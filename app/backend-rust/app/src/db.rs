pub trait MessageDB {
    async fn init(&self) -> Result<(), sqlx::Error>;
    async fn fetch_messages(&self) -> Result<serde_json::Value, sqlx::Error>;

    // TODO: this function calls cleanup if needed
    // async fn post_message(&self, data: serde_json::Value) -> Result<(), sqlx::Error>;
    async fn add_message(&self, data: serde_json::Value) -> Result<(), sqlx::Error>;
    async fn get_message_count(&self) -> Result<usize, sqlx::Error>;

    async fn cleanup_needed(&self) -> Result<bool, sqlx::Error>;
    async fn perform_cleanup(&self) -> Result<(), sqlx::Error>;
}
