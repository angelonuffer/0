import { _0 } from './analisador_sintático/index.js';
import { importações } from './analisador_sintático/importações.js';
import { avaliar, criarLazyThunk } from './analisador_semântico/index.js';
import fs from 'fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Parse command line arguments
const args = process.argv.slice(2);
const modo_verbose = args.includes('-v');
const módulo_principal = args.find(arg => !arg.startsWith('-'));

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
  const base_dir = base_module_path.includes('/') ? base_module_path.substring(0, base_module_path.lastIndexOf('/') + 1) : '';
  const base_url = 'file:///' + base_dir;
  const resolved_url = new URL(rel_path, base_url);
  return decodeURIComponent(resolved_url.pathname.substring(1));
};

// Helper function to load content (local or remote)
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
const mostrar_erro_semântico = (endereço, mensagem_erro, termo_busca, informações_extras = []) => {
  const conteúdo = conteúdos[endereço];
  const linhas = conteúdo.split('\n');
  
  // Find the first occurrence of the search term in the source
  let posição_erro = -1;
  let número_linha = 0;
  let número_coluna = 0;
  let comprimento_termo = termo_busca.length;
  
  // Create a regex that matches the search term as a whole word
  const regex = new RegExp(`\\b${termo_busca.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`);
  
  for (let i = 0; i < linhas.length; i++) {
    const match = linhas[i].match(regex);
    if (match) {
      número_linha = i + 1;
      número_coluna = match.index + 1;
      posição_erro = conteúdo.split('\n').slice(0, i).join('\n').length + (i > 0 ? 1 : 0) + match.index;
      break;
    }
  }
  
  if (posição_erro === -1) {
    // Fallback: just show the error without highlighting
    console.log(`Erro: ${mensagem_erro}\n${endereço}`);
    for (const info of informações_extras) {
      console.log(info);
    }
    return;
  }
  
  const linha = linhas[número_linha - 1];
  
  // Highlight the term with yellow background (ANSI code 43)
  const linha_com_erro = linha.substring(0, número_coluna - 1) +
    `\x1b[43m${termo_busca}\x1b[0m` +
    linha.substring(número_coluna - 1 + comprimento_termo);
  
  console.log(`Erro: ${mensagem_erro}\n${endereço}\n${número_linha}:${número_coluna}: ${linha_com_erro}`);
  
  // Show extra information aligned with the error position
  if (informações_extras.length > 0) {
    // Calculate padding to align with the term position
    const padding = ' '.repeat(`${número_linha}:${número_coluna}: `.length + número_coluna - 1);
    for (const info of informações_extras) {
      console.log(`${padding}${info}`);
    }
  }
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
  const unparsed_text = módulo_bruto.menor_resto || módulo_bruto.resto;
  const posição_base = conteúdos[endereço].length - unparsed_text.length;
  
  // If no unparsed text available, the error is at the end of input
  if (!unparsed_text || unparsed_text.length === 0) {
    const posição_erro = conteúdos[endereço].length;
    const linhas = conteúdos[endereço].split('\n');
    const linhas_antes = conteúdos[endereço].substring(0, posição_erro).split('\n');
    const número_linha = linhas_antes.length;
    const número_coluna = linhas_antes.at(-1).length + 1;
    const linha = linhas[número_linha - 1];
    
    const linha_com_erro = (linha?.substring(0, número_coluna - 1) ?? "") +
      `\x1b[41m${linha?.[número_coluna - 1] ?? ""}\x1b[0m` +
      (linha?.substring(número_coluna) ?? "");
    console.log(`Erro de sintaxe.\n${endereço}\n${número_linha}:${número_coluna}: ${linha_com_erro}`);
    return;
  }
  
  // Determine error position based on the type of syntax error
  // For unexpected tokens (closing brackets, invalid operators), error is at the token
  // For unclosed constructs, error is at end of line (newline position)
  const trimmed_unparsed = unparsed_text.trimStart();
  const is_unexpected_closing = /^[)\]}]\s*\n/.test(trimmed_unparsed);
  const is_invalid_operator = /^=\s+[^>]/.test(trimmed_unparsed);
  
  let posição_erro;
  if (is_unexpected_closing || is_invalid_operator) {
    // Error at the unexpected token (start of menor_resto)
    posição_erro = posição_base;
  } else {
    // Error at end of line (newline position)
    const newline_pos = unparsed_text.indexOf('\n');
    posição_erro = newline_pos !== -1 ? posição_base + newline_pos : posição_base;
  }
  
  const linhas = conteúdos[endereço].split('\n');
  const linhas_antes = conteúdos[endereço].substring(0, posição_erro).split('\n');
  const número_linha = linhas_antes.length;
  const número_coluna = linhas_antes.at(-1).length + 1;
  const linha = linhas[número_linha - 1];
  
  const linha_com_erro = (linha?.substring(0, número_coluna - 1) ?? "") +
    `\x1b[41m${linha?.[número_coluna - 1] ?? ""}\x1b[0m` +
    (linha?.substring(número_coluna) ?? "");
  console.log(`Erro de sintaxe.\n${endereço}\n${número_linha}:${número_coluna}: ${linha_com_erro}`);
};



