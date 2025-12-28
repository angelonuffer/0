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
    use crate::analisador_semantico::avaliar;

    #[test]
    fn test_evaluate_logica_e() {
        assert_eq!(avaliar("1 && 1").unwrap(), "1\n");
        assert_eq!(avaliar("1 && 0").unwrap(), "0\n");
        assert_eq!(avaliar("0 && 1").unwrap(), "0\n");
        assert_eq!(avaliar("0 && 0").unwrap(), "0\n");
    }

    #[test]
    fn test_evaluate_logica_ou() {
        assert_eq!(avaliar("1 || 1").unwrap(), "1\n");
        assert_eq!(avaliar("1 || 0").unwrap(), "1\n");
        assert_eq!(avaliar("0 || 1").unwrap(), "1\n");
        assert_eq!(avaliar("0 || 0").unwrap(), "0\n");
    }

    #[test]
    fn test_precedence() {
        // && has higher precedence than ||
        assert_eq!(avaliar("0 || 1 && 0").unwrap(), "0\n");
        assert_eq!(avaliar("1 || 1 && 0").unwrap(), "1\n");
    }

    #[test]
    fn test_short_circuit_and() {
        // The right side of && should not be evaluated if the left side is false.
        // We use an undefined variable 'a' on the right side. If it were evaluated, it would cause an error.
        assert_eq!(avaliar("0 && a").unwrap(), "0\n");
    }

    #[test]
    fn test_short_circuit_or() {
        // The right side of || should not be evaluated if the left side is true.
        assert_eq!(avaliar("1 || a").unwrap(), "1\n");
    }
}