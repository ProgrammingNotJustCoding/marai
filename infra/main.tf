provider "aws" {
  region     = var.aws_region
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
  token = var.aws_session_token
}

module "security_group" {
  source        = "./modules/security_group"
  sg_name       = "marai-database-sg"
  sg_description = "Security group for RDS and ElastiCache"
  vpc_id        = var.vpc_id
  
  ingress_rules = [
    {
      from_port   = 5432  # PostgreSQL
      to_port     = 5432
      protocol    = "tcp"
      cidr_blocks = var.allowed_cidr_blocks
      description = "Allow PostgreSQL access"
    },
    {
      from_port   = 6379  # Redis
      to_port     = 6379
      protocol    = "tcp"
      cidr_blocks = var.allowed_cidr_blocks
      description = "Allow Redis access"
    }
  ]
}

module "cloudwatch" {
  source            = "./modules/cloudwatch"
  log_group_name    = var.log_group_name
  retention_in_days = var.retention_in_days
}

module "waf" {
  source   = "./modules/waf"
  waf_name = var.waf_name
}

module "elb" {
  source     = "./modules/elb"
  elb_name   = var.elb_name
  vpc_id     = var.vpc_id
  subnet_ids = var.subnet_ids
}

module "sqs" {
  source                    = "./modules/sqs"
  queue_name                = var.queue_name
  delay_seconds             = var.delay_seconds
  max_message_size          = var.max_message_size
  message_retention_seconds = var.message_retention_seconds
}

module "ec2" {
  source        = "./modules/ec2"
  aws_region    = var.aws_region
  ami           = var.ami
  instance_type = var.instance_type
  subnet_id     = var.subnet_id
  key_name      = var.key_name
  security_group_ids = [module.security_group.sg_id]
}

module "elasticache" {
  source               = "./modules/elasticache"
  cluster_id           = var.cache_cluster_id
  engine               = "redis"
  node_type            = var.cache_node_type
  num_cache_nodes      = var.cache_nodes
  parameter_group_name = "default.redis7"
  subnet_group_name    = var.cache_subnet_group_name
  subnet_ids           = var.ec_subnet_ids
  security_group_ids   = [module.security_group.sg_id]
}

module "s3" {
  source            = "./modules/s3"
  bucket_name       = var.s3_bucket_name
  environment       = var.environment
  enable_versioning = var.enable_versioning
}

module "rds" {
  source               = "./modules/rds"
  db_identifier        = var.db_identifier
  db_engine            = var.db_engine
  db_engine_version    = var.db_engine_version
  db_instance_class    = var.db_instance_class
  db_allocated_storage = var.db_allocated_storage
  db_username          = var.db_username
  db_password          = var.db_password
  parameter_group_name = "default.${var.db_engine}${var.db_engine_version}"
  subnet_group_name    = var.db_subnet_group_name
  subnet_ids           = var.rds_subnet_ids
  security_group_ids   = [module.security_group.sg_id]
  multi_az             = var.db_multi_az
}