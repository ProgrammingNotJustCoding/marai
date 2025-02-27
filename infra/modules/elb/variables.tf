variable "elb_name" {
  description = "Name of the Elastic Load Balancer"
  type        = string
}

variable "vpc_id" {
  description = "ID of the VPC where resources will be deployed"
  type        = string
}

variable "subnet_ids" {
  description = "List of subnet IDs for the ELB"
  type        = list(string)
}