// State for module loading and execution
const conteúdos = {};
const módulos = {};
const valores_módulos = {};

// Helper function to extract address references from source text using regex
// This is a lightweight alternative to full parsing for pre-fetching
const extrair_referências_endereços = (conteúdo) => {
  const endereços = [];
  
  // Match address literals in parentheses: (path/to/file.0) or (./file.0) or (../file.0)
  // Supports Unicode characters in paths
  const regex_literal = /\(([./][^\s()]+\.0)\)/gu;
  let match;
  while ((match = regex_literal.exec(conteúdo)) !== null) {
    endereços.push(match[1]);
  }
  
  return endereços;
};

// Helper to pre-fetch all remote URLs recursively
const pré_carregar_urls_remotas = async (endereço, visitados = new Set()) => {
  if (visitados.has(endereço)) {
    return; // Already processed
  }
  visitados.add(endereço);
  
  // Load this module's content if not already loaded
  if (!conteúdos[endereço]) {
    conteúdos[endereço] = await carregar_conteúdo(endereço);
  }
  
  // Use lightweight parsing to find imports (# syntax)
  const importações_resultado = importações(conteúdos[endereço]);
  const importações_lista = importações_resultado.sucesso ? importações_resultado.valor : [];
  
  // Use regex to find address literals (avoid full parsing during pre-fetch)
  const endereços_literais = extrair_referências_endereços(conteúdos[endereço]);
  
  // Collect all dependencies
  const todas_dependências = [
    ...importações_lista.map(({ endereço: end_rel }) => resolve_endereço(endereço, end_rel)),
    ...endereços_literais.map(end_rel => resolve_endereço(endereço, end_rel))
  ];
  
  // Recursively pre-fetch all dependencies
  for (const dep of todas_dependências) {
    await pré_carregar_urls_remotas(dep, visitados);
  }
};

