resource "aws_managed_blockchain_network" "example" {
  name     = var.network_name
  framework = var.framework
  framework_version = var.framework_version
  voting_policy {
    approval_threshold_percentage = var.approval_threshold_percentage
  }
}

resource "aws_managed_blockchain_member" "example" {
  network_id = aws_managed_blockchain_network.example.id
  name       = var.member_name
  framework_configuration {
    framework = var.framework
    version   = var.framework_version
  }
}

resource "aws_managed_blockchain_node" "example" {
  member_id = aws_managed_blockchain_member.example.id
  network_id = aws_managed_blockchain_network.example.id
  availability_zone = var.availability_zone
  instance_type = var.instance_type
}