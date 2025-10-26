use crate::db::MessageDB;
use sqlx::postgres::{PgPool, PgPoolOptions};

pub struct PostgresMessageDB {
    // TODO: consider using something more complex like url::Url\
    pool: PgPool,
}

impl PostgresMessageDB {
    pub async fn new(url: &str) -> Self {
        // FIXME: error handling
        let pool = PgPoolOptions::new()
            .max_connections(5)
            .connect(url)
            .await
            .unwrap();
        Self { pool }
    }
}

impl MessageDB for PostgresMessageDB {
    async fn init(&self) {
        sqlx::query(
            r#"
            CREATE TABLE IF NOT EXISTS messages (
                id PRIMARY KEY,
                content TEXT NOT NULL
            );
            "#,
        )
        .execute(&self.pool)
        .await;
    }
    async fn add_message(&self, data: serde_json::Value) {}

    async fn get_message_count(&self) -> usize {
        let (count,): (i64,) = sqlx::query_as(
            r#"
            SELECT COUNT(*) FROM messages;
            "#,
        )
        .fetch_one(&self.pool)
        .await
        .unwrap();

        count as usize
    }
}
