output "security_group_id" {
  value = module.security_group.sg_id
}

output "cloudwatch_log_group_arn" {
  value = module.cloudwatch.log_group_arn
}

output "waf_id" {
  value = module.waf.id
}

output "elb_dns" {
  value = module.elb.dns_name
}

output "sqs_queue_url" {
  value = module.sqs.queue_url
}

output "ec2_id" {
  value = module.ec2.id
}

output "ec2_public_ip" {
  value = module.ec2.public_ip
}

output "elasticache_endpoint" {
  value = module.elasticache.endpoint
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