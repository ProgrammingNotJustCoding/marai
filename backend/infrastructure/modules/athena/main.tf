resource "aws_athena_database" "example" {
  name   = var.database_name
  bucket = var.s3_bucket_name
}

resource "aws_athena_table" "example" {
  name          = var.table_name
  database_name = aws_athena_database.example.name
  bucket        = var.s3_bucket_name

  columns {
    name = "id"
    type = "integer"
  }

  columns {
    name = "name"
    type = "string"
  }

  partitioned_by = ["year", "month"]

  lifecycle {
    ignore_changes = [columns]
  }
}