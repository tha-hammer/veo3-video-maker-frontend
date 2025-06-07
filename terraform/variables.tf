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

variable "github_repo" {
  description = "The name of the frontend GitHub repository"
  type        = string
}

variable "enable_cdn" {
  description = "Whether to enable Cloud CDN"
  type        = bool
  default     = false
}

variable "domain_name" {
  description = "Domain name for the frontend (optional)"
  type        = string
  default     = ""
}

variable "load_balancer_name" {
  description = "Name of the load balancer (if CDN enabled)"
  type        = string
  default     = "veo3-frontend-lb"
} 