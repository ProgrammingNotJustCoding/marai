import ollama
from openai import OpenAI
from config import env

# chat_model = "llama3.2:1b"
# image_model = "llava"

chat_model = "gpt-4.1"
image_model = "gpt-4.1"

client = OpenAI(
    base_url=env["OPENAI_BASE_URL"],
    api_key=env["OPENAI_API_KEY"],
)
