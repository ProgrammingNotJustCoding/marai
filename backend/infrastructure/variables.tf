variable "athena_database_name" {
  description = "The name of the Athena database"
  type        = string
}

variable "athena_table_schema" {
  description = "The schema for the Athena table"
  type        = map(any)
}

variable "s3_bucket_name" {
  description = "The name of the S3 bucket for Athena"
  type        = string
}

variable "s3_region" {
  description = "The AWS region where the S3 bucket will be created"
  type        = string
}

variable "rds_instance_type" {
  description = "The instance type for the RDS PostgreSQL database"
  type        = string
}

variable "rds_database_name" {
  description = "The name of the PostgreSQL database"
  type        = string
}

variable "rds_username" {
  description = "The username for the PostgreSQL database"
  type        = string
}

variable "rds_password" {
  description = "The password for the PostgreSQL database"
  type        = string
  sensitive   = true
}

variable "cloudfront_origin_domain" {
  description = "The domain of the origin for CloudFront"
  type        = string
}

variable "cloudfront_cache_behavior" {
  description = "Caching behavior settings for CloudFront"
  type        = map(any)
}

variable "managed_blockchain_network_name" {
  description = "The name of the Managed Blockchain network"
  type        = string
}

variable "managed_blockchain_framework" {
  description = "The framework for the Managed Blockchain network"
  type        = string
}