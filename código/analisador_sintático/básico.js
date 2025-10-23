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
  ([, , expr]) => ({
    tipo: 'não',
    expressão: expr
  })
)

const depuração = transformar(
  sequência(
    símbolo("%"),
    opcional(espaço),
    código => expressão(código),
  ),
  ([, , expr]) => ({
    tipo: 'depuração',
    expressão: expr
  })
)

const valor_constante = transformar(
  nome,
  nome_var => ({
    tipo: 'variável',
    nome: nome_var
  })
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
  ([nome_var, , , arg_seq_optional, ,]) => ({
    tipo: 'chamada_função_imediata',
    nome: nome_var,
    argumento: arg_seq_optional ? arg_seq_optional[0] : undefined
  })
)

// Function to set the expressão reference
const setExpressão = (expr) => {
  expressão = expr;
};

export { não, depuração, valor_constante, chamada_função_imediata, setExpressão };
