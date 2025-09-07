// Semantic analyzer - Evaluation and runtime logic
// Transforms parsed tokens and AST into executable forms
import { transformar } from '../combinadores/index.js';
import { alternativa, sequência, opcional, vários, símbolo, operador, inversão, faixa } from '../combinadores/index.js';
import { operação } from '../combinadores/avançados.js';

// Re-export combinators that are used for structure parsing (keep in lexical/syntax)
export { alternativa, sequência, opcional, vários, símbolo, operador, operação, inversão, faixa };

// transformar is now only available through semantic analysis
export { transformar };

// Import raw lexical elements
import { espaço, nome, endereço, número, número_negativo, texto } from '../analisador_léxico/index.js';

// Re-export lexical elements for use in syntax analysis
export { espaço, nome, endereço, número, número_negativo, texto };

// Utility functions for semantic analysis
export const criarEscopo = (parent = null) => ({ __parent__: parent });

export const buscarVariável = (escopo, nome) => {
  let atualEscopo = escopo;
  while (atualEscopo) {
    if (atualEscopo.hasOwnProperty(nome)) {
      return atualEscopo[nome];
    }
    atualEscopo = atualEscopo.__parent__;
  }
  return undefined;
};

export const definirVariável = (escopo, nome, valor) => {
  escopo[nome] = valor;
};