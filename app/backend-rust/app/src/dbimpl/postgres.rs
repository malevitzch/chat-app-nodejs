use crate::db::MessageDB;
use sqlx::postgres::PgPoolOptions;

struct PostgresMessageDB {
    // TODO: consider using something more complex like url::Url
    url: String,
}

impl MessageDB for PostgresMessageDB {
    fn init(&self) {
        sqlx::query(
            r#"
            CREATE TABLE IF NOT EXISTS messages (
                id PRIMARY KEY,
                content TEXT NOT NULL
            );
            "#,
        );
    }

    async fn get_message_count(&self) -> usize {
        let res = sqlx::query(
            r#"
            SELECT COUNT(*) FROM messages;
            "#,
        );
    }
}
