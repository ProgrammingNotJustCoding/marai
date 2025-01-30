variable "bucket_domain_name" {
  description = "Domain name of the S3 bucket"
  type        = string
}

variable "bucket_arn" {
  description = "ARN of the S3 bucket"
  type        = string
}

variable "origin_domain" {
  description = "The domain of the origin for CloudFront"
  type        = string
}