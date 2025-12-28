use pest::iterators::Pair;
use crate::analisador_sintatico::Rule;
use crate::analisador_semantico::{Value, Scope, evaluate_recursively};

pub fn evaluate_comparacao(pair: Pair<Rule>, scope: &mut Scope) -> Value {
    let mut pairs = pair.into_inner().filter(|p| p.as_rule() != Rule::WHITESPACE);
    let mut value = evaluate_recursively(pairs.next().unwrap(), scope);

    if let Some(op) = pairs.next() {
        let rhs = evaluate_recursively(pairs.next().unwrap(), scope);

        // Type checking for comparison operators
        let op_str = op.as_str();
        if (matches!(value, Value::String(_)) || matches!(rhs, Value::String(_)))
            && !matches!(op_str, "==" | "!=")
        {
            panic!(
                "❌ 💡 Erro semântico: Operador '{}' não pode ser usado com texto",
                op_str
            );
        }

        value = match op_str {
            ">" => Value::Boolean(value.as_number() > rhs.as_number()),
            "<" => Value::Boolean(value.as_number() < rhs.as_number()),
            ">=" => Value::Boolean(value.as_number() >= rhs.as_number()),
            "<=" => Value::Boolean(value.as_number() <= rhs.as_number()),
            "==" => Value::Boolean(value == rhs),
            "!=" => Value::Boolean(value != rhs),
            _ => unreachable!(),
        };
    }
    value
}

#[cfg(test)]
mod tests {
    use crate::analisador_semantico::avaliar;

    #[test]
    fn test_evaluate_comparacao_maior() {
        assert_eq!(avaliar("5 > 2").unwrap(), "true\n");
        assert_eq!(avaliar("2 > 5").unwrap(), "false\n");
    }

    #[test]
    fn test_evaluate_comparacao_menor() {
        assert_eq!(avaliar("2 < 5").unwrap(), "true\n");
        assert_eq!(avaliar("5 < 2").unwrap(), "false\n");
    }

    #[test]
    fn test_evaluate_comparacao_maior_igual() {
        assert_eq!(avaliar("5 >= 2").unwrap(), "true\n");
        assert_eq!(avaliar("5 >= 5").unwrap(), "true\n");
        assert_eq!(avaliar("2 >= 5").unwrap(), "false\n");
    }

    #[test]
    fn test_evaluate_comparacao_menor_igual() {
        assert_eq!(avaliar("2 <= 5").unwrap(), "true\n");
        assert_eq!(avaliar("5 <= 5").unwrap(), "true\n");
        assert_eq!(avaliar("5 <= 2").unwrap(), "false\n");
    }

    #[test]
    fn test_evaluate_comparacao_igual() {
        assert_eq!(avaliar("5 == 5").unwrap(), "true\n");
        assert_eq!(avaliar("5 == 2").unwrap(), "false\n");
        assert_eq!(avaliar(r#""a" == "a""#).unwrap(), "true\n");
        assert_eq!(avaliar(r#""a" == "b""#).unwrap(), "false\n");
    }

    #[test]
    fn test_evaluate_comparacao_diferente() {
        assert_eq!(avaliar("5 != 2").unwrap(), "true\n");
        assert_eq!(avaliar(r#""a" != "b""#).unwrap(), "true\n");
        assert_eq!(avaliar("5 != 5").unwrap(), "false\n");
    }

    #[test]
    fn test_semantic_error_invalid_op_with_string_1() {
        assert!(avaliar(r#""a" > "b""#).is_err());
    }

    #[test]
    fn test_semantic_error_invalid_op_with_string_2() {
        assert!(avaliar(r#""a" < "b""#).is_err());
    }

    #[test]
    fn test_semantic_error_invalid_op_with_string_3() {
        assert!(avaliar(r#""a" >= "b""#).is_err());
    }

    #[test]
    fn test_semantic_error_invalid_op_with_string_4() {
        assert!(avaliar(r#""a" <= "b""#).is_err());
    }
}
