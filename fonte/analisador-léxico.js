import * as fs from 'fs';

const entrada = fs.readFileSync(0, 'utf-8').trim();

let estado = 'INICIAL';
let lexema = '';
const tokens = [];

for (let i = 0; i < entrada.length; i++) {
  const char = entrada[i];

  switch (estado) {
    case 'INICIAL':
      if (char === '"') {
        estado = 'STRING';
      } else if (char.trim() === '') {
      }
      break;
    case 'STRING':
      if (char === '"') {
        tokens.push({ texto: lexema });
        lexema = '';
        estado = 'INICIAL';
      } else {
        lexema += char;
      }
      break;
  }
}

tokens.push({ fim: true });

console.log(JSON.stringify(tokens, null, 2))
