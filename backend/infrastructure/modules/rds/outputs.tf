output "rds_endpoint" {
  value = aws_db_instance.my_rds_instance.endpoint
}

output "rds_instance_id" {
  value = aws_db_instance.my_rds_instance.id
}

output "rds_port" {
  value = aws_db_instance.my_rds_instance.port
}