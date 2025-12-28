use pest::iterators::Pair;
use crate::analisador_sintatico::Rule;
use crate::analisador_semantico::Value;

pub fn evaluate_number_literal(pair: Pair<Rule>) -> Value {
    Value::Number(pair.as_str().parse().unwrap())
}

pub fn evaluate_string_literal(pair: Pair<Rule>) -> Value {
    let s = pair.as_str();
    Value::String(s[1..s.len() - 1].to_string())
}

#[cfg(test)]
mod tests {
    use crate::analisador_semantico::avaliar;

    #[test]
    fn test_evaluate_number_literal_simple() {
        assert_eq!(avaliar("10").unwrap(), "10\n");
    }

    #[test]
    fn test_evaluate_string_literal_simple() {
        assert_eq!(avaliar("\"hello\"").unwrap(), "hello\n");
    }
}