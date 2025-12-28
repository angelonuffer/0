use pest::iterators::Pair;
use crate::analisador_sintatico::Rule;
use crate::analisador_semantico::{Value, Scope, evaluate_recursively};

pub fn evaluate_lista(pair: Pair<Rule>, scope: &mut Scope) -> Value {
    let mut list_values = Vec::new();
    for element in pair.into_inner() {
        list_values.push(evaluate_recursively(element, scope));
    }
    Value::List(list_values)
}

#[cfg(test)]
mod tests {
    use crate::analisador_semantico::avaliar;

    #[test]
    fn test_evaluate_lista_vazia() {
        assert_eq!(avaliar("[]").unwrap(), "[]\n");
    }

    #[test]
    fn test_evaluate_lista_com_um_elemento() {
        assert_eq!(avaliar("[1]").unwrap(), "[1]\n");
    }

    #[test]
    fn test_evaluate_lista_com_multiplos_elementos() {
        assert_eq!(avaliar("[1, 2, 3]").unwrap(), "[1, 2, 3]\n");
    }

    #[test]
    fn test_evaluate_lista_com_expressoes() {
        assert_eq!(avaliar("[1 + 2, 3 * 4]").unwrap(), "[3, 12]\n");
    }
}
