import os
import ollama
from dotenv import load_dotenv

load_dotenv()

def elaborate_on(text: str):
    res = ollama.generate(
        model=os.getenv("MODEL_USED"),
        prompt=os.getenv("SYSTEM_PROMPT") + "\n" + "CONTENT: " + text,
    )
    
    print(res)
    
    return res['response']