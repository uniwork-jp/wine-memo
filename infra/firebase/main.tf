# Enable required APIs
resource "google_project_service" "firestore" {
  service = "firestore.googleapis.com"
}

resource "google_project_service" "firebase" {
  service = "firebase.googleapis.com"
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

# Firestore indexes are now generated from Zod schemas
# See generated-indexes.tf for the auto-generated index configurations 