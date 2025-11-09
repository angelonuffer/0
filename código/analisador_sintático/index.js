// Syntax analyzer - Parsing expressions and language constructs
// This module imports from sub-modules and wires everything together

// Import basic operations
import { não, depuração, valor_constante, chamada_função_imediata, setExpressão as setExpressãoBásico, setOperações } from './básico.js';

// Import object operations
import { fatia, tamanho, chaves, lista, objeto, atributo, setExpressão as setExpressãoObjeto } from './objeto.js';

// Import function operations
import { lambda, chamada_função, parênteses, setExpressão as setExpressãoFunção, setGetTermo6 as setGetTermo6Função } from './função.js';

// Import term operations
import { getTermo1, getTermo2, getTermo3, getTermo4, getTermo5, getTermo6, setDependências } from './termos.js';

// Import expression and module parser
import { buildExpressão, _0, setGetTermo6, setExpressão as setExpressãoModule } from './expressão.js';

// Wire up all the dependencies
setDependências(null, {
  não,
  depuração,
  valor_constante,
  chamada_função_imediata,
  fatia,
  tamanho,
  chaves,
  lista,
  objeto,
  atributo,
  lambda,
  chamada_função,
  parênteses,
});

// Set operations for chamada_função_imediata
setOperações({
  fatia,
  tamanho,
  chaves,
  atributo,
  chamada_função,
});

// Set getTermo6 for expression builder
setGetTermo6(getTermo6);

// Set getTermo6 for function operations
setGetTermo6Função(getTermo6);

// Build the main expression
const expressão = buildExpressão();

// Set expression references in modules that need it
setExpressãoBásico(expressão);
setExpressãoObjeto(expressão);
setExpressãoFunção(expressão);
setExpressãoModule(expressão);
setDependências(expressão, {
  não,
  depuração,
  valor_constante,
  chamada_função_imediata,
  fatia,
  tamanho,
  chaves,
  lista,
  objeto,
  atributo,
  lambda,
  chamada_função,
  parênteses,
});

export { expressão, _0 };