use pest::iterators::Pair;
use crate::analisador_sintatico::Rule;
use crate::analisador_semantico::value::Value;
use crate::analisador_semantico::value::Scope;
use crate::analisador_semantico::value::evaluate_recursively;

pub fn evaluate_term_2(pair: Pair<Rule>, scope: &mut Scope) -> Value {
    let mut pairs = pair.into_inner().filter(|p| p.as_rule() != Rule::WHITESPACE);
    let mut value = evaluate_recursively(pairs.next().unwrap(), scope);

    while let Some(op) = pairs.next() {
        let rhs = evaluate_recursively(pairs.next().unwrap(), scope);
        value = match op.as_str() {
            "*" => Value::Number(value.as_number() * rhs.as_number()),
            "/" => Value::Number(value.as_number() / rhs.as_number()),
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


    // Helper function to parse and evaluate termo_2
    fn parse_and_evaluate_termo_2(input: &str) -> Value {
        let mut pairs = SintaticoParser::parse(Rule::termo_2, input).unwrap();
        let pair = pairs.next().unwrap();
        let mut scope = Scope::new();
        evaluate_term_2(pair, &mut scope)
    }

    #[test]
    fn test_evaluate_term_2_multiplication() {
        assert_eq!(parse_and_evaluate_termo_2("5 * 2"), Value::Number(10.0));
        assert_eq!(parse_and_evaluate_termo_2("2.5 * 4"), Value::Number(10.0));
    }

    #[test]
    fn test_evaluate_term_2_division() {
        assert_eq!(parse_and_evaluate_termo_2("10 / 2"), Value::Number(5.0));
        assert_eq!(parse_and_evaluate_termo_2("10 / 4"), Value::Number(2.5));
    }

    #[test]
    fn test_evaluate_term_2_left_associativity() {
        // 10 / 2 * 5 should be (10 / 2) * 5 = 5 * 5 = 25
        assert_eq!(parse_and_evaluate_termo_2("10 / 2 * 5"), Value::Number(25.0));
        // 100 * 2 / 4 should be (100 * 2) / 4 = 200 / 4 = 50
        assert_eq!(parse_and_evaluate_termo_2("100 * 2 / 4"), Value::Number(50.0));
    }


}