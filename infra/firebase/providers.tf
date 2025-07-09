# Configure the Google Provider
provider "google" {
  project = var.project_id
  region  = var.region
}

# Configure the Google Beta Provider for Firebase resources
provider "google-beta" {
  project = var.project_id
  region  = var.region
} 