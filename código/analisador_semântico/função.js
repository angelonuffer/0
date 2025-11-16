// Function operations - lambda, chamada_função, chamada_função_imediata

import { buscarVariável } from './escopo.js';
import { pushFrame, popFrame, getSnapshotForError } from './pilha.js';
import { TIPO_AST } from '../constantes.js';

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
    case TIPO_AST.LAMBDA:
      return async (caller_context, ...valoresArgs) => {
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
        if (ast.corpo && ast.corpo.tipo === TIPO_AST.GUARDS) {
          // Evaluate guards in order
          for (const guard of ast.corpo.guards) {
            if (guard.tipo === TIPO_AST.GUARD_DEFAULT) {
              // Default guard - always matches
              return await avaliar(guard.expressão, fn_scope);
            } else if (guard.tipo === TIPO_AST.GUARD) {
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

    case TIPO_AST.CHAMADA_FUNÇÃO: {
      const função = await avaliar(ast.função, escopo);
      if (typeof função !== 'function') {
        const erro = new Error(`Value is not a function, got ${typeof função}`);
        erro.é_erro_semântico = true;
        erro.módulo_endereço = obterEndereçoMódulo(escopo);
        // Attach current semantic stack snapshot so runner can display full call stack
        erro.pilha_semântica = getSnapshotForError().concat(erro.pilha_semântica || []);
        // For anonymous function calls, we don't have a good search term
        throw erro;
      }
      if (ast.argumento !== undefined) {
        const arg_value = await avaliar(ast.argumento, escopo);
        // Push a frame for this application (anonymous call site)
        pushFrame({ endereço: obterEndereçoMódulo(escopo), termo_busca: undefined, comprimento: 1 });
        try {
          return await função(escopo, arg_value);
        } catch (err) {
          if (err && err.é_erro_semântico) {
            err.pilha_semântica = getSnapshotForError().concat(err.pilha_semântica || []);
          }
          throw err;
        } finally {
          popFrame();
        }
      } else {
        pushFrame({ endereço: obterEndereçoMódulo(escopo), termo_busca: undefined, comprimento: 1 });
        try {
          return await função(escopo);
        } catch (err) {
          if (err && err.é_erro_semântico) {
            err.pilha_semântica = getSnapshotForError().concat(err.pilha_semântica || []);
          }
          throw err;
        } finally {
          popFrame();
        }
      }
    }

    case TIPO_AST.CHAMADA_FUNÇÃO_IMEDIATA: {
      const função = await buscarVariável(escopo, ast.nome);
      if (typeof função !== 'function') {
        const erro = new Error(`${ast.nome} is not a function`);
        erro.é_erro_semântico = true;
        erro.termo_busca = ast.nome;
        erro.módulo_endereço = obterEndereçoMódulo(escopo);
        erro.pilha_semântica = getSnapshotForError().concat(erro.pilha_semântica || []);
        throw erro;
      }
      if (ast.argumento !== undefined) {
        const arg_value = await avaliar(ast.argumento, escopo);
        pushFrame({ endereço: obterEndereçoMódulo(escopo), termo_busca: ast.nome, comprimento: ast.nome.length });
        try {
          return await função(escopo, arg_value);
        } catch (err) {
          if (err && err.é_erro_semântico) {
            err.pilha_semântica = getSnapshotForError().concat(err.pilha_semântica || []);
          }
          throw err;
        } finally {
          popFrame();
        }
      } else {
        pushFrame({ endereço: obterEndereçoMódulo(escopo), termo_busca: ast.nome, comprimento: ast.nome.length });
        try {
          return await função(escopo);
        } catch (err) {
          if (err && err.é_erro_semântico) {
            err.pilha_semântica = getSnapshotForError().concat(err.pilha_semântica || []);
          }
          throw err;
        } finally {
          popFrame();
        }
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
