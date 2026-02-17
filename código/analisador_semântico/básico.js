// Basic evaluation cases - números, texto, variável, não, parênteses

import { buscarVariável, INTERNAL_CONTEXT } from './escopo.js';
import { pushFrame, popFrame, getSnapshotForError } from './pilha.js';
import { ANSI, TIPO_AST, NAO_MANIPULADO } from '../constantes.js';

// Forward declaration for recursive avaliar reference
let avaliar;

export const avaliarBásico = async (ast, escopo) => {
  switch (ast.tipo) {
    case TIPO_AST.NÚMERO:
    case TIPO_AST.TEXTO:
      return ast.valor;

    case TIPO_AST.NULO:
      return null;

    case TIPO_AST.VARIÁVEL:
      return await buscarVariável(escopo, ast.nome);

    case TIPO_AST.NÃO:
      return (await avaliar(ast.expressão, escopo)) === 0 ? 1 : 0;

    case TIPO_AST.DEPURAÇÃO: {
      const valor = await avaliar(ast.expressão, escopo);
      // Display debug output to stderr with green background
      console.error(`${ANSI.VERDE_FUNDO}%${ANSI.RESET} ${JSON.stringify(valor)}`);
      return valor;
    }

    case TIPO_AST.CARREGAR: {
      // Evaluate the expression to get the address
      const endereço_expr = await avaliar(ast.expressão, escopo);
      
      // Get internal context from scope (check parent chain)
      let context, módulo_atual;
      let current_scope = escopo;
      while (current_scope) {
        if (current_scope[INTERNAL_CONTEXT]) {
          context = current_scope[INTERNAL_CONTEXT];
          módulo_atual = current_scope.__módulo__;
          break;
        }
        current_scope = current_scope.__parent__;
      }
      
      if (!context || !context.carregar_conteúdo || !context.resolve_endereço || !módulo_atual) {
        const erro = new Error('Content loading context not available');
        erro.é_erro_semântico = true;
        erro.módulo_endereço = módulo_atual;
        erro.pilha_semântica = erro.pilha_semântica || [];
        erro.pilha_semântica.push({ endereço: módulo_atual, termo_busca: undefined, comprimento: 1 });
        throw erro;
      }
      
      // Resolve the address relative to the current module
      const endereço_resolvido = context.resolve_endereço(módulo_atual, endereço_expr);
      
      // Load and return the content
      pushFrame({ endereço: módulo_atual, termo_busca: undefined, comprimento: 1 });
      try {
        return await context.carregar_conteúdo(endereço_resolvido);
      } catch (err) {
        if (err && err.é_erro_semântico) {
          err.pilha_semântica = getSnapshotForError().concat(err.pilha_semântica || []);
        }
        throw err;
      } finally {
        popFrame();
      }
    }

    case TIPO_AST.PARÊNTESES:
      return await avaliar(ast.expressão, escopo);

    case TIPO_AST.PARÊNTESES_COM_DECLARAÇÕES: {
      // Create a new scope for the declarations
      const novoEscopo = { __parent__: escopo };
      
      // First pass: declare all names
      for (const decl of ast.declarações) {
        novoEscopo[decl.nome] = undefined;
      }
      
      // Second pass: evaluate and assign values
      for (const decl of ast.declarações) {
        novoEscopo[decl.nome] = await avaliar(decl.valor, novoEscopo);
      }
      
      // Evaluate the expression in the new scope
      return await avaliar(ast.expressão, novoEscopo);
    }

    case TIPO_AST.ENDEREÇO_LITERAL: {
      // Get internal context from scope (check parent chain)
      let context, módulo_atual;
      let current_scope = escopo;
      while (current_scope) {
        if (current_scope[INTERNAL_CONTEXT]) {
          context = current_scope[INTERNAL_CONTEXT];
          módulo_atual = current_scope.__módulo__;
          break;
        }
        current_scope = current_scope.__parent__;
      }
      
      if (!context || !context.valores_módulos || !context.resolve_endereço || !módulo_atual) {
        const erro = new Error('Module loading context not available');
        erro.é_erro_semântico = true;
        erro.módulo_endereço = módulo_atual;
        erro.pilha_semântica = erro.pilha_semântica || [];
        erro.pilha_semântica.push({ endereço: módulo_atual, termo_busca: undefined, comprimento: 1 });
        throw erro;
      }
      
      // Resolve the address relative to the current module
      const endereço_resolvido = context.resolve_endereço(módulo_atual, ast.valor);
      
      // If module not yet evaluated and we have lazy evaluator, evaluate it now
      if (!context.valores_módulos.hasOwnProperty(endereço_resolvido) && context.avaliar_módulo_lazy) {
        pushFrame({ endereço: módulo_atual, termo_busca: String(ast.valor), comprimento: String(ast.valor).length });
        try {
          return await context.avaliar_módulo_lazy(endereço_resolvido);
        } catch (err) {
          if (err && err.é_erro_semântico) {
            err.pilha_semântica = getSnapshotForError().concat(err.pilha_semântica || []);
          }
          throw err;
        } finally {
          popFrame();
        }
      }
      
      // Return the module value
      if (!context.valores_módulos.hasOwnProperty(endereço_resolvido)) {
        const erro = new Error(`Module not loaded: ${ast.valor}`);
        erro.é_erro_semântico = true;
        erro.termo_busca = ast.valor;
        erro.módulo_endereço = módulo_atual;
        // Prepend current semantic stack snapshot so runner can show full call chain
        erro.pilha_semântica = getSnapshotForError().concat(erro.pilha_semântica || []);
        erro.pilha_semântica.push({ endereço: módulo_atual, termo_busca: String(ast.valor), comprimento: String(ast.valor).length });
        throw erro;
      }
      
      return context.valores_módulos[endereço_resolvido];
    }

    default:
      return NAO_MANIPULADO; // Not handled by this module
  }
};

// Function to set the avaliar reference
export const setAvaliar = (fn) => {
  avaliar = fn;
};
