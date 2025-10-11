// Function operations - lambda, chamada_função, parênteses
import { sequência, opcional, transformar, símbolo } from '../combinadores/index.js';
import { espaço, nome } from '../analisador_léxico/index.js';

// Forward declaration for recursive expressão reference
let expressão;

const lambda = transformar(
  sequência(
    nome,
    opcional(espaço),
    símbolo("=>"),
    opcional(espaço),
    código => expressão(código)
  ),
  (valorBrutoLambda) => {
    const [paramsResultado, , , , corpoExprFunc] = valorBrutoLambda;

    let nomeParam = null;
    if (Array.isArray(paramsResultado) && paramsResultado[0] === '(') {
      // Parentheses case: (param) or ()
      nomeParam = paramsResultado[2] || null;
    } else {
      // No parentheses case: param
      nomeParam = paramsResultado;
    }

    return definition_scope => {
      return (caller_context, ...valoresArgs) => {
        const fn_scope = { __parent__: definition_scope || null };
        if (nomeParam) {
          // Function has a parameter
          if (valoresArgs.length === 1) {
            fn_scope[nomeParam] = valoresArgs[0];
          } else {
            // This case should not happen with the new syntax, but keeping for safety
            fn_scope[nomeParam] = valoresArgs;
          }
        }
        // If nomeParam is null, it's a zero-parameter function, so we don't assign anything
        return corpoExprFunc(fn_scope);
      };
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
  ([, , arg_seq_optional,]) => (escopo, função) => {
    if (arg_seq_optional) {
      const arg_value = arg_seq_optional[0](escopo);
      return função(escopo, arg_value);
    } else {
      return função(escopo);
    }
  }
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
    const [, , valor_fn,] = valorSeq;

    return outer_scope_param => {
      return valor_fn(outer_scope_param);
    };
  }
);

// Function to set the expressão reference
const setExpressão = (expr) => {
  expressão = expr;
};

export { lambda, chamada_função, parênteses, setExpressão };
