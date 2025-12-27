use pest::iterators::Pair;
use crate::analisador_sintatico::Rule;
use crate::analisador_semantico::value::Value;
use crate::analisador_semantico::value::evaluate_recursively;

pub fn evaluate_expression(pair: Pair<Rule>) -> Value {
    evaluate_recursively(pair.into_inner().next().unwrap())
}
