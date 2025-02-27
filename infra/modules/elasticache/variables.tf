variable "cluster_id" {
  description = "The ID of the ElastiCache cluster"
  type        = string
}

variable "engine" {
  description = "ElastiCache engine (redis or memcached)"
  type        = string
}

variable "node_type" {
  description = "The instance type for the ElastiCache nodes"
  type        = string
}

variable "num_cache_nodes" {
  description = "The number of cache nodes"
  type        = number
}

variable "parameter_group_name" {
  description = "The parameter group for ElastiCache"
  type        = string
}

variable "subnet_group_name" {
  description = "Subnet group name for ElastiCache"
  type        = string
}

variable "subnet_ids" {
  description = "List of subnet IDs for the ElastiCache cluster"
  type        = list(string)
}

variable "security_group_ids" {
  description = "List of security group IDs for ElastiCache"
  type        = list(string)
}
