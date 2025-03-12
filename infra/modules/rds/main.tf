resource "aws_db_subnet_group" "this" {
  name       = var.subnet_group_name
  subnet_ids = var.subnet_ids

  tags = {
    Name = var.subnet_group_name
  }
}

resource "aws_db_instance" "this" {
  identifier              = var.db_identifier
  engine                  = var.db_engine
  engine_version          = var.db_engine_version
  instance_class          = var.db_instance_class
  allocated_storage       = var.db_allocated_storage
  storage_type            = "gp2"
  storage_encrypted       = true
  username                = var.db_username
  password                = var.db_password
  parameter_group_name    = var.parameter_group_name
  db_subnet_group_name    = aws_db_subnet_group.this.name
  vpc_security_group_ids  = var.security_group_ids
  multi_az                = var.multi_az
  backup_retention_period = 7
  skip_final_snapshot     = true
  
  tags = {
    Name = var.db_identifier
  }
}