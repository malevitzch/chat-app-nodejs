use axum::{
    extract::{ws::WebSocket, WebSocketUpgrade},
    response::Response,
};

use crate::dbimpl::postgres::PostgresMessageDB;
use std::{env, net::SocketAddr};

pub async fn run_server() {
    let url = env::var("DB_URL").unwrap();

    // TODO: actually use the db_type to instantiate the database
    // as a dyn object
    let dbtype = env::var("DB_TYPE").unwrap();
    let db = PostgresMessageDB::new(&url).await.unwrap();
}

async fn ws_handler(ws: WebSocketUpgrade) -> Response {
    ws.on_upgrade(handle_socket)
}

async fn handle_socket(mut socket: WebSocket) {
    while let Some(msg) = socket.recv().await {
        if let Ok(msg) = msg {}
    }
}
