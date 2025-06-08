project_id = "silmarimarketer"
region     = "us-central1"

github_owner         = "tha-hammer"
github_frontend_repo = "veo3-video-maker-frontend"

# These variables are no longer needed as they are read from the remote state
# generate_background_function_url  = "..."
# process_presentation_function_url = "..."

# These variables are for the Cloud Build service account, which should be managed
# in the backend/GCP console, not passed in here.
# cloudbuild_service_account_email = "..."
# cloudbuild_service_account_id    = "..."

# Variables for the optional CDN and Load Balancer
enable_cdn         = true
load_balancer_name = "veo3-frontend-lb"
#domain_name        = "dev.your-domain.com" # Optional: replace with your domain

# Variable for the API Gateway
api_gateway_name = "veo3-frontend-gateway" 