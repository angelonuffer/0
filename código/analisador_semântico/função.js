// Function operations - lambda, chamada_função, chamada_função_imediata

import { buscarVariável } from './escopo.js';

// Forward declaration for recursive avaliar reference
let avaliar;

// Helper to get module address from scope chain
const obterEndereçoMódulo = (escopo) => {
  let atualEscopo = escopo;
  while (atualEscopo) {
    if (atualEscopo.hasOwnProperty('__módulo__')) {
      return atualEscopo.__módulo__;
    }
    atualEscopo = atualEscopo.__parent__;
  }
  return null;
};

export const avaliarFunção = async (ast, escopo) => {
  switch (ast.tipo) {
    case 'lambda':
      return async (caller_context, ...valoresArgs) => {
        const fn_scope = { __parent__: escopo || null };
        
        // If caller_context has call stack information, inherit it
        if (caller_context && caller_context.__pilha_chamadas__) {
          fn_scope.__pilha_chamadas__ = caller_context.__pilha_chamadas__;
        }
        
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
              return await avaliar(guard.expressão, fn_scope);
            } else if (guard.tipo === 'guard') {
              // Conditional guard - check condition
              const conditionValue = await avaliar(guard.condição, fn_scope);
              // In the language, 0 is false, anything else is true
              if (conditionValue !== 0) {
                return await avaliar(guard.expressão, fn_scope);
              }
            }
          }
          // If no guards matched and no default, return undefined
          return undefined;
        } else {
          // Regular function body
          return await avaliar(ast.corpo, fn_scope);
        }
      };

    case 'chamada_função': {
      const função = await avaliar(ast.função, escopo);
      if (typeof função !== 'function') {
        const erro = new Error(`Value is not a function, got ${typeof função}`);
        erro.é_erro_semântico = true;
        erro.módulo_endereço = obterEndereçoMódulo(escopo);
        // For anonymous function calls, we don't have a good search term
        // The error will be caught and displayed without specific highlighting
        throw erro;
      }
      if (ast.argumento !== undefined) {
        const arg_value = await avaliar(ast.argumento, escopo);
        return await função(escopo, arg_value);
      } else {
        return await função(escopo);
      }
    }

    case 'chamada_função_imediata': {
      const função = await buscarVariável(escopo, ast.nome);
      if (typeof função !== 'function') {
        const erro = new Error(`${ast.nome} is not a function`);
        erro.é_erro_semântico = true;
        erro.termo_busca = ast.nome;
        erro.módulo_endereço = obterEndereçoMódulo(escopo);
        throw erro;
      }
      
      // Build the call stack by collecting from current scope and adding this call
      const pilha_atual = [];
      let atualEscopo = escopo;
      while (atualEscopo) {
        if (atualEscopo.__pilha_chamadas__) {
          pilha_atual.push(...atualEscopo.__pilha_chamadas__);
          break;
        }
        atualEscopo = atualEscopo.__parent__;
      }
      pilha_atual.push({
        nome: ast.nome,
        módulo: obterEndereçoMódulo(escopo)
      });
      
      // Create a new scope for the call with call stack information
      const call_scope = { 
        __parent__: escopo,
        __pilha_chamadas__: pilha_atual
      };
      
      if (ast.argumento !== undefined) {
        const arg_value = await avaliar(ast.argumento, escopo);
        return await função(call_scope, arg_value);
      } else {
        return await função(call_scope);
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
