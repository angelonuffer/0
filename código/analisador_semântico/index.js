// Semantic analyzer - Evaluation and runtime logic
// In this language, most semantic analysis is integrated into the syntax analysis
// This file contains utilities for scope management and evaluation helpers

// Utility functions for semantic analysis could be added here in the future
// For now, the evaluation logic is integrated into the syntax analyzer

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