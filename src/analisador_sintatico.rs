extern crate pest;
use pest::Parser;

#[derive(pest_derive::Parser)]
#[grammar = "gramatica.pest"]
pub struct SintaticoParser;

pub fn parse(input: &str) -> Result<pest::iterators::Pairs<'_, Rule>, String> {
    let pairs = SintaticoParser::parse(Rule::arquivo, input).map_err(|e| format!("❌ Erro de sintaxe: {}", e))?;
    Ok(pairs.peek().unwrap().into_inner())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_erro_expressao_incompleta() {
        let input = "1 +";
        let resultado = parse(input);
        assert!(resultado.is_err(), "Deveria falhar para expressão incompleta '1 +'");
        assert!(resultado.unwrap_err().contains("1:4"), "Erro deveria estar na posição 1:4");
    }

    #[test]
    fn test_erro_token_inesperado_inicio() {
        let input = "+ 1";
        let resultado = parse(input);
        assert!(resultado.is_err(), "Deveria falhar para operador no início '+ 1'");
        assert!(resultado.unwrap_err().contains("1:1"), "Erro deveria estar na posição 1:1");
    }

    #[test]
    fn test_erro_parenteses_nao_fechados() {
        let input = "(1 + 2";
        let resultado = parse(input);
        assert!(resultado.is_err(), "Deveria falhar para parênteses não fechados '(1 + 2'");
        assert!(resultado.unwrap_err().contains("1:7"), "Erro deveria estar na posição 1:7");
    }

    #[test]
    fn test_erro_caractere_invalido() {
        let input = "1 + @";
        let resultado = parse(input);
        assert!(resultado.is_err(), "Deveria falhar para caractere inválido '@'");
        assert!(resultado.unwrap_err().contains("1:5"), "Erro deveria estar na posição 1:5");
    }
}
