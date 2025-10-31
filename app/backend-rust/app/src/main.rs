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
    let url = env::var("DB_URL").unwrap();
    let pgdb = PostgresMessageDB::new(&url).await.unwrap();
    println!("Connected to database");
    pgdb.init().await.unwrap();
    println!("{}", pgdb.get_message_count().await.unwrap());
    pgdb.add_message(json!({"text": "HEY"})).await.unwrap();
    println!("{}", pgdb.get_message_count().await.unwrap());
    println!("{}", pgdb.fetch_messages().await.unwrap());
    server::run_server().await;
}
