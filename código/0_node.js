import { _0 } from './analisador_sintático/index.js';
import { importações } from './analisador_sintático/importações.js';
import { avaliar } from './analisador_semântico/index.js';
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

// Helper function to show undefined variable error with context
const mostrar_erro_variável = (endereço, nome_variável, nomes_disponíveis) => {
  const conteúdo = conteúdos[endereço];
  const linhas = conteúdo.split('\n');
  
  // Find the first occurrence of the variable name in the source
  // We need to find it as a whole word (not part of another word)
  let posição_erro = -1;
  let número_linha = 0;
  let número_coluna = 0;
  
  // Create a regex that matches the variable name as a whole word
  const regex = new RegExp(`\\b${nome_variável.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`);
  
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
    console.log(`Erro: Nome não encontrado: ${nome_variável}\n${endereço}`);
    if (nomes_disponíveis.length > 0) {
      console.log(`Nomes disponíveis: ${nomes_disponíveis.join(', ')}`);
    }
    return;
  }
  
  const linha = linhas[número_linha - 1];
  
  // Highlight the variable name with yellow background (ANSI code 43)
  const linha_com_erro = linha.substring(0, número_coluna - 1) +
    `\x1b[43m${nome_variável}\x1b[0m` +
    linha.substring(número_coluna - 1 + nome_variável.length);
  
  console.log(`${endereço}\n${número_linha}:${número_coluna}: ${linha_com_erro}`);
  
  // Show available names aligned with the error position
  if (nomes_disponíveis.length > 0) {
    // Calculate padding to align with the variable position
    const padding = ' '.repeat(`${número_linha}:${número_coluna}: `.length + número_coluna - 1);
    for (const nome of nomes_disponíveis) {
      console.log(`${padding}${nome}`);
    }
  }
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
  
  // The error position is exactly where the parser stopped
  const posição_erro = posição_base;
  
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
const conteúdos = {
  [módulo_principal]: await carregar_conteúdo(módulo_principal),
};
const módulos = {
  [módulo_principal]: null,
};
const valores_módulos = {};

try {
  // Step 2: Parse all modules and resolve dependencies
  while (true) {
    const pendente = Object.entries(módulos).find(([endereço, módulo]) => módulo === null);
    if (!pendente) break;
    
    const [endereço] = pendente;
    
    // Extract imports using the import parser
    const importações_resultado = importações(conteúdos[endereço]);
    const importações_lista = importações_resultado.sucesso ? importações_resultado.valor : [];
    
    const módulo_bruto = _0(conteúdos[endereço]);
    
    // Check if parsing failed
    if (!módulo_bruto.sucesso) {
      // If there's an error with stack trace, it's a transformer error
      if (módulo_bruto.erro && módulo_bruto.erro.stack) {
        console.log(`Erro: ${módulo_bruto.erro.mensagem || módulo_bruto.erro.message}\n${módulo_bruto.erro.stack}`);
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
    const resolved_importações = importações_lista.map(({ nome, endereço: end_rel }) => [nome, resolve_endereço(endereço, end_rel)]);
    
    // Add new dependencies
    for (const [, end] of resolved_importações) {
      if (!conteúdos.hasOwnProperty(end)) {
        conteúdos[end] = null;
      }
      if (!módulos.hasOwnProperty(end)) {
        módulos[end] = null;
      }
    }
    
    módulos[endereço] = {
      importações: resolved_importações,
      expressão: corpo
    };
    
    // Load new content if needed
    while (true) {
      const pendente_conteúdo = Object.entries(conteúdos).find(([endereço, conteúdo]) => conteúdo === null);
      if (!pendente_conteúdo) break;
      
      const [end_pendente] = pendente_conteúdo;
      
      conteúdos[pendente_conteúdo[0]] = await carregar_conteúdo(end_pendente);
    }
  }
  
  // Step 3: Execute modules in dependency order
  while (true) {
    const executável = Object.entries(módulos).find(
      ([e, m]) =>
        m !== null &&
        !valores_módulos.hasOwnProperty(e) &&
        m.importações.every(([, dep_end]) => valores_módulos.hasOwnProperty(dep_end))
    );
    
    if (!executável) {
      // Check if all modules are executed
      const todos_avaliados = Object.keys(módulos).every(e => valores_módulos.hasOwnProperty(e));
      if (todos_avaliados) {
        break;
      } else {
        console.log("Erro: Dependência circular detectada.");
        process.exit(1);
      }
    }
    
    const [endereço, módulo] = executável;
    const { importações, expressão: corpoAst } = módulo;
    
    const escopo_importações = Object.fromEntries(
      importações.map(([nome, dep_end]) => [nome, valores_módulos[dep_end]])
    );
    
    const escopo = { ...escopo_importações, __parent__: null };
    let valor;
    try {
      valor = corpoAst ? avaliar(corpoAst, escopo) : undefined;
    } catch (erro) {
      // Check if it's an undefined variable error
      if (erro.nome_variável) {
        mostrar_erro_variável(endereço, erro.nome_variável, erro.nomes_disponíveis);
        salvar_cache();
        process.exit(1);
      }
      // Otherwise re-throw
      throw erro;
    }
    
    valores_módulos[endereço] = valor;
  }
  
  // Save cache
  salvar_cache();
  
  await eval(valores_módulos[módulo_principal]("Node.js"))
  
} catch (erro) {
  console.error(erro);
  process.exit(1);
}