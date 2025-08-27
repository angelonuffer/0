// Syntax analyzer - Parsing expressions and language constructs
import { alternativa, sequência, opcional, vários, transformar, símbolo, operador } from '../combinadores/index.js';
import { operação } from '../combinadores/avançados.js';
import { espaço, nome, endereço, número, número_negativo, texto } from '../analisador_léxico/index.js';

// Forward declaration for recursive references
let expressão;

const não = transformar(
  sequência(
    símbolo("!"),
    opcional(espaço),
    { analisar: código => expressão.analisar(código) },
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

const fatia = transformar(
  sequência(
    símbolo("["),
    { analisar: código => expressão.analisar(código) },
    opcional(sequência(
      símbolo(":"),
      opcional({ analisar: código => expressão.analisar(código) }),
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
          alternativa( // Key can be nome or [expression]
            nome,
            sequência(
              símbolo("["),
              { analisar: código => expressão.analisar(código) },
              símbolo("]"),
            )
          ),
          símbolo(":"),
          opcional(espaço),
          { analisar: código => expressão.analisar(código) },
          opcional(espaço),
        ),
        sequência( // Spread syntax ...expression
          símbolo("..."),
          { analisar: código => expressão.analisar(código) },
          opcional(espaço),
        ),
        sequência( // Value-only (auto-indexed)
          { analisar: código => expressão.analisar(código) },
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

const lambda = transformar(
  sequência(
    nome,
    opcional(espaço),
    símbolo("=>"),
    opcional(espaço),
    { analisar: código => expressão.analisar(código) }
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
        { analisar: código => expressão.analisar(código) },
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
    { analisar: código => expressão.analisar(código) },
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

const termo1 = transformar(
  sequência(
    alternativa(
      valor_constante,
      parênteses,
      lista,
      número,
      texto,
    ),
    opcional(espaço),
    vários(
      alternativa(
        fatia,
        tamanho,
        chaves,
        atributo,
        chamada_função,
      ),
    ),
  ),
  valor => {
    const [valor_fn, , operações_fns] = valor;

    return escopo => {
      if (operações_fns.length === 0) {
        return valor_fn(escopo);
      }
      return operações_fns.reduce(
        (resultado, operação_fn) => operação_fn(escopo, resultado),
        valor_fn(escopo)
      );
    };
  }
);

const termo2 = alternativa(
  lambda,
  termo1,
  número_negativo,
  não,
  valor_constante,
  parênteses
);

const termo3 = operação(
  termo2,
  alternativa(
    operador("*", (v1, v2) => {
      // If one operand is a list and the other is a string, perform join
      if (Array.isArray(v1) && typeof v2 === "string") {
        // Special case: when joining with empty string, convert numbers to characters
        if (v2 === "") {
          return v1.map(item => typeof item === "number" ? String.fromCharCode(item) : item).join(v2);
        }
        return v1.join(v2);
      }
      if (typeof v1 === "string" && Array.isArray(v2)) {
        // Special case: when joining with empty string, convert numbers to characters
        if (v1 === "") {
          return v2.map(item => typeof item === "number" ? String.fromCharCode(item) : item).join(v1);
        }
        return v2.join(v1);
      }
      // Check for list objects (with length property and numeric indices)
      if (typeof v1 === "object" && v1 !== null && typeof v1.length === "number" && typeof v2 === "string") {
        const arr = [];
        for (let i = 0; i < v1.length; i++) {
          arr.push(v1[i]);
        }
        // Special case: when joining with empty string, convert numbers to characters
        if (v2 === "") {
          return arr.map(item => typeof item === "number" ? String.fromCharCode(item) : item).join(v2);
        }
        return arr.join(v2);
      }
      if (typeof v1 === "string" && typeof v2 === "object" && v2 !== null && typeof v2.length === "number") {
        const arr = [];
        for (let i = 0; i < v2.length; i++) {
          arr.push(v2[i]);
        }
        // Special case: when joining with empty string, convert numbers to characters
        if (v1 === "") {
          return arr.map(item => typeof item === "number" ? String.fromCharCode(item) : item).join(v1);
        }
        return arr.join(v1);
      }
      // Otherwise, perform numeric multiplication
      return v1 * v2;
    }),
    operador("/", (v1, v2) => {
      // If both operands are strings, perform string split
      if (typeof v1 === "string" && typeof v2 === "string") {
        return v1.split(v2);
      }
      // Otherwise, perform numeric division
      return v1 / v2;
    }),
  ),
);

const termo4 = operação(
  termo3,
  alternativa(
    operador("+", (v1, v2) => v1 + v2),
    operador("-", (v1, v2) => v1 - v2),
  ),
);

const termo5 = operação(
  termo4,
  alternativa(
    operador(">=", (v1, v2) => v1 >= v2 ? 1 : 0),
    operador("<=", (v1, v2) => v1 <= v2 ? 1 : 0),
    operador(">", (v1, v2) => v1 > v2 ? 1 : 0),
    operador("<", (v1, v2) => v1 < v2 ? 1 : 0),
    operador("==", (v1, v2) => v1 === v2 ? 1 : 0),
    operador("!=", (v1, v2) => v1 !== v2 ? 1 : 0),
  ),
);

const termo6 = transformar(
  sequência(
    termo5,
    opcional(sequência(
      opcional(espaço),
      símbolo("?"),
      opcional(espaço),
      { analisar: código => expressão.analisar(código) },
      opcional(espaço),
      símbolo(":"),
      opcional(espaço),
      { analisar: código => expressão.analisar(código) },
    ), undefined)
  ),
  valor => {
    const [condição_fn, resto_opcional_val] = valor;

    if (!resto_opcional_val) return condição_fn;

    const [, , , valor_se_verdadeiro_fn, , , , valor_se_falso_fn] = resto_opcional_val;
    return escopo => condição_fn(escopo) !== 0 ? valor_se_verdadeiro_fn(escopo) : valor_se_falso_fn(escopo);
  }
);

// Now define expressão after all dependencies are available
expressão = operação(
  termo6,
  alternativa(
    operador("&", (v1, v2) => v1 !== 0 ? v2 : 0),
    operador("|", (v1, v2) => v1 !== 0 ? v1 : v2),
  ),
);

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
      expressão,
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

export { expressão, _0 };