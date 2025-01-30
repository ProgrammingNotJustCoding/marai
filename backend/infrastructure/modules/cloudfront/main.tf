resource "aws_cloudfront_origin_access_identity" "example" {
  comment = "Example OAI for S3 bucket access"
}

resource "aws_cloudfront_distribution" "example" {
  origin {
    domain_name = var.origin_domain
    origin_id   = "exampleOrigin"

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.example.cloudfront_access_identity_path
    }
  }

  default_cache_behavior {
    target_origin_id       = "exampleOrigin"
    viewer_protocol_policy = "allow-all"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "Example distribution"
  default_root_object = "index.html"

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}