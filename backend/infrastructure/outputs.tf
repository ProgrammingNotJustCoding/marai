output "athena_database_name" {
  value = module.athena.database_name
}

output "athena_table_names" {
  value = module.athena.table_names
}

output "s3_bucket_name" {
  value = module.s3.bucket_name
}

output "s3_bucket_arn" {
  value = module.s3.bucket_arn
}

output "rds_endpoint" {
  value = module.rds.endpoint
}

output "rds_instance_id" {
  value = module.rds.instance_id
}

output "cloudfront_distribution_id" {
  value = module.cloudfront.distribution_id
}

output "cloudfront_domain_name" {
  value = module.cloudfront.domain_name
}

output "managed_blockchain_network_id" {
  value = module.managed_blockchain.network_id
}

output "managed_blockchain_member_id" {
  value = module.managed_blockchain.member_id
}