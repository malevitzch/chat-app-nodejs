use serde::{Deserialize, Serialize};
#[derive(Debug, Deserialize, Serialize)]
pub struct Message {
    pub content: String,
}

#[macro_export]
macro_rules! msg {
    ( $x:expr ) => {
        $crate::msg::Message {
            text: $x.to_string(),
        }
    };
}
