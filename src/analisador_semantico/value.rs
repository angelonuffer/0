use crate::analisador_semantico::literals;
use crate::analisador_semantico::expressions;
use pest::iterators::{Pair, Pairs};
use crate::analisador_sintatico::Rule;

#[derive(Debug, Clone, PartialEq)]
pub enum Value {
    Number(f64),
    String(String),
}

impl Value {
    pub(crate) fn as_number(&self) -> f64 {
        match self {
            Value::Number(n) => *n,
            Value::String(s) => s.parse::<f64>().unwrap_or(f64::NAN),
        }
    }
}

pub fn evaluate_recursively(pair: Pair<Rule>) -> Value {
    match pair.as_rule() {
        Rule::expressao => expressions::evaluate_expression(pair),
        Rule::operacao_numerica => expressions::evaluate_operacao_numerica(pair),
        Rule::termo_2 => expressions::evaluate_term_2(pair),
        Rule::termo_1 => expressions::evaluate_term_1(pair),
        Rule::numero_literal => literals::evaluate_number_literal(pair),
        Rule::texto_literal => literals::evaluate_string_literal(pair),
        _ => unreachable!("Unexpected rule: {:?}", pair.as_rule()),
    }
}

pub fn evaluate(pairs: Pairs<Rule>) -> Result<String, String> {
    let mut final_result = String::new();
    for pair in pairs {
        if pair.as_rule() == Rule::expressao {
            let value = evaluate_recursively(pair);
            let formatted_value = match value {
                Value::Number(n) => n.to_string(),
                Value::String(s) => s,
            };
            final_result.push_str(&formatted_value);
            final_result.push('\n');
        }
    }
    if !final_result.is_empty() {
        final_result.pop();
    }
    Ok(final_result)
}