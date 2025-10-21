// Scope management - Creating, searching, and defining variables in scope

export const criarEscopo = (parent = null) => ({ __parent__: parent });

export const buscarVariável = (escopo, nome) => {
  let atualEscopo = escopo;
  while (atualEscopo) {
    if (atualEscopo.hasOwnProperty(nome)) {
      return atualEscopo[nome];
    }
    atualEscopo = atualEscopo.__parent__;
  }
  // Collect all available names in scope for error message
  const nomesDisponíveis = [];
  atualEscopo = escopo;
  while (atualEscopo) {
    for (const key of Object.keys(atualEscopo)) {
      if (key !== '__parent__' && key !== '__módulo__' && !nomesDisponíveis.includes(key)) {
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
  erro.nome_variável = nome;
  erro.nomes_disponíveis = nomesDisponíveis;
  erro.módulo_endereço = módulo_endereço;
  throw erro;
};

export const definirVariável = (escopo, nome, valor) => {
  escopo[nome] = valor;
};
