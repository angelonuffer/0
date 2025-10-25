// Object operations - fatia, tamanho, chaves, objeto, atributo
import { alternativa, sequência, opcional, vários, transformar, símbolo } from '../combinadores/index.js';
import { espaço, nome, texto } from '../analisador_léxico/index.js';

// Forward declaration for recursive expressão reference
let expressão;

const fatia = transformar(
  sequência(
    símbolo("["),
    código => expressão(código),
    opcional(sequência(
      símbolo(":"),
      opcional(código => expressão(código)),
    )),
    símbolo("]"),
  ),
  valorSeq => {
    const [, índiceExpr, opcionalFaixa,] = valorSeq;
    const éFaixa = opcionalFaixa ? opcionalFaixa[0] !== undefined : false;
    const fimExpr = opcionalFaixa ? opcionalFaixa[1] : undefined;

    return {
      tipo: 'operação_fatia',
      índice: índiceExpr,
      fim: fimExpr,
      éFaixa: éFaixa
    };
  }
);

const tamanho = transformar(
  símbolo("[.]"),
  () => ({
    tipo: 'operação_tamanho'
  })
);

const chaves = transformar(
  símbolo("[*]"),
  () => ({
    tipo: 'operação_chaves'
  })
);

const lista = transformar(
  sequência(
    símbolo("["),
    opcional(espaço),
    vários(
      alternativa(
        sequência( // Spread syntax ...expression
          símbolo("..."),
          código => expressão(código),
          opcional(espaço),
        ),
        sequência( // Value-only (auto-indexed)
          código => expressão(código),
          opcional(espaço),
        ),
      ),
    ),
    símbolo("]")
  ),
  ([, , valores_vários,]) => {
    if (!valores_vários) {
      return {
        tipo: 'objeto',
        items: [],
        usarObjeto: false
      };
    }
    
    // Check if any spread operations exist
    const hasSpreads = valores_vários.some(v_seq => v_seq[0] === "...");
    
    const usarObjeto = hasSpreads;
    
    const items = valores_vários.map(v_alt => {
      const firstEl = v_alt[0];
      if (firstEl === "...") {
        return {
          tipo: 'espalhamento',
          expressão: v_alt[1]
        };
      } else {
        return {
          valor: v_alt[0]
        };
      }
    });
    
    return {
      tipo: 'objeto',
      items: items,
      usarObjeto: usarObjeto
    };
  }
);

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
        ),
        sequência( // Spread syntax ...expression
          símbolo("..."),
          código => expressão(código),
          opcional(espaço),
        ),
        sequência( // Value-only (auto-indexed)
          código => expressão(código),
          opcional(espaço),
        ),
      ),
    ),
    símbolo("}")
  ),
  ([, , valores_vários,]) => {
    if (!valores_vários) {
      return {
        tipo: 'objeto',
        items: [],
        usarObjeto: false
      };
    }
    
    // Check if we have any key-value pairs
    const hasKeyValuePairs = valores_vários.some(v_alt => 
      v_alt.length === 5 && v_alt[1] === ":"
    );
    
    // Check if we have any value-only items
    const hasValueOnlyItems = valores_vários.some(v_alt => 
      v_alt[0] !== "..." && !(v_alt.length === 5 && v_alt[1] === ":")
    );
    
    // Enforce strict separation: cannot mix keyed and keyless items
    if (hasKeyValuePairs && hasValueOnlyItems) {
      throw new Error("Syntax error: Cannot mix items with keys and items without keys in the same object. Use {} for objects with keys or [] for lists without keys.");
    }
    
    // Check if any spread operations exist
    const hasSpreads = valores_vários.some(v_seq => v_seq[0] === "...");
    
    const usarObjeto = hasKeyValuePairs || hasSpreads;
    
    const items = valores_vários.map(v_alt => {
      const firstEl = v_alt[0];
      if (firstEl === "...") {
        return {
          tipo: 'espalhamento',
          expressão: v_alt[1]
        };
      } else if (v_alt.length === 5 && v_alt[1] === ":") {
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
      } else {
        return {
          valor: v_alt[0]
        };
      }
    });
    
    return {
      tipo: 'objeto',
      items: items,
      usarObjeto: usarObjeto
    };
  }
);

const atributo = transformar(
  sequência(
    símbolo("."),
    nome,
  ),
  ([, atributoNome]) => ({
    tipo: 'operação_atributo',
    nome: atributoNome
  })
);

// Function to set the expressão reference
const setExpressão = (expr) => {
  expressão = expr;
};

export { fatia, tamanho, chaves, lista, objeto, atributo, setExpressão };
