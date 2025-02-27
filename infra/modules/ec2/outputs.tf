output "ec2_instance_id" {
    description = "The ID of the EC2 instance"
    value       = aws_instance.ec2_instance.id
  }
  
  output "ec2_public_ip" {
    description = "The public IP of the EC2 instance"
    value       = aws_instance.ec2_instance.public_ip
  }
  
  output "ec2_private_ip" {
    description = "The private IP of the EC2 instance"
    value       = aws_instance.ec2_instance.private_ip
  }
  