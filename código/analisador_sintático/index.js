// Syntax analyzer - Parsing expressions and language constructs
// This module imports from sub-modules and wires everything together

// Import basic operations
import { não, valor_constante, chamada_função_imediata, setExpressão as setExpressãoBásico } from './básico.js';

// Import list operations
import { fatia, tamanho, chaves, lista, atributo, setExpressão as setExpressãoLista } from './lista.js';

// Import function operations
import { lambda, chamada_função, parênteses, setExpressão as setExpressãoFunção } from './função.js';

// Import term operations
import { getTermo1, getTermo2, getTermo3, getTermo4, getTermo5, getTermo6, setDependências } from './termos.js';

// Import expression and module parser
import { buildExpressão, _0, setGetTermo6, setExpressão as setExpressãoModule } from './expressão.js';

// Wire up all the dependencies
setDependências(null, {
  não,
  valor_constante,
  chamada_função_imediata,
  fatia,
  tamanho,
  chaves,
  lista,
  atributo,
  lambda,
  chamada_função,
  parênteses,
});

// Set getTermo6 for expression builder
setGetTermo6(getTermo6);

// Build the main expression
const expressão = buildExpressão();

// Set expression references in modules that need it
setExpressãoBásico(expressão);
setExpressãoLista(expressão);
setExpressãoFunção(expressão);
setExpressãoModule(expressão);
setDependências(expressão, {
  não,
  valor_constante,
  chamada_função_imediata,
  fatia,
  tamanho,
  chaves,
  lista,
  atributo,
  lambda,
  chamada_função,
  parênteses,
});

export { expressão, _0 };