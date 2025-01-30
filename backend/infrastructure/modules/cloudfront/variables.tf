variable "origin_domain" {
  description = "The domain name of the origin for the CloudFront distribution."
  type        = string
}

variable "default_cache_behavior" {
  description = "The default cache behavior for the CloudFront distribution."
  type        = map(string)
}

variable "viewer_certificate" {
  description = "Configuration for the viewer certificate."
  type        = map(string)
  default     = {}
}

variable "enabled" {
  description = "Whether the CloudFront distribution is enabled."
  type        = bool
  default     = true
}

variable "price_class" {
  description = "The price class for the CloudFront distribution."
  type        = string
  default     = "PriceClass_All"
}