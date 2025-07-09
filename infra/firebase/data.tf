# Get the current Google Cloud project
data "google_project" "current" {
  project_id = var.project_id
}

# Get the current user/account information
data "google_client_config" "current" {} 