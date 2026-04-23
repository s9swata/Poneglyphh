FROM rust:1-bookworm AS builder

WORKDIR /app

COPY Cargo.toml Cargo.lock* ./
RUN mkdir src && printf 'fn main() {}\n' > src/main.rs
RUN cargo build --release || true
RUN rm -rf src

COPY src/ src/
RUN cargo build --release

FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY --from=builder /app/target/release/upload-worker /usr/local/bin/upload-worker

CMD ["/usr/local/bin/upload-worker"]
