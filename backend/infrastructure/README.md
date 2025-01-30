# Terraform AWS Project

This project contains Terraform configurations for setting up various AWS services including Athena, S3, PostgreSQL in RDS, CloudFront, and Managed Blockchain.

## Project Structure

```markdown
infrastucture
├── modules
│   ├── athena
│   ├── s3
│   ├── rds
│   ├── cloudfront
│   └── managed-blockchain
├── main.tf
├── outputs.tf
├── providers.tf
├── variables.tf
└── README.md
```

## Modules

- **Athena**: Configures AWS Athena with necessary databases and tables.
- **S3**: Creates the underlying S3 bucket used by Athena.
- **RDS**: Sets up PostgreSQL in RDS with required configurations.
- **CloudFront**: Configures CloudFront distributions.
- **Managed Blockchain**: Sets up Managed Blockchain networks and members.

## Setup Instructions

1. **Install Terraform**: Ensure you have Terraform installed on your machine. You can download it from [terraform.io](https://www.terraform.io/downloads.html).

2. **Configure AWS Credentials**: Set up your AWS credentials using the AWS CLI or by exporting environment variables.

3. **Initialize the Project**: Navigate to the project directory and run:

   ```markdown
   terraform init
   ```

4. **Plan the Deployment**: To see what resources will be created, run:

   ```markdown
   terraform plan
   ```

5. **Apply the Configuration**: To create the resources, run:

   ```markdown
   terraform apply
   ```

6. **Outputs**: After the deployment, you can view the outputs by running:

   ```markdown
   terraform output
   ```

## Usage Guidelines

- Modify the `variables.tf` files in each module to customize the configurations as per your requirements.
- Ensure that you have the necessary permissions in your AWS account to create the resources defined in this project.
