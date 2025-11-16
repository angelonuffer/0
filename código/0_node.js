import { _0 } from './analisador_sintático/index.js';
import { importações } from './analisador_sintático/importações.js';
import { avaliar, criarLazyThunk, INTERNAL_CONTEXT } from './analisador_semântico/index.js';
import { ANSI } from './constantes.js';
import fs from 'fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const módulo_principal = process.argv[2];

// Caminho absoluto do arquivo de cache no mesmo diretório deste 0_node.js
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CAMINHO_CACHE = path.join(__dirname, '0_cache.json');

let cache = {};
if (fs.existsSync(CAMINHO_CACHE)) {
  cache = JSON.parse(fs.readFileSync(CAMINHO_CACHE, 'utf-8'));
}

const salvar_cache = () => fs.writeFileSync(CAMINHO_CACHE, JSON.stringify(cache, null, 2));

// Helper function to resolve relative paths
const resolve_endereço = (base_module_path, rel_path) => {
  if (rel_path.startsWith('https://')) {
    return rel_path;
  }
  // Handle absolute paths
  if (rel_path.startsWith('/')) {
    return rel_path;
  }
  const base_dir = base_module_path.includes('/') ? base_module_path.substring(0, base_module_path.lastIndexOf('/') + 1) : '';
  const base_url = 'file:///' + base_dir;
  const resolved_url = new URL(rel_path, base_url);
  return decodeURIComponent(resolved_url.pathname.substring(1));
};

// Helper function to load content (local or remote) - now async lazy
const carregar_conteúdo = async (endereço) => {
  if (cache[endereço]) {
    return cache[endereço];
  }
  if (endereço.startsWith("https://")) {
    const resposta = await fetch(endereço);
    cache[endereço] = await resposta.text();
    return cache[endereço];
  } else {
    return fs.readFileSync(endereço, 'utf-8');
  }
};

// Helper function to show semantic errors with highlighted code
// Helper to print a single error block: endereço + linha:col: código da linha (with ANSI highlight)
const exibir_bloco_erro = (endereço, número_linha, número_coluna, comprimento = 1, corAnsi = 41, suprimirArquivoHeader = false) => {
  const conteúdo = conteúdos[endereço] || '';
  const linhas = conteúdo.split('\n');
  const linha = linhas[número_linha - 1] ?? '';
  const start = Math.max(0, número_coluna - 1);
  const before = linha.substring(0, start);
  const highlight = linha.substring(start, start + Math.max(1, comprimento));
  const after = linha.substring(start + Math.max(1, comprimento));
  const linha_com_erro = `${before}\x1b[${corAnsi}m${highlight}${ANSI.RESET}${after}`;
  if (!suprimirArquivoHeader) console.log(`${endereço}`);
  console.log(`${número_linha}:${número_coluna}: ${linha_com_erro}`);
};

// Helper to display a simulated line where the highlighted region is replaced by a value string
const exibir_bloco_erro_com_valor = (endereço, número_linha, número_coluna, comprimento = 1, valorStr = '', corAnsi = 43) => {
  const conteúdo = conteúdos[endereço] || '';
  const linhas = conteúdo.split('\n');
  const linha = linhas[número_linha - 1] ?? '';
  const start = Math.max(0, número_coluna - 1);
  const before = linha.substring(0, start);
  const after = linha.substring(start + Math.max(1, comprimento));
  const safeValor = String(valorStr);
  const linha_simulada = `${before}\x1b[${corAnsi}m${safeValor}${ANSI.RESET}${after}`;
  console.log(`${endereço}\n${número_linha}:${número_coluna}: ${linha_simulada}`);
};

