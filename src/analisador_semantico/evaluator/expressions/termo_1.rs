use pest::iterators::Pair;
use crate::analisador_sintatico::Rule;
use crate::analisador_semantico::value::Value;
use crate::analisador_semantico::evaluator::evaluate_recursively;

pub fn evaluate_term_1(pair: Pair<Rule>) -> Value {
    evaluate_recursively(pair.into_inner().next().unwrap())
}

pub fn evaluate_parentheses(pair: Pair<Rule>) -> Value {
    evaluate_recursively(pair.into_inner().filter(|p| p.as_rule() != Rule::WHITESPACE).next().unwrap())
}
