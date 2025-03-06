<div align=center>

<h1>Marai Agents Server</h1>

<img alt="Python" src="https://img.shields.io/badge/Python-3.8+-blue">
<img alt="OpenAI" src="https://img.shields.io/badge/OpenAI-Integration-orange">
<img alt="AWS" src="https://img.shields.io/badge/AWS-SQS-yellow">

</div>

## Overview

This agents server is a scalable, asynchronous system that manages a pool of specialized AI agents designed to process legal tasks. The server consumes tasks from AWS SQS queues, routes them to appropriate AI agents, and manages the agent lifecycle.

### Features

- **Agent Pool Management**: Efficiently manages pools of specialized AI agents
- **Asynchronous Processing**: Handles multiple tasks concurrently using Python's asyncio
- **AWS SQS Integration**: Consumes tasks from SQS queues with reliable message handling
- **Task Routing**: Intelligently routes tasks to appropriate agent types

### Development

To extend with new agent types:

- Create a new agent class inheriting from BaseAgent
- Add the agent type to `AGENT_CONFIGS` in [config.py](./src/config.py)
- Implement task-specific handling in the agent class
- Agents are dynamically allocated based on task requirements and returned to the pool after processing.
