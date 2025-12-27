use pest::iterators::Pair;
use crate::analisador_sintatico::Rule;
use crate::analisador_semantico::value::Value;
use crate::analisador_semantico::evaluator::evaluate_recursively;

pub fn evaluate_expression(pair: Pair<Rule>) -> Value {
    let mut pairs = pair.into_inner().filter(|p| p.as_rule() != Rule::WHITESPACE);
    let mut value = evaluate_recursively(pairs.next().unwrap());

    while let Some(op) = pairs.next() {
        let rhs = evaluate_recursively(pairs.next().unwrap());
        value = match op.as_str() {
            "+" => Value::Number(value.as_number() + rhs.as_number()),
            "-" => Value::Number(value.as_number() - rhs.as_number()),
            _ => unreachable!(),
        };
    }
    value
}
