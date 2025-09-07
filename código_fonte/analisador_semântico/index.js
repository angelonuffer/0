// Semantic analyzer - Imports parsers from syntax analyzer and applies semantic transformations
// This is the main interface that should be used by the automaton for parsing
import { transformar } from '../combinadores/index.js';
import { expressão as expressãoSintática, _0 as _0Sintático } from '../analisador_sintático/index.js';

// Scope management utilities
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

// Re-export the main parsers from syntax analyzer
// In the future, these could be enhanced with additional semantic transformations
export const expressão = expressãoSintática;
export const _0 = _0Sintático;