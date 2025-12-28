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
    use super::*;
    use crate::analisador_sintatico::SintaticoParser;
    use pest::Parser;

    fn parse_and_evaluate_unario(input: &str) -> Value {
        let mut pairs = SintaticoParser::parse(Rule::unario, input).unwrap();
        let pair = pairs.next().unwrap();
        let mut scope = Scope::new();
        evaluate_unario(pair, &mut scope)
    }

    #[test]
    fn test_evaluate_unario_negation_boolean() {
        assert_eq!(parse_and_evaluate_unario("!(1 > 0)"), Value::Boolean(false));
        assert_eq!(parse_and_evaluate_unario("!(1 < 0)"), Value::Boolean(true));
    }

    #[test]
    fn test_evaluate_unario_negation_number() {
        assert_eq!(parse_and_evaluate_unario("!1"), Value::Boolean(false));
        assert_eq!(parse_and_evaluate_unario("!0"), Value::Boolean(true));
    }

    #[test]
    #[should_panic(expected = "❌ Erro semântico: Não é possível aplicar o operador '!' a uma string.")]
    fn test_semantic_error_negation_on_string() {
        parse_and_evaluate_unario("!\"a\"");
    }

    #[test]
    fn test_evaluate_unario_no_negation() {
        assert_eq!(parse_and_evaluate_unario("1"), Value::Number(1.0));
    }
}
