variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
}

variable "aws_access_key" {
  description = "AWS Access Key ID"
  type        = string
  sensitive   = true
}

variable "aws_secret_key" {
  description = "AWS Secret Access Key"
  type        = string
  sensitive   = true
}

variable "aws_session_token" {
  description = "AWS Session Token"
  type        = string
  sensitive   = true
}

variable "vpc_id" {
  description = "VPC ID to use for resources"
  type        = string
}

variable "subnet_ids" {
  description = "Subnet IDs for ELB"
  type        = list(string)
}

variable "ec_subnet_ids" {
  description = "Subnet IDs for ElastiCache"
  type        = list(string)
}

variable "rds_subnet_ids" {
  description = "Subnet IDs for RDS"
  type        = list(string)
}

variable "allowed_cidr_blocks" {
  description = "CIDR blocks allowed to access the databases"
  type        = list(string)
}

variable "log_group_name" {
  description = "CloudWatch log group name"
  type        = string
}

variable "retention_in_days" {
  description = "Log retention period in days"
  type        = number
}

variable "waf_name" {
  description = "WAF name"
  type        = string
}

variable "elb_name" {
  description = "ELB name"
  type        = string
}

variable "queue_name" {
  description = "SQS queue name"
  type        = string
}

variable "delay_seconds" {
  description = "SQS delay seconds"
  type        = number
}

variable "max_message_size" {
  description = "SQS max message size"
  type        = number
}

variable "message_retention_seconds" {
  description = "SQS message retention seconds"
  type        = number
}

variable "ami" {
  description = "AMI ID for EC2 instances"
  type        = string
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
}

variable "subnet_id" {
  description = "Subnet ID for EC2 instance"
  type        = string
}

variable "key_name" {
  description = "SSH key name for EC2 instance"
  type        = string
}

variable "s3_bucket_name" {
  description = "S3 bucket name"
  type        = string
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
}

variable "enable_versioning" {
  description = "Enable S3 bucket versioning"
  type        = bool
}

variable "db_identifier" {
  description = "RDS instance identifier"
  type        = string
}

variable "db_engine" {
  description = "RDS database engine"
  type        = string
}

variable "db_engine_version" {
  description = "RDS database engine version"
  type        = string
}

variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
}

variable "db_allocated_storage" {
  description = "RDS allocated storage in GB"
  type        = number
}

variable "db_username" {
  description = "Database username"
  type        = string
  sensitive   = true
}

variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}

variable "db_subnet_group_name" {
  description = "RDS subnet group name"
  type        = string
}

variable "db_multi_az" {
  description = "Enable multi-AZ for RDS"
  type        = bool
}

variable "cache_cluster_id" {
  description = "ElastiCache cluster ID"
  type        = string
}

variable "cache_node_type" {
  description = "ElastiCache node type"
  type        = string
}

variable "cache_nodes" {
  description = "Number of ElastiCache nodes"
  type        = number
}

variable "cache_subnet_group_name" {
  description = "ElastiCache subnet group name"
  type        = string
}