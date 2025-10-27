use crate::msg;
use sqlx::Error;

pub trait MessageDB {
    async fn init(&self) -> Result<(), sqlx::Error>;
    //async fn fetch_messages(&self) -> Option<serde_json::Value>;
    //async fn post_message(&self, message: msg::Message);

    async fn add_message(&self, data: serde_json::Value) -> Result<(), sqlx::Error>;
    async fn get_message_count(&self) -> Result<usize, sqlx::Error>;
}

pub async fn hello() -> &'static str {
    "Hello!\n"
}
