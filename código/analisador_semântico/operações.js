// Binary, logical, and conditional operations
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

export const avaliarOperações = async (ast, escopo) => {
  switch (ast.tipo) {
    case TIPO_AST.OPERAÇÃO_BINÁRIA: {
      const esquerda = await avaliar(ast.esquerda, escopo);
      const direita = await avaliar(ast.direita, escopo);
      return ast.operador(esquerda, direita);
    }

    case TIPO_AST.OPERAÇÃO_LÓGICA: {
      const esquerda = await avaliar(ast.esquerda, escopo);
      if (ast.operador === '&') {
        return esquerda !== 0 ? await avaliar(ast.direita, escopo) : 0;
      } else if (ast.operador === '|') {
        return esquerda !== 0 ? esquerda : await avaliar(ast.direita, escopo);
      }
      const erro = new Error(`Unknown logical operator: ${ast.operador}`);
      erro.é_erro_semântico = true;
      erro.módulo_endereço = obterEndereçoMódulo(escopo);
      erro.pilha_semântica = erro.pilha_semântica || [];
      erro.pilha_semântica.push({ endereço: erro.módulo_endereço, termo_busca: String(ast.operador), comprimento: String(ast.operador).length });
      throw erro;
    }

    case TIPO_AST.CONDICIONAL: {
      const condição = await avaliar(ast.condição, escopo);
      return condição !== 0 ? await avaliar(ast.seVerdadeiro, escopo) : await avaliar(ast.seFalso, escopo);
    }

    default:
      return null; // Not handled by this module
  }
};

// Function to set the avaliar reference
export const setAvaliar = (fn) => {
  avaliar = fn;
};
