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
    use crate::analisador_semantico::avaliar;

    #[test]
    fn test_evaluate_atribuicao() {
        let input = "a = 10\na";
        assert_eq!(avaliar(input).unwrap(), "10\n");
    }

    #[test]
    fn test_evaluate_atribuicao_complex() {
        let input = "b = 5 * 2 + 1\nb";
        assert_eq!(avaliar(input).unwrap(), "11\n");
    }
}
