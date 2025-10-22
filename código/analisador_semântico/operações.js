// Binary, logical, and conditional operations

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

export const avaliarOperações = (ast, escopo) => {
  switch (ast.tipo) {
    case 'operação_binária': {
      const esquerda = avaliar(ast.esquerda, escopo);
      const direita = avaliar(ast.direita, escopo);
      return ast.operador(esquerda, direita);
    }

    case 'operação_lógica': {
      const esquerda = avaliar(ast.esquerda, escopo);
      if (ast.operador === '&') {
        return esquerda !== 0 ? avaliar(ast.direita, escopo) : 0;
      } else if (ast.operador === '|') {
        return esquerda !== 0 ? esquerda : avaliar(ast.direita, escopo);
      }
      const erro = new Error(`Unknown logical operator: ${ast.operador}`);
      erro.é_erro_semântico = true;
      erro.módulo_endereço = obterEndereçoMódulo(escopo);
      throw erro;
    }

    case 'condicional': {
      const condição = avaliar(ast.condição, escopo);
      return condição !== 0 ? avaliar(ast.seVerdadeiro, escopo) : avaliar(ast.seFalso, escopo);
    }

    default:
      return null; // Not handled by this module
  }
};

// Function to set the avaliar reference
export const setAvaliar = (fn) => {
  avaliar = fn;
};
