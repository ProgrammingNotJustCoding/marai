variable "database_name" {
  description = "The name of the Athena database"
  type        = string
}

variable "table_name" {
  description = "The name of the Athena table"
  type        = string
}

variable "table_schema" {
  description = "The schema of the Athena table in JSON format"
  type        = string
}

variable "s3_bucket" {
  description = "The S3 bucket where Athena will store query results"
  type        = string
}

variable "s3_prefix" {
  description = "The prefix for the S3 bucket"
  type        = string
  default     = ""
}