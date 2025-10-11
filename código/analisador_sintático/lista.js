// List operations - fatia, tamanho, chaves, lista, atributo
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
    const [, i_fn, opcionalFaixa,] = valorSeq;
    const faixa = opcionalFaixa ? opcionalFaixa[0] : undefined;
    const j_fn_opcional = opcionalFaixa ? opcionalFaixa[1] : undefined;

    return (escopo, valor) => {
      const i = i_fn(escopo);
      const j = j_fn_opcional ? j_fn_opcional(escopo) : undefined;

      if (typeof valor === "string") {
        if (faixa !== undefined || j !== undefined) {
          return valor.slice(i, j);
        } else {
          return valor.charCodeAt(i);
        }
      } else if (Array.isArray(valor)) {
        if (faixa !== undefined || j !== undefined) {
          return valor.slice(i, j);
        } else {
          return valor[i];
        }
      } else if (typeof valor === 'object' && valor !== null) {
        if (typeof i !== 'string' && typeof i !== 'number') {
          throw new Error(`Runtime Error: Object key must be a string or number, got type ${typeof i} for key '${i}'.`);
        }
        if (faixa !== undefined || j !== undefined) {
          // Check if this is a list object (has length property and numeric indices)
          if (typeof valor.length === 'number') {
            // Convert list object to array for slicing
            const arr = [];
            for (let idx = 0; idx < valor.length; idx++) {
              arr[idx] = valor[idx];
            }
            return arr.slice(i, j);
          } else {
            throw new Error(`Runtime Error: Slicing syntax not supported for object property access using key '${i}'.`);
          }
        }
        return valor[i];
      } else {
        if (valor === null || valor === undefined) {
          throw new Error(`Runtime Error: Cannot apply indexing/slicing to '${valor}'.`);
        }
        throw new Error(`Runtime Error: Cannot apply indexing/slicing to type '${typeof valor}' (value: ${String(valor).slice(0, 20)}).`);
      }
    };
  }
);

const tamanho = transformar(
  símbolo("[.]"),
  () => (escopo, valor) => valor.length,
);

const chaves = transformar(
  símbolo("[*]"),
  () => (escopo, objeto) => {
    const keys = Object.keys(objeto);
    
    // For real arrays, return all indices as strings
    if (Array.isArray(objeto)) {
      return keys;
    }
    
    // For list objects (objects with a length property), filter out numeric indices and length
    if (typeof objeto.length === 'number') {
      return keys.filter(key => key !== 'length' && !/^\d+$/.test(key));
    }
    
    // For regular objects, return all keys
    return keys;
  },
);

const lista = transformar(
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
  ([, , valores_vários,]) => escopo => {
    if (!valores_vários) return [];
    
    // Check if we have any key-value pairs
    const hasKeyValuePairs = valores_vários.some(v_alt => 
      v_alt.length === 5 && v_alt[1] === ":"
    );
    
    if (!hasKeyValuePairs) {
      // Check if any spread operations exist - use object implementation for spreads
      const hasSpreads = valores_vários.some(v_seq => v_seq[0] === "...");
      
      if (!hasSpreads) {
        // Use the original array-based implementation for simple lists without spreads
        return valores_vários.map(v_seq => {
          const expr_fn = v_seq[0];
          return expr_fn(escopo);
        });
      } else {
        // Use object-based implementation for lists with spreads to handle object spreads
        // (fall through to object implementation below)
      }
    }
    
    // Use object-based implementation for lists with keys
    const listScope = { __parent__: escopo };
    let autoIndex = 0;
    
    // First pass: declare all property names in the scope
    for (const v_alt of valores_vários) {
      const firstEl = v_alt[0];
      if (firstEl === "...") {
        continue;
      } else if (v_alt.length === 5 && v_alt[1] === ":") {
        const key_alt_result = v_alt[0];
        let chave;
        if (typeof key_alt_result === "string") {
          chave = key_alt_result;
        } else if (typeof key_alt_result === "function") {
          chave = key_alt_result(escopo);
        } else {
          const key_expr_fn = key_alt_result[1];
          chave = key_expr_fn(escopo);
        }
        listScope[chave] = undefined;
      } else {
        listScope[autoIndex] = undefined;
        autoIndex++;
      }
    }
    
    // Second pass: evaluate property values
    autoIndex = 0;
    const resultado = valores_vários.reduce((resultado, v_alt) => {
      const firstEl = v_alt[0];
      if (firstEl === "...") {
        const spread_expr_fn = v_alt[1];
        const spreadValue = spread_expr_fn(escopo);
        if (Array.isArray(spreadValue)) {
          spreadValue.forEach(valor => {
            resultado[autoIndex] = valor;
            autoIndex++;
          });
        } else if (typeof spreadValue === 'object' && spreadValue !== null && typeof spreadValue.length === 'number') {
          // For list objects, copy indexed items and named properties
          for (let idx = 0; idx < spreadValue.length; idx++) {
            resultado[autoIndex] = spreadValue[idx];
            autoIndex++;
          }
          // Copy named properties (not numeric indices or length)
          for (const key in spreadValue) {
            if (key !== 'length' && !/^\d+$/.test(key)) {
              resultado[key] = spreadValue[key];
            }
          }
        } else if (typeof spreadValue === 'object' && spreadValue !== null) {
          Object.assign(resultado, spreadValue);
        }
        return resultado;
      } else if (v_alt.length === 5 && v_alt[1] === ":") {
        const key_alt_result = v_alt[0];
        const val_expr_fn = v_alt[3];
        let chave;
        if (typeof key_alt_result === "string") {
          chave = key_alt_result;
        } else if (typeof key_alt_result === "function") {
          chave = key_alt_result(escopo);
        } else {
          const key_expr_fn = key_alt_result[1];
          chave = key_expr_fn(escopo);
        }
        const valor = val_expr_fn(listScope);
        listScope[chave] = valor;
        resultado[chave] = valor;
        return resultado;
      } else {
        const val_expr_fn = v_alt[0];
        const valor = val_expr_fn(listScope);
        listScope[autoIndex] = valor;
        resultado[autoIndex] = valor;
        autoIndex++;
        return resultado;
      }
    }, {});

    resultado.length = autoIndex;
    
    // Convert to real array if it only has numeric properties and length
    const hasNamedProps = Object.keys(resultado).some(key => 
      key !== 'length' && !/^\d+$/.test(key)
    );
    
    if (!hasNamedProps) {
      // Convert to real array
      const realArray = [];
      for (let i = 0; i < autoIndex; i++) {
        realArray[i] = resultado[i];
      }
      return realArray;
    }
    
    return resultado;
  }
);

const atributo = transformar(
  sequência(
    símbolo("."),
    nome,
  ),
  ([, atributoNome]) => (escopo, objeto) => objeto[atributoNome],
);

// Function to set the expressão reference
const setExpressão = (expr) => {
  expressão = expr;
};

export { fatia, tamanho, chaves, lista, atributo, setExpressão };
