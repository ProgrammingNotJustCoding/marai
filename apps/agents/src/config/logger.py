import asyncio
import sys
import logging
import structlog
from typing import Dict, Any

from .env import env

log_level = getattr(logging, env["LOG_LEVEL"])
logging.basicConfig(
    format="%(message)s",
    stream=sys.stdout,
    level=log_level,
)

structlog.configure(
    processors=[
        structlog.contextvars.merge_contextvars,
        structlog.processors.add_log_level,
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.UnicodeDecoder(),
        structlog.processors.JSONRenderer(),
    ],
    logger_factory=structlog.stdlib.LoggerFactory(),
    wrapper_class=structlog.stdlib.BoundLogger,
    cache_logger_on_first_use=True,
)

def get_logger(name: str):
    return structlog.get_logger(name)

def with_context(logger, **context) -> Any:
    return logger.bind(**context)

def log_exception(logger, start_msg: str, end_msg: str):
    
    def decorator(func):
        import functools
        import time
        
        @functools.wraps(func)
        async def async_wrapper(*args, **kwargs):
            start_time = time.time()
            logger.info(start_msg)
            try:
                result = await func(*args, **kwargs)
                elapsed = time.time() - start_time
                logger.info(end_msg, elapsed_seconds=round(elapsed, 3))
                return result
            except Exception as e:
                elapsed = time.time() - start_time
                logger.error(
                    f"Error during {func.__name__}",
                    error=str(e),
                    elapsed_seconds=round(elapsed, 3),
                    exc_info=True
                )
                raise
        
        @functools.wraps(func)
        def sync_wrapper(*args, **kwargs):
            start_time = time.time()
            logger.info(start_msg)
            try:
                result = func(*args, **kwargs)
                elapsed = time.time() - start_time
                logger.info(end_msg, elapsed_seconds=round(elapsed, 3))
                return result
            except Exception as e:
                elapsed = time.time() - start_time
                logger.error(
                    f"Error during {func.__name__}",
                    error=str(e),
                    elapsed_seconds=round(elapsed, 3),
                    exc_info=True
                )
                raise

        return async_wrapper if asyncio.iscoroutinefunction(func) else sync_wrapper

    return decorator