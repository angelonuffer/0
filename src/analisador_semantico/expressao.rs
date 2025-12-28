use pest::iterators::Pair;
use crate::analisador_sintatico::Rule;
use crate::analisador_semantico::{Value, Scope, evaluate_recursively};

pub fn evaluate_expression(pair: Pair<Rule>, scope: &mut Scope) -> Value {
    let mut last_value = Value::Number(f64::NAN);
    for inner_pair in pair.into_inner() {
        last_value = evaluate_recursively(inner_pair, scope);
    }
    last_value
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::analisador_semantico::Value;
    use crate::analisador_sintatico::SintaticoParser;
    use pest::Parser;
    use crate::analisador_sintatico::Rule;
    use crate::analisador_semantico::Scope;

    fn parse_and_evaluate_expression(input: &str) -> Value {
        let mut pairs = SintaticoParser::parse(Rule::expressao, input).unwrap();
        let pair = pairs.next().unwrap();
        let mut scope = Scope::new();
        evaluate_expression(pair, &mut scope)
    }

    #[test]
    fn test_evaluate_fator_with_terms_2() {
        // 5 * 2 + 3 should be 10 + 3 = 13
        assert_eq!(parse_and_evaluate_expression("5 * 2 + 3"), Value::Number(13.0));
        // 10 / 2 - 1 should be 5 - 1 = 4
        assert_eq!(parse_and_evaluate_expression("10 / 2 - 1"), Value::Number(4.0));
    }

    #[test]
    fn test_evaluate_expression_with_assignments() {
        // a = 2
        // a + 3
        // Result should be 5
        let input = "a = 2\na + 3";
        assert_eq!(parse_and_evaluate_expression(input), Value::Number(5.0));
        
        // x = 10
        // y = 5
        // x * y
        // Result should be 50
        let input2 = "x = 10\ny = 5\nx * y";
        assert_eq!(parse_and_evaluate_expression(input2), Value::Number(50.0));
    }
}