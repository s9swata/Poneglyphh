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

variable "image" {
  description = "Full container image reference to deploy"
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

variable "rabbitmq_url" {
  type      = string
  sensitive = true
}

variable "rabbitmq_queue" {
  type = string
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
