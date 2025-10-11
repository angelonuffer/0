// Semantic analyzer - Evaluation and runtime logic
// This module integrates all sub-modules and provides the main evaluation function

// Import scope management
export { criarEscopo, buscarVariável, definirVariável } from './escopo.js';

// Import evaluation modules
import { avaliarBásico, setAvaliar as setAvaliarBásico } from './básico.js';
import { avaliarOperações, setAvaliar as setAvaliarOperações } from './operações.js';
import { avaliarObjeto, setAvaliar as setAvaliarObjeto } from './objeto.js';
import { avaliarColeção, setAvaliar as setAvaliarColeção } from './coleção.js';
import { avaliarFunção, setAvaliar as setAvaliarFunção } from './função.js';

// Main evaluation function - takes an AST node and scope, returns the evaluated value
export const avaliar = (ast, escopo) => {
  if (!ast || typeof ast !== 'object' || !ast.tipo) {
    // Handle literal values (numbers, strings, etc.)
    return ast;
  }

  // Try each module in order
  let result;
  
  result = avaliarBásico(ast, escopo);
  if (result !== null) return result;
  
  result = avaliarOperações(ast, escopo);
  if (result !== null) return result;
  
  result = avaliarObjeto(ast, escopo);
  if (result !== null) return result;
  
  result = avaliarColeção(ast, escopo);
  if (result !== null) return result;
  
  result = avaliarFunção(ast, escopo);
  if (result !== null) return result;

  throw new Error(`Unknown AST node type: ${ast.tipo}`);
};

// Wire up recursive references
setAvaliarBásico(avaliar);
setAvaliarOperações(avaliar);
setAvaliarObjeto(avaliar);
setAvaliarColeção(avaliar);
setAvaliarFunção(avaliar);