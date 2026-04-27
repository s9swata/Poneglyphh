locals {
  worker_env_vars = [
    {
      name  = "DATABASE_URL"
      value = var.database_url
    },
    {
      name  = "GEMINI_API_KEY"
      value = var.google_generative_ai_api_key
    },
    {
      name  = "SERVER_CALLBACK_URL"
      value = var.worker_callback_url
    },
    {
      name  = "UPLOAD_CALLBACK_SECRET"
      value = var.upload_callback_secret
    },
  ]
}

resource "google_service_account" "pubsub_push_invoker" {
  account_id   = "poneglyph-pubsub-push"
  display_name = "Poneglyph Pub/Sub push invoker"
  project      = var.project_id

  depends_on = [google_project_service.required]
}

module "upload_worker" {
  source  = "GoogleCloudPlatform/cloud-run/google"
  version = "~> 0.26"

  service_name = var.worker_service_name
  project_id   = var.project_id
  location     = var.region
  image        = var.worker_image

  ports = {
    name = "http1"
    port = var.worker_container_port
  }

  timeout_seconds = 900
  members         = []

  limits = {
    cpu    = "1000m"
    memory = "1Gi"
  }

  container_concurrency = 1
  env_vars              = local.worker_env_vars

  template_annotations = {
    "autoscaling.knative.dev/minScale" = "0"
    "autoscaling.knative.dev/maxScale" = tostring(var.worker_max_scale)
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
    "run.googleapis.com/ingress" = "internal"
  }

  depends_on = [google_project_service.required]
}

resource "google_cloud_run_service_iam_member" "upload_worker_invoker" {
  project  = var.project_id
  location = var.region
  service  = var.worker_service_name
  role     = "roles/run.invoker"
  member   = "serviceAccount:${google_service_account.pubsub_push_invoker.email}"
}

module "upload_pubsub" {
  source  = "terraform-google-modules/pubsub/google"
  version = "~> 8.7"

  topic      = var.pubsub_upload_topic
  project_id = var.project_id

  grant_token_creator = true

  push_subscriptions = [
    {
      name                       = var.pubsub_upload_subscription
      push_endpoint              = "${module.upload_worker.service_url}/pubsub/upload"
      ack_deadline_seconds       = 600
      oidc_service_account_email = google_service_account.pubsub_push_invoker.email
      audience                   = module.upload_worker.service_url
      no_wrapper                 = true
      write_metadata             = false
      max_delivery_attempts      = 5
      minimum_backoff            = "10s"
      maximum_backoff            = "300s"
    }
  ]

  depends_on = [google_cloud_run_service_iam_member.upload_worker_invoker]
}

output "upload_worker_url" {
  value = module.upload_worker.service_url
}

output "upload_worker_revision" {
  value = module.upload_worker.revision
}

output "upload_pubsub_topic" {
  value = module.upload_pubsub.topic
}
