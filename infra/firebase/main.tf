# Enable required APIs
resource "google_project_service" "firestore" {
  service = "firestore.googleapis.com"
}

resource "google_project_service" "firebase" {
  service = "firebase.googleapis.com"
}

resource "google_project_service" "cloudfunctions" {
  service = "cloudfunctions.googleapis.com"
}

resource "google_project_service" "cloudbuild" {
  service = "cloudbuild.googleapis.com"
}

resource "google_project_service" "storage" {
  service = "storage.googleapis.com"
}

# Create Firebase project
resource "google_firebase_project" "default" {
  provider = google-beta
  project  = var.project_id

  depends_on = [
    google_project_service.firebase
  ]
}

# Create Firestore database
resource "google_firestore_database" "database" {
  name        = "(default)"
  location_id = var.firestore_location
  type        = "FIRESTORE_NATIVE"

  depends_on = [
    google_project_service.firestore
  ]
}

# Create Cloud Storage bucket for wine label images
resource "google_storage_bucket" "wine_labels" {
  name          = "${var.project_id}-wine-labels"
  location      = var.firestore_location
  force_destroy = true

  uniform_bucket_level_access = true

  cors {
    origin          = ["*"]
    method          = ["GET", "POST", "PUT", "DELETE"]
    response_header = ["*"]
    max_age_seconds = 3600
  }
}

# Firestore indexes are now generated from Zod schemas
# See generated-indexes.tf for the auto-generated index configurations 