resource "aws_sqs_queue" "this" {
  name                      = var.queue_name
  delay_seconds             = var.delay_seconds
  max_message_size          = var.max_message_size
  message_retention_seconds = var.message_retention_seconds
  receive_wait_time_seconds = 10
  
  sqs_managed_sse_enabled = true

  tags = {
    Name = var.queue_name
  }
}