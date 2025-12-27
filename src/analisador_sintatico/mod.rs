
#[derive(Debug)]
pub enum AstNode {
    StringLiteral(String),
}

pub fn parse(input: &str) -> Result<AstNode, String> {
    let trimmed = input.trim();
    if trimmed.starts_with('"') && trimmed.ends_with('"') {
        if trimmed.len() >= 2 {
            let content = &trimmed[1..trimmed.len() - 1];
            if content.contains('"') {
                Err("❌ Caractere de aspas duplas inesperado dentro da string.".to_string())
            } else {
                Ok(AstNode::StringLiteral(content.to_string()))
            }
        } else {
             Err("❌ String com aspas duplas incompleta.".to_string())
        }
    } else {
        Err("❌ Esperado uma string com aspas duplas.".to_string())
    }
}
