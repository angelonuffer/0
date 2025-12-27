use pest::iterators::Pair;
use crate::analisador_sintatico::Rule;
use crate::analisador_semantico::value::Value;

pub fn evaluate_number_literal(pair: Pair<Rule>) -> Value {
    Value::Number(pair.as_str().parse().unwrap())
}

pub fn evaluate_string_literal(pair: Pair<Rule>) -> Value {
    let s = pair.as_str();
    Value::String(s[1..s.len() - 1].to_string())
}