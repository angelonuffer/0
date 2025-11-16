// Semantic analyzer - Evaluation and runtime logic
// This module integrates all sub-modules and provides the main evaluation function

// Import scope management
export { criarEscopo, buscarVariável, definirVariável, criarLazyThunk, INTERNAL_CONTEXT } from './escopo.js';

// Import evaluation modules
import { avaliarBásico, setAvaliar as setAvaliarBásico } from './básico.js';
import { avaliarOperações, setAvaliar as setAvaliarOperações } from './operações.js';
import { avaliarObjeto, setAvaliar as setAvaliarObjeto } from './objeto.js';
import { avaliarColeção, setAvaliar as setAvaliarColeção } from './coleção.js';
import { avaliarFunção, setAvaliar as setAvaliarFunção } from './função.js';

// Main evaluation function - takes an AST node and scope, returns the evaluated value
export const avaliar = async (ast, escopo) => {
  if (!ast || typeof ast !== 'object' || !ast.tipo) {
    // Handle literal values (numbers, strings, etc.)
    return ast;
  }

  // Try each module in order
  let result;
  
  result = await avaliarBásico(ast, escopo);
  if (result !== null) return result;
  
  result = await avaliarOperações(ast, escopo);
  if (result !== null) return result;
  
  result = await avaliarObjeto(ast, escopo);
  if (result !== null) return result;
  
  result = await avaliarColeção(ast, escopo);
  if (result !== null) return result;
  
  result = await avaliarFunção(ast, escopo);
  if (result !== null) return result;

  const erro = new Error(`Unknown AST node type: ${ast.tipo}`);
  erro.é_erro_semântico = true;
  // Attach current semantic stack snapshot so runner displays full chain
  import('./pilha.js').then(({ getSnapshotForError }) => {
    erro.pilha_semântica = getSnapshotForError().concat(erro.pilha_semântica || []);
    erro.pilha_semântica.push({ endereço: null, termo_busca: String(ast.tipo), comprimento: String(ast.tipo).length });
  }).catch(() => {
    erro.pilha_semântica = erro.pilha_semântica || [];
    erro.pilha_semântica.push({ endereço: null, termo_busca: String(ast.tipo), comprimento: String(ast.tipo).length });
  });
  throw erro;
};

// Wire up recursive references
setAvaliarBásico(avaliar);
setAvaliarOperações(avaliar);
setAvaliarObjeto(avaliar);
setAvaliarColeção(avaliar);
setAvaliarFunção(avaliar);