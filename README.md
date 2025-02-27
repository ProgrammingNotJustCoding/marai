<div align=center>
<h1>
Marai
</h1>

![AWS](https://img.shields.io/badge/AWS-Cloud-darkblue) ![Azure](https://img.shields.io/badge/Azure-Cloud-darkblue) ![React](https://img.shields.io/badge/React-Frontend-green) ![Golang](https://img.shields.io/badge/Golang-Backend-blue) ![OpenAI](https://img.shields.io/badge/OpenAI-Swarm-orange)
</div>

## Overview
Marai is a cloud-based architecture designed to streamline legal consultations and case file management for clients and law firms. It enables seamless communication between clients and legal consultants, allowing clients to request legal guidance, submit case files for review, and receive AI-powered insights. The system ensures secure storage, efficient case file compression, and retrieval through a distributed and scalable infrastructure leveraging AWS and Azure services.

> [!CAUTION]
> We are currently developing the Marai platform.

## Applications:
- Workflow Management for law firms.
- Contract Lifecycle Management for law firms.
- Integrates AI-driven analysis for legal case management.
- Marketplace for legal services and resources.

## Architecture Components
The system consists of multiple AWS and Azure services interacting to form a robust and efficient workflow:

> [!TIP]
> We are using a multi-cloud based architecture, with AWS Services on the API server side, and Azure for the agents server.

- **Client (EC2, React) 🖥️**
  - A front-end application running on AWS EC2, built with React.
  - Handles user interactions and sends requests to the backend.

- **AWS WAF (Web Application Firewall) 🔒**
  - Provides security against common web threats.
  - Protects the system from malicious attacks before traffic reaches the load balancer.

- **AWS ALB (Application Load Balancer) ⚖️**
  - Distributes incoming traffic among multiple backend instances.
  - Ensures high availability and fault tolerance.

- **Server (EC2, Echo) 💻**
  - The main backend application running on AWS EC2, built with Echo (a Golang framework).
  - Handles requests from the front-end and interacts with various AWS services.

- **AWS SQS (Simple Queue Service) 📩**
  - Asynchronous message queuing service.
  - Ensures smooth processing of tasks by the Swarm Server.

- **Swarm Server (EC2, FastAPI) ⚡**
  - A microservice-based backend using FastAPI, running on EC2.
  - Processes queued tasks and interacts with AI and search services.

- **AWS S3 (Simple Storage Service) 📂**
  - Stores files and documents for the system.
  - Ensures secure and scalable storage of workflow-related data.

- **AWS ElastiCache ⚡**
  - Provides caching for improved application performance.
  - Works alongside AWS RDS for efficient data retrieval.

- **AWS RDS (PostgreSQL) 🗄️**
  - Relational database for structured data storage.
  - Used for managing workflow-related metadata and case information.

- **AWS CloudWatch 📊**
  - Monitors application and infrastructure performance.
  - Provides logging, metrics, and alerting functionalities.

- **Azure OpenAI 🤖**
  - Provides AI-powered capabilities for legal case analysis and automation.
  - Supports intelligent document processing and legal insights.

- **AWS OpenSearch (RAG - Retrieval-Augmented Generation) 🔍**
  - Enables efficient searching and indexing of legal documents.
  - Supports AI-powered retrieval and case reference management.

## Workflow Process
- The Client (React on EC2) sends requests via AWS ALB.
- Requests pass through AWS WAF for security checks.
- The Server (Echo on EC2) processes the request and interacts with:
  - AWS S3 for document storage.
  - AWS RDS for database queries.
  - AWS ElastiCache for fast data retrieval.
  - AWS CloudWatch for monitoring and logging.
- If necessary, tasks are sent to AWS SQS, which triggers the Swarm Server (FastAPI on EC2) for processing.
- The Swarm Server interacts with AI models on Azure OpenAI and performs document retrieval using AWS OpenSearch (RAG).
- The system responds to the client with processed data or insights.

## Deployment
1. Provision AWS EC2 instances for the client, backend servers, and swarm server.
2. Set up AWS ALB and WAF for secure traffic management.
3. Deploy PostgreSQL on AWS RDS and configure connections.
4. Enable AWS S3 and OpenSearch for storage and document retrieval.
5. Configure Azure OpenAI API for AI-driven processing.
6. Monitor performance using AWS CloudWatch.

## Future Improvements
- Implement serverless functions (AWS Lambda) for improved scalability.
- Enhance AI models for better legal text processing.
- Expand OpenSearch capabilities for advanced legal search queries.

## Shout outs 💥

| <p align="center">![Rishi Viswanathan](https://github.com/risv1.png?size=128)<br>[Rishi Viswanathan](https://github.com/risv1)</p> | <p align="center">![Harsh Patel](https://github.com/HarshPatel5940.png?size=128)<br>[Harsh Patel](https://github.com/HarshPatel5940)</p> | <p align="center">![Inigo Jeevan](https://github.com/inigojeevan.png?size=128)<br>[Inigo Jeevan](https://github.com/inigojeevan)</p> | <p align="center">![Dheekshitha](https://github.com/Dheekshitha24.png?size=128)<br>[Dheekshitha](https://github.com/Dheekshitha24)</p>
 ---------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |

## License 📜

`marai` is available under the MPL 2.0 license. See the LICENSE file for more info.