// Helper function to show semantic errors with highlighted code (yellow)
const mostrar_erro_semântico = (endereço, _mensagem_erro, termo_busca, informações_extras = [], suprimirArquivoHeader = false) => {
  const conteúdo = conteúdos[endereço] || '';
  const linhas = conteúdo.split('\n');

  // Try to find the term; fallback to first non-empty line
  let número_linha = 1;
  let número_coluna = 1;
  let comprimento_termo = termo_busca ? termo_busca.length : 1;

  if (termo_busca) {
    const regex = new RegExp(`\\b${termo_busca.replace(/[.*+?^${}()|[\\]\\]/g, '\\\\$&')}\\b`);
    // Prefer the last occurrence in the file so call-site highlighting chooses the deepest match
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
    // Find first non-empty line
    for (let i = 0; i < linhas.length; i++) {
      if ((linhas[i] || '').trim() !== '') { número_linha = i + 1; número_coluna = 1; break; }
    }
  }

  exibir_bloco_erro(endereço, número_linha, número_coluna, comprimento_termo, 43, suprimirArquivoHeader);

  // Show extra information aligned with the error position (no verbal messages)
  if (informações_extras.length > 0) {
    const padding = ' '.repeat(`${número_linha}:${número_coluna}: `.length + número_coluna - 1);
    for (const info of informações_extras) {
      console.log(`${padding}${info}`);
    }
  }

  return { número_linha, número_coluna, comprimento_termo };
};

// Helper function to show undefined variable error with context
const mostrar_erro_variável = (endereço, nome_variável, nomes_disponíveis) => {
  const informações_extras = nomes_disponíveis.length > 0 
    ? nomes_disponíveis 
    : [];
  
  mostrar_erro_semântico(endereço, `Nome não encontrado: ${nome_variável}`, nome_variável, informações_extras);
};

// Helper function to show syntax error with context
const mostrar_erro_sintaxe = (endereço, módulo_bruto) => {
  // O analisador sintático fornece menor_resto que aponta para onde o erro ocorreu
  const unparsed_text = módulo_bruto.menor_resto || módulo_bruto.resto;
  const resto_text = módulo_bruto.resto;
  let posição_erro = conteúdos[endereço].length - unparsed_text.length;
  
  // Verifica se há delimitadores não fechados no texto restante (resto)
  // Isso indica que um delimitador foi aberto mas nunca fechado
  const resto_opening = (resto_text.match(/[\[\{\(]/g) || []).length;
  const resto_closing = (resto_text.match(/[\]\}\)]/g) || []).length;
  
  // Verifica se há uma string não fechada
  // Conta as aspas não escapadas no resto
  const aspas_matches = resto_text.match(/(?<!\\)"/g) || [];
  const tem_string_não_fechada = (aspas_matches.length % 2) === 1;
  
  // Se há mais aberturas que fechamentos no resto, o erro é provavelmente no final (falta um fechamento)
  if (resto_opening > resto_closing || tem_string_não_fechada) {
    // Move a posição do erro para o final do input (onde o delimitador deveria estar)
    // Encontra a última linha não-vazia
    const linhas = conteúdos[endereço].split('\n');
    let última_linha_não_vazia = linhas.length - 1;
    while (última_linha_não_vazia >= 0 && linhas[última_linha_não_vazia].trim() === '') {
      última_linha_não_vazia--;
    }
    
    // Calcula a posição no início da última linha não-vazia
    let pos = 0;
    for (let i = 0; i < última_linha_não_vazia; i++) {
      pos += linhas[i].length + 1; // +1 for newline
    }
    
    // Se a última linha contém um delimitador de fechamento não pareado, aponta para ele
    // Caso contrário, aponta para o final da linha
    const última_linha = linhas[última_linha_não_vazia];
    const tem_delim_fechamento = /[\]\}\)]/.test(última_linha);
    
    if (tem_delim_fechamento && !tem_string_não_fechada) {
      // Aponta para o início da linha (onde está o delimitador não pareado)
      posição_erro = pos;
    } else {
      // Aponta para o final da linha (onde o delimitador deveria estar)
      const última_linha_trimmed = última_linha.replace(/[ \t]+$/, '');
      pos += última_linha_trimmed.length;
      posição_erro = pos;
    }
  }
  
  const linhas = conteúdos[endereço].split('\n');
  const linhas_antes = conteúdos[endereço].substring(0, posição_erro).split('\n');
  const número_linha = linhas_antes.length;
  const número_coluna = linhas_antes.at(-1).length + 1;
  const linha = linhas[número_linha - 1];
  
  const linha_com_erro = (linha?.substring(0, número_coluna - 1) ?? "") +
    `${ANSI.VERMELHO_FUNDO}${linha?.[número_coluna - 1] ?? ""}${ANSI.RESET}` +
    (linha?.substring(número_coluna) ?? "");
  // Use unified display helper (red highlight for syntax errors)
  exibir_bloco_erro(endereço, número_linha, número_coluna, 1, 41);
};



