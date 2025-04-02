import os
from dotenv import load_dotenv

load_dotenv()

env = {
    "HOST": os.getenv("HOST", "127.0.0.1"),
    "PORT": int(os.getenv("PORT", "8000")),
    "OPENAI_API_KEY": os.getenv("OPENAI_API_KEY"),
    "OPENAI_BASE_URL": os.getenv("OPENAI_BASE_URL"),
    "AZURE_AI_SEARCH_ENDPOINT": os.getenv("AZURE_AI_SEARCH_ENDPOINT"),
    "AZURE_SEARCH_INDEX_NAME": os.getenv("AZURE_SEARCH_INDEX_NAME"),
    "AZURE_SEARCH_API_NAME": os.getenv("AZURE_SEARCH_API_NAME"),
    "AZURE_STORAGE_CONNECTION": os.getenv("AZURE_STORAGE_CONNECTION"),
    "AZURE_STORAGE_NAME": os.getenv("AZURE_STORAGE_NAME"),
    "DEFAULT_POOL_SIZE": int(os.getenv("DEFAULT_POOL_SIZE", 5)),
    "MAX_POOL_SIZE": int(os.getenv("MAX_POOL_SIZE", 20)),
    "AGENT_TIMEOUT_SECONDS": int(os.getenv("AGENT_TIMEOUT_SECONDS", 300)),
    "LOG_LEVEL": os.getenv("LOG_LEVEL", "INFO"),
}