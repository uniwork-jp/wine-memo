variable "project_id" {
  description = "The Google Cloud Project ID"
  type        = string
}

variable "region" {
  description = "The Google Cloud region for resources"
  type        = string
  default     = "asia-northeast1"
}

variable "firestore_location" {
  description = "The location for the Firestore database"
  type        = string
  default     = "asia-northeast1"
}

variable "environment" {
  description = "Environment name (e.g., dev, staging, prod)"
  type        = string
  default     = "dev"
} 