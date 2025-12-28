use pest::iterators::Pair;
use crate::analisador_sintatico::Rule;
use crate::analisador_semantico::{Value, Scope, evaluate_recursively};

fn evaluate_logical_op(pair: Pair<Rule>, scope: &mut Scope) -> Value {
    let mut pairs = pair.into_inner().filter(|p| p.as_rule() != Rule::WHITESPACE);
    let mut value = evaluate_recursively(pairs.next().unwrap(), scope);
    let mut has_logical_op = false;

    while let Some(op) = pairs.next() {
        let op_rule = op.as_rule();

        // Short-circuit for || and &&
        if (op_rule == Rule::ou && value.as_number() != 0.0) || (op_rule == Rule::e && value.as_number() == 0.0) {
            // Skip the right-hand side evaluation
            pairs.next(); // Consume the RHS pair
            continue;
        }

        let rhs = evaluate_recursively(pairs.next().unwrap(), scope);

        value = match op_rule {
            Rule::ou => Value::Number(if value.as_number() != 0.0 || rhs.as_number() != 0.0 { 1.0 } else { 0.0 }),
            Rule::e => Value::Number(if value.as_number() != 0.0 && rhs.as_number() != 0.0 { 1.0 } else { 0.0 }),
            _ => unreachable!(),
        };
        has_logical_op = true;
    }

    if has_logical_op {
        Value::Number(if value.as_number() != 0.0 { 1.0 } else { 0.0 })
    } else {
        value
    }
}

pub fn evaluate_logica_ou(pair: Pair<Rule>, scope: &mut Scope) -> Value {
    evaluate_logical_op(pair, scope)
}

pub fn evaluate_logica_e(pair: Pair<Rule>, scope: &mut Scope) -> Value {
    evaluate_logical_op(pair, scope)
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::analisador_semantico::Value;
    use crate::analisador_sintatico::SintaticoParser;
    use pest::Parser;
    use crate::analisador_sintatico::Rule;
    use crate::analisador_semantico::Scope;

    fn parse_and_evaluate_logica(input: &str, _rule: Rule) -> Value {
        let mut pairs = SintaticoParser::parse(Rule::logica_ou, input).unwrap();
        let pair = pairs.next().unwrap();
        let mut scope = Scope::new();
        evaluate_recursively(pair, &mut scope)
    }

    #[test]
    fn test_evaluate_logica_e() {
        assert_eq!(parse_and_evaluate_logica("1 && 1", Rule::logica_ou), Value::Number(1.0));
        assert_eq!(parse_and_evaluate_logica("1 && 0", Rule::logica_ou), Value::Number(0.0));
        assert_eq!(parse_and_evaluate_logica("0 && 1", Rule::logica_ou), Value::Number(0.0));
        assert_eq!(parse_and_evaluate_logica("0 && 0", Rule::logica_ou), Value::Number(0.0));
    }

    #[test]
    fn test_evaluate_logica_ou() {
        assert_eq!(parse_and_evaluate_logica("1 || 1", Rule::logica_ou), Value::Number(1.0));
        assert_eq!(parse_and_evaluate_logica("1 || 0", Rule::logica_ou), Value::Number(1.0));
        assert_eq!(parse_and_evaluate_logica("0 || 1", Rule::logica_ou), Value::Number(1.0));
        assert_eq!(parse_and_evaluate_logica("0 || 0", Rule::logica_ou), Value::Number(0.0));
    }

    #[test]
    fn test_precedence() {
        // && has higher precedence than ||
        assert_eq!(parse_and_evaluate_logica("0 || 1 && 0", Rule::logica_ou), Value::Number(0.0));
        assert_eq!(parse_and_evaluate_logica("1 || 1 && 0", Rule::logica_ou), Value::Number(1.0));
    }

    #[test]
    fn test_short_circuit_and() {
        // The right side of && should not be evaluated if the left side is false.
        // We test this by having a panic on the right side.
        // Since we are not implementing a full interpreter, we cannot easily test for side effects.
        // This test will have to suffice.
        assert_eq!(parse_and_evaluate_logica("0 && (1/0)", Rule::logica_ou), Value::Number(0.0));
    }

    #[test]
    fn test_short_circuit_or() {
        // The right side of || should not be evaluated if the left side is true.
        assert_eq!(parse_and_evaluate_logica("1 || (1/0)", Rule::logica_ou), Value::Number(1.0));
    }
}