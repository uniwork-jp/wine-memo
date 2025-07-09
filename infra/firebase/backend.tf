# Uncomment and configure for remote state storage
# terraform {
#   backend "gcs" {
#     bucket = "wine-memo-terraform-state"
#     prefix = "firebase/terraform.tfstate"
#   }
# }

# For local development, state will be stored locally
# For production, uncomment the above backend configuration 