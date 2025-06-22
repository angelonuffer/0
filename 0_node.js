import _0 from './0.js';
import fs from 'fs';
import path from 'path';
import mensagens_erro from './mensagens_erro.js';

const CACHE_PATH = path.resolve('0_cache.json');
let cache = {};
try {
  cache = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf-8'));
} catch {
  cache = {};
}

const salvar_cache = () => {
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2), 'utf-8');
};

const importar = async endereço => {
  const endereço_diretório = path.dirname(endereço);
  let código;

  if (endereço.startsWith("https://")) {
    if (cache[endereço]) {
      código = cache[endereço];
    } else {
      código = await (await fetch(endereço)).text();
      cache[endereço] = código;
      salvar_cache();
    }
  } else {
    código = fs.readFileSync(endereço, 'utf-8');
  }

  const [[importações, carregamentos, função_executar], código_restante] = _0(código);
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
    ...(Object.fromEntries(
      await Promise.all(
        importações.map(async ([nome, endereço]) => [
          nome,
          await importar(
            endereço.startsWith("https://")
              ? endereço
              : path.resolve(endereço_diretório, endereço)
          )
        ])
      )
    )),
    ...Object.fromEntries(
      await Promise.all(
        carregamentos.map(async ([nome, endereço]) => [
          nome,
          cache[endereço.startsWith("https://") ? endereço : path.resolve(endereço_diretório, endereço)]
            ?? (
              endereço.startsWith("https://")
                ? (cache[endereço] = await (await fetch(endereço)).text(), salvar_cache(), cache[endereço])
                : fs.readFileSync(path.resolve(endereço_diretório, endereço), 'utf-8')
            )
        ])
      )
    ),
  })
}

const [código_saída, saída] = await importar(process.argv[2])
console.log(saída);
process.exit(código_saída);