import * as fs from 'fs';

const entrada = fs.readFileSync(0, 'utf-8').trim();

if (entrada) {
  const tokens = JSON.parse(entrada);

  let ast = {
    declaracoes: [],
    retorno: null
  };

  if (tokens.length > 0 && tokens[0].texto !== undefined && tokens[1]?.fim) {
    console.log(JSON.stringify({ texto: tokens[0].texto }, null, 2));
    process.exit(0);
  }

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
    }
  }

  console.log(JSON.stringify(ast, null, 2));
}
