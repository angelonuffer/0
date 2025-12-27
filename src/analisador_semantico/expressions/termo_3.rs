use pest::iterators::Pair;
use crate::analisador_sintatico::Rule;
use crate::analisador_semantico::value::Value;
use crate::analisador_semantico::value::evaluate_recursively;

pub fn evaluate_term_3(pair: Pair<Rule>) -> Value {
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

#[cfg(test)]
mod tests {
    use super::*;
    use crate::analisador_semantico::value::Value;
    use crate::analisador_sintatico::SintaticoParser;
    use pest::Parser;
    use crate::analisador_sintatico::Rule;

    // Helper function to parse and evaluate termo_3
    fn parse_and_evaluate_termo_3(input: &str) -> Value {
        let mut pairs = SintaticoParser::parse(Rule::termo_3, input).unwrap();
        let pair = pairs.next().unwrap();
        evaluate_term_3(pair)
    }

    #[test]
    fn test_evaluate_term_3_addition() {
        assert_eq!(parse_and_evaluate_termo_3("5 + 2"), Value::Number(7.0));
        assert_eq!(parse_and_evaluate_termo_3("2.5 + 4"), Value::Number(6.5));
    }

    #[test]
    fn test_evaluate_term_3_subtraction() {
        assert_eq!(parse_and_evaluate_termo_3("10 - 2"), Value::Number(8.0));
        assert_eq!(parse_and_evaluate_termo_3("10 - 12.5"), Value::Number(-2.5));
    }

    #[test]
    fn test_evaluate_term_3_left_associativity() {
        // 10 - 2 + 5 should be (10 - 2) + 5 = 8 + 5 = 13
        assert_eq!(parse_and_evaluate_termo_3("10 - 2 + 5"), Value::Number(13.0));
        // 100 + 2 - 4 should be (100 + 2) - 4 = 102 - 4 = 98
        assert_eq!(parse_and_evaluate_termo_3("100 + 2 - 4"), Value::Number(98.0));
    }

    #[test]
    fn test_evaluate_term_3_with_terms_2() {
        // 5 * 2 + 3 should be 10 + 3 = 13
        assert_eq!(parse_and_evaluate_termo_3("5 * 2 + 3"), Value::Number(13.0));
        // 10 / 2 - 1 should be 5 - 1 = 4
        assert_eq!(parse_and_evaluate_termo_3("10 / 2 - 1"), Value::Number(4.0));
    }
}
