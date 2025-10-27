use crate::db::MessageDB;
use sqlx::postgres::{PgPool, PgPoolOptions};
use sqlx::Error;

pub struct PostgresMessageDB {
    // TODO: consider using something more complex like url::Url\
    pool: PgPool,
}

impl PostgresMessageDB {
    pub async fn new(url: &str) -> Result<Self, sqlx::Error> {
        let pool = PgPoolOptions::new().max_connections(5).connect(url).await?;
        Ok(Self { pool })
    }
}

impl MessageDB for PostgresMessageDB {
    async fn init(&self) -> Result<(), sqlx::Error> {
        let res = sqlx::query(
            r#"
            CREATE TABLE IF NOT EXISTS messages (
                id SERIAL PRIMARY KEY,
                content TEXT NOT NULL
            );
            "#,
        )
        .execute(&self.pool)
        .await?;
        Ok(())
    }
    async fn add_message(&self, data: serde_json::Value) -> Result<(), sqlx::Error> {
        //TODO: handle error
        let text = data.get("text").unwrap();
        sqlx::query(
            r#"
            INSERT INTO messages (content) values ($1);
            "#,
        )
        .bind(text)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    async fn get_message_count(&self) -> Result<usize, sqlx::Error> {
        let (count,): (i64,) = sqlx::query_as(
            r#"
            SELECT COUNT(*) FROM messages;
            "#,
        )
        .fetch_one(&self.pool)
        .await?;

        Ok(count as usize)
    }
}
