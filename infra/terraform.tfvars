aws_region = "ap-south-1"

# CloudWatch
log_group_name = "marai-application-logs"
retention_in_days = 14

# WAF
waf_name = "marai-web-protection"

# ELB
elb_name = "marai-load-balancer"
vpc_id = "sample-vpc-id"
subnet_ids = ["sample-1", "sample-2"]

# SQS
queue_name = "marai-processing-queue"
delay_seconds = 0
max_message_size = 262144
message_retention_seconds = 345600

# EC2
ami             = "ami-123456"
instance_type   = "t2.micro"
subnet_id       = "subnet-abc123"
key_name        = "my-key-pair"

# Elasticache
ec_subnet_ids      = ["subnet-abc123", "subnet-def456"]

# S3
s3_bucket_name   = "my-terraform-s3-bucket"
environment      = "dev"
enable_versioning = true

# RDS
rds_subnet_ids       = ["subnet-abc123", "subnet-def456"]
db_username      = "admin"
db_password      = "StrongPassword123!"

