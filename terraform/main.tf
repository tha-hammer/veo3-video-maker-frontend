terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 4.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# Frontend static website bucket
resource "google_storage_bucket" "frontend" {
  name          = "${var.project_id}-frontend"
  location      = var.region
  force_destroy = false

  website {
    main_page_suffix = "index.html"
    not_found_page   = "index.html"
  }

  cors {
    origin          = ["*"]
    method          = ["GET", "HEAD", "PUT", "POST", "DELETE"]
    response_header = ["*"]
    max_age_seconds = 3600
  }

  uniform_bucket_level_access = true
}

# Cloud Build trigger for frontend
resource "google_cloudbuild_trigger" "frontend" {
  name        = "veo3-frontend-trigger"
  description = "Trigger for frontend changes"
  
  github {
    owner = var.github_owner
    name  = var.github_repo
    push {
      branch = "^main$"
    }
  }
  
  included_files = [
    "src/**",
    "public/**",
    "package.json",
    "vite.config.ts",
    "index.html",
    "cloudbuild.yaml"
  ]
  
  substitutions = {
    _FRONTEND_BUCKET = google_storage_bucket.frontend.name
    _LOAD_BALANCER_NAME = var.load_balancer_name
  }
  
  filename = "cloudbuild.yaml"
}

# Optional: HTTPS Load Balancer with CDN
resource "google_compute_backend_bucket" "frontend" {
  count = var.enable_cdn ? 1 : 0
  
  name        = "frontend-backend-bucket"
  bucket_name = google_storage_bucket.frontend.name
  enable_cdn  = true
}

resource "google_compute_url_map" "frontend" {
  count = var.enable_cdn ? 1 : 0
  
  name            = var.load_balancer_name
  default_service = google_compute_backend_bucket.frontend[0].self_link
}

resource "google_compute_managed_ssl_certificate" "frontend" {
  count = var.enable_cdn && var.domain_name != "" ? 1 : 0
  
  name = "frontend-cert"
  managed {
    domains = [var.domain_name]
  }
}

resource "google_compute_target_https_proxy" "frontend" {
  count = var.enable_cdn && var.domain_name != "" ? 1 : 0
  
  name             = "frontend-https-proxy"
  url_map          = google_compute_url_map.frontend[0].self_link
  ssl_certificates = [google_compute_managed_ssl_certificate.frontend[0].self_link]
}

resource "google_compute_global_forwarding_rule" "frontend" {
  count = var.enable_cdn && var.domain_name != "" ? 1 : 0
  
  name       = "frontend-forwarding-rule"
  target     = google_compute_target_https_proxy.frontend[0].self_link
  port_range = "443"
} 