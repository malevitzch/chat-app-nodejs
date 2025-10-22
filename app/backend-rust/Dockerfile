FROM rust:1.81-bullseye AS builder

WORKDIR /usr/src/app

COPY app/src ./src
COPY app/Cargo.toml .

RUN rustup target add x86_64-unknown-linux-musl
RUN cargo build --release --target x86_64-unknown-linux-musl

FROM alpine:3.14

COPY --from=builder /usr/src/app/target/x86_64-unknown-linux-musl/release/app /usr/local/bin/app

CMD ["app"]
