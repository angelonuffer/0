// Binary, logical, and conditional operations

// Forward declaration for recursive avaliar reference
let avaliar;

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
      throw new Error(`Unknown logical operator: ${ast.operador}`);
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
