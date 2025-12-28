use pest::iterators::Pair;
use crate::analisador_sintatico::Rule;
use crate::analisador_semantico::{Value, Scope};

use crate::analisador_semantico::unario::evaluate_unario;

pub fn evaluate_produto(pair: Pair<Rule>, scope: &mut Scope) -> Value {
    let mut pairs = pair.into_inner().filter(|p| p.as_rule() != Rule::WHITESPACE);
    let mut value = evaluate_unario(pairs.next().unwrap(), scope);

    while let Some(op) = pairs.next() {
        let rhs = evaluate_unario(pairs.next().unwrap(), scope);
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
    use crate::analisador_semantico::avaliar;

    #[test]
    fn test_evaluate_term_2_multiplication() {
        assert_eq!(avaliar("5 * 2").unwrap(), "10\n");
        assert_eq!(avaliar("2.5 * 4").unwrap(), "10\n");
    }

    #[test]
    fn test_evaluate_term_2_division() {
        assert_eq!(avaliar("10 / 2").unwrap(), "5\n");
        assert_eq!(avaliar("10 / 4").unwrap(), "2.5\n");
    }

    #[test]
    fn test_evaluate_term_2_left_associativity() {
        // 10 / 2 * 5 should be (10 / 2) * 5 = 5 * 5 = 25
        assert_eq!(avaliar("10 / 2 * 5").unwrap(), "25\n");
        // 100 * 2 / 4 should be (100 * 2) / 4 = 200 / 4 = 50
        assert_eq!(avaliar("100 * 2 / 4").unwrap(), "50\n");
    }


}