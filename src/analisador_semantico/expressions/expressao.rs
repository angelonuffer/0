use pest::iterators::Pair;
use crate::analisador_sintatico::Rule;
use crate::analisador_semantico::value::Value;
use crate::analisador_semantico::value::evaluate_recursively;

pub fn evaluate_expression(pair: Pair<Rule>) -> Value {
    evaluate_recursively(pair.into_inner().next().unwrap())
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::analisador_semantico::value::Value;
    use crate::analisador_sintatico::SintaticoParser;
    use pest::Parser;
    use crate::analisador_sintatico::Rule;

    fn parse_and_evaluate_expression(input: &str) -> Value {
        let mut pairs = SintaticoParser::parse(Rule::expressao, input).unwrap();
        let pair = pairs.next().unwrap();
        evaluate_expression(pair)
    }

    #[test]
    fn test_evaluate_term_3_with_terms_2() {
        // 5 * 2 + 3 should be 10 + 3 = 13
        assert_eq!(parse_and_evaluate_expression("5 * 2 + 3"), Value::Number(13.0));
        // 10 / 2 - 1 should be 5 - 1 = 4
        assert_eq!(parse_and_evaluate_expression("10 / 2 - 1"), Value::Number(4.0));
    }
}