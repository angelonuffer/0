// Basic evaluation cases - números, texto, variável, não, parênteses

import { buscarVariável } from './escopo.js';

// Forward declaration for recursive avaliar reference
let avaliar;

export const avaliarBásico = (ast, escopo) => {
  switch (ast.tipo) {
    case 'número':
    case 'texto':
      return ast.valor;

    case 'variável':
      return buscarVariável(escopo, ast.nome);

    case 'não':
      return avaliar(ast.expressão, escopo) === 0 ? 1 : 0;

    case 'depuração': {
      const valor = avaliar(ast.expressão, escopo);
      // Display debug output to stderr with green background
      console.error(`\x1b[42m%\x1b[0m ${JSON.stringify(valor)}`);
      return valor;
    }

    case 'parênteses':
      return avaliar(ast.expressão, escopo);

    case 'parênteses_com_declarações': {
      // Create a new scope for the declarations
      const novoEscopo = { __parent__: escopo };
      
      // First pass: declare all names
      for (const decl of ast.declarações) {
        novoEscopo[decl.nome] = undefined;
      }
      
      // Second pass: evaluate and assign values
      for (const decl of ast.declarações) {
        novoEscopo[decl.nome] = avaliar(decl.valor, novoEscopo);
      }
      
      // Evaluate the expression in the new scope
      return avaliar(ast.expressão, novoEscopo);
    }

    default:
      return null; // Not handled by this module
  }
};

// Function to set the avaliar reference
export const setAvaliar = (fn) => {
  avaliar = fn;
};
