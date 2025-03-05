import asyncio
import json
import boto3
import signal
import logging
import sys
from collections import defaultdict
from botocore.exceptions import ClientError
from agent_core.agent_factory import AgentFactory
from config import SQS_QUEUE_URL, AWS_REGION, POLL_INTERVAL, AGENT_CONFIGS

logger = logging.getLogger(__name__)

class SQSConsumer:
    
    def __init__(self, queue_url=SQS_QUEUE_URL, region=AWS_REGION):
        self.queue_url = queue_url
        self.sqs = boto3.client('sqs', region_name=region)
        self.agent_factory = AgentFactory()
        self.running = False
        self.task_queues = defaultdict(asyncio.Queue)
        self.workers = []
        
    async def start_workers(self):
        for agent_type, config in self.agent_factory.agent_configs.items():
            worker_count = AGENT_CONFIGS.get(agent_type, {}).get("workers", 3)
            for i in range(worker_count):
                worker = asyncio.create_task(
                    self._worker_loop(agent_type, i)
                )
                self.workers.append(worker)
                logger.info(f"Started worker {i} for agent type {agent_type}")
                
    async def _worker_loop(self, agent_type, worker_id):
        queue = self.task_queues[agent_type]
        logger.info(f"Worker {worker_id} for agent type {agent_type} started")
        
        while self.running:
            try:
                try:
                    message_data = await asyncio.wait_for(
                        queue.get(),
                        timeout=POLL_INTERVAL
                    )
                    if not message_data:
                        continue
                    
                    task, message = message_data
                
                except asyncio.TimeoutError:
                    continue
                
                agent = None
                try:
                    agent = await self.agent_factory.get_agent(agent_type)
                    logger.info(f"Worker {worker_id} processing task {task['task_id']} using agent {agent.name}")
                    
                    messages = []
                    if task.get('metadata'):
                        metadata_str = json.dumps(task['metadata'])
                        messages.append({
                            "role": "assistant",
                            "content": f"Context information: {metadata_str}"
                        })
                        
                    messages.append({
                        "role": "user",
                        "content": task['content']
                    })
                    
                    response = self.agent_factory.swarm_client.run(
                        agent=agent,
                        messages=messages
                    )
                    
                    logger.info(f"Worker {worker_id} completed task {task['task_id']} using agent {agent.name}")
                    
                    receipt_handle = message['ReceiptHandle']
                    self.sqs.delete_message(
                        QueueUrl=self.queue_url,
                        ReceiptHandle=receipt_handle
                    )
                    
                except Exception as e:
                    logger.error(f"Error processing task {task['task_id']} using agent {agent.name}: {e}")
                    logger.exception(e)
                    
                finally:
                    if agent:
                        self.agent_factory.return_agent(agent)
                    queue.task_done()
                    
            except Exception as e:
                logger.error(f"Worker loop error: {e}", exc_info=True)
                await asyncio.sleep(1)
                
    async def process_message(self, message):
        try:
            body = json.loads(message['Body'])
            task_id = message.get('MessageId', 'unknown')
            task_type = body.get('task_type', 'unknown')
            content = body.get('content', '')
            
            logger.info(f"Received task {task_id} of type {task_type}")
            
            agent_type = None
            for a_type, config in self.agent_factory.agent_configs.items():
                if hasattr(config, 'can_handle') and config.can_handle(task_type):
                    agent_type = a_type
                    break
                
            if not agent_type:
                logger.warning(f"No agent available to handle task {task_id} of type {task_type}")
                return
            
            task = {
                "task_id": task_id,
                "task_type": task_type,
                "content": content,
                "metadata": body.get('metadata', {})
            }
            
            await self.task_queues[agent_type].put((task, message))
            logger.debug(f"Task {task_id} queued for processing by {agent_type} agent")
            
        except json.JSONDecodeError as e:
            logger.error(f"Error decoding message: {e}")
            logger.error(f"Message: {message}")
        except Exception as e:
            logger.error(f"Error processing message: {e}")
            logger.exception(e)
            
    async def poll_and_process(self):
        try:
            response = self.sqs.receive_message(
                QueueUrl=self.queue_url,
                AttributeNames=['All'],
                MaxNumberOfMessages=10,
                WaitTimeSeconds=20
            )
            
            if 'Messages' in response:
                messages = response['Messages']
                logger.info(f"Received {len(messages)} messages from SQS")
                
                tasks = [self.process_message(message) for message in messages]
                await asyncio.gather(*tasks)
                
            else:
                logger.debug("No messages received from SQS")
                
        except ClientError as e:
            logger.error(f"Error receiving messages from SQS: {e}")
            logger.exception(e)
            
    async def start(self):
        self.running = True
        logger.info(f"Starting SQS consumer for queue {self.queue_url}")
        
        for sig in (signal.SIGINT, signal.SIGTERM):
            signal.signal(sig, self._signal_handler)
            
        await self.start_workers()
        
        while self.running:
            await self.poll_and_process()
            await asyncio.sleep(POLL_INTERVAL)
            
    async def stop(self):
        logger.info("Stopping SQS consumer")
        self.running = False
        
        for worker in self.workers:
            if not worker.done():
                worker.cancel()
                
        if self.workers:
            await asyncio.gather(*self.workers, return_exceptions=True)
            
        logger.info("SQS consumer stopped")
        
    def _signal_handler(self, sig, frame):
        logger.info(f"Received signal {sig}, stopping SQS consumer")
        
        loop = asyncio.get_event_loop()
        loop.create_task(self.stop())
        
        import time
        time.sleep(2)
        sys.exit()