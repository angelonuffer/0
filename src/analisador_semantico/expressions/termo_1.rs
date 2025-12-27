use pest::iterators::Pair;
use crate::analisador_sintatico::Rule;
use crate::analisador_semantico::value::Value;
use crate::analisador_semantico::value::Scope;
use crate::analisador_semantico::value::evaluate_recursively;

pub fn evaluate_term_1(pair: Pair<Rule>, scope: &mut Scope) -> Value {
    evaluate_recursively(pair.into_inner().next().unwrap(), scope)
}

#[cfg(test)]
mod tests {
    use crate::analisador_semantico::value::Value;
    use crate::analisador_sintatico::SintaticoParser;
    use pest::Parser;
    use crate::analisador_sintatico::Rule;
    use crate::analisador_semantico::expressions::termo_2::evaluate_term_2;
    use crate::analisador_semantico::value::Scope;

    fn parse_and_evaluate_termo_2(input: &str) -> Value {
        let mut pairs = SintaticoParser::parse(Rule::termo_2, input).unwrap();
        let pair = pairs.next().unwrap();
        let mut scope = Scope::new();
        evaluate_term_2(pair, &mut scope)
    }

    #[test]
    fn test_evaluate_term_2_with_parentheses() {
        // (2 + 3) * 4 -> the parenthesis will be evaluated first by termo_1, then multiplication
        // The grammar for termo_2 is `termo_1 ~ ((multiplicacao | divisao) ~ termo_1)*`
        // So `(2 + 3)` is a `termo_1` and `4` is a `termo_1`.
        assert_eq!(parse_and_evaluate_termo_2("(2 + 3) * 4"), Value::Number(20.0));
        assert_eq!(parse_and_evaluate_termo_2("100 / (10 - 5)"), Value::Number(20.0));
    }
}
