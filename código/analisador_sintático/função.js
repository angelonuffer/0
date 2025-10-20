// Function operations - lambda, chamada_função, parênteses
import { sequência, opcional, transformar, símbolo, alternativa, vários } from '../combinadores/index.js';
import { espaço, nome } from '../analisador_léxico/index.js';

// Forward declaration for recursive expressão reference
let expressão;

// Parser for object destructuring pattern: { a b c }
const objeto_destructuring = transformar(
  sequência(
    símbolo("{"),
    opcional(espaço),
    vários(
      sequência(
        nome,
        opcional(espaço),
      )
    ),
    símbolo("}")
  ),
  ([, , nomes_seq,]) => {
    if (!nomes_seq) {
      return {
        tipo: 'destructuring',
        nomes: []
      };
    }
    const nomes = nomes_seq.map(seq => seq[0]);
    return {
      tipo: 'destructuring',
      nomes: nomes
    };
  }
);

const lambda = transformar(
  sequência(
    alternativa(
      objeto_destructuring,
      nome
    ),
    opcional(espaço),
    símbolo("=>"),
    opcional(espaço),
    código => expressão(código)
  ),
  (valorBrutoLambda) => {
    const [paramsResultado, , , , corpoExpr] = valorBrutoLambda;

    let nomeParam = null;
    let destructuringParam = null;
    
    if (typeof paramsResultado === 'object' && paramsResultado.tipo === 'destructuring') {
      // Object destructuring case: { a b c }
      destructuringParam = paramsResultado.nomes;
    } else if (Array.isArray(paramsResultado) && paramsResultado[0] === '(') {
      // Parentheses case: (param) or ()
      nomeParam = paramsResultado[2] || null;
    } else {
      // No parentheses case: param
      nomeParam = paramsResultado;
    }

    return {
      tipo: 'lambda',
      parâmetro: nomeParam,
      destructuring: destructuringParam,
      corpo: corpoExpr
    };
  }
);

const chamada_função = transformar(
  sequência(
    símbolo("("),
    opcional(espaço),
    opcional(
      sequência(
        código => expressão(código),
        opcional(espaço),
      )
    ),
    opcional(espaço),
    símbolo(")"),
  ),
  ([, , arg_seq_optional,]) => ({
    tipo: 'operação_chamada_função',
    argumento: arg_seq_optional ? arg_seq_optional[0] : undefined
  })
);

const parênteses = transformar(
  sequência(
    símbolo("("),
    opcional(espaço),
    código => expressão(código),
    opcional(espaço),
    símbolo(")"),
  ),
  valorSeq => {
    const [, , expr,] = valorSeq;
    return {
      tipo: 'parênteses',
      expressão: expr
    };
  }
);

// Function to set the expressão reference
const setExpressão = (expr) => {
  expressão = expr;
};

export { lambda, chamada_função, parênteses, setExpressão };
