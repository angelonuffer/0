// Basic operations - não, valor_constante, chamada_função_imediata
import { alternativa, sequência, opcional, transformar, símbolo } from '../combinadores/index.js';
import { espaço, nome } from '../analisador_léxico/index.js';

// Forward declaration for recursive expressão reference
let expressão;

const não = transformar(
  sequência(
    símbolo("!"),
    opcional(espaço),
    código => expressão(código),
  ),
  ([, , v]) => escopo => v(escopo) === 0 ? 1 : 0,
)

const valor_constante = transformar(
  nome,
  v => escopo => {
    let atualEscopo = escopo;
    while (atualEscopo) {
      if (atualEscopo.hasOwnProperty(v)) {
        return atualEscopo[v];
      }
      atualEscopo = atualEscopo.__parent__;
    }
    return undefined;
  },
)

// Immediate function call - identifier directly followed by parentheses (no space)
const chamada_função_imediata = transformar(
  sequência(
    nome,
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
  ([nome_var, , , arg_seq_optional, ,]) => escopo => {
    // Get the function from the scope
    let atualEscopo = escopo;
    let função = undefined;
    while (atualEscopo) {
      if (atualEscopo.hasOwnProperty(nome_var)) {
        função = atualEscopo[nome_var];
        break;
      }
      atualEscopo = atualEscopo.__parent__;
    }
    
    if (typeof função !== 'function') {
      throw new Error(`${nome_var} is not a function`);
    }
    
    // Call the function with argument if provided
    if (arg_seq_optional) {
      const arg_value = arg_seq_optional[0](escopo);
      return função(escopo, arg_value);
    } else {
      return função(escopo);
    }
  }
)

// Function to set the expressão reference
const setExpressão = (expr) => {
  expressão = expr;
};

export { não, valor_constante, chamada_função_imediata, setExpressão };
