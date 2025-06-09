output "frontend_url" {
  description = "The public URL of the frontend website"
  value       = var.enable_cdn && var.domain_name != "" ? "https://${google_compute_global_forwarding_rule.frontend[0].ip_address}" : "https://storage.googleapis.com/${google_storage_bucket.frontend.name}/index.html"
}

output "frontend_bucket_name" {
  description = "Name of the GCS bucket for the frontend."
  value       = google_storage_bucket.frontend.name
}

output "api_gateway_url" {
  description = "The URL of the API Gateway."
  value       = "https://${google_api_gateway_gateway.gateway.default_hostname}"
} 