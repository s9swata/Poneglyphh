locals {
  server_env_vars = [
    {
      name  = "NODE_ENV"
      value = "production"
    },
    {
      name  = "BETTER_AUTH_URL"
      value = var.better_auth_url
    },
    {
      name  = "FRONTEND_URL"
      value = var.cors_origin
    },
    {
      name  = "CORS_ORIGIN"
      value = var.cors_origin
    },
    {
      name  = "DATABASE_URL"
      value = var.database_url
    },
    {
      name  = "BETTER_AUTH_SECRET"
      value = var.better_auth_secret
    },
    {
      name  = "S3_ACCESS_KEY"
      value = var.s3_access_key
    },
    {
      name  = "S3_SECRET_KEY"
      value = var.s3_secret_key
    },
    {
      name  = "S3_BUCKET_NAME"
      value = var.s3_bucket_name
    },
    {
      name  = "S3_ENDPOINT"
      value = var.s3_endpoint
    },
    {
      name  = "S3_REGION"
      value = var.s3_region
    },
    {
      name  = "GOOGLE_GENERATIVE_AI_API_KEY"
      value = var.google_generative_ai_api_key
    },
    {
      name  = "GROQ_API_KEY"
      value = var.groq_api_key
    },
    {
      name  = "TAVILY_API_KEY"
      value = var.tavily_api_key
    },
    {
      name  = "UPSTASH_REDIS_REST_URL"
      value = var.upstash_redis_rest_url
    },
    {
      name  = "UPSTASH_REDIS_REST_TOKEN"
      value = var.upstash_redis_rest_token
    },
    {
      name  = "RESEND_API_KEY"
      value = var.resend_api_key
    },
    {
      name  = "RESEND_FROM_EMAIL"
      value = var.resend_from_email
    },
    {
      name  = "RESEND_FROM_NAME"
      value = var.resend_from_name
    },
    {
      name  = "UPLOAD_CALLBACK_SECRET"
      value = var.upload_callback_secret
    },
    {
      name  = "GOOGLE_CLIENT_ID"
      value = var.google_client_id
    },
    {
      name  = "GOOGLE_CLIENT_SECRET"
      value = var.google_client_secret
    },
    {
      name  = "PUBSUB_PROJECT_ID"
      value = var.project_id
    },
    {
      name  = "PUBSUB_UPLOAD_TOPIC"
      value = var.pubsub_upload_topic
    },
  ]
}

resource "google_project_service" "required" {
  for_each = toset([
    "run.googleapis.com",
    "pubsub.googleapis.com",
    "iam.googleapis.com",
  ])

  project            = var.project_id
  service            = each.value
  disable_on_destroy = false
}

resource "google_project_iam_member" "server_pubsub_publisher" {
  project = var.project_id
  role    = "roles/pubsub.publisher"
  member  = "serviceAccount:${data.google_project.current.number}-compute@developer.gserviceaccount.com"

  depends_on = [google_project_service.required]
}

module "cloud_run" {
  source  = "GoogleCloudPlatform/cloud-run/google"
  version = "~> 0.26"

  service_name = var.service_name
  project_id   = var.project_id
  location     = var.region
  image        = var.image

  ports = {
    name = "http1"
    port = var.container_port
  }

  timeout_seconds = 120
  members         = ["allUsers"]

  limits = {
    cpu    = "1000m"
    memory = "512Mi"
  }

  env_vars = local.server_env_vars

  template_annotations = {
    "autoscaling.knative.dev/minScale" = "0"
    "autoscaling.knative.dev/maxScale" = tostring(var.max_scale)
    "run.googleapis.com/client-name"   = "terraform"
    "generated-by"                     = "terraform"
  }

  startup_probe = {
    failure_threshold     = 3
    initial_delay_seconds = 0
    timeout_seconds       = 5
    period_seconds        = 10
    http_get = {
      path = "/health"
    }
  }

  service_annotations = {
    "run.googleapis.com/ingress" = "all"
  }

  depends_on = [
    google_project_service.required,
    google_project_iam_member.server_pubsub_publisher,
  ]
}

output "cloud_run_url" {
  value = module.cloud_run.service_url
}

output "cloud_run_revision" {
  value = module.cloud_run.revision
}
