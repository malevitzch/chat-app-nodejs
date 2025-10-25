use crate::msg;

pub trait MessageDB {
    fn init(&self);
    //async fn fetch_messages(&self) -> Option<serde_json::Value>;
    //async fn post_message(&self, message: msg::Message);

    //async fn add_message(&self, data: serde_json::Value);
    async fn get_message_count(&self) -> usize;
}

pub async fn hello() -> &'static str {
    "Hello!\n"
}
