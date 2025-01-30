provider "aws" {
  region = var.region
}

module "s3" {
  source = "./modules/s3"
  bucket_name = var.s3_bucket_name
  region = var.region
}

module "athena" {
  source      = "./modules/athena"
  s3_bucket   = var.s3_bucket_name
  table_name  = var.table_name
  database_name = var.database_name
}

module "rds" {
  source = "./modules/rds"
  instance_type = var.rds_instance_type
  db_name = var.rds_db_name
  username = var.rds_username
  password = var.rds_password
}

module "cloudfront" {
  source = "./modules/cloudfront"
  origin_domain = var.cloudfront_origin_domain
}

module "managed_blockchain" {
  source = "./modules/managed-blockchain"
  network_name = var.blockchain_network_name
  framework = var.blockchain_framework
}