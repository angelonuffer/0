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
    use super::*;
    use crate::analisador_sintatico::{SintaticoParser, Rule};
    use pest::Parser;

    #[test]
    fn test_evaluate_number_literal_simple() {
        let mut pairs = SintaticoParser::parse(Rule::numero_literal, "10").unwrap();
        let pair = pairs.next().unwrap();
        assert_eq!(evaluate_number_literal(pair), Value::Number(10.0));
    }

    #[test]
    fn test_evaluate_string_literal_simple() {
        let mut pairs = SintaticoParser::parse(Rule::texto_literal, "\"hello\"").unwrap();
        let pair = pairs.next().unwrap();
        assert_eq!(evaluate_string_literal(pair), Value::String("hello".to_string()));
    }
}