mod db;
mod dbimpl;
mod msg;

use dbimpl::postgres::PostgresMessageDB;
use serde_json::json;
use std::{env, net::SocketAddr};
use tokio::runtime::Runtime;

use db::MessageDB;

use axum::{routing::get, Router};

fn create_router() -> Router {
    Router::new().route("/", get(db::hello))
}

async fn run_server() {
    let app = create_router();
    let address = SocketAddr::from(([0, 0, 0, 0], 8000));
    axum::serve(tokio::net::TcpListener::bind(address).await.unwrap(), app)
        .await
        .unwrap();
}

#[tokio::main]
async fn main() {
    let url = env::var("DATABASE_URL").unwrap();
    let pgdb = PostgresMessageDB::new(&url).await.unwrap();
    println!("Connected to database");
    pgdb.init().await.unwrap();
    println!("{}", pgdb.get_message_count().await.unwrap());
    pgdb.add_message(json!({"text": "HEY"})).await.unwrap();
    println!("{}", pgdb.get_message_count().await.unwrap());
    run_server().await;
}
