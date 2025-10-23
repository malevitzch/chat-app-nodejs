use crate::msg;

pub trait MessageDB {
    fn init(&self);
    async fn fetch_messages(&self) -> Option<serde_json::Value>;
    async fn post_message(&self, message: msg::Message);

    async fn add_message(&self, data: serde_json::Value);
    async fn get_message_count(&self) -> usize;
    async fn cleanup(&self);

    fn get_history_size(&self) -> usize;
    fn set_history_size(&self, size: usize);

    fn get_message_limit(&self) -> usize;
    fn set_message_limit(&self, limit: usize);

    fn get_deletion_limit(&self) -> usize;
    fn set_deletion_limit(&self, limit: usize);
}

pub async fn hello() -> &'static str {
    "Hello!\n"
}
