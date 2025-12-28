use pest::iterators::Pair;
use crate::analisador_sintatico::Rule;
use crate::analisador_semantico::{Value, Scope, evaluate_recursively};

pub fn evaluate_soma(pair: Pair<Rule>, scope: &mut Scope) -> Value {
    let mut pairs = pair.into_inner().filter(|p| p.as_rule() != Rule::WHITESPACE);
    let mut value = evaluate_recursively(pairs.next().unwrap(), scope);

    let mut next_pairs = pairs.clone();
    if next_pairs.next().is_some() { // Check if there is an operation
        if let Value::String(_) = &value {
            panic!("❌ 💡 Erro semântico: Operando em operação numérica deve ser numérico");
        }
    }

    while let Some(op) = pairs.next() {
        let rhs = evaluate_recursively(pairs.next().unwrap(), scope);
        if let Value::String(_) = &rhs {
            panic!("❌ 💡 Erro semântico: Operando em operação numérica deve ser numérico");
        }
        value = match op.as_str() {
            "+" => Value::Number(value.as_number() + rhs.as_number()),
            "-" => Value::Number(value.as_number() - rhs.as_number()),
            _ => unreachable!(),
        };
    }
    value
}

#[cfg(test)]
mod tests {
    use crate::analisador_semantico::avaliar;

    #[test]
    fn test_evaluate_soma_addition() {
        assert_eq!(avaliar("5 + 2").unwrap(), "7\n");
        assert_eq!(avaliar("2.5 + 4").unwrap(), "6.5\n");
    }

    #[test]
    fn test_evaluate_soma_subtraction() {
        assert_eq!(avaliar("10 - 2").unwrap(), "8\n");
        assert_eq!(avaliar("10 - 12.5").unwrap(), "-2.5\n");
    }

    #[test]
    fn test_evaluate_soma_left_associativity() {
        // 10 - 2 + 5 should be (10 - 2) + 5 = 8 + 5 = 13
        assert_eq!(avaliar("10 - 2 + 5").unwrap(), "13\n");
        // 100 + 2 - 4 should be (100 + 2) - 4 = 102 - 4 = 98
        assert_eq!(avaliar("100 + 2 - 4").unwrap(), "98\n");
    }

    #[test]
    fn test_semantic_error_string_in_numeric_operation() {
        let code = r#"x = "texto"\nx + 1"#;
        assert!(avaliar(code).is_err());
    }

    #[test]
    fn test_semantic_success_numeric_operation() {
        let code = "x = 10\nx + 1";
        assert!(avaliar(code).is_ok());
    }
}
