FROM rust:1.81-bullseye AS builder

WORKDIR /usr/src/app

COPY app/ .

RUN cargo build --release

FROM debian:bullseye-slim

COPY --from=builder /usr/src/app/target/release/app /usr/local/bin/app

CMD ["app"]
