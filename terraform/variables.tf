variable "project_id" {
  description = "The GCP project ID"
  type        = string
}

variable "region" {
  description = "The default GCP region for resource deployment"
  type        = string
  default     = "us-central1"
}

variable "github_owner" {
  description = "The GitHub repository owner"
  type        = string
}

variable "github_frontend_repo" {
  description = "The name of the frontend GitHub repository"
  type        = string
}

variable "enable_cdn" {
  description = "Flag to enable/disable the CDN and Load Balancer"
  type        = bool
  default     = false
}

variable "load_balancer_name" {
  description = "The name for the CDN Load Balancer"
  type        = string
  default     = "veo3-frontend-lb"
}

variable "domain_name" {
  description = "The custom domain name for the frontend (optional)"
  type        = string
  default     = ""
}

variable "api_gateway_name" {
  description = "The name for the API Gateway."
  type        = string
  default     = "veo3-frontend-gateway"
} 