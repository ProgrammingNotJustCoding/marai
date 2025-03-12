variable "cluster_id" {
  description = "ElastiCache cluster ID"
  type        = string
}

variable "engine" {
  description = "ElastiCache engine (redis or memcached)"
  type        = string
  default     = "redis"
}

variable "node_type" {
  description = "ElastiCache node type"
  type        = string
}

variable "num_cache_nodes" {
  description = "Number of cache nodes"
  type        = number
  default     = 1
}

variable "parameter_group_name" {
  description = "ElastiCache parameter group name"
  type        = string
  default     = "default.redis7"
}

variable "subnet_group_name" {
  description = "ElastiCache subnet group name"
  type        = string
}

variable "subnet_ids" {
  description = "Subnet IDs for ElastiCache"
  type        = list(string)
}

variable "security_group_ids" {
  description = "Security group IDs for ElastiCache"
  type        = list(string)
}