variable "bucket_name" {
  description = "The name of the S3 bucket for Athena."
  type        = string
}

variable "region" {
  description = "The AWS region where the S3 bucket will be created."
  type        = string
  default     = "us-east-1"
}

variable "acl" {
  description = "The canned ACL to apply to the bucket."
  type        = string
  default     = "private"
}