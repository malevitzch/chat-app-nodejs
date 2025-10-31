use crate::db::MessageDB;
use crate::dbimpl::postgres::PostgresMessageDB;
use axum::routing::get;
use serde_json::Value;
use std::env;

use std::sync::Arc;

use socketioxide::{extract::SocketRef, SocketIo};

pub async fn run_server() {
    let url = env::var("DB_URL").unwrap();

    // TODO: actually use the db_type to instantiate the database
    // as a dyn object, preferrably one that's shared between worker threads
    // to make sure handling multiple connections is possible
    let dbtype = env::var("DB_TYPE").unwrap();
    let db = Arc::new(PostgresMessageDB::new(&url).await.unwrap());
    db.init().await.unwrap();

    let (layer, io) = SocketIo::new_layer();
    io.ns("/", async move |s: SocketRef| {
        let db = db.clone();
        s.on("get_msgs", async move |s: SocketRef| {
            let msgs = db.fetch_messages().await.unwrap();
            s.emit("update", &msgs).unwrap();
        });
    });
    let app = axum::Router::new()
        .route("/", get(async || "Hello, World!"))
        .layer(layer);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:8000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
