output "web_acl_id" {
  description = "ID of the WAF web ACL"
  value       = aws_wafv2_web_acl.this.id
}