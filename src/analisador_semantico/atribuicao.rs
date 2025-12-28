use pest::iterators::Pair;
use crate::analisador_sintatico::Rule;
use crate::analisador_semantico::{Scope, evaluate_recursively};

pub fn evaluate_atribuicao(pair: Pair<Rule>, scope: &mut Scope) {
    let mut inner = pair.into_inner();
    let nome_pair = inner.next().unwrap();
    let expressao_pair = inner.next().unwrap();

    let nome = nome_pair.as_str().to_string();
    let value = evaluate_recursively(expressao_pair, scope);

    scope.insert(nome, value);
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::analisador_semantico::Value;
    use crate::analisador_sintatico::{SintaticoParser, Rule};
    use pest::Parser;

    #[test]
    fn test_evaluate_atribuicao() {
        let input = "a = 10";
        let mut pairs = SintaticoParser::parse(Rule::atribuicao, input).unwrap();
        let pair = pairs.next().unwrap();
        let mut scope = Scope::new();

        evaluate_atribuicao(pair, &mut scope);

        assert_eq!(scope.get("a"), Some(&Value::Number(10.0)));
    }

    #[test]
    fn test_evaluate_atribuicao_complex() {
        let input = "b = 5 * 2 + 1";
        let mut pairs = SintaticoParser::parse(Rule::atribuicao, input).unwrap();
        let pair = pairs.next().unwrap();
        let mut scope = Scope::new();

        evaluate_atribuicao(pair, &mut scope);

        assert_eq!(scope.get("b"), Some(&Value::Number(11.0)));
    }
}
