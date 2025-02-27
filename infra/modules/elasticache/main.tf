resource "aws_elasticache_subnet_group" "cache_subnet_group" {
  name       = var.subnet_group_name
  subnet_ids = var.subnet_ids
}

resource "aws_elasticache_cluster" "cache_cluster" {
  cluster_id           = var.cluster_id
  engine              = var.engine
  node_type           = var.node_type
  num_cache_nodes     = var.num_cache_nodes
  parameter_group_name = var.parameter_group_name
  subnet_group_name    = aws_elasticache_subnet_group.cache_subnet_group.name
  security_group_ids   = var.security_group_ids
}
