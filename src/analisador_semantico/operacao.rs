use pest::iterators::Pair;
use crate::analisador_sintatico::Rule;
use crate::analisador_semantico::{Value, Scope, evaluate_recursively};

pub fn evaluate_operacao(pair: Pair<Rule>, scope: &mut Scope) -> Value {
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
    use super::*;
    use crate::analisador_semantico::Value;
    use crate::analisador_sintatico::SintaticoParser;
    use pest::Parser;
    use crate::analisador_sintatico::Rule;
    use crate::analisador_semantico::Scope;

    fn parse_and_evaluate_operacao(input: &str) -> Value {
        let mut pairs = SintaticoParser::parse(Rule::operacao, input).unwrap();
        let pair = pairs.next().unwrap();
        let mut scope = Scope::new();
        evaluate_operacao(pair, &mut scope)
    }

    #[test]
    fn test_evaluate_operacao_maior() {
        assert_eq!(parse_and_evaluate_operacao("5 > 2"), Value::Boolean(true));
        assert_eq!(parse_and_evaluate_operacao("2 > 5"), Value::Boolean(false));
    }

    #[test]
    fn test_evaluate_operacao_menor() {
        assert_eq!(parse_and_evaluate_operacao("2 < 5"), Value::Boolean(true));
        assert_eq!(parse_and_evaluate_operacao("5 < 2"), Value::Boolean(false));
    }

    #[test]
    fn test_evaluate_operacao_maior_igual() {
        assert_eq!(parse_and_evaluate_operacao("5 >= 2"), Value::Boolean(true));
        assert_eq!(parse_and_evaluate_operacao("5 >= 5"), Value::Boolean(true));
        assert_eq!(parse_and_evaluate_operacao("2 >= 5"), Value::Boolean(false));
    }

    #[test]
    fn test_evaluate_operacao_menor_igual() {
        assert_eq!(parse_and_evaluate_operacao("2 <= 5"), Value::Boolean(true));
        assert_eq!(parse_and_evaluate_operacao("5 <= 5"), Value::Boolean(true));
        assert_eq!(parse_and_evaluate_operacao("5 <= 2"), Value::Boolean(false));
    }

    #[test]
    fn test_evaluate_operacao_igual() {
        assert_eq!(parse_and_evaluate_operacao("5 == 5"), Value::Boolean(true));
        assert_eq!(parse_and_evaluate_operacao("5 == 2"), Value::Boolean(false));
        assert_eq!(parse_and_evaluate_operacao(r#""a" == "a""#), Value::Boolean(true));
        assert_eq!(parse_and_evaluate_operacao(r#""a" == "b""#), Value::Boolean(false));
    }

    #[test]
    fn test_evaluate_operacao_diferente() {
        assert_eq!(parse_and_evaluate_operacao("5 != 2"), Value::Boolean(true));
        assert_eq!(parse_and_evaluate_operacao(r#""a" != "b""#), Value::Boolean(true));
        assert_eq!(parse_and_evaluate_operacao(r#""a" != "a""#), Value::Boolean(false));
    }

    #[test]
    #[should_panic]
    fn test_semantic_error_invalid_op_with_string_1() {
        parse_and_evaluate_operacao(r#""a" > "b""#);
    }

    #[test]
    #[should_panic]
    fn test_semantic_error_invalid_op_with_string_2() {
        parse_and_evaluate_operacao(r#""a" < "b""#);
    }

    #[test]
    #[should_panic]
    fn test_semantic_error_invalid_op_with_string_3() {
        parse_and_evaluate_operacao(r#""a" >= "b""#);
    }

    #[test]
    #[should_panic]
    fn test_semantic_error_invalid_op_with_string_4() {
        parse_and_evaluate_operacao(r#""a" <= "b""#);
    }
}
