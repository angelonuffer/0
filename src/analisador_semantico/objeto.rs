use std::collections::HashMap;
use pest::iterators::Pair;
use crate::analisador_sintatico::Rule;
use crate::analisador_semantico::{Value, Scope, evaluate_recursively};

pub fn evaluate_objeto(pair: Pair<Rule>, scope: &mut Scope) -> Value {
    let mut object_values = HashMap::new();
    for par in pair.into_inner() {
        let mut inner_rules = par.into_inner();
        let nome = inner_rules.next().unwrap().as_str().to_string();
        let valor = evaluate_recursively(inner_rules.next().unwrap(), scope);
        object_values.insert(nome, valor);
    }
    Value::Object(object_values)
}

#[cfg(test)]
mod tests {
    use crate::analisador_semantico::avaliar;

    #[test]
    fn test_evaluate_objeto_vazio() {
        assert_eq!(avaliar("{}").unwrap(), "{}\n");
    }

    #[test]
    fn test_evaluate_objeto_com_um_elemento() {
        assert_eq!(avaliar("{a: 1}").unwrap(), "{a: 1}\n");
    }

    #[test]
    fn test_evaluate_objeto_com_multiplos_elementos() {
        assert_eq!(avaliar("{a: 1, b: 2, c: 3}").unwrap(), "{a: 1, b: 2, c: 3}\n");
    }

    #[test]
    fn test_evaluate_objeto_com_expressoes() {
        assert_eq!(avaliar("{a: 1 + 2, b: 3 * 4}").unwrap(), "{a: 3, b: 12}\n");
    }
}
