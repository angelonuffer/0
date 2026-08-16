import * as fs from 'fs';

const entrada = fs.readFileSync(0, 'utf-8').trim();

if (entrada) {
  const tokens = JSON.parse(entrada);

  let ast = {
    declaracoes: [],
    retorno: null
  };

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.símbolo === '&') {
      if (tokens[i+1]?.identificador && tokens[i+2]?.símbolo === '=' && tokens[i+3]?.texto !== undefined) {
        ast.declaracoes.push({
          identificador: tokens[i+1].identificador,
          valor: {
            texto: tokens[i+3].texto
          }
        });
        i += 3;
      }
    } else if (token.símbolo === '#') {
      if (tokens[i+1]?.identificador) {
        ast.retorno = { tamanho: tokens[i+1].identificador };
        i += 1;
      }
    } else if (token.texto !== undefined) {
      ast.retorno = { texto: token.texto };
    }
  }

  console.log(JSON.stringify(ast, null, 2));
}
