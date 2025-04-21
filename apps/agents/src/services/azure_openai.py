from config.env import env
from openai import AzureOpenAI

endpoint = env["OPENAI_BASE_URL"]
model_name = "gpt-4.1"

api_key = env["OPENAI_API_KEY"]
api_version = env["OPENAI_API_VERSION"]

azure_client = AzureOpenAI(
    api_version=api_version,
    azure_endpoint=endpoint,
    api_key=api_key,   
)
