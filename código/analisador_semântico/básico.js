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

    case 'parênteses':
      return avaliar(ast.expressão, escopo);

    default:
      return null; // Not handled by this module
  }
};

// Function to set the avaliar reference
export const setAvaliar = (fn) => {
  avaliar = fn;
};
