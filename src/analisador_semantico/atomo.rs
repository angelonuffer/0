use pest::iterators::Pair;
use crate::analisador_sintatico::Rule;
use crate::analisador_semantico::{Value, Scope, evaluate_recursively};

pub fn evaluate_atomo(pair: Pair<Rule>, scope: &mut Scope) -> Value {
    let inner = pair.into_inner().next().unwrap();
    evaluate_recursively(inner, scope)
}

#[cfg(test)]
mod tests {
    use crate::analisador_semantico::avaliar;

    #[test]
    fn test_evaluate_term_2_with_parentheses() {
        // (2 + 3) * 4 -> the parenthesis will be evaluated first by atomo, then multiplication
        // The grammar for produto is `atomo ~ ((multiplicacao | divisao) ~ atomo)*`
        // So `(2 + 3)` is a `atomo` and `4` is a `atomo`.
        assert_eq!(avaliar("(2 + 3) * 4").unwrap(), "20\n");
        assert_eq!(avaliar("100 / (10 - 5)").unwrap(), "20\n");
    }
}
