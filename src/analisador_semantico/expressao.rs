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
    use crate::analisador_semantico::avaliar;

    #[test]
    fn test_evaluate_soma_with_terms_2() {
        // 5 * 2 + 3 should be 10 + 3 = 13
        assert_eq!(avaliar("5 * 2 + 3").unwrap(), "13\n");
        // 10 / 2 - 1 should be 5 - 1 = 4
        assert_eq!(avaliar("10 / 2 - 1").unwrap(), "4\n");
    }

    #[test]
    fn test_evaluate_expression_with_assignments() {
        // a = 2
        // a + 3
        // Result should be 5
        let input = "a = 2\na + 3";
        assert_eq!(avaliar(input).unwrap(), "5\n");
        
        // x = 10
        // y = 5
        // x * y
        // Result should be 50
        let input2 = "x = 10\ny = 5\nx * y";
        assert_eq!(avaliar(input2).unwrap(), "50\n");
    }
}