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
      } else if (char === '&') {
        tokens.push({ símbolo: '&' });
      } else if (char === '#') {
        tokens.push({ símbolo: '#' });
      } else if (char === '=') {
        tokens.push({ símbolo: '=' });
      } else if (/[a-zA-Z]/.test(char)) {
        lexema += char;
        estado = 'IDENTIFICADOR';
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
    case 'IDENTIFICADOR':
      if (/[a-zA-Z]/.test(char)) {
        lexema += char;
      } else {
        tokens.push({ identificador: lexema });
        lexema = '';
        estado = 'INICIAL';
        i--;
      }
      break;
  }
}

if (estado === 'IDENTIFICADOR') {
  tokens.push({ identificador: lexema });
}

tokens.push({ fim: true });

console.log(JSON.stringify(tokens, null, 2))

