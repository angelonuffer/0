use pest::iterators::Pair;
use crate::analisador_sintatico::Rule;
use crate::analisador_semantico::value::Value;
use crate::analisador_semantico::value::Scope;
use crate::analisador_semantico::value::evaluate_recursively;

pub fn evaluate_operacao_numerica(pair: Pair<Rule>, scope: &mut Scope) -> Value {
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
    use super::*;
    use crate::analisador_semantico::value::Value;
    use crate::analisador_sintatico::SintaticoParser;
    use pest::Parser;
    use crate::analisador_sintatico::Rule;
    use crate::analisador_semantico::value::Scope;
    use crate::analisador_semantico::expressions::expressao::evaluate_expression;

    // Helper function to parse and evaluate operacao_numerica
    fn parse_and_evaluate_operacao_numerica(input: &str) -> Value {
        let mut pairs = SintaticoParser::parse(Rule::operacao_numerica, input).unwrap();
        let pair = pairs.next().unwrap();
        let mut scope = Scope::new();
        evaluate_operacao_numerica(pair, &mut scope)
    }

    fn evaluate_code(code: &str) {
        let pairs = SintaticoParser::parse(Rule::expressao, code).unwrap();
        let mut scope = Scope::new();
        evaluate_expression(pairs.into_iter().next().unwrap(), &mut scope);
    }

    #[test]
    fn test_evaluate_operacao_numerica_addition() {
        assert_eq!(parse_and_evaluate_operacao_numerica("5 + 2"), Value::Number(7.0));
        assert_eq!(parse_and_evaluate_operacao_numerica("2.5 + 4"), Value::Number(6.5));
    }

    #[test]
    fn test_evaluate_operacao_numerica_subtraction() {
        assert_eq!(parse_and_evaluate_operacao_numerica("10 - 2"), Value::Number(8.0));
        assert_eq!(parse_and_evaluate_operacao_numerica("10 - 12.5"), Value::Number(-2.5));
    }

    #[test]
    fn test_evaluate_operacao_numerica_left_associativity() {
        // 10 - 2 + 5 should be (10 - 2) + 5 = 8 + 5 = 13
        assert_eq!(parse_and_evaluate_operacao_numerica("10 - 2 + 5"), Value::Number(13.0));
        // 100 + 2 - 4 should be (100 + 2) - 4 = 102 - 4 = 98
        assert_eq!(parse_and_evaluate_operacao_numerica("100 + 2 - 4"), Value::Number(98.0));
    }

    #[test]
    #[should_panic]
    fn test_semantic_error_string_in_numeric_operation() {
        let code = r#"x = "texto" x + 1"#;
        evaluate_code(code);
    }

    #[test]
    fn test_semantic_success_numeric_operation() {
        let code = r#"x = 10 x + 1"#;
        evaluate_code(code);
    }
}
