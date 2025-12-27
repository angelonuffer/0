extern crate pest;
use pest::Parser;

#[derive(pest_derive::Parser)]
#[grammar = "analisador_sintatico/gramatica.pest"]
pub struct SintaticoParser;

pub fn parse(input: &str) -> Result<pest::iterators::Pairs<'_, Rule>, String> {
    SintaticoParser::parse(Rule::program, input).map_err(|e| format!("❌ Erro de sintaxe: {}", e))
}
