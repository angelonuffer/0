// Function operations - lambda, chamada_função, chamada_função_imediata

import { buscarVariável } from './escopo.js';

// Forward declaration for recursive avaliar reference
let avaliar;

export const avaliarFunção = (ast, escopo) => {
  switch (ast.tipo) {
    case 'lambda':
      return (caller_context, ...valoresArgs) => {
        const fn_scope = { __parent__: escopo || null };
        if (ast.parâmetro) {
          if (valoresArgs.length === 1) {
            fn_scope[ast.parâmetro] = valoresArgs[0];
          } else {
            fn_scope[ast.parâmetro] = valoresArgs;
          }
        }
        return avaliar(ast.corpo, fn_scope);
      };

    case 'chamada_função': {
      const função = avaliar(ast.função, escopo);
      if (typeof função !== 'function') {
        throw new Error(`Value is not a function, got ${typeof função}`);
      }
      if (ast.argumento !== undefined) {
        const arg_value = avaliar(ast.argumento, escopo);
        return função(escopo, arg_value);
      } else {
        return função(escopo);
      }
    }

    case 'chamada_função_imediata': {
      const função = buscarVariável(escopo, ast.nome);
      if (typeof função !== 'function') {
        throw new Error(`${ast.nome} is not a function`);
      }
      if (ast.argumento !== undefined) {
        const arg_value = avaliar(ast.argumento, escopo);
        return função(escopo, arg_value);
      } else {
        return função(escopo);
      }
    }

    default:
      return null; // Not handled by this module
  }
};

// Function to set the avaliar reference
export const setAvaliar = (fn) => {
  avaliar = fn;
};
