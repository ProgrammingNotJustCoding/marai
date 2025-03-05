import asyncio
import sys
from coordination.sqs_consumer import SQSConsumer
from utils.logger import setup_logging

async def main_async():
    logger = setup_logging()
    logger.info("Starting Marai Agents Server")
    
    try:
        consumer = SQSConsumer()
        await consumer.start()
    except KeyboardInterrupt:
        logger.info("Shutting down due to keyboard interrupt")
    except Exception as e:
        logger.exception(f"Unexpected error: {e}")
        return 1
    finally:
        logger.info("Marai Agents Server shut down")
    
    return 0

def main():
    try:
        exit_code = asyncio.run(main_async())
        sys.exit(exit_code)
    except KeyboardInterrupt:
        print("\nShutting down due to keyboard interrupt")
        sys.exit(0)
        
if __name__ == '__main__':
    main()
    