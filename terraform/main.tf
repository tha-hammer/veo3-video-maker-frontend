terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 4.0"
    }
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "~> 4.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

provider "google-beta" {
  project = var.project_id
  region  = var.region
}

# Storage bucket for frontend static assets
resource "google_storage_bucket" "frontend" {
  name          = "${var.project_id}-frontend-assets"
  location      = var.region
  force_destroy = true # Set to false in production

  uniform_bucket_level_access = true

  website {
    main_page_suffix = "index.html"
    not_found_page   = "index.html"
  }
}

# Allow public access to the frontend bucket
/* resource "google_storage_bucket_iam_member" "public_access" {
  bucket = google_storage_bucket.frontend.name
  role   = "roles/storage.objectViewer"
  member = "allUsers"
} */

# Cloud Build trigger for frontend
resource "google_cloudbuild_trigger" "frontend" {
  name        = "veo3-frontend-trigger"
  description = "Trigger for frontend changes"
  
  github {
    owner = var.github_owner
    name  = var.github_frontend_repo
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

# API Gateway for backend functions
resource "google_api_gateway_api" "api" {
  provider = google-beta
  api_id   = var.api_gateway_name
}

resource "google_api_gateway_api_config" "api_cfg" {
  provider = google-beta
  api      = google_api_gateway_api.api.api_id
  api_config_id_prefix = "veo3-cfg"

  openapi_documents {
    document {
      path = "spec.yaml"
      contents = base64encode(templatefile("${path.module}/openapi_spec.yaml.tftpl", {
        process_presentation_url = data.terraform_remote_state.backend.outputs.process_presentation_function_url
        generate_background_url = data.terraform_remote_state.backend.outputs.generate_background_function_url
      }))
    }
  }
  lifecycle {
    create_before_destroy = true
  }
}

resource "google_api_gateway_gateway" "gateway" {
  provider = google-beta
  api_config = google_api_gateway_api_config.api_cfg.id
  gateway_id = var.api_gateway_name
  display_name = var.api_gateway_name
}
