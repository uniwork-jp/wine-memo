# Auto-generated Terraform configuration from Zod schemas
# Generated on: 2025-07-09T02:55:55.760Z
# Source: lib/zodSchemas.ts

# Index for listing wines by creation date (newest first)
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

# Index for wine characteristics queries and filtering
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

# Index for region and grape variety searches
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

# Index for rating-based queries
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

# Index for vintage-based queries
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

# Index for name-based searches
resource "google_firestore_index" "wines_name_search" {
  collection = "wines"
  depends_on = [google_firestore_database.database]
  
  fields {
    field_path = "name"
    order      = "ASCENDING"
  }
  fields {
    field_path = "createdAt"
    order      = "DESCENDING"
  }
}

# Note: Outputs are defined in outputs.tf to avoid duplicates
