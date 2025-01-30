variable "network_name" {
  description = "The name of the Managed Blockchain network."
  type        = string
}

variable "framework" {
  description = "The framework for the Managed Blockchain (e.g., Hyperledger Fabric, Ethereum)."
  type        = string
}

variable "member_name" {
  description = "The name of the member in the Managed Blockchain network."
  type        = string
}

variable "member_description" {
  description = "A description for the member."
  type        = string
  default     = ""
}

variable "framework_version" {
  description = "The version of the framework to use."
  type        = string
  default     = "1.0"
}