use crate::db::MessageDB;
use sqlx::postgres::{PgPool, PgPoolOptions};
use sqlx::Error;

use serde::{Deserialize, Serialize};

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

#[derive(sqlx::FromRow, Serialize, Deserialize)]
struct RowMSG {
    content: String,
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
    async fn fetch_messages(&self) -> Result<serde_json::Value, sqlx::Error> {
        // TODO: bind the actual message limit rather than a static 10
        let result = sqlx::query_as::<_, RowMSG>(
            r#"
            SELECT content FROM messages ORDER BY id LIMIT $1
            "#,
        )
        .bind(10)
        .fetch_all(&self.pool)
        .await?;

        Ok(serde_json::to_value(result).unwrap())
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
