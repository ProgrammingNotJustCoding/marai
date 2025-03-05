import ollama
from config import OPENAI_BASEURL, OPENAI_API_KEY, DEFAULT_MODEL
from openai import OpenAI

model = DEFAULT_MODEL

model_client = OpenAI(
    base_url=OPENAI_BASEURL,
    api_key=OPENAI_API_KEY
)