mod db;
mod dbimpl;
mod msg;
use dbimpl::postgres::PostgresMessageDB;
use std::{env, net::SocketAddr};
use tokio::runtime::Runtime;

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
    let pgdb = PostgresMessageDB::new(&url).await;
    println!("Connected to database");
    run_server().await;
}
