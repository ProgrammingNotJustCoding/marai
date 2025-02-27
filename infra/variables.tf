variable "aws_region" {
  description = "The AWS region to deploy resources"
  type        = string
  default     = "ap-south-1"
}

variable "vpc_id" {
  description = "ID of the VPC where resources will be deployed"
  type        = string
}

# Security Group variables
variable "allowed_cidr_blocks" {
  description = "List of CIDR blocks allowed to access the database and cache"
  type        = list(string)
  default     = ["10.0.0.0/16"]
}

# CloudWatch variables
variable "log_group_name" {
  description = "Name of the CloudWatch log group"
  type        = string
  default     = "marai-logs"
}

variable "retention_in_days" {
  description = "Number of days to retain logs"
  type        = number
  default     = 30
}

# WAF variables
variable "waf_name" {
  description = "Name of the WAF web ACL"
  type        = string
  default     = "marai-waf"
}

# ELB variables
variable "elb_name" {
  description = "Name of the Elastic Load Balancer"
  type        = string
  default     = "marai-elb"
}

variable "subnet_ids" {
  description = "List of subnet IDs for the ELB"
  type        = list(string)
}

# SQS variables
variable "queue_name" {
  description = "Name of the SQS queue"
  type        = string
  default     = "marai-queue"
}

variable "delay_seconds" {
  description = "The time in seconds that the delivery of all messages in the queue will be delayed"
  type        = number
  default     = 0
}

variable "max_message_size" {
  description = "The limit of how many bytes a message can contain"
  type        = number
  default     = 262144
}

variable "message_retention_seconds" {
  description = "The number of seconds SQS retains a message"
  type        = number
  default     = 345600
}


# Elasticache variables
variable "ec_subnet_ids" {
  description = "List of subnet IDs for ElastiCache"
  type        = list(string)
}

# S3 variables
variable "s3_bucket_name" {
  description = "Name of the S3 bucket"
  type        = string
}

variable "environment" {
  description = "Deployment environment"
  type        = string
}

variable "enable_versioning" {
  description = "Enable versioning for S3 bucket"
  type        = bool
}

variable "rds_subnet_ids" {
  description = "List of subnet IDs for RDS"
  type        = list(string)
}

variable "db_username" {
  description = "Master username for RDS"
  type        = string
}

variable "db_password" {
  description = "Master password for RDS"
  type        = string
  sensitive   = true
}

# EC2 variables
variable "ami" {
  description = "AMI ID for the EC2 instance"
  type        = string
}

variable "instance_type" {
  description = "Instance type for the EC2 instance"
  type        = string
}

variable "subnet_id" {
  description = "Subnet ID for the EC2 instance"
  type        = string
}

variable "key_name" {
  description = "Name of the EC2 key pair"
  type        = string
}