use crate::msg;
use sqlx::Error;

pub trait MessageDB {
    async fn init(&self) -> Result<(), sqlx::Error>;
    async fn fetch_messages(&self) -> Result<serde_json::Value, sqlx::Error>;

    // TODO: this might be implemented but rather just by wrapping msg::Message as serializable
    // and then simply calling add_message on the data, making it implementation-agnostic
    //async fn post_message(&self, message: msg::Message) -> Result<(), sqlx::Error>;

    async fn add_message(&self, data: serde_json::Value) -> Result<(), sqlx::Error>;
    async fn get_message_count(&self) -> Result<usize, sqlx::Error>;
}

pub async fn hello() -> &'static str {
    "Hello!\n"
}
