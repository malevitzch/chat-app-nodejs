use std::net::SocketAddr;

use axum::{routing::get, Router};
async fn hello() -> &'static str {
    "Welcome"
}

fn create_router() -> Router {
    Router::new().route("/", get(hello))
}

async fn run_server() {
    let app = create_router();
    let address = SocketAddr::from(([0, 0, 0, 0], 8000));
    axum::serve(tokio::net::TcpListener::bind(address).await.unwrap(), app)
        .await
        .unwrap();
}

fn main() {
    println!("Hello, world!");
    let rt = tokio::runtime::Builder::new_multi_thread()
        .worker_threads(4)
        .enable_all()
        .build()
        .unwrap();

    rt.block_on(async {
        run_server().await;
    });
}
