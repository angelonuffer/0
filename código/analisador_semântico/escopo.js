// Scope management - Creating, searching, and defining variables in scope

// Symbol for internal context - not accessible through normal variable lookup
export const INTERNAL_CONTEXT = Symbol('internal_context');

export const criarEscopo = (parent = null) => ({ __parent__: parent });

// Lazy thunk marker
export const criarLazyThunk = (avaliarFn) => {
  return {
    __é_lazy_thunk__: true,
    __avaliar__: avaliarFn,
    __valor_cache__: undefined,
    __foi_avaliado__: false
  };
};

import { getSnapshotForError } from './pilha.js';

export const buscarVariável = async (escopo, nome) => {
  let atualEscopo = escopo;
  while (atualEscopo) {
    if (atualEscopo.hasOwnProperty(nome)) {
      const valor = atualEscopo[nome];
      // Check if it's a lazy thunk that needs evaluation
      if (valor && typeof valor === 'object' && valor.__é_lazy_thunk__) {
        if (!valor.__foi_avaliado__) {
          valor.__valor_cache__ = await valor.__avaliar__();
          valor.__foi_avaliado__ = true;
        }
        return valor.__valor_cache__;
      }
      return valor;
    }
    atualEscopo = atualEscopo.__parent__;
  }

  // Se não encontrou no escopo, tenta resolver como módulo ou diretório
  let context, módulo_atual;
  atualEscopo = escopo;
  while (atualEscopo) {
    if (atualEscopo[INTERNAL_CONTEXT]) {
      context = atualEscopo[INTERNAL_CONTEXT];
      módulo_atual = atualEscopo.__módulo__;
      break;
    }
    atualEscopo = atualEscopo.__parent__;
  }

  if (context && context.avaliar_módulo_lazy && context.resolve_endereço && módulo_atual) {
    if (context.existe_módulo && context.existe_módulo(módulo_atual, nome)) {
      const endereço_resolvido = context.resolve_endereço(módulo_atual, nome + ".0");
      return await context.avaliar_módulo_lazy(endereço_resolvido);
    }
    if (context.existe_diretório && context.existe_diretório(módulo_atual, nome)) {
      const endereço_resolvido = context.resolve_endereço(módulo_atual, nome);
      return { __é_proxy_diretório__: true, __caminho__: endereço_resolvido + "/" };
    }
  }

  // Collect all available names in scope for error message
  const nomesDisponíveis = [];
  atualEscopo = escopo;
  while (atualEscopo) {
    for (const key of Object.keys(atualEscopo)) {
      if (key !== '__parent__' && key !== '__módulo__' && key !== INTERNAL_CONTEXT && !nomesDisponíveis.includes(key)) {
        nomesDisponíveis.push(key);
      }
    }
    atualEscopo = atualEscopo.__parent__;
  }
  
  // Find the module address from the scope chain
  let módulo_endereço = null;
  atualEscopo = escopo;
  while (atualEscopo) {
    if (atualEscopo.hasOwnProperty('__módulo__')) {
      módulo_endereço = atualEscopo.__módulo__;
      break;
    }
    atualEscopo = atualEscopo.__parent__;
  }
  
  const erro = new Error(`Nome não encontrado: ${nome}`);
  erro.é_erro_semântico = true;
  erro.nome_variável = nome;
  erro.nomes_disponíveis = nomesDisponíveis;
  erro.módulo_endereço = módulo_endereço;
  // Prepend current semantic stack snapshot so runner can display full stack
  erro.pilha_semântica = getSnapshotForError().concat(erro.pilha_semântica || []);
  // Attach a semantic frame to help the top-level formatter build a stack
  erro.pilha_semântica.push({ endereço: módulo_endereço, termo_busca: nome, comprimento: nome.length });
  throw erro;
};

export const definirVariável = (escopo, nome, valor) => {
  escopo[nome] = valor;
};
