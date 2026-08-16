import * as fs from 'fs';

const entrada = fs.readFileSync(0, 'utf-8').trim();

if (entrada) {
  const ast = JSON.parse(entrada);

  if (ast.texto !== undefined) {
    console.log(ast.texto);
  }
}
