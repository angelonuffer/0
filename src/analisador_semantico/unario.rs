use crate::analisador_semantico::{evaluate_recursively, Value, Scope};
use crate::analisador_sintatico::Rule;
use pest::iterators::Pair;

pub fn evaluate_unario(pair: Pair<Rule>, scope: &mut Scope) -> Value {
    let mut inner = pair.into_inner();
    let first = inner.next().unwrap();

    if first.as_rule() == Rule::negacao {
        let value = evaluate_recursively(inner.next().unwrap(), scope);
        match value {
            Value::Boolean(b) => Value::Boolean(!b),
            Value::Number(n) => Value::Boolean(n == 0.0),
            Value::String(_) => panic!("❌ Erro semântico: Não é possível aplicar o operador '!' a uma string."),
        }
    } else {
        evaluate_recursively(first, scope)
    }
}

#[cfg(test)]
mod tests {
    use crate::analisador_semantico::avaliar;

    #[test]
    fn test_evaluate_unario_negation_boolean() {
        assert_eq!(avaliar("!(1 > 0)").unwrap(), "false\n");
        assert_eq!(avaliar("!(1 < 0)").unwrap(), "true\n");
    }

    #[test]
    fn test_evaluate_unario_negation_number() {
        assert_eq!(avaliar("!1").unwrap(), "false\n");
        assert_eq!(avaliar("!0").unwrap(), "true\n");
    }

    #[test]
    fn test_semantic_error_negation_on_string() {
        assert!(avaliar("!\"a\"").is_err());
    }

    #[test]
    fn test_evaluate_unario_no_negation() {
        assert_eq!(avaliar("1").unwrap(), "1\n");
    }
}
