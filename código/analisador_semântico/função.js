// Function operations - lambda, chamada_função, chamada_função_imediata

import { buscarVariável } from './escopo.js';

// Forward declaration for recursive avaliar reference
let avaliar;

export const avaliarFunção = (ast, escopo) => {
  switch (ast.tipo) {
    case 'lambda':
      return (caller_context, ...valoresArgs) => {
        const fn_scope = { __parent__: escopo || null };
        
        // Handle object destructuring
        if (ast.destructuring) {
          const argValue = valoresArgs.length === 1 ? valoresArgs[0] : valoresArgs;
          
          // Extract values from the argument object based on destructuring keys
          for (const nome of ast.destructuring) {
            if (typeof argValue === 'object' && argValue !== null) {
              fn_scope[nome] = argValue[nome];
            } else {
              fn_scope[nome] = undefined;
            }
          }
        } else if (ast.parâmetro) {
          // Original behavior for named parameters
          if (valoresArgs.length === 1) {
            fn_scope[ast.parâmetro] = valoresArgs[0];
          } else {
            fn_scope[ast.parâmetro] = valoresArgs;
          }
        }
        
        // Check if the body is a guards expression
        if (ast.corpo && ast.corpo.tipo === 'guards') {
          // Evaluate guards in order
          for (const guard of ast.corpo.guards) {
            if (guard.tipo === 'guard_default') {
              // Default guard - always matches
              return avaliar(guard.expressão, fn_scope);
            } else if (guard.tipo === 'guard') {
              // Conditional guard - check condition
              const conditionValue = avaliar(guard.condição, fn_scope);
              // In the language, 0 is false, anything else is true
              if (conditionValue !== 0) {
                return avaliar(guard.expressão, fn_scope);
              }
            }
          }
          // If no guards matched and no default, return undefined
          return undefined;
        } else {
          // Regular function body
          return avaliar(ast.corpo, fn_scope);
        }
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
