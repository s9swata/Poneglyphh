variable "project_id" {
  description = "GCP project ID"
  type        = string
  default     = "agasta"
}

variable "region" {
  description = "GCP region for Cloud Run and Artifact Registry"
  type        = string
  default     = "asia-south1"
}

variable "service_name" {
  description = "Cloud Run service name"
  type        = string
  default     = "poneglyph-server"
}

variable "worker_service_name" {
  description = "Cloud Run upload worker service name"
  type        = string
  default     = "poneglyph-upload-worker"
}

variable "container_port" {
  description = "Container port exposed to Cloud Run"
  type        = number
  default     = 8080
}

variable "max_scale" {
  description = "Maximum Cloud Run instances"
  type        = number
  default     = 2
}

variable "worker_max_scale" {
  description = "Maximum Cloud Run worker instances"
  type        = number
  default     = 1
}

variable "image" {
  description = "Full container image reference to deploy"
  type        = string
}

variable "worker_image" {
  description = "Full upload worker container image reference to deploy"
  type        = string
}

variable "worker_container_port" {
  description = "Worker container port exposed to Cloud Run"
  type        = number
  default     = 8080
}

variable "pubsub_upload_topic" {
  description = "Pub/Sub topic name for upload jobs"
  type        = string
  default     = "poneglyph-upload"
}

variable "pubsub_upload_subscription" {
  description = "Pub/Sub push subscription name for upload worker"
  type        = string
  default     = "poneglyph-upload-worker-push"
}

variable "worker_callback_url" {
  description = "Server callback URL used by the upload worker"
  type        = string
}

variable "better_auth_url" {
  description = "Public backend URL used by Better Auth"
  type        = string
  default     = "https://poneglyph-api.vyse.site"
}

variable "cors_origin" {
  description = "Allowed frontend origin"
  type        = string
  default     = "https://poneglyph.vyse.site"
}

variable "database_url" {
  type      = string
  sensitive = true
}

variable "better_auth_secret" {
  type      = string
  sensitive = true
}

variable "s3_access_key" {
  type      = string
  sensitive = true
}

variable "s3_secret_key" {
  type      = string
  sensitive = true
}

variable "s3_bucket_name" {
  type = string
}

variable "s3_endpoint" {
  type = string
}

variable "s3_region" {
  type    = string
  default = "auto"
}

variable "google_generative_ai_api_key" {
  type      = string
  sensitive = true
}

variable "groq_api_key" {
  type      = string
  sensitive = true
}

variable "tavily_api_key" {
  type      = string
  sensitive = true
}

variable "upstash_redis_rest_url" {
  type = string
}

variable "upstash_redis_rest_token" {
  type      = string
  sensitive = true
}

variable "resend_api_key" {
  type      = string
  sensitive = true
}

variable "resend_from_email" {
  type = string
}

variable "resend_from_name" {
  type = string
}

variable "upload_callback_secret" {
  type      = string
  sensitive = true
}

variable "google_client_id" {
  description = "Google OAuth client ID"
  type        = string
}

variable "google_client_secret" {
  description = "Google OAuth client secret"
  type        = string
  sensitive   = true
}
