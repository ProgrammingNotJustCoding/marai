resource "aws_s3_bucket" "athena_bucket" {
  bucket = var.bucket_name
}

resource "aws_athena_workgroup" "main" {
  name = "primary"

  configuration {
    result_configuration {
      output_location = "s3://${aws_s3_bucket.athena_bucket.bucket}/output/"
    }
  }
}