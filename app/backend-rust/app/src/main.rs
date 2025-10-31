mod db;
mod dbimpl;
mod msg;
mod server;

use dbimpl::postgres::PostgresMessageDB;
use serde_json::json;
use std::{env, net::SocketAddr};

use db::MessageDB;

use axum::{routing::get, Router};

#[tokio::main]
async fn main() {
    server::run_server().await;
}
