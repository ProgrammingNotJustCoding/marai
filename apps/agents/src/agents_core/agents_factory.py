from swarm import Swarm, Agent

from .base import client, chat_model
from services.azure_openai import azure_client

swarm_client = Swarm(azure_client)

def init_agent(name, instructions, functions, model=chat_model):
    agent = Agent(
        name=name,
        model=model,
        instructions=instructions,
        functions=functions
    )
    
    return agent

def run_client(agent, messages):
    response = swarm_client.run(
        agent=agent,
        messages=messages
    )
    
    return response.messages[-1]["content"]
