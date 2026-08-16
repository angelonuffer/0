import * as fs from 'fs';

const entrada = fs.readFileSync(0, 'utf-8').trim();

const tokens = [];
const regex = /"([^"]*)"|([&#=])|([a-zA-Z]+)|\s+/g;

for (const match of entrada.matchAll(regex)) {
  if (match[1] !== undefined) {
    tokens.push({ texto: match[1] });
  } else if (match[2] !== undefined) {
    tokens.push({ símbolo: match[2] });
  } else if (match[3] !== undefined) {
    tokens.push({ identificador: match[3] });
  }
}

tokens.push({ fim: true });

console.log(JSON.stringify(tokens, null, 2))

