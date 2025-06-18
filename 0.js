const alt = (...analisadores) => {
  if (analisadores.length === 0) {
    // Base case: no parsers left, so this 'alt' path fails to find a match.
    return código => [3, null, código];
  }
  const analisadorPrincipal = analisadores[0];
  const analisadoresRestantes = analisadores.slice(1);

  return código => {
    const [status, valor, resto] = analisadorPrincipal(código);
    if (status === 0) { // Current parser succeeded
      return [0, valor, resto];
    }
    // Current parser failed (status !== 0), try the rest.
    return alt(...analisadoresRestantes)(código);
  };
};

const seq = (...analisadores) => {
  if (analisadores.length === 0) {
    return código => [0, [], código]; // Success, an empty seq matches an empty sequence
  }
  const próximo_seq = seq(...analisadores.slice(1));
  return código => {
    const [status1, valor1, resto1] = analisadores[0](código);
    if (status1 !== 0) return [status1, valor1, código]; // Pass along the error object from valor1 and original 'código'
    const [status2, valor2, resto2] = próximo_seq(resto1);
    if (status2 !== 0) return [status2, valor2, código]; // Propagate error, original code
    return [0, [valor1, ...valor2], resto2]; // Both succeed
  };
}

const símbolo = (símbolo_esperado) => código => {
  if (código.startsWith(símbolo_esperado)) return [0, símbolo_esperado, código.slice(símbolo_esperado.length)];
  return [1, símbolo_esperado, código];
};

const regex = (expRegex) => código => {
  const valorMatch = código.match(expRegex);
  if (valorMatch && valorMatch.index === 0) return [0, valorMatch[0], código.slice(valorMatch[0].length)];
  return [2, expRegex.source, código];
};

const opcional = (analisador, valor_padrão) => código => {
  const [status, valor, resto] = analisador(código);
  // If analyzer succeeded with a non-null value, use it.
  if (status === 0 && valor !== null) return [0, valor, resto];
  // If analyzer failed (status != 0) OR succeeded but with a null value (e.g. vários matching nothing),
  // opcional succeeds by returning default value and original code for this opcional instance.
  // The 'código' returned here is the original 'código' passed to 'opcional',
  // because 'analisador' either failed on it or effectively returned it as 'resto'.
  return [0, valor_padrão, código];
};

// Corrected 'vários'
const vários = analisador => {
  const analisador_recursivo = código_atual => {
    // Try to parse one element
    const [status_elemento, valor_elemento, resto_após_elemento] = analisador(código_atual);

    // If the element parser failed OR if it succeeded but consumed no input
    if (status_elemento !== 0 || (status_elemento === 0 && resto_após_elemento === código_atual)) {
      // Base case for recursion: analisador didn't match or didn't consume.
      // 'vários' itself succeeds here, matching zero (more) elements.
      return [0, null, código_atual]; // Return null for value, and original code for this attempt
    }

    // Analisador matched one element AND consumed input. Try to match more.
    const [status_resto_vários, valor_resto_vários, resto_final_vários] = analisador_recursivo(resto_após_elemento);
    // status_resto_vários will always be 0 due to the base case [0, null, código_atual] of this recursive fn.

    if (valor_resto_vários === null) {
      // Recursive call matched no further elements.
      return [0, [valor_elemento], resto_após_elemento];
    } else {
      // Recursive call matched more elements.
      return [0, [valor_elemento, ...valor_resto_vários], resto_final_vários];
    }
  };
  return analisador_recursivo;
};

const transformar = (analisador, transformador) => código => {
  const [status, valor, resto] = analisador(código);
  if (status !== 0) return [status, valor, código]; // valor is already the error object from analisador
  return [0, transformador(valor), resto];
};

const operador = (literal, funcao) => transformar(
  símbolo(literal), // Símbolo will return [status, value, remainder]
  () => funcao // Transformador only called on success of símbolo
);

const operação = (termo, operadores) => {
  // Manually handle the transformation to correctly propagate errors from term/operadores
  return código => {
    const [status, valor, resto] = seq(
      termo,
      opcional(vários(seq(
        opcional(espaço),
        operadores,
        opcional(espaço),
        termo,
      )), []),
    )(código);

    if (status !== 0) return [status, valor, código];

    const [primeiroTermo, operaçõesSequenciais] = valor;

    if (operaçõesSequenciais.length === 0) return [0, primeiroTermo, resto];

    const fn = escopo =>
      operaçõesSequenciais.reduce(
        (resultado, valSeq) => {
          // valSeq is [maybeSpace1, opFunc, maybeSpace2, nextTermFunc]
          // or if optional spaces are not present, it might be shorter.
          // Assuming opcional returns default value (e.g. null or a specific marker) if space is not there.
          // And assuming seq returns array of values.
          // Let's get the operator and nextTerm more robustly.
          // The structure from seq is [valMaybeSpace1, valOperador, valMaybeSpace2, valProximoTermo]
          // where valMaybeSpace1 and valMaybeSpace2 could be the default from opcional (e.g. null).
          const operador = valSeq[1]; // The actual operator function from 'operadores' parser
          const próximoTermo = valSeq[3]; // The next term function
          return operador(resultado, próximoTermo(escopo));
        },
        primeiroTermo(escopo)
      );
    return [0, fn, resto];
  };
};

const nome = regex(/[a-zA-ZÀ-ÿ_][a-zA-ZÀ-ÿ0-9_]*/); // regex returns [status, value, remainder]

const endereço = regex(/\S+/); // regex returns [status, value, remainder]

// Matches one or more whitespace characters OR a single-line comment
const um_espaço_ou_comentário = alt(
  regex(/\s+/),
  seq(símbolo("//"), regex(/[^\n]*/), opcional(símbolo("\n")))
);

// Consumes multiple instances of whitespace blocks or comments
const espaço = vários(um_espaço_ou_comentário); // vários and um_espaço_ou_comentário handle status

const número = transformar(regex(/\d+/), v => () => parseInt(v)); // regex and transformar handle status

const texto = transformar(regex(/"([^"]*)"/), v => () => v.slice(1, -1)); // regex and transformar handle status

const não = transformar(
  seq(
    símbolo("!"), // símbolo returns [status, value, remainder]
    opcional(espaço), // opcional and espaço handle status
    código => expressão(código), // expressão will return [status, value, remainder]
  ),
  ([, , v]) => escopo => v(escopo) === 0 ? 1 : 0, // transformador called on success
)

const valor_constante = transformar(
  nome, // nome (regex) returns [status, value, remainder]
  v => escopo => {
    let atualEscopo = escopo;
    while (atualEscopo) {
      if (atualEscopo.hasOwnProperty(v)) {
        return atualEscopo[v];
      }
      atualEscopo = atualEscopo.__parent__;
    }
    // If variable not found in any scope, return undefined instead of throwing an error.
    // This allows expressions like 'x == 10' to evaluate to false if x is undefined.
    return undefined;
  }, // transformador called on success
)

// fatia needs to handle status from its internal expression calls
const fatia = código => {
  const [statusSeq, valorSeq, restoSeq] = seq(
    símbolo("["),
    código_interno => { // Wrapper for expression call
      const [statusExp, valorExp, restoExp] = expressão(código_interno);
      if (statusExp !== 0) return [statusExp, valorExp, código_interno];
      return [0, valorExp, restoExp];
    },
    opcional(seq(
      símbolo(":"),
      opcional(código_interno_opcional => { // Wrapper for optional expression call
        const [statusExpOpt, valorExpOpt, restoExpOpt] = expressão(código_interno_opcional);
        if (statusExpOpt !== 0) return [statusExpOpt, valorExpOpt, código_interno_opcional]; // Propagate error
        return [0, valorExpOpt, restoExpOpt];
      }),
    ), []), // Default for opcional if inner seq fails (or if opcional expression fails)
    símbolo("]"),
  )(código);

  if (statusSeq !== 0) return [statusSeq, valorSeq, código];

  const [, i_fn, [faixa, j_fn_opcional],] = valorSeq;
  const transformador = (escopo, valor) => {
    const i = i_fn(escopo);
    // j_fn_opcional could be the default from opcional (e.g. undefined or null) if its expression wasn't there or failed
    // or it could be the actual function if expression succeeded.
    const j = j_fn_opcional ? j_fn_opcional(escopo) : undefined;

    // First, handle cases where valor should support slice or indexing
    if (typeof valor === "string") {
      if (faixa !== undefined || j !== undefined) { // Slice operation
        return valor.slice(i, j); // j might be undefined for slice(i)
      } else { // Index access
        return valor.charCodeAt(i);
      }
    } else if (Array.isArray(valor)) {
      if (faixa !== undefined || j !== undefined) { // Slice operation
        return valor.slice(i, j); // j might be undefined for slice(i)
      } else { // Index access
        return valor[i];
      }
    } else if (typeof valor === 'object' && valor !== null) {
      // Object property access: valor[i] (where i is the key)
      // Ensure 'i' (the key) is a string or number, which are typical for object keys in JS.
      if (typeof i !== 'string' && typeof i !== 'number') {
        throw new Error(`Runtime Error: Object key must be a string or number, got type ${typeof i} for key '${i}'.`);
      }
      // Ensure no slice syntax (e.g., obj["key":] or obj["key":"endKey"]) is used for objects
      if (faixa !== undefined || j !== undefined) {
        // Or, if faixa is present but j is not, it implies obj["key":] which is also not standard.
        throw new Error(`Runtime Error: Slicing syntax not supported for object property access using key '${i}'.`);
      }
      return valor[i];
    } else {
      // valor is not a string, array, or object. Indexing or slicing is a type error.
      // Also handles cases where valor might be null or undefined from a previous operation.
      if (valor === null || valor === undefined) {
        throw new Error(`Runtime Error: Cannot apply indexing/slicing to '${valor}'.`);
      }
      throw new Error(`Runtime Error: Cannot apply indexing/slicing to type '${typeof valor}' (value: ${String(valor).slice(0,20)}).`);
    }
  };
  return [0, transformador, restoSeq];
};

const conteúdo_modelo = transformar(regex(/[^`$]+/), v => () => v); // regex and transformar handle status

// expressão_modelo needs to handle status from its internal expressão call
const expressão_modelo = código => {
  const [statusSeq, valorSeq, restoSeq] = seq(
    símbolo("${"),
    código_interno => { // Wrapper for expression call
      const [statusExp, valorExp, restoExp] = expressão(código_interno);
      if (statusExp !== 0) return [statusExp, valorExp, código_interno];
      return [0, valorExp, restoExp];
    },
    símbolo("}"),
  )(código);

  if (statusSeq !== 0) return [statusSeq, valorSeq, código];
  const [, valor_fn,] = valorSeq;
  return [0, escopo => valor_fn(escopo), restoSeq];
};

// modelo needs to handle status from its internal alt and vários calls
const modelo = código => {
  const [statusSeq, valorSeq, restoSeq] = seq(
    símbolo("`"),
    vários(
      alt(
        expressão_modelo, // expressão_modelo now returns [status, val, rem]
        conteúdo_modelo,  // conteúdo_modelo is a transformed regex, returns [status, val, rem]
      ),
    ),
    símbolo("`"),
  )(código);

  if (statusSeq !== 0) return [statusSeq, valorSeq, código];

  const [, conteúdo_fns,] = valorSeq; // conteúdo_fns is an array of functions from varios(alt(...))
  const transformador = escopo => conteúdo_fns.map(fn => {
    const valor2 = fn(escopo);
    if (typeof valor2 === "number") return String.fromCharCode(valor2);
    return valor2
  }).join("");
  return [0, transformador, restoSeq];
}

const tamanho = transformar(
  símbolo("[.]"), // símbolo returns [status, value, remainder]
  () => (escopo, valor) => valor.length, // transformador called on success
);

const atributos_objeto = transformar(
  símbolo("[*]"),
  () => (escopo, objeto) => Object.keys(objeto),
);

// lista needs to handle status from internal expressão calls
const lista = código => {
  const [statusSeq, valorSeq, restoSeq] = seq(
    símbolo("["),
    opcional(espaço),
    opcional(
      vários(
        seq(
          opcional(símbolo("..."), ""),
          código_interno => { // Wrapper for expression call
            const [statusExp, valorExp, restoExp] = expressão(código_interno);
            if (statusExp !== 0) return [statusExp, valorExp, código_interno];
            return [0, valorExp, restoExp];
          },
          opcional(símbolo(",")),
          opcional(espaço),
        )
      ),
    ),
    símbolo("]"),
  )(código);

  if (statusSeq !== 0) return [statusSeq, valorSeq, código];

  const [, , valores_seq,] = valorSeq; // valores_seq is the array from vários(seq(...))
  const transformador = escopo => valores_seq ? valores_seq.flatMap(v_seq => {
    // v_seq is [maybeEllipsis, expr_fn, maybeComma, maybeSpace]
    const isSpread = v_seq[0] === "...";
    const expr_fn = v_seq[1];
    return isSpread ? expr_fn(escopo) : [expr_fn(escopo)];
  }) : [];
  return [0, transformador, restoSeq];
};

// objeto needs to handle status from internal expressão calls
const objeto = código => {
  const [statusSeq, valorSeq, restoSeq] = seq(
    símbolo("{"),
    opcional(espaço),
    opcional(
      vários(
        alt(
          seq( // Key-value pair
            alt( // Key can be nome or [expression]
              nome,
              seq(
                símbolo("["),
                código_interno_key_expr => { // Wrapper for key expression
                  const [s, v, r] = expressão(código_interno_key_expr);
                  if (s !== 0) return [s, v, código_interno_key_expr];
                  return [0, v, r];
                },
                símbolo("]"),
              )
            ),
            símbolo(":"),
            opcional(espaço),
            código_interno_val_expr => { // Wrapper for value expression
              const [s, v, r] = expressão(código_interno_val_expr);
              if (s !== 0) return [s, v, código_interno_val_expr];
              return [0, v, r];
            },
            opcional(símbolo(",")),
            opcional(espaço),
          ),
          seq( // Spread syntax ...expression
            símbolo("..."),
            código_interno_spread_expr => { // Wrapper for spread expression
              const [s, v, r] = expressão(código_interno_spread_expr);
              if (s !== 0) return [s, v, código_interno_spread_expr];
              return [0, v, r];
            },
            opcional(símbolo(",")),
            opcional(espaço),
          ),
        ),
      ),
    ),
    símbolo("}"),
  )(código);

  if (statusSeq !== 0) return [statusSeq, valorSeq, código];

  const [, , valores_vários,] = valorSeq; // valores_vários is array from vários(alt(...))
  const transformador = escopo => {
    return valores_vários ? valores_vários.reduce((resultado, v_alt) => {
      // v_alt is the result of one of the alt branches in vários
      // It's either a sequence for key-value or a sequence for spread
      const firstEl = v_alt[0]; // Can be key_alt_result or "..."
      if (firstEl === "...") { // Spread: v_alt is ["...", expr_fn, maybeComma, maybeSpace]
        const spread_expr_fn = v_alt[1];
        return { ...resultado, ...spread_expr_fn(escopo) };
      } else { // Key-value: v_alt is [key_alt_result, ":", maybeSpace1, val_expr_fn, maybeComma, maybeSpace2]
        const key_alt_result = v_alt[0]; // This is from alt(nome, seq(...))
        const val_expr_fn = v_alt[3];

        let chave;
        if (typeof key_alt_result === "string") { // It was a 'nome'
          chave = key_alt_result;
        } else { // It was a seq for [expression]: key_alt_result is ["[", key_expr_fn, "]"]
          const key_expr_fn = key_alt_result[1];
          chave = key_expr_fn(escopo);
        }
        return { ...resultado, [chave]: val_expr_fn(escopo) };
      }
    }, {}) : {};
  };
  return [0, transformador, restoSeq];
};

const atributo = transformar(
  seq(
    símbolo("."), // símbolo returns [status, value, remainder]
    nome,          // nome (regex) returns [status, value, remainder]
  ),
  ([, atributoNome]) => (escopo, objeto) => objeto[atributoNome], // transformador called on success
);

// Helper for lambda parameters
const params_lista_com_parenteses = seq(
  símbolo("("),
  opcional(espaço),
  opcional(vários(seq(nome, opcional(espaço), opcional(símbolo(",")), opcional(espaço))), []),
  opcional(espaço),
  símbolo(")")
);

// Helper for naked parameters
const params_lista_sem_parenteses = vários(seq(nome, opcional(espaço)));

const lambda = transformar(
  seq(
    alt(
      params_lista_com_parenteses,
      params_lista_sem_parenteses
    ),
    opcional(espaço),
    símbolo("=>"),
    opcional(espaço),
    código => expressão(código)
  ),
  (valorBrutoLambda) => {
    const [paramsResultado, , , , corpoExprFunc] = valorBrutoLambda;

    let listaNomesParams = [];
    // Check if paramsResultado itself is an array and its first element is '(', indicating parenthesized list
    if (Array.isArray(paramsResultado) && paramsResultado[0] === '(') {
      if (paramsResultado[2]) {
        listaNomesParams = paramsResultado[2].map(paramSeq => paramSeq[0]);
      }
    } else { // Matched params_lista_sem_parenteses (or it was null/empty from varios)
      listaNomesParams = (paramsResultado || []).map(paramSeq => paramSeq[0]);
    }

    // The 'definition_scope' parameter here is the definition-time lexical scope.
    return definition_scope => {
      // This returned function is what gets stored as the value of the lambda.
      // 'caller_context' is the scope/object from where the function is called (passed as 'escopo' by 'chamada_função').
      // 'valoresArgs' are the arguments passed to the function.
      return (caller_context, ...valoresArgs) => {
        const fn_scope = { __parent__: definition_scope || null }; // Create new scope for function execution, linked to definition scope.
        listaNomesParams.forEach((nomeArg, i) => {
          fn_scope[nomeArg] = valoresArgs[i]; // Populate with arguments
        });
        // corpoExprFunc is the parsed body of the lambda. It expects a scope.
        // We pass fn_scope, so any free variables in corpoExprFunc will be resolved
        // against fn_scope (i.e., args) and then up the __parent__ chain to definition_scope.
        // caller_context is not directly used for the lexical resolution of corpoExprFunc here,
        // which aligns with lexical scoping principles (variables resolved where function is defined, not where it's called).
        return corpoExprFunc(fn_scope);
      };
    };
  }
);

// chamada_função needs to handle status from internal expressão calls
const chamada_função = código => {
  const [statusSeq, valorSeq, restoSeq] = seq(
    símbolo("("),
    opcional(espaço),
    opcional(
      vários(
        seq(
          código_interno_arg_expr => { // Wrapper for argument expression
            const [s, v, r] = expressão(código_interno_arg_expr);
            if (s !== 0) return [s, v, código_interno_arg_expr];
            return [0, v, r];
          },
          opcional(espaço),
          opcional(símbolo(",")),
          opcional(espaço),
        )
      ),
      [] // Default for opcional (arguments)
    ),
    opcional(espaço),
    símbolo(")"),
  )(código);

  if (statusSeq !== 0) return [statusSeq, valorSeq, código];

  const [, , args_seq,] = valorSeq; // args_seq is array from varios(seq(expr_fn, ...))
  const transformador = (escopo, função) => {
    return função(escopo, ...args_seq.map(arg_val_seq => arg_val_seq[0](escopo)));
  };
  return [0, transformador, restoSeq];
};

// parênteses needs to handle status from internal declarações_constantes and expressão calls
const parênteses = código => {
  const [statusSeq, valorSeq, restoSeq] = seq(
    símbolo("("),
    opcional(espaço),
    opcional(código_decl => { // Wrapper for declarações_constantes
        const [s,v,r] = declarações_constantes(código_decl);
        if (s !== 0) return [s, v, código_decl];
        return [0,v,r];
    }, []), // Default for opcional
    opcional(espaço),
    código_expr => { // Wrapper for expressão
        const [s,v,r] = expressão(código_expr);
        if (s !== 0) return [s, v, código_expr];
        return [0,v,r];
    },
    opcional(espaço),
    símbolo(")"),
  )(código);

  if (statusSeq !== 0) return [statusSeq, valorSeq, código];

  const [, , constantes_val, , valor_fn,] = valorSeq;
  // constantes_val is from opcional(declarações_constantes, [])
  // valor_fn is from expressão

  const transformador = outer_scope_param => {
    const escopoParenteses = { __parent__: outer_scope_param || null };
    // constantes_val is from opcional(declarações_constantes, [])
    // It's an array of items like: [[nome_val, maybeSpace1, "=", maybeSpace2, valorAtribuição_fn], maybeOuterSpace]
    // So, the actual declaration is the first element of each item.
    if (constantes_val && constantes_val.length > 0) {
      // First pass: Add placeholders for constants defined in this parenthesized block
      for (const decl_const_seq of constantes_val) {
        // decl_const_seq itself is an array like [[ [nome, s1, '=', s2, expr_fn] ], s_outer]
        // We need the inner array: [nome, s1, '=', s2, expr_fn]
        const [declaration_details_array] = decl_const_seq;
        const [nome_val, , , , /* valor_const_fn */] = declaration_details_array;
        escopoParenteses[nome_val] = undefined; // Placeholder
      }
      // Second pass: Evaluate and assign actual values
      for (const decl_const_seq of constantes_val) {
        const [declaration_details_array] = decl_const_seq;
        const [nome_val, , , , valor_const_fn] = declaration_details_array;
        escopoParenteses[nome_val] = valor_const_fn(escopoParenteses);
      }
    }
    return valor_fn(escopoParenteses);
  };
  return [0, transformador, restoSeq];
};

// termo1 needs to handle status from its components
const termo1 = código => {
  const [statusSeq, valorSeq, restoSeq] = seq(
    alt( // alt handles status
      valor_constante, // valor_constante (transformed nome) handles status
      parênteses,    // parênteses handles status
    ),
    opcional(espaço), // opcional and espaço handle status
    vários( // vários handles status
      alt( // alt handles status
        fatia,          // fatia handles status
        tamanho,        // tamanho (transformed símbolo) handles status
        atributos_objeto, // atributos_objeto (transformed símbolo) handles status
        atributo,       // atributo (transformed seq) handles status
        chamada_função, // chamada_função handles status
      ),
    ),
  )(código);

  if (statusSeq !== 0) return [statusSeq, valorSeq, código];

  const [valor_fn, , operações_fns] = valorSeq;
  // valor_fn is from alt(valor_constante, parênteses)
  // operações_fns could be null if vários(alt(...)) matches nothing.

  const transformador = escopo => {
    // If operações_fns is null (no accessors like .slice, .length after the primary term),
    // then just return the value of the primary term.
    if (!operações_fns) {
      return valor_fn(escopo);
    }
    return operações_fns.reduce(
      (resultado, operação_fn) => operação_fn(escopo, resultado),
      valor_fn(escopo) // Initial value from valor_constante or parênteses
    );
  };
  return [0, transformador, restoSeq];
};

// New termo2 with lambda prioritized
// termo1, número, não, texto, modelo, lista, objeto, valor_constante, parênteses must be defined before this line.
// lambda is now also defined before this line.
const termo2 = alt(
  lambda,
  termo1,
  número,
  não,
  texto,
  modelo,
  lista,
  objeto,
  valor_constante, // valor_constante is often a component of termo1, keep for direct use
  parênteses      // parênteses is often a component of termo1, keep for direct use
);

const termo3 = operação( // operação handles status propagation
  termo2, // termo2 (alt) handles status
  alt( // alt handles status
    operador("*", (v1, v2) => v1 * v2), // operador (transformed símbolo) handles status
    operador("/", (v1, v2) => v1 / v2),
  ),
);

const termo4 = operação( // operação handles status propagation
  termo3, // termo3 (operação) handles status
  alt( // alt handles status
    operador("+", (v1, v2) => v1 + v2), // operador handles status
    operador("-", (v1, v2) => v1 - v2),
  ),
);

const termo5 = operação( // operação handles status propagation
  termo4, // termo4 (operação) handles status
  alt( // alt handles status
    operador(">=", (v1, v2) => v1 >= v2 ? 1 : 0), // operador handles status
    operador("<=", (v1, v2) => v1 <= v2 ? 1 : 0),
    operador(">", (v1, v2) => v1 > v2 ? 1 : 0),
    operador("<", (v1, v2) => v1 < v2 ? 1 : 0),
    operador("==", (v1, v2) => v1 === v2 ? 1 : 0),
    operador("!=", (v1, v2) => v1 !== v2 ? 1 : 0),
  ),
);

// termo6 needs to handle status from internal expressão calls
const termo6 = código => {
  const [statusSeq, valorSeq, restoSeqOuter] = seq(
    termo5, // termo5 (operação) handles status
    opcional(seq( // opcional and seq handle status
      opcional(espaço),
      símbolo("?"),
      opcional(espaço),
      código_true_expr => { // Wrapper for true expression
        const [s,v,r] = expressão(código_true_expr);
        if (s !== 0) return [s,v,código_true_expr];
        return [0,v,r];
      },
      opcional(espaço),
      símbolo(":"),
      opcional(espaço),
      código_false_expr => { // Wrapper for false expression
        const [s,v,r] = expressão(código_false_expr);
        if (s !== 0) return [s,v,código_false_expr];
        return [0,v,r];
      },
    )),
  )(código);

  if (statusSeq !== 0) return [statusSeq, valorSeq, código];

  const [condição_fn, resto_opcional_val] = valorSeq;
  // resto_opcional_val is the result from opcional(seq(...))
  // If ternary exists, it's an array like [maybeSpace1, "?", maybeSpace2, true_fn, maybeSpace3, ":", maybeSpace4, false_fn]
  // If not, it's the default value from opcional (e.g., null or undefined).

  if (!resto_opcional_val) return [0, condição_fn, restoSeqOuter]; // No ternary part

  const [, , , valor_se_verdadeiro_fn, , , , valor_se_falso_fn] = resto_opcional_val;
  const transformador = escopo => condição_fn(escopo) !== 0 ? valor_se_verdadeiro_fn(escopo) : valor_se_falso_fn(escopo);
  return [0, transformador, restoSeqOuter];
};

const expressão = operação( // operação handles status propagation
  termo6, // termo6 handles status
  alt( // alt handles status
    operador("&", (v1, v2) => v1 !== 0 ? v2 : 0), // operador handles status
    operador("|", (v1, v2) => v1 !== 0 ? v1 : v2),
  ),
);

const raw_expression_capture = código => {
    const [status_expr, valor_expr_fn, resto_expr] = expressão(código);

    if (status_expr !== 0) {
        return [status_expr, valor_expr_fn, código]; // Propagate error
    }

    const expressão_str_capturada = código.substring(0, código.length - resto_expr.length);
    return [0, { valor_fn: valor_expr_fn, str: expressão_str_capturada.trim() }, resto_expr];
};

const debug_command = transformar(
  seq(
    símbolo("$"),
    opcional(espaço),
    raw_expression_capture
  ),
  (seq_result) => { // seq_result is [ "$", maybeSpaceValue, { valor_fn, str } ]
    const { valor_fn, str } = seq_result[2]; // Get the object from raw_expression_capture
    return (escopo) => {
      const valor_calculado = valor_fn(escopo);
      console.log(`$ ${str} = ${JSON.stringify(valor_calculado)}`);
      return { type: 'debug', expression: str, value: valor_calculado }; // Return marker
    };
  }
);

// declarações_constantes uses vários and seq, and internal expressão needs wrapping
const const_declaration_seq = seq(
  nome,
  opcional(espaço),
  símbolo("="),
  opcional(espaço),
  código_const_expr => {
    const [s,v,r] = expressão(código_const_expr);
    if (s !== 0) return [s,v,código_const_expr];
    return [0,v,r];
  }
);

const declarações_constantes = vários(
  seq(
    alt(
      const_declaration_seq,
      debug_command
    ),
    espaço
  )
);


const _0 = código => {
  const [statusSeq, valorSeq, restoSeq] = seq(
    opcional(espaço), // opcional and espaço handle status
    opcional(vários( // opcional and vários handle status
      seq( // seq handles status
        seq( // Inner seq for "name # address"
          nome, // nome (regex) handles status
          opcional(espaço),
          símbolo("#"), // símbolo handles status
          opcional(espaço),
          endereço, // endereço (regex) handles status
        ),
        espaço, // espaço handles status
      ),
    ), []), // Default for opcional (importações)
    opcional(vários( // opcional and vários handle status
      seq( // seq handles status
        seq( // Inner seq for "name @ address"
          nome, // nome (regex) handles status
          opcional(espaço),
          símbolo("@"), // símbolo handles status
          opcional(espaço),
          endereço, // endereço (regex) handles status
        ),
        espaço, // espaço handles status
      ),
    ), []), // Default for opcional (carregamentos)
    opcional(espaço),
    opcional(declarações_constantes, []), // opcional and declarações_constantes (vários) handle status
    opcional(espaço),
    expressão, // expressão (operação) handles status
    opcional(espaço), // Consume trailing spaces/comments after the main expression
  )(código);

  // if (statusSeq !== 0) return [statusSeq, valorSeq, código];

  // valorSeq is [maybeSpace1, importaçõesDetectadas_val, carregamentosDetectadas_val, maybeSpace2, atribuições_val, maybeSpace3, valor_fn_expr]
  const [, importaçõesDetectadas_val, carregamentosDetectadas_val, , atribuições_val, , valor_fn_expr] = valorSeq;
  const importações = importaçõesDetectadas_val.map(([[nome, , , , endereço]]) => [nome, endereço])
  const carregamentos = carregamentosDetectadas_val.map(([[nome, , , , endereço]]) => [nome, endereço])

  return [statusSeq, [importações, carregamentos, outer_scope_param => {
    // Create a new scope, blockScope, that starts with the outer_scope (from imports, file loads, etc.).
    const blockScope = { __parent__: outer_scope_param || null };

    // First pass: Iterate over all constant declarations (atribuições_val).
    // For each declaration `nome_val = ...`, add `nome_val` to `blockScope` with a placeholder value (e.g., undefined).
    // This ensures that when the Right-Hand Side (RHS) of any assignment in this block is evaluated,
    // the scope provided to it will already have all the names declared in this block.
    // This is crucial for recursive functions, as the function's own name will be in the scope
    // that its body captures.
    // atribuições_val is an array of items where each item is:
    // [ actual_item, maybeOuterSpace ]
    // actual_item is either:
    //   - for const declarations: [nome_val, maybeSpace1, "=", maybeSpace2, valorAtribuição_fn]
    //   - for debug commands: debug_fn (a function)

    // First pass for placeholders:
    for (const atrib_ou_debug_item of atribuições_val) {
        const actual_item = atrib_ou_debug_item[0];
        // Check if it's a const declaration (an array with specific structure)
        if (Array.isArray(actual_item) && actual_item.length === 5 && actual_item[2] === '=') {
            const [nome_val] = actual_item; // actual_item is [nome_val, s1, '=', s2, expr_fn]
            blockScope[nome_val] = undefined;
        }
    }

    // Second pass for evaluation and assignment/execution:
    for (const atrib_ou_debug_item of atribuições_val) {
        const actual_item = atrib_ou_debug_item[0];
        // Check if it's a const declaration
        if (Array.isArray(actual_item) && actual_item.length === 5 && actual_item[2] === '=') {
            const [nome_val, , , , valorAtribuição_fn] = actual_item;
            blockScope[nome_val] = valorAtribuição_fn(blockScope);
        } else { // It's a debug command (a function)
            const debug_fn = actual_item;
            debug_fn(blockScope); // Execute the debug command
        }
    }

    // Finally, the main expression of the program (valor_fn_expr) is evaluated using this
    // fully resolved `blockScope`.
    return valor_fn_expr(blockScope);
  }], restoSeq]
};

export default _0