resource "aws_db_subnet_group" "rds_subnet_group" {
  name       = var.subnet_group_name
  subnet_ids = var.subnet_ids

  tags = {
    Name = var.subnet_group_name
  }
}

resource "aws_db_instance" "rds_instance" {
  identifier             = var.db_identifier
  engine                = var.db_engine
  engine_version        = var.db_engine_version
  instance_class        = var.db_instance_class
  allocated_storage     = var.db_allocated_storage
  username             = var.db_username
  password             = var.db_password
  parameter_group_name = var.parameter_group_name
  db_subnet_group_name = aws_db_subnet_group.rds_subnet_group.name
  vpc_security_group_ids = var.security_group_ids
  publicly_accessible   = false
  multi_az             = var.multi_az
  skip_final_snapshot  = true
}
