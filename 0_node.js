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

  const [status_parse, resultado_data, resto_data] = _0(código);

  if (status_parse !== 0) {
    const posição_erro = código.length - resto_data.length;
    const linhas = código.split('\n');
    const linhas_antes = código.substring(0, posição_erro).split('\n');
    let número_linha = linhas_antes.length;
    let número_coluna = linhas_antes.at(-1).length + 1;

    // Ajuste para erros onde 'resto_data' é o código inteiro (parser falhou no início)
    if (posição_erro === 0 && resto_data === código) {
        número_linha = 1;
        número_coluna = 1;
    }

    let detalhe_erro_parser = "";
    if (typeof resultado_data === 'string') { // Caso do parser 'símbolo' ou 'regex'
        detalhe_erro_parser = ` Esperava '${resultado_data}'.`;
    } else if (resultado_data && typeof resultado_data === 'object' && resultado_data.mensagem) {
        detalhe_erro_parser = ` ${resultado_data.mensagem}.`;
         if (resultado_data.esperado) {
            detalhe_erro_parser += ` Esperava ${resultado_data.esperado}.`;
        }
    }


    console.error(`${endereço}: Erro de sintaxe na linha ${número_linha}, coluna ${número_coluna}.${detalhe_erro_parser}`);
    // Garante que a linha existe antes de tentar acessá-la
    if (número_linha -1 < linhas.length) {
      console.error(` --> ${linhas[número_linha - 1]}`);
      console.error(`     ${' '.repeat(número_coluna -1)}^`);
    } else {
      console.error(` (Erro no final inesperado do arquivo)`);
    }
    process.exit(1);
  }

  // Sucesso no parse
  const { importações, carregamentos, função_executar } = resultado_data;

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
  });
};

// Modificado para lidar com o fato de que importar agora retorna apenas o valor, não o código de saída.
// O código de saída é tratado com process.exit(1) em caso de erro.
(async () => {
  try {
    const saída = await importar(process.argv[2]);
    if (saída !== undefined) { // Apenas imprime se houver uma saída (evita 'undefined' para arquivos só com const)
        console.log(saída);
    }
    process.exit(0); // Sucesso
  } catch (e) {
    // Erros de runtime ainda podem ocorrer e serão pegos aqui.
    // Erros de sintaxe são tratados dentro de importar() com process.exit(1).
    if (e.message.startsWith("Runtime Error:")) {
        console.error(e.message);
    } else {
        console.error("Erro inesperado durante a execução:", e);
    }
    process.exit(1); // Erro genérico de runtime
  }
})();