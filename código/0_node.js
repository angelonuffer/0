import { _0 } from './analisador_sintático/index.js';
import fs from 'fs';

// Get command line arguments
const argumentos = process.argv.slice(2);
const [módulo_principal] = argumentos;

// Check and load cache
let cache = {};
if (fs.existsSync("0_cache.json")) {
  cache = JSON.parse(fs.readFileSync("0_cache.json", 'utf-8'));
}

// State for module loading and execution
const conteúdos = {
  "0_cache.json": cache,
  [módulo_principal]: null,
};
const módulos = {
  [módulo_principal]: null,
};
const valores_módulos = {};

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
  if (endereço.startsWith("https://")) {
    const resposta = await fetch(endereço);
    return await resposta.text();
  } else {
    return fs.readFileSync(endereço, 'utf-8');
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

try {
  // Step 1: Load all module contents
  while (true) {
    const pendente = Object.entries(conteúdos).find(([endereço, conteúdo]) => conteúdo === null);
    if (!pendente) break;
    
    const [endereço] = pendente;
    
    // Check if content is in cache
    if (conteúdos["0_cache.json"][endereço]) {
      conteúdos[endereço] = conteúdos["0_cache.json"][endereço];
    } else {
      const conteúdo = await carregar_conteúdo(endereço);
      conteúdos[endereço] = conteúdo;
      
      // Update cache for remote URLs
      if (endereço.startsWith("https://")) {
        conteúdos["0_cache.json"][endereço] = conteúdo;
      }
    }
  }
  
  // Step 2: Parse all modules and resolve dependencies
  while (true) {
    const pendente = Object.entries(módulos).find(([endereço, módulo]) => módulo === null);
    if (!pendente) break;
    
    const [endereço] = pendente;
    const módulo_bruto = _0.analisar(conteúdos[endereço]);
    
    if (módulo_bruto.erro) {
      console.log(`Erro: ${módulo_bruto.erro.message}\n${módulo_bruto.erro.stack}`);
      fs.writeFileSync("0_cache.json", JSON.stringify(conteúdos["0_cache.json"], null, 2));
      process.exit(1);
    }
    
    if (módulo_bruto.resto.length > 0) {
      mostrar_erro_sintaxe(endereço, módulo_bruto);
      fs.writeFileSync("0_cache.json", JSON.stringify(conteúdos["0_cache.json"], null, 2));
      process.exit(1);
    }
    
    const [importações, , corpo] = módulo_bruto.valor;
    const resolved_importações = importações.map(([nome, end_rel]) => [nome, resolve_endereço(endereço, end_rel)]);
    
    // Add new dependencies
    for (const [, end] of resolved_importações) {
      if (!conteúdos.hasOwnProperty(end)) {
        conteúdos[end] = null;
      }
      if (!módulos.hasOwnProperty(end)) {
        módulos[end] = null;
      }
    }
    
    módulos[endereço] = [resolved_importações, [], corpo];
    
    // Load new content if needed
    while (true) {
      const pendente_conteúdo = Object.entries(conteúdos).find(([endereço, conteúdo]) => conteúdo === null);
      if (!pendente_conteúdo) break;
      
      const [end_pendente] = pendente_conteúdo;
      
      if (conteúdos["0_cache.json"][end_pendente]) {
        conteúdos[end_pendente] = conteúdos["0_cache.json"][end_pendente];
      } else {
        const conteúdo = await carregar_conteúdo(end_pendente);
        conteúdos[end_pendente] = conteúdo;
        
        if (end_pendente.startsWith("https://")) {
          conteúdos["0_cache.json"][end_pendente] = conteúdo;
        }
      }
    }
  }
  
  // Step 3: Execute modules in dependency order
  while (true) {
    const executável = Object.entries(módulos).find(
      ([e, m]) =>
        m !== null &&
        !valores_módulos.hasOwnProperty(e) &&
        m[0].every(([, dep_end]) => valores_módulos.hasOwnProperty(dep_end))
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
    const [importações, , corpo] = módulo;
    
    const escopo_importações = Object.fromEntries(
      importações.map(([nome, dep_end]) => [nome, valores_módulos[dep_end]])
    );
    
    const escopo = { ...escopo_importações };
    const valor = corpo(escopo);
    
    valores_módulos[endereço] = valor;
  }
  
  // Save cache
  fs.writeFileSync("0_cache.json", JSON.stringify(conteúdos["0_cache.json"], null, 2));
  
  await eval(valores_módulos[módulo_principal])
  
} catch (erro) {
  console.error(erro);
  process.exit(1);
}