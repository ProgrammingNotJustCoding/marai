provider "aws" {
  region = var.aws_region
}

module "s3_athena" {
  source = "./modules/s3"
  bucket_name = var.athena_bucket_name
}

module "athena" {
  source = "./modules/athena"
  
  bucket_name = var.athena_bucket_name
}

module "rds" {
  source                 = "./modules/rds"
  db_name                = var.db_name
  db_username            = var.db_username
  db_password            = var.db_password
  instance_class         = var.instance_class
  allocated_storage      = var.allocated_storage
  allowed_cidrs          = var.allowed_cidrs
  vpc_security_group_ids = var.vpc_security_group_ids
  db_engine              = var.db_engine
  db_engine_version      = var.db_engine_version
  db_identifier          = var.db_identifier
}

module "cloudfront" {
  source = "./modules/cloudfront"
  bucket_domain_name = module.s3_athena.bucket_domain_name
  bucket_arn         = module.s3_athena.bucket_arn
  origin_domain      = var.origin_domain
}