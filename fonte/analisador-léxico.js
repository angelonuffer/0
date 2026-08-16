import * as fs from 'fs';

const entrada = fs.readFileSync(0, 'utf-8').trim();

const regras = [
  { regex: /"([^"]*)"/g, token: 'texto' },
  { regex: /([&#=])/g, token: 'símbolo' },
  { regex: /([a-zA-Z]+)/g, token: 'identificador' },
  { regex: /\s+/g, token: 'espaço', ignore: true },
]

const tokens = [];

let posicao = 0;
while (posicao < entrada.length) {
  let matchLength = 0;
  for (const regra of regras) {
    const match = entrada.slice(posicao).match(new RegExp('^' + regra.regex.source));
    if (match) {
      if (!regra.ignore) {
        tokens.push({ [regra.token]: match[1] });
      }
      matchLength = match[0].length;
      break;
    }
  }
  if (matchLength === 0) {
    throw new Error(`Erro léxico na posição ${posicao}`);
  }
  posicao += matchLength;
}

tokens.push({ fim: true });

console.log(JSON.stringify(tokens, null, 2))

