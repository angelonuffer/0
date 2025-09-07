// Syntax analyzer - Parsing expressions and language constructs
import { alternativa, sequência, opcional, vários, transformar, símbolo, operador } from '../combinadores/index.js';
import { operação } from '../combinadores/avançados.js';
import { espaço, nome, endereço, número, número_negativo, texto } from '../analisador_léxico/index.js';
import { avaliarSoma, avaliarSubtração, avaliarMultiplicação, avaliarDivisão, avaliarMaiorQue, avaliarMenorQue, avaliarMaiorOuIgual, avaliarMenorOuIgual, avaliarIgual, avaliarDiferente, avaliarE, avaliarOu, avaliarVariável, avaliarNegação, avaliarCondicional, avaliarTamanho, avaliarChaves, avaliarFatia, avaliarAtributo, avaliarParênteses } from '../analisador_semântico/index.js';

// Forward declaration for recursive references
let expressão;

const não = transformar(
  sequência(
    símbolo("!"),
    opcional(espaço),
    { analisar: código => expressão.analisar(código) },
  ),
  ([, , v]) => avaliarNegação(v),
)

const valor_constante = transformar(
  nome,
  avaliarVariável,
)

// Immediate function call - identifier directly followed by parentheses (no space)
const chamada_função_imediata = transformar(
  sequência(
    nome,
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
    return avaliarFatia(i_fn, opcionalFaixa);
  }
);

const tamanho = transformar(
  símbolo("[.]"),
  avaliarTamanho,
);

const chaves = transformar(
  símbolo("[*]"),
  avaliarChaves,
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
  ([, atributoNome]) => avaliarAtributo(atributoNome),
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
    return avaliarParênteses(valor_fn);
  }
);

const termo1 = alternativa(
  chamada_função_imediata,  // Try immediate function call first
  transformar(
    sequência(
      alternativa(
        valor_constante,
        parênteses,
        lista,
        número,
        texto,
      ),
      alternativa(
        // No space - allow all operations including function calls
        vários(
          alternativa(
            fatia,
            tamanho,
            chaves,
            atributo,
            chamada_função,
          ),
        ),
        // With space - only allow operations that are not function calls
        sequência(
          espaço,
          vários(
            alternativa(
              fatia,
              tamanho,
              chaves,
              atributo,
              // Deliberately exclude chamada_função here
            ),
          ),
        )
      )
    ),
    valor => {
      const [valor_fn, operações_info] = valor;

      return escopo => {
        let operações_fns;
        if (Array.isArray(operações_info) && operações_info.length >= 2 && operações_info[0] === undefined) {
          // This might be the "with space" case where we have [espaço, operations]
          operações_fns = operações_info[1] || [];
        } else if (Array.isArray(operações_info)) {
          // This is likely the "no space" case where operações_info is directly the operations array
          operações_fns = operações_info;
        } else {
          // Fallback
          operações_fns = [];
        }
        
        if (!Array.isArray(operações_fns) || operações_fns.length === 0) {
          return valor_fn(escopo);
        }
        return operações_fns.reduce(
          (resultado, operação_fn) => operação_fn(escopo, resultado),
          valor_fn(escopo)
        );
      };
    }
  )
)

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
    operador("*", avaliarMultiplicação),
    operador("/", avaliarDivisão),
  ),
);

const termo4 = operação(
  termo3,
  alternativa(
    operador("+", avaliarSoma),
    operador("-", avaliarSubtração),
  ),
);

const termo5 = operação(
  termo4,
  alternativa(
    operador(">=", avaliarMaiorOuIgual),
    operador("<=", avaliarMenorOuIgual),
    operador(">", avaliarMaiorQue),
    operador("<", avaliarMenorQue),
    operador("==", avaliarIgual),
    operador("!=", avaliarDiferente),
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
    return avaliarCondicional(condição_fn, valor_se_verdadeiro_fn, valor_se_falso_fn);
  }
);

// Now define expressão after all dependencies are available
expressão = operação(
  termo6,
  alternativa(
    operador("&", avaliarE),
    operador("|", avaliarOu),
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