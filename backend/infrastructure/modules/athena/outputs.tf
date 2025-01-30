output "database_name" {
  value = aws_athena_database.example.name
}

output "table_names" {
  value = [aws_athena_table.example.name]
}