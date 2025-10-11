// Main expression and module parser - expressão, _0
import { alternativa, sequência, opcional, vários, transformar, símbolo, operador } from '../combinadores/index.js';
import { operação } from '../combinadores/avançados.js';
import { espaço, nome, endereço } from '../analisador_léxico/index.js';

// Forward declarations
let getTermo6;

// Build the main expression parser
const buildExpressão = () => {
  return operação(
    getTermo6(),
    alternativa(
      operador("&", (v1, v2) => v1 !== 0 ? v2 : 0),
      operador("|", (v1, v2) => v1 !== 0 ? v1 : v2),
    ),
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
      const [, importaçõesDetectadas_val, , valor_fn_expr] = valorSeq;
      const importações = importaçõesDetectadas_val.map(([[nome, , , , endereço]]) => [nome, endereço])

      const corpo = outer_scope_param => {
        const blockScope = { __parent__: outer_scope_param || null };
        return valor_fn_expr(blockScope);
      };

      return [importações, [], corpo];
    }
  ),
  [[], [], () => { }]
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
