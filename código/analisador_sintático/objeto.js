// Object parser: handles curly-brace object literals and attribute access
import { alternativa, sequência, opcional, vários, transformar, símbolo } from '../combinadores/index.js';
import { espaço, nome, texto } from '../analisador_léxico/index.js';
import { TIPO_AST } from '../constantes.js';

// Forward declaration for recursive expressão reference
let expressão;

const objeto = transformar(
  sequência(
    símbolo("{"),
    opcional(espaço),
    vários(
      alternativa(
        sequência( // Key-value pair
          alternativa( // Key can be nome, texto, or [expression]
            nome,
            texto,
            sequência(
              símbolo("["),
              código => expressão(código),
              símbolo("]"),
            )
          ),
          símbolo(":"),
          opcional(espaço),
          código => expressão(código),
          opcional(espaço),
          opcional(sequência(símbolo(","), opcional(espaço))),
        ),
        sequência( // Spread syntax ...expression
          símbolo("..."),
          código => expressão(código),
          opcional(espaço),
          opcional(sequência(símbolo(","), opcional(espaço))),
        ),
        sequência( // Shorthand property: { name } equivalent to { name: name }
          nome,
          opcional(espaço),
          opcional(sequência(símbolo(","), opcional(espaço))),
        ),
        sequência( // Value-only (auto-indexed) - parser will reject value-only entries for {} later
          código => expressão(código),
          opcional(espaço),
          opcional(sequência(símbolo(","), opcional(espaço))),
        ),
      ),
    ),
    símbolo("}")
  ),
  ([, , valores_vários,]) => {
    if (!valores_vários) {
      return {
        tipo: TIPO_AST.OBJETO,
        items: [],
        usarObjeto: true
      };
    }

    // Check if we have any value-only items (excluding spread and shorthand)
    const hasValueOnlyItems = valores_vários.some(v_alt => 
      v_alt[0] !== "..." && 
      !(v_alt.length === 6 && v_alt[1] === ":") &&
      !(v_alt.length === 3 && typeof v_alt[0] === 'string')
    );

    // Enforce strict separation: {} is ONLY for objects with keys, [] is ONLY for lists
    if (hasValueOnlyItems) {
      throw new Error("Syntax error: Lists must use [] syntax. The {} syntax is only for objects with key-value pairs.");
    }

    const items = valores_vários.map(v_alt => {
      const firstEl = v_alt[0];
      if (firstEl === "...") {
        return {
          tipo: TIPO_AST.ESPALHAMENTO,
          expressão: v_alt[1]
        };
      } else if (v_alt.length === 6 && v_alt[1] === ":") {
        const key_alt_result = v_alt[0];
        let chave;
        if (typeof key_alt_result === "string") {
          chave = key_alt_result;
        } else if (Array.isArray(key_alt_result)) {
          // It's a computed key [expression]
          chave = key_alt_result[1];
        } else {
          chave = key_alt_result;
        }
        return {
          chave: chave,
          valor: v_alt[3]
        };
      } else if (v_alt.length === 3 && typeof v_alt[0] === 'string') {
        // Shorthand property: { name } equivalent to { name: name }
        const nomeProp = v_alt[0];
        return {
          chave: nomeProp,
          valor: { tipo: TIPO_AST.VARIÁVEL, nome: nomeProp }
        };
      } else {
        return {
          valor: v_alt[0]
        };
      }
    });

    return {
      tipo: TIPO_AST.OBJETO,
      items: items,
      usarObjeto: true
    };
  }
);

const atributo = transformar(
  sequência(
    símbolo("."),
    nome,
  ),
  ([, atributoNome]) => ({
    tipo: TIPO_AST.OPERAÇÃO_ATRIBUTO,
    nome: atributoNome
  })
);

// Function to set the expressão reference
const setExpressão = (expr) => {
  expressão = expr;
};

export { objeto, atributo, setExpressão };

