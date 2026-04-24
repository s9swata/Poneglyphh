terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = ">= 6.0.0, < 8.0.0"
    }
    google-beta = {
      source  = "hashicorp/google-beta"
      version = ">= 6.0.0, < 8.0.0"
    }
  }

  required_version = ">= 1.3"
}

provider "google" {
  project = var.project_id
  region  = var.region
}
