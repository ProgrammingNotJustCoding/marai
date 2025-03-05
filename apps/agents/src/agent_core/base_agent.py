import uuid
import logging
from swarm import Agent
from config import DEFAULT_MODEL

logger = logging.getLogger(__name__)

class BaseAgent:
    
    def __init__(self, agent_type, name=None, instructions=None, model=None, functions=None):
        self.agent_id = str(uuid.uuid4())
        self.agent_type = agent_type
        self.name = name or f"{agent_type}_{self.agent_id[:8]}"
        self.model = model or DEFAULT_MODEL
        self.instructions = instructions
        self.functions = functions or []
        logger.debug(f"Created agent for {name} of type {agent_type}")
        
    def __str__(self):
        return f"{self.name} ({self.agent_type})"
    
    def create_agent(self):
        agent = Agent(
            name=self.name,
            instructions=self.instructions,
            model=self.model,
            functions=self.functions
        )
        
        agent.agent_id = self.agent_id
        agent.agent_type = self.agent_type
        return agent
    
    def can_handle(self, task_type):
        return task_type in self.functions