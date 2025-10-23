#[derive(Debug)]
pub struct Message {
    pub text: String,
}

#[macro_export]
macro_rules! msg {
    ( $x:expr ) => {
        $crate::msg::Message {
            text: $x.to_string(),
        }
    };
}
