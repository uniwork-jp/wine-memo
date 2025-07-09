locals {
  project_name = "wine-memo"
  project_id   = "wine-memo-465402"
  project_number = "460160444600"
  
  common_tags = {
    Project     = local.project_name
    Environment = var.environment
    ManagedBy   = "terraform"
    Owner       = "wine-memo-team"
  }
} 