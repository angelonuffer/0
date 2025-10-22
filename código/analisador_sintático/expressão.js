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
      // Parse constant declarations and debug commands: nome = expressão OR % expressão
      opcional(vários(
        alternativa(
          // Declaration: nome = expressão
          sequência(
            nome,
            opcional(espaço),
            símbolo("="),
            opcional(espaço),
            código => expressão(código),
            espaço,
          ),
          // Debug command: % expressão
          sequência(
            símbolo("%"),
            opcional(espaço),
            código => expressão(código),
            espaço,
          )
        )
      ), []),
      opcional(espaço),
      código => expressão(código),
      opcional(espaço),
    ),
    valorSeq => {
      const [, importaçõesDetectadas_val, , declarações_ou_debug_val, , corpoAst] = valorSeq;
      const importações = importaçõesDetectadas_val.map(([[nome, , , , endereço]]) => [nome, endereço])

      // Extract declarations and debug commands, preserving order
      const statements = [];
      
      for (const item of declarações_ou_debug_val) {
        if (item.length === 6) {
          // This is a declaration: [nome, espaço?, "=", espaço?, expressão, espaço]
          statements.push({
            tipo: 'declaração',
            nome: item[0],
            valor: item[4]
          });
        } else if (item.length === 4) {
          // This is a debug command: ["%", espaço?, expressão, espaço]
          statements.push({
            tipo: 'debug',
            expressão: item[2]
          });
        }
      }

      return {
        importações: importações,
        statements: statements,
        expressão: corpoAst
      };
    }
  ),
  { importações: [], statements: [], expressão: undefined }
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
