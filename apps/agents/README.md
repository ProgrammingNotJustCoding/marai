<div align=center>

<h1>Marai Agents Server</h1>

<img alt="Python" src="https://img.shields.io/badge/Python-3.8+-blue">
<img alt="Azure OpenAI" src="https://img.shields.io/badge/Azure_OpenAI-Integration-blue?logo=azurefunctions">
<img alt="Azure AI Search" src="https://img.shields.io/badge/Azure_AI_Search-Knowledge_Base-purple?logo=microsoftazure">
<img alt="Apache Spark" src="https://img.shields.io/badge/Apache_Spark-Preprocessing-orange?logo=apachespark">

</div>

## Overview

This agents server is a scalable, asynchronous system that manages a pool of specialized AI agents designed to process legal tasks. The server leverages **Azure OpenAI** for advanced language understanding and generation, integrates with **Azure AI Search** for retrieving information from knowledge bases, and utilizes **Apache Spark on Azure** (e.g., Azure Synapse Analytics, Azure Databricks) for preprocessing data used in LLM fine-tuning.

The system is designed to handle tasks efficiently through a managed pool of agents, processing them asynchronously. Task ingestion can be configured via various mechanisms (e.g., API endpoint) depending on your architecture.

### Features

- **Agent Pool Management**: Efficiently manages pools of specialized AI agents, allocating them dynamically based on task requirements.
- **Asynchronous Processing**: Handles multiple tasks concurrently using Python's asyncio for high throughput.
- **Azure OpenAI Integration**: Utilizes powerful models from Azure OpenAI Service for core AI capabilities.
- **Knowledge Base Integration**: Leverages **Azure AI Search** to provide agents with access to relevant information stored in knowledge bases (e.g., data indexed from Azure Blob Storage, Azure SQL Database, etc.).
- **Scalable Data Preprocessing**: Incorporates **Apache Spark on Azure** (Synapse/Databricks) capabilities for large-scale data preprocessing, particularly for preparing datasets for fine-tuning language models.
- **Task Routing**: Intelligently routes incoming tasks to the appropriate agent type based on task characteristics.
- **Flexible Task Ingestion**: Designed to integrate with various task input sources (requires configuration).

### Development

To extend with new agent types:

1. **Create Agent Class**: Define a new agent class inheriting from `BaseAgent`.
2. **Implement Logic**: Implement task-specific handling within the new agent class, potentially interacting with Azure OpenAI and Azure AI Search.
3. **Configure Agent**: Add the new agent type and its configuration to `AGENT_CONFIGS` in `src/config.py`.
4. **Configure Azure Services**: Ensure connection strings, API keys, and endpoints for Azure OpenAI, Azure AI Search, and the chosen knowledge base storage (e.g., Azure Blob Storage) are correctly configured.
5. **Set up Task Ingestion**: Implement or configure the chosen method for feeding tasks into the agent server (e.g., develop an API endpoint).

Agents are dynamically allocated from the pool when a task arrives and are returned to the pool after processing is complete. The system manages the lifecycle and availability of agents within their respective pools.

For data preprocessing pipelines using Spark:

- Develop Spark jobs targeting your chosen Azure Spark service (Azure Synapse Analytics or Azure Databricks).
- These jobs will typically read raw data, perform necessary cleaning and transformation, and output data suitable for fine-tuning LLMs hosted on Azure OpenAI or elsewhere.
