resource "aws_db_instance" "my_rds_instance" {
  allocated_storage    = var.allocated_storage
  engine               = var.db_engine
  engine_version       = var.db_engine_version
  instance_class       = var.instance_class
  username             = var.db_username
  password             = var.db_password
  vpc_security_group_ids = var.vpc_security_group_ids
  skip_final_snapshot  = true
}

resource "aws_security_group" "rds" {
  name        = "${var.db_identifier}-rds-sg"
  description = "Security group for RDS instance"

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = var.allowed_cidrs
  }
}