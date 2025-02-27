output "sg_id" {
  description = "The ID of the security group"
  value       = aws_security_group.sg.id
}

output "sg_name" {
  description = "The name of the security group"
  value       = aws_security_group.sg.name
}