// State for module loading and execution
const conteúdos = {};
const módulos = {};
const valores_módulos = {};

// Helper function to parse a module on demand (async lazy loading)
const parsear_módulo = async (endereço) => {
  // If already parsed, return cached result
  if (módulos[endereço]) {
    return módulos[endereço];
  }
  
  // Load content lazily (async)
  if (!conteúdos[endereço]) {
    conteúdos[endereço] = await carregar_conteúdo(endereço);
  }
  
  // Extract imports using the import parser
  const importações_resultado = importações(conteúdos[endereço]);
  const importações_lista = importações_resultado.sucesso ? importações_resultado.valor : [];
  
  const módulo_bruto = _0(conteúdos[endereço]);
  
  // Check if parsing failed
  if (!módulo_bruto.sucesso) {
    // If there's an error with stack trace, it's a transformer error
    if (módulo_bruto.erro && módulo_bruto.erro.stack) {
      // Show only endereço + line:col: code line (no verbal message)
      const linhas_conteudo = (conteúdos[endereço] || '').split('\n');
      let ln = 1, col = 1;
      for (let i = 0; i < linhas_conteudo.length; i++) {
        if ((linhas_conteudo[i] || '').trim() !== '') { ln = i + 1; col = 1; break; }
      }
      exibir_bloco_erro(endereço, ln, col, 1, 41, suprimirArquivoHeader);
    } else {
      // Otherwise show syntax error
      mostrar_erro_sintaxe(endereço, módulo_bruto);
    }
    salvar_cache();
    process.exit(1);
  }
  
  if (módulo_bruto.resto.length > 0) {
    mostrar_erro_sintaxe(endereço, módulo_bruto);
    salvar_cache();
    process.exit(1);
  }
  
  const corpo = módulo_bruto.valor.expressão;
  const declarações = módulo_bruto.valor.declarações || [];
  const resolved_importações = importações_lista.map(({ nome, endereço: end_rel }) => [nome, resolve_endereço(endereço, end_rel)]);
  
  módulos[endereço] = {
    importações: resolved_importações,
    declarações: declarações,
    expressão: corpo
  };
  
  return módulos[endereço];
};

