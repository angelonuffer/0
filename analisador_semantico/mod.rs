
use crate::analisador_sintatico::AstNode;

pub fn evaluate(ast: AstNode) -> Result<String, String> {
    match ast {
        AstNode::StringLiteral(value) => Ok(value),
    }
}
