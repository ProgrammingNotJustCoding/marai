variable "elb_name" {
  description = "Name of the ELB"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID for ELB"
  type        = string
}

variable "subnet_ids" {
  description = "Subnet IDs for ELB"
  type        = list(string)
}