// Helper function to evaluate a module and its dependencies lazily (now async)
const avaliar_módulo = async (endereço) => {
  // If already evaluated, return cached value
  if (valores_módulos.hasOwnProperty(endereço)) {
    return valores_módulos[endereço];
  }
  
  // Parse module if not yet parsed (lazy parsing - now async)
  let módulo = módulos[endereço];
  if (!módulo) {
    módulo = await parsear_módulo(endereço);
  }
  
  const { importações, declarações, expressão: corpoAst } = módulo;
  
  // Create lazy thunks for imports (now returns async functions)
  const escopo_importações = {};
  for (const [nome, dep_end] of importações) {
    escopo_importações[nome] = criarLazyThunk(() => avaliar_módulo(dep_end));
  }
  
  const escopo = { 
    ...escopo_importações, 
    __parent__: null, 
    __módulo__: endereço,
    [INTERNAL_CONTEXT]: {
      valores_módulos: valores_módulos,
      resolve_endereço: resolve_endereço,
      avaliar_módulo_lazy: avaliar_módulo,
      carregar_conteúdo: carregar_conteúdo
    }
  };
  
  // First pass: declare all constant names
  if (declarações) {
    for (const decl of declarações) {
      escopo[decl.nome] = undefined;
    }
  }
  
  // Second pass: evaluate and assign values (now async)
  if (declarações) {
    for (const decl of declarações) {
      try {
        escopo[decl.nome] = await avaliar(decl.valor, escopo);
      } catch (erro) {
        // Check if it's a semantic analyzer error
        if (erro.é_erro_semântico) {
          const erro_endereço = erro.módulo_endereço || endereço;

          // If a semantic stack snapshot is present, defer printing here and rethrow
          // so the outer (module-body) handler prints the full stack in call-site order.
          if (erro.pilha_semântica && Array.isArray(erro.pilha_semântica) && erro.pilha_semântica.length > 0) {
            throw erro;
          }

          // Otherwise handle specific semantic errors locally
          if (erro.nome_variável) {
            mostrar_erro_variável(erro_endereço, erro.nome_variável, erro.nomes_disponíveis);
          } else if (erro.termo_busca) {
            mostrar_erro_semântico(erro_endereço, erro.message, erro.termo_busca, [], false);
          } else {
            const linhas_conteudo = (conteúdos[erro_endereço] || '').split('\n');
            let ln = 1, col = 1;
            for (let i = 0; i < linhas_conteudo.length; i++) {
              if ((linhas_conteudo[i] || '').trim() !== '') { ln = i + 1; col = 1; break; }
            }
            exibir_bloco_erro(erro_endereço, ln, col, 1, 43);
          }

          salvar_cache();
          process.exit(1);
        }
        // Otherwise re-throw
        throw erro;
      }
    }
  }
  
  let valor;
  try {
    valor = corpoAst ? await avaliar(corpoAst, escopo) : undefined;
  } catch (erro) {
    // Check if it's a semantic analyzer error
    if (erro.é_erro_semântico) {
      const erro_endereço = erro.módulo_endereço || endereço;
      
      // Prefer printing semantic frames (if present) before handling specific variable error
      if (erro.pilha_semântica && Array.isArray(erro.pilha_semântica) && erro.pilha_semântica.length > 0) {
        let framesToPrint = erro.pilha_semântica.slice().reverse();
        const seen = new Set();
        framesToPrint = framesToPrint.filter(f => {
          const key = `${f.endereço || ''}|${f.termo_busca || ''}|${f.comprimento || ''}|${f.valor || ''}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
        // If the error is a missing-variable error, move any frame that targets the missing name
        // to the end so we print call-sites before the origin frame (which will include suggestions).
        if (erro.nome_variável) {
          const tail = framesToPrint.filter(f => String(f.termo_busca) === String(erro.nome_variável));
          const head = framesToPrint.filter(f => String(f.termo_busca) !== String(erro.nome_variável));
          framesToPrint = head.concat(tail);
        }
        let último_endereço_impresso = null;
        for (let i = 0; i < framesToPrint.length; i++) {
          const frame = framesToPrint[i];
          const frame_end = frame.endereço || erro_endereço;
          const infos = (i === framesToPrint.length - 1 && erro.nome_variável) ? (erro.nomes_disponíveis || []) : [];
          // Insert a blank line when switching to a different file frame (for readability)
          if (i !== 0 && frame_end !== último_endereço_impresso) console.log('');
          // Only suppress the file header when printing consecutive frames from the same file
          const suprimirArquivoHeader = (i !== 0 && frame_end === último_endereço_impresso);
          const pos = mostrar_erro_semântico(frame_end, erro.message, frame.termo_busca, infos, suprimirArquivoHeader);
          if (frame.valor !== undefined) {
            exibir_bloco_erro_com_valor(frame_end, pos.número_linha, pos.número_coluna, frame.comprimento || pos.comprimento_termo, frame.valor, 43);
          }
          último_endereço_impresso = frame_end;
        }
      } else if (erro.nome_variável) {
        mostrar_erro_variável(erro_endereço, erro.nome_variável, erro.nomes_disponíveis);
      } else if (erro.termo_busca) {
        // Generic semantic error with search term
        mostrar_erro_semântico(erro_endereço, erro.message, erro.termo_busca, [], false);
      } else {
        // Semantic error without search term - show endereço + first non-empty line highlighted
        const linhas_conteudo = (conteúdos[erro_endereço] || '').split('\n');
        let ln = 1, col = 1;
        for (let i = 0; i < linhas_conteudo.length; i++) {
          if ((linhas_conteudo[i] || '').trim() !== '') { ln = i + 1; col = 1; break; }
        }
        exibir_bloco_erro(erro_endereço, ln, col, 1, 43);
      }
      
      salvar_cache();
      process.exit(1);
    }
    // Otherwise re-throw
    throw erro;
  }
  
  valores_módulos[endereço] = valor;
  return valor;
};

// Evaluate the main module (will trigger lazy parsing and evaluation of dependencies)
const main_value = await avaliar_módulo(módulo_principal);

// Save cache
salvar_cache();

console.log(main_value);