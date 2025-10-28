use crate::dbimpl::postgres::PostgresMessageDB;
use std::{env, net::SocketAddr};

async fn run_server() {
    let url = env::var("DB_URL").unwrap();

    // TODO: actually use the db_type to instantiate the database
    // as a dyn object
    let dbtype = env::var("DB_TYPE").unwrap();
    let db = PostgresMessageDB::new(&url).await.unwrap();
}
