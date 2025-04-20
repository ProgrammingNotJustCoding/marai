import os
from dotenv import load_dotenv

load_dotenv()

env = {
    "HOST": os.getenv("HOST", "127.0.0.1"),
    "PORT": int(os.getenv("PORT", "8000")),
    "OPENAI_API_KEY": os.getenv("OPENAI_API_KEY"),
    "OPENAI_BASE_URL": os.getenv("OPENAI_BASE_URL"),
    "OPENAI_API_VERSION": os.getenv("OPENAI_API_VERSION"),
    "DEFAULT_POOL_SIZE": int(os.getenv("DEFAULT_POOL_SIZE", 5)),
    "MAX_POOL_SIZE": int(os.getenv("MAX_POOL_SIZE", 20)),
    "AGENT_TIMEOUT_SECONDS": int(os.getenv("AGENT_TIMEOUT_SECONDS", 300)),
    "LOG_LEVEL": os.getenv("LOG_LEVEL", "INFO"),
}
