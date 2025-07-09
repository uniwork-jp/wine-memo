output "project_id" {
  description = "The Google Cloud Project ID"
  value       = var.project_id
}

output "firestore_database_name" {
  description = "The name of the Firestore database"
  value       = google_firestore_database.database.name
}

output "firestore_database_location" {
  description = "The location of the Firestore database"
  value       = google_firestore_database.database.location_id
}

output "firebase_project_id" {
  description = "The Firebase project ID"
  value       = google_firebase_project.default.project
}

output "firestore_indexes" {
  description = "List of created Firestore indexes"
  value = [
    google_firestore_index.wines_created_at_desc.id,
    google_firestore_index.wines_characteristics.id,
    google_firestore_index.wines_region_grape.id,
    google_firestore_index.wines_rating.id,
    google_firestore_index.wines_vintage.id,
    google_firestore_index.wines_name_search.id
  ]
} 