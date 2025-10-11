// Main expression and module parser - expressão, _0
import { alternativa, sequência, opcional, vários, transformar, símbolo, operador } from '../combinadores/index.js';
import { operação } from '../combinadores/avançados.js';
import { espaço, nome, endereço } from '../analisador_léxico/index.js';

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
            tipo: 'operação_lógica',
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
      opcional(vários(
        sequência(
          sequência(
            nome,
            opcional(espaço),
            símbolo("#"),
            opcional(espaço),
            endereço,
          ),
          espaço,
        ),
      ), []),

      opcional(espaço),
      código => expressão(código),
      opcional(espaço),
    ),
    valorSeq => {
      const [, importaçõesDetectadas_val, , corpoAst] = valorSeq;
      const importações = importaçõesDetectadas_val.map(([[nome, , , , endereço]]) => [nome, endereço])

      return [importações, [], corpoAst];
    }
  ),
  [[], [], undefined]
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
