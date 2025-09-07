// Semantic analyzer - Evaluation and runtime logic
// Transforms parsed tokens and AST into executable forms
import { transformar } from '../combinadores/index.js';

// Import the raw parsers from lexical and syntax analyzers
// These will be wrapped with transformar to add semantic meaning

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

// Semantic transformations for lexical tokens
export const criarNúmero = (número_parser) => transformar(
  número_parser,
  v => () => parseInt(v.flat(Infinity).join("")),
);

export const criarNúmeroNegativo = (número_negativo_parser) => transformar(
  número_negativo_parser,
  v => () => -parseInt(v.slice(1).flat(Infinity).join("")),
);

export const criarNome = (nome_parser) => transformar(
  nome_parser,
  v => v.flat(Infinity).join(""),
);

export const criarEndereço = (endereço_parser) => transformar(
  endereço_parser,
  v => v.join(""),
);

export const criarTexto = (texto_parser) => transformar(
  texto_parser,
  v => () => v.flat(Infinity).join("").slice(1, -1)
);