# Use cargo-chef to cache dependencies
FROM lukemathwalker/cargo-chef:latest-rust-1.75 AS chef
WORKDIR /app

FROM chef AS planner
COPY . .
RUN cargo chef prepare --recipe-path recipe.json

FROM chef AS builder
COPY --from=planner /app/recipe.json recipe.json
# Build dependencies - this is the caching layer
RUN cargo chef cook --release --recipe-path recipe.json
# Build application
COPY . .
RUN cargo build --release --bin coin-backend

# Runtime image
FROM debian:bookworm-slim AS runtime
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates && rm -rf /var/lib/apt/lists/*

# Copy the binary
COPY --from=builder /app/target/release/coin-backend /app/coin-backend
# Copy migrations for sqlx::migrate!
COPY --from=builder /app/migrations /app/migrations

ENV RUST_LOG=info
ENV BIND_ADDRESS=0.0.0.0:8000

EXPOSE 8000
CMD ["./coin-backend"]
