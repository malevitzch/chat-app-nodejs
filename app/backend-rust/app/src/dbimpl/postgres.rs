use crate::db::MessageDB;
use sqlx::postgres::{PgPool, PgPoolOptions};
use sqlx::Error;
use std::env;

pub struct PostgresMessageDB {
    // TODO: consider using something more complex like url::Url\
    pool: PgPool,
    msg_limit: usize,
}

impl PostgresMessageDB {
    pub async fn new(url: &str) -> Result<Self, sqlx::Error> {
        let pool = PgPoolOptions::new().max_connections(5).connect(url).await?;
        let msg_limit = env::var("MESSAGE_LIMIT").unwrap().parse::<usize>().unwrap();
        Ok(Self { pool, msg_limit })
    }
}

impl MessageDB for PostgresMessageDB {
    async fn init(&self) -> Result<(), sqlx::Error> {
        sqlx::query(
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
        let result: serde_json::Value = sqlx::query_scalar(
            r#"
            SELECT json_agg(json_build_object('content', content::json))
            FROM (SELECT content FROM (SELECT content, id FROM messages ORDER BY id desc LIMIT $1) ORDER BY id asc) msg;
            "#,
        )
        .bind(self.msg_limit as i64)
        .fetch_one(&self.pool)
        .await?;

        Ok(result)
    }
    async fn add_message(&self, data: serde_json::Value) -> Result<(), sqlx::Error> {
        //TODO: handle error
        let text = data.get("content").unwrap();
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
