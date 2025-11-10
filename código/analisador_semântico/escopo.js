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
  throw erro;
};

export const definirVariável = (escopo, nome, valor) => {
  escopo[nome] = valor;
};
