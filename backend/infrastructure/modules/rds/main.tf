resource "aws_db_instance" "default" {
  identifier              = var.db_instance_identifier
  engine                 = "postgres"
  engine_version         = var.engine_version
  instance_class         = var.instance_class
  allocated_storage       = var.allocated_storage
  storage_type           = var.storage_type
  username               = var.username
  password               = var.password
  db_name                = var.db_name
  skip_final_snapshot    = true
  vpc_security_group_ids  = [aws_security_group.default.id]
}

resource "aws_security_group" "default" {
  name        = "${var.db_instance_identifier}-sg"
  description = "Allow access to RDS instance"

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = var.allowed_cidrs
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_db_parameter_group" "default" {
  name   = "${var.db_instance_identifier}-pg"
  family = "postgres12"

  parameter {
    name  = "max_connections"
    value = var.max_connections
  }
}