import * as fs from 'fs';

const entrada = fs.readFileSync(0, 'utf-8').trim();

if (entrada) {
  const ast = JSON.parse(entrada);

  if (ast.declaracoes) {
    let variaveis = {};
    for (const decl of ast.declaracoes) {
      variaveis[decl.identificador] = decl.valor.texto;
    }
    
    if (ast.retorno) {
      if (ast.retorno.texto !== undefined) {
        console.log(ast.retorno.texto);
      } else if (ast.retorno.tamanho) {
        const varName = ast.retorno.tamanho;
        if (variaveis[varName] !== undefined) {
          console.log(variaveis[varName].length);
        }
      }
    }
  }
}
