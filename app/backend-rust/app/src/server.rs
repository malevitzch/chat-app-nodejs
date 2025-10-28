async fn run_server() {
    let url = env::var("DATABASE_URL").unwrap();

    let dbtype = env::var("DATABASE_TYPE").unwrap();
    let db;

    let db = PostgresMessageDB::new(&url).await.unwrap();
}
