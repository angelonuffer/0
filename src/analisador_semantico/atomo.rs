use pest::iterators::Pair;
use crate::analisador_sintatico::Rule;
use crate::analisador_semantico::{Value, Scope, evaluate_recursively};

pub fn evaluate_atomo(pair: Pair<Rule>, scope: &mut Scope) -> Value {
    let inner = pair.into_inner().next().unwrap();
    evaluate_recursively(inner, scope)
}

#[cfg(test)]
mod tests {
    use crate::analisador_semantico::{Value, Scope};
    use crate::analisador_sintatico::SintaticoParser;
    use pest::Parser;
    use crate::analisador_sintatico::Rule;
    use crate::analisador_semantico::produto::evaluate_produto;

    fn parse_and_evaluate_produto(input: &str) -> Value {
        let mut pairs = SintaticoParser::parse(Rule::produto, input).unwrap();
        let pair = pairs.next().unwrap();
        let mut scope = Scope::new();
        evaluate_produto(pair, &mut scope)
    }

    #[test]
    fn test_evaluate_term_2_with_parentheses() {
        // (2 + 3) * 4 -> the parenthesis will be evaluated first by atomo, then multiplication
        // The grammar for produto is `atomo ~ ((multiplicacao | divisao) ~ atomo)*`
        // So `(2 + 3)` is a `atomo` and `4` is a `atomo`.
        assert_eq!(parse_and_evaluate_produto("(2 + 3) * 4"), Value::Number(20.0));
        assert_eq!(parse_and_evaluate_produto("100 / (10 - 5)"), Value::Number(20.0));
    }
}