try {
  // Step 1: Pre-fetch all remote URLs to enable synchronous lazy parsing
  await pré_carregar_urls_remotas(módulo_principal);
  
  // Helper function to parse a module on demand (now synchronous)
  const parsear_módulo = (endereço) => {
    // If already parsed, return cached result
    if (módulos[endereço]) {
      return módulos[endereço];
    }
    
    // Load content (synchronous since we pre-fetched remote URLs)
    if (!conteúdos[endereço]) {
      if (endereço.startsWith('https://')) {
        const erro = new Error(`Remote URL not pre-fetched: ${endereço}`);
        throw erro;
      }
      conteúdos[endereço] = fs.readFileSync(endereço, 'utf-8');
    }
    
    // Extract imports using the import parser
    const importações_resultado = importações(conteúdos[endereço]);
    const importações_lista = importações_resultado.sucesso ? importações_resultado.valor : [];
    
    const módulo_bruto = _0(conteúdos[endereço]);
    
    // Check if parsing failed
    if (!módulo_bruto.sucesso) {
      // If there's an error with stack trace, it's a transformer error
      if (módulo_bruto.erro && módulo_bruto.erro.stack) {
        if (modo_verbose) {
          console.log(`Erro: ${módulo_bruto.erro.mensagem || módulo_bruto.erro.message}\n${módulo_bruto.erro.stack}`);
        } else {
          console.log(`Erro: ${módulo_bruto.erro.mensagem || módulo_bruto.erro.message}`);
        }
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
  
  // Helper function to evaluate a module and its dependencies lazily
  const avaliar_módulo = (endereço) => {
    // If already evaluated, return cached value
    if (valores_módulos.hasOwnProperty(endereço)) {
      return valores_módulos[endereço];
    }
    
    // Parse module if not yet parsed (lazy parsing)
    let módulo = módulos[endereço];
    if (!módulo) {
      módulo = parsear_módulo(endereço);
    }
    
    const { importações, declarações, expressão: corpoAst } = módulo;
    
    // Create lazy thunks for imports
    const escopo_importações = {};
    for (const [nome, dep_end] of importações) {
      escopo_importações[nome] = criarLazyThunk(() => avaliar_módulo(dep_end));
    }
    
    const escopo = { 
      ...escopo_importações, 
      __parent__: null, 
      __módulo__: endereço,
      __valores_módulos__: valores_módulos,
      __resolve_endereço__: resolve_endereço,
      __avaliar_módulo_lazy__: avaliar_módulo
    };
    
    // First pass: declare all constant names
    if (declarações) {
      for (const decl of declarações) {
        escopo[decl.nome] = undefined;
      }
    }
    
    // Second pass: evaluate and assign values
    if (declarações) {
      for (const decl of declarações) {
        try {
          escopo[decl.nome] = avaliar(decl.valor, escopo);
        } catch (erro) {
          // Check if it's a semantic analyzer error
          if (erro.é_erro_semântico) {
            const erro_endereço = erro.módulo_endereço || endereço;
            
            // Check if it's an undefined variable error (special case)
            if (erro.nome_variável) {
              mostrar_erro_variável(erro_endereço, erro.nome_variável, erro.nomes_disponíveis);
            } else if (erro.termo_busca) {
              // Generic semantic error with search term
              mostrar_erro_semântico(erro_endereço, erro.message, erro.termo_busca);
            } else {
              // Semantic error without search term - just show the message
              console.log(`Erro: ${erro.message}\n${erro_endereço}`);
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
      valor = corpoAst ? avaliar(corpoAst, escopo) : undefined;
    } catch (erro) {
      // Check if it's a semantic analyzer error
      if (erro.é_erro_semântico) {
        const erro_endereço = erro.módulo_endereço || endereço;
        
        // Check if it's an undefined variable error (special case)
        if (erro.nome_variável) {
          mostrar_erro_variável(erro_endereço, erro.nome_variável, erro.nomes_disponíveis);
        } else if (erro.termo_busca) {
          // Generic semantic error with search term
          mostrar_erro_semântico(erro_endereço, erro.message, erro.termo_busca);
        } else {
          // Semantic error without search term - just show the message
          console.log(`Erro: ${erro.message}\n${erro_endereço}`);
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
  
  // Step 2: Parse only the main module initially
  parsear_módulo(módulo_principal);
  
  // Step 3: Evaluate the main module (will trigger lazy parsing and evaluation of dependencies)
  const main_value = avaliar_módulo(módulo_principal);
  
  // Save cache
  salvar_cache();
  
  console.log(main_value);
  
} catch (erro) {
  if (modo_verbose) {
    console.error(erro);
  } else {
    const mensagem = erro.message || erro;
    console.error(erro instanceof Error ? `Error: ${mensagem}` : mensagem);
  }
  process.exit(1);
}