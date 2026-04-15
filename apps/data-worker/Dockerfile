FROM rust:1-bookworm AS builder

RUN apt-get update && apt-get install -y musl-tools
RUN rustup target add x86_64-unknown-linux-musl

WORKDIR /app
COPY Cargo.toml Cargo.lock* ./
COPY src/ src/

RUN cargo build --release --target x86_64-unknown-linux-musl

FROM public.ecr.aws/lambda/provided:al2023

COPY --from=builder /app/target/x86_64-unknown-linux-musl/release/data-worker /var/runtime/bootstrap

RUN chmod +x /var/runtime/bootstrap
