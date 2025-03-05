import asyncio
import logging
from collections import defaultdict, deque
from swarm import Swarm
from agent_core.base_agent import BaseAgent
from agent_core.client import model_client
from config import AGENT_POOL_SIZE

logger = logging.getLogger(__name__)

class AgentFactory:
    
    def __init__(self):
        self.swarm_client = Swarm(model_client)
        self.agent_configs = self._initialize_agent_configs()
        self.agent_pools = self._initialize_agent_pools()
        self._pool_waiters = defaultdict(list)
        
    def _initialize_agent_configs(self):
        configs = defaultdict(dict)
        
        configs["contract_analysis"] = BaseAgent(
            agent_type="contract_analysis",
            name="ContractAnalyzer",
            instructions="""You are a contract analysis expert. Analyze legal documents for risks, obligations, and important clauses.
                            Provide clear summaries and highlight potential issues. Always maintain legal accuracy.""",
            functions=[],
        )
        
        configs["legal_chat"] = BaseAgent(
            agent_type="legal_chat",
            name="LegalAssistant",
            instructions="""You are a legal assistant that can answer questions about contracts, legal terms, and general legal concepts.
                            Provide helpful explanations but make it clear you are not providing legal advice.""",
            functions=[],
        )
        
        configs["document_verification"] = BaseAgent(
            agent_type="document_verification",
            name="DocumentVerifier",
            instructions="""You are a document verification specialist. Check documents for completeness, consistency, and compliance with requirements.
                            Flag missing information or inconsistencies.""",
            functions=[],
        )
        
        configs["document_improvement"] = BaseAgent(
            agent_type="document_improvement",
            name="DocImprover",
            instructions="""You are a document improvement specialist. Refine and enhance document clarity, structure, and language.
                            Maintain the original meaning while improving readability.""",
            functions=[],
        )
        
        return configs
    
    def _initialize_agent_pools(self):
        pools = defaultdict(deque)
        
        for agent_type, config in self.agent_configs.items():
            logger.info(f"Initializing pool of {AGENT_POOL_SIZE} agents for {agent_type}")
            for i in range(AGENT_POOL_SIZE):
                agent_config = BaseAgent(
                    agent_type=agent_type,
                    name=f"{config.name}_{i}",
                    instructions=config.instructions,
                    functions=config.functions,
                )
                
                agent = agent_config.create_agent()
                pools[agent_type].append(agent)
                
        return pools
    
    async def get_agent(self, agent_type):
        if agent_type not in self.agent_pools:
            logger.error(f"Unknown agent type: {agent_type}")
            raise ValueError(f"Unknown agent type: {agent_type}")
        
        pool = self.agent_pools[agent_type]
        
        if not pool:
            logger.error(f"No agents available for {agent_type}, waiting for agents to become available")
            
            if not hasattr(self, '_pool_waiters'):
                self._pool_waiters = defaultdict(list)
                
            waiter = asyncio.Future()
            self._pool_waiters[agent_type].append(waiter)
            
            try:
                await waiter
            except asyncio.CancelledError:
                if waiter in self._pool_waiters[agent_type]:
                    self._pool_waiters[agent_type].remove(waiter)
                raise
            
            if not pool:
                logger.error(f"Agent was signaled as available but pool for {agent_type} is still empty")
                
                config = self.agent_configs[agent_type]
                agent = BaseAgent(
                    agent_type=agent_type,
                    name=f"{config.name}_{len(self.agent_pools[agent_type])}",
                    instructions=config.instructions,
                    functions=config.functions,
                ).create_agent()
                
                return agent
            
                
        agent = pool.popleft()
        logger.debug(f"Got agent {agent.name} from {agent_type} pool, {len(pool)} remaining")
        return agent
    
    def return_agent(self, agent):
        agent_type = getattr(agent, 'agent_type', None)
        
        if not agent_type or agent_type not in self.agent_pools:
            logger.warning(f"Cannot return agent with unknown type: {agent_type}")
            return
        
        pool = self.agent_pools[agent_type]
        pool.append(agent)
        logger.debug(f"Returned agent {agent.name} to {agent_type} pool, {len(pool)} available")
        
        if hasattr(self, '_pool_waiters') and agent_type in self._pool_waiters and self._pool_waiters[agent_type]:
            waiter = self._pool_waiters[agent_type].pop(0)
            if not waiter.done():
                waiter.set_result(True)
                logger.debug(f"Signaled waiter that agent is available")