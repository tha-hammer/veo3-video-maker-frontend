    # In veo3-video-maker-frontend/terraform/remote_state.tf
    
    data "terraform_remote_state" "backend" {
      backend = "gcs"
      config = {
        bucket = "veo3-video-maker-tfstate"
        prefix = "terraform/state"
      }
    }