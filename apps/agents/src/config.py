from utils.safe_types import safe_int, safe_float
import os
from dotenv import load_dotenv
from pathlib import Path

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent
SRC_DIR = BASE_DIR / 'src'

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_BASEURL = os.getenv("OPENAI_BASEURL")
DEFAULT_MODEL = os.getenv("DEFAULT_MODEL")
AGENT_POOL_SIZE = safe_int(os.getenv("AGENT_POOL_SIZE"), 5)

AWS_REGION = os.getenv("AWS_REGION")
SQS_QUEUE_URL = os.getenv("SQS_QUEUE_URL")
POLL_INTERVAL = safe_float(os.getenv("POLL_INTERVAL"), 5.0)

AGENT_CONFIGS = {
    "contract_analysis": {
        "workers": int(os.getenv("CONTRACT_WORKERS", 3)),
        "model": DEFAULT_MODEL,
        "max_queue_size": int(os.getenv("CONTRACT_QUEUE_SIZE", 100)),
        "functions": []
    },
    "legal_chat": {
        "workers": int(os.getenv("LEGAL_CHAT_WORKERS", 4)),
        "model": DEFAULT_MODEL,
        "max_queue_size": int(os.getenv("LEGAL_CHAT_QUEUE_SIZE", 200)),
        "functions": []
    },
    "document_verification": {
        "workers": int(os.getenv("DOC_VERIFY_WORKERS", 3)),
        "model": DEFAULT_MODEL,
        "max_queue_size": int(os.getenv("DOC_VERIFY_QUEUE_SIZE", 100)),
        "functions": []
    },
    "document_improvement": {
        "workers": int(os.getenv("DOC_IMPROVE_WORKERS", 3)),
        "model": DEFAULT_MODEL,
        "max_queue_size": int(os.getenv("DOC_IMPROVE_QUEUE_SIZE", 100)),
        "functions": []
    }
}

LOG_LEVEL = os.getenv("LOG_LEVEL")
LOG_FORMAT = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
LOG_FILE = os.getenv("LOG_FILE", str(BASE_DIR / "logs" / "marai_agents.log"))