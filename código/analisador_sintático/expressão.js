// Main expression and module parser - expressão, _0
import { alternativa, sequência, opcional, vários, transformar, símbolo, operador } from '../combinadores/index.js';
import { operação } from '../combinadores/avançados.js';
import { espaço, nome } from '../analisador_léxico/index.js';
import { TIPO_AST } from '../constantes.js';

// Forward declarations
let getTermo6;

// Build the main expression parser
const buildExpressão = () => {
  return transformar(
    sequência(
      getTermo6(),
      vários(sequência(
        opcional(espaço),
        alternativa(
          símbolo("&"),
          símbolo("|"),
        ),
        opcional(espaço),
        getTermo6()
      ))
    ),
    v => {
      const [primeiroTermo, operaçõesSequenciais] = v;
      if (operaçõesSequenciais.length === 0) return primeiroTermo;

      return operaçõesSequenciais.reduce(
        (esquerda, valSeq) => {
          const operador = valSeq[1];
          const direita = valSeq[3];
          return {
            tipo: TIPO_AST.OPERAÇÃO_LÓGICA,
            esquerda: esquerda,
            direita: direita,
            operador: operador
          };
        },
        primeiroTermo
      );
    }
  );
};

let expressão;

const _0 = opcional(
  transformar(
    sequência(
      opcional(espaço),
      // Parse constant declarations: nome = expressão
      opcional(vários(
        sequência(
          nome,
          opcional(espaço),
          símbolo("="),
          opcional(espaço),
          código => expressão(código),
          espaço,
        )
      ), []),
      opcional(espaço),
      código => expressão(código),
      opcional(espaço),
    ),
    valorSeq => {
      const [, declarações_val, , corpoAst] = valorSeq;

      // Extract declarations
      const declarações = declarações_val.map(([nome_var, , , , valorExpr]) => ({
        nome: nome_var,
        valor: valorExpr
      }));

      return {
        importações: [],
        declarações: declarações,
        expressão: corpoAst
      };
    }
  ),
  { importações: [], declarações: [], expressão: undefined }
);

// Function to set termo6 getter reference
const setGetTermo6 = (getter) => {
  getTermo6 = getter;
};

// Function to set the built expressão
const setExpressão = (expr) => {
  expressão = expr;
};

export { buildExpressão, _0, setGetTermo6, setExpressão };
