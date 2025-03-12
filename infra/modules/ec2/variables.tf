variable "aws_region" {
  description = "AWS region"
  type        = string
}

variable "ami" {
  description = "AMI ID for the EC2 instance"
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
  description = "SSH key name"
  type        = string
}

variable "security_group_ids" {
  description = "Security group IDs for EC2 instance"
  type        = list(string)
  default     = []
}