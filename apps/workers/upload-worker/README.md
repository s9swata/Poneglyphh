# upload-worker

This worker consumes RabbitMQ upload jobs, creates dataset records, embeds the content, and notifies the server when processing succeeds.

It is a long-running consumer, so it fits container-style deployment better than Lambda.
