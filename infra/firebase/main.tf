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

# Create Firestore indexes for the wines collection
resource "google_firestore_index" "wines_created_at_desc" {
  collection = "wines"
  depends_on = [google_firestore_database.database]
  
  fields {
    field_path = "createdAt"
    order      = "DESCENDING"
  }
  
  fields {
    field_path = "__name__"
    order      = "ASCENDING"
  }
}

# Create Firestore indexes for wine characteristics queries
resource "google_firestore_index" "wines_characteristics" {
  collection = "wines"
  depends_on = [google_firestore_database.database]
  
  fields {
    field_path = "characteristics.sweetness"
    order      = "ASCENDING"
  }
  
  fields {
    field_path = "characteristics.body"
    order      = "ASCENDING"
  }
  
  fields {
    field_path = "characteristics.acidity"
    order      = "ASCENDING"
  }
  
  fields {
    field_path = "characteristics.tannin"
    order      = "ASCENDING"
  }
  
  fields {
    field_path = "characteristics.bitterness"
    order      = "ASCENDING"
  }
}

# Create Firestore indexes for wine search queries
resource "google_firestore_index" "wines_region_grape" {
  collection = "wines"
  depends_on = [google_firestore_database.database]
  
  fields {
    field_path = "region"
    order      = "ASCENDING"
  }
  
  fields {
    field_path = "grapeVariety"
    order      = "ASCENDING"
  }
  
  fields {
    field_path = "createdAt"
    order      = "DESCENDING"
  }
}

# Create Firestore indexes for rating queries
resource "google_firestore_index" "wines_rating" {
  collection = "wines"
  depends_on = [google_firestore_database.database]
  
  fields {
    field_path = "rating"
    order      = "DESCENDING"
  }
  
  fields {
    field_path = "createdAt"
    order      = "DESCENDING"
  }
}

# Create Firestore indexes for vintage queries
resource "google_firestore_index" "wines_vintage" {
  collection = "wines"
  depends_on = [google_firestore_database.database]
  
  fields {
    field_path = "vintage"
    order      = "ASCENDING"
  }
  
  fields {
    field_path = "createdAt"
    order      = "DESCENDING"
  }
} 