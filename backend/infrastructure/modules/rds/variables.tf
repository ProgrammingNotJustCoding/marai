variable "allocated_storage" {
  description = "The allocated storage for the RDS instance"
  type        = number
}

variable "db_engine" {
  description = "The database engine for the RDS instance"
  type        = string
}

variable "db_engine_version" {
  description = "The database engine version for the RDS instance"
  type        = string
}

variable "instance_class" {
  description = "The instance class for the RDS instance"
  type        = string
}

variable "db_name" {
  description = "The name of the database"
  type        = string
}

variable "db_username" {
  description = "The username for the database"
  type        = string
}

variable "db_password" {
  description = "The password for the database"
  type        = string
  sensitive   = true
}

variable "vpc_security_group_ids" {
  description = "A list of VPC security group IDs to associate with the RDS instance"
  type        = list(string)
}

variable "allowed_cidrs" {
  description = "The list of allowed CIDR blocks"
  type        = list(string)
}

variable "db_identifier" {
  description = "The identifier for the RDS instance"
  type        = string
}