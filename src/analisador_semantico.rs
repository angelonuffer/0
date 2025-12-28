pub mod atribuicao;
pub mod expressao;
pub mod comparacao;
pub mod atomo;
pub mod produto;
pub mod soma;
pub mod literals;
pub mod unario;
pub mod logica;
pub mod lista;

use pest::iterators::{Pair, Pairs};
use crate::analisador_sintatico::Rule;
use std::collections::HashMap;
use std::panic;
use crate::analisador_sintatico;

#[derive(Debug, Clone, PartialEq)]
pub enum Value {
    Number(f64),
    String(String),
    Boolean(bool),
    List(Vec<Value>),
}

impl Value {
    pub(crate) fn as_number(&self) -> f64 {
        match self {
            Value::Number(n) => *n,
            Value::String(s) => s.parse::<f64>().unwrap_or(f64::NAN),
            Value::Boolean(b) => if *b { 1.0 } else { 0.0 },
            Value::List(_) => f64::NAN,
        }
    }
}

pub type Scope = HashMap<String, Value>;

pub fn evaluate_recursively(pair: Pair<Rule>, scope: &mut Scope) -> Value {
    match pair.as_rule() {
        Rule::expressao => expressao::evaluate_expression(pair, scope),
        Rule::atribuicao => {
            atribuicao::evaluate_atribuicao(pair, scope);
            Value::Number(f64::NAN) // Assignments don't return a value in this logic, or return last value?
                                    // But expressao calls it. expressao logic handles the flow.
                                    // If evaluate_recursively is called on atribuicao, it means we are inside expressao loop probably.
        },
        Rule::logica_ou => logica::evaluate_logica_ou(pair, scope),
        Rule::logica_e => logica::evaluate_logica_e(pair, scope),
        Rule::comparacao => comparacao::evaluate_comparacao(pair, scope),
        Rule::soma => soma::evaluate_soma(pair, scope),
        Rule::produto => produto::evaluate_produto(pair, scope),
        Rule::unario => unario::evaluate_unario(pair, scope),
        Rule::atomo => atomo::evaluate_atomo(pair, scope),
        Rule::lista => lista::evaluate_lista(pair, scope),
        Rule::numero_literal => literals::evaluate_number_literal(pair),
        Rule::texto_literal => literals::evaluate_string_literal(pair),
        Rule::nome => {
            let name = pair.as_str();
            scope.get(name).cloned().unwrap_or(Value::Number(f64::NAN)) // Return NAN or error if not found
        }
        _ => unreachable!("Unexpected rule: {:?}", pair.as_rule()),
    }
}

pub fn avaliar(input: &str) -> Result<String, String> {
    let pairs = analisador_sintatico::parse(input)?;
    evaluate(pairs)
}

pub fn evaluate(pairs: Pairs<Rule>) -> Result<String, String> {
    let mut final_result = String::new();
    let mut scope = Scope::new();

    let result = panic::catch_unwind(move || {
        for pair in pairs {
            if pair.as_rule() == Rule::expressao {
                let value = evaluate_recursively(pair, &mut scope);
                let formatted_value = match value {
                    Value::Number(n) => n.to_string(),
                    Value::String(s) => s,
                    Value::Boolean(b) => b.to_string(),
                    Value::List(l) => format!("[{}]", l.iter().map(|v| {
                        match v {
                            Value::Number(n) => n.to_string(),
                            Value::String(s) => format!("\"{}\"", s),
                            Value::Boolean(b) => b.to_string(),
                            Value::List(_) => "[...]".to_string(),
                        }
                    }).collect::<Vec<String>>().join(", ")),
                };
                final_result.push_str(&formatted_value);
                final_result.push('\n');
            }
        }
        final_result
    });

    match result {
        Ok(output) => Ok(output),
        Err(_) => Err("Erro semântico capturado".to_string()),
    }
}