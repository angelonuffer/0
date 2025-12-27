#[derive(Debug, Clone, PartialEq)]
pub enum Value {
    Number(f64),
    String(String),
}

impl Value {
    pub(crate) fn as_number(&self) -> f64 {
        match self {
            Value::Number(n) => *n,
            Value::String(s) => s.parse::<f64>().unwrap_or(std::f64::NAN),
        }
    }
}
