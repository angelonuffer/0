import { ANSI } from './constantes.js';

export const exibir_bloco_erro = (conteúdos, endereço, número_linha, número_coluna, comprimento = 1, _corAnsi = 41, suprimirArquivoHeader = false) => {
  const conteúdo = conteúdos[endereço] || '';
  const linhas = conteúdo.split('\n');
  const linha = linhas[número_linha - 1] ?? '';

  console.error(`${número_linha}:${número_coluna}`);
  if (!suprimirArquivoHeader) {
    console.error(`${endereço}`);
  }

  console.error(linha);
  const marcador = ' '.repeat(Math.max(0, número_coluna - 1)) + '^'.repeat(Math.max(1, comprimento));
  console.error(marcador);
};

export const exibir_bloco_erro_com_valor = (conteúdos, endereço, número_linha, número_coluna, comprimento = 1, valorStr = '', _corAnsi = 43) => {
  const conteúdo = conteúdos[endereço] || '';
  const linhas = conteúdo.split('\n');
  const linha = linhas[número_linha - 1] ?? '';
  const start = Math.max(0, número_coluna - 1);
  const before = linha.substring(0, start);
  const after = linha.substring(start + Math.max(1, comprimento));
  const safeValor = String(valorStr);

  console.error(`${número_linha}:${número_coluna}`);
  console.error(endereço);

  const linha_simulada = `${before}${safeValor}${after}`;
  console.error(linha_simulada);
  const marcador = ' '.repeat(start) + '^'.repeat(safeValor.length);
  console.error(marcador);
};

export const mostrar_erro_semântico = (conteúdos, endereço, _mensagem_erro, termo_busca, informações_extras = [], suprimirArquivoHeader = false) => {
  const conteúdo = conteúdos[endereço] || '';
  const linhas = conteúdo.split('\n');

  let número_linha = 1;
  let número_coluna = 1;
  let comprimento_termo = termo_busca ? String(termo_busca).length : 1;

  if (termo_busca) {
    const termo_escapado = String(termo_busca).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${termo_escapado}\\b`);
    let lastMatchLine = null;
    let lastMatchIndex = null;
    for (let i = 0; i < linhas.length; i++) {
      const match = linhas[i].match(regex);
      if (match) {
        lastMatchLine = i + 1;
        lastMatchIndex = match.index + 1;
      }
    }
    if (lastMatchLine !== null) {
      número_linha = lastMatchLine;
      número_coluna = lastMatchIndex;
    }
  } else {
    for (let i = 0; i < linhas.length; i++) {
      if ((linhas[i] || '').trim() !== '') { número_linha = i + 1; número_coluna = 1; break; }
    }
  }

  exibir_bloco_erro(conteúdos, endereço, número_linha, número_coluna, comprimento_termo, 43, suprimirArquivoHeader);

  if (informações_extras.length > 0) {
    console.error(`Opções: ${informações_extras.join(', ')}`);
  }

  return { número_linha, número_coluna, comprimento_termo };
};

export const mostrar_erro_variável = (conteúdos, endereço, nome_variável, nomes_disponíveis) => {
  const informações_extras = nomes_disponíveis.length > 0 ? nomes_disponíveis : [];
  mostrar_erro_semântico(conteúdos, endereço, null, nome_variável, informações_extras);
};

export const mostrar_erro_sintaxe = (conteúdos, endereço, módulo_bruto) => {
  const unparsed_text = módulo_bruto.menor_resto || módulo_bruto.resto;
  const resto_text = módulo_bruto.resto;
  let posição_erro = (conteúdos[endereço] || '').length - unparsed_text.length;

  const resto_opening = (resto_text.match(/[\[\{\(]/g) || []).length;
  const resto_closing = (resto_text.match(/[\]\}\)]/g) || []).length;
  const aspas_matches = resto_text.match(/(?<!\\)"/g) || [];
  const tem_string_não_fechada = (aspas_matches.length % 2) === 1;

  if (resto_opening > resto_closing || tem_string_não_fechada) {
    const linhas = (conteúdos[endereço] || '').split('\n');
    let última_linha_não_vazia = linhas.length - 1;
    while (última_linha_não_vazia >= 0 && linhas[última_linha_não_vazia].trim() === '') {
      última_linha_não_vazia--;
    }
    let pos = 0;
    for (let i = 0; i < última_linha_não_vazia; i++) {
      pos += linhas[i].length + 1;
    }
    const última_linha = linhas[última_linha_não_vazia] || '';
    const tem_delim_fechamento = /[\]\}\)]/.test(última_linha);
    if (tem_delim_fechamento && !tem_string_não_fechada) {
      posição_erro = pos;
    } else {
      const última_linha_trimmed = última_linha.replace(/[ \t]+$/, '');
      pos += última_linha_trimmed.length;
      posição_erro = pos;
    }
  }

  const linhas_antes = (conteúdos[endereço] || '').substring(0, posição_erro).split('\n');
  const número_linha = linhas_antes.length;
  const número_coluna = linhas_antes.at(-1).length + 1;

  exibir_bloco_erro(conteúdos, endereço, número_linha, número_coluna, 1, 41);

  if (módulo_bruto.erro && módulo_bruto.erro.esperado && módulo_bruto.erro.esperado.length > 0) {
    console.error(`Opções: ${módulo_bruto.erro.esperado.join(', ')}`);
  }
};
