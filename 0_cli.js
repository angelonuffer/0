import _0 from './0.js';
import fs from 'fs';
import path from 'path';
import mensagens_erro from './mensagens_erro.js';

const importar = endereço => {
  const endereço_diretório = path.dirname(endereço);
  const código = fs.readFileSync(endereço, 'utf-8');
  const [status, [importações, carregamentos, função_executar], código_restante] = _0(código);
  if (status !== 0) {
    console.error(`${endereço}: ${mensagens_erro[status] || `Erro desconhecido de código: ${status}`}`)
    process.exit(1)
  }
  if (código_restante.length > 0) {
    const posição_erro = código.length - código_restante.length;
    const linhas = código.split('\n');
    const linhas_antes = código.substring(0, posição_erro).split('\n');
    const número_linha = linhas_antes.length;
    const número_coluna = linhas_antes.at(-1).length + 1;
    console.error(`${endereço}: Erro de sintaxe na linha ${número_linha}, coluna ${número_coluna}.`)
    console.error(`${número_linha}:${número_coluna}: ${linhas[número_linha - 1]}`);
    process.exit(1);
  }
  return função_executar({
    ...Object.fromEntries(importações.map(([nome, endereço]) => [nome, importar(path.resolve(endereço_diretório, endereço))])),
    ...Object.fromEntries(carregamentos.map(([nome, endereço]) => [nome, fs.readFileSync(path.resolve(endereço_diretório, endereço), 'utf-8')])),
  })
}

const [código_saída, saída] = importar(process.argv[2])
console.log(saída);
process.exit(código_saída);