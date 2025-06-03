function stripLeadingWhitespaceAndComments(código) {
  let current_code = código;
  let made_change;
  do {
    made_change = false;
    // Strip whitespace
    let match = current_code.match(/^\s+/);
    if (match) {
      current_code = current_code.substring(match[0].length);
      made_change = true;
    }
    // Strip // comments, including the newline character
    match = current_code.match(/^\/\/[^\n]*(\n)?/);
    if (match) {
      current_code = current_code.substring(match[0].length);
      made_change = true;
    }
  } while (made_change);
  return current_code;
}

const alt = (...analisadores) => {
  if (analisadores.length === 0) return código => [null, código]; // Should not happen with new errors
  return código => {
    let lastError = null;
    for (const analisador of analisadores) {
      const [valor, resto] = analisador(código);
      if (valor && valor.error) {
        lastError = [valor, resto]; // Keep the error object and original code
        // Continue to allow other parsers to try, last error will be from the "most specific" or last attempted parse
      } else if (valor !== null) {
        return [valor, resto]; // Success
      } else {
        // This case handles the [null, code] return for non-matching optional, which is not an error.
        // However, if all parsers return this, it's effectively a "no match" scenario.
        // We need a way to distinguish this from a hard error.
        // For now, if a specific error object was captured, that takes precedence.
        // If all return [null, code] (e.g. all are optional and none match), then alt should also return [null, code]
        // to indicate no match without it being a syntax error.
        // If lastError is null here, it means the parser returned [null, code]
        if (!lastError) {
          lastError = [null, código]; // Default to a generic non-match if no specific error was set
        }
      }
    }
    return lastError || [null, código]; // Return last captured error, or generic non-match
  };
}

const seq = (...analisadores) => {
  if (analisadores.length === 0) {
    return código => [[], código];
  }
  return código => {
    const resultados = [];
    let código_atual = código;
    for (const analisador of analisadores) {
      const [valor, resto] = analisador(código_atual);
      if (valor && valor.error) {
        return [valor, código]; // Propagate error immediately, return original code
      }
      if (valor === null) {
        // This indicates a non-match, which in a sequence is an error unless handled by optional.
        // For simplicity, let's assume seq expects all its components to match.
        // A more robust system might need to differentiate between "expected non-match" (optional) and "unexpected non-match".
        // For now, treat as a generic failure if no specific error object was returned by the failing parser.
        return [{ error: true, message: "Sequence component failed to match", code: código_atual }, código];
      }
      resultados.push(valor);
      código_atual = resto;
    }
    return [resultados, código_atual];
  };
}

const símbolo_original = código_input => símbolo_val => { // Keep original logic but structure for easy wrapping
  if (código_input.startsWith(símbolo_val)) return [símbolo_val, código_input.slice(símbolo_val.length)];
  return [null, código_input];
};

const símbolo = valor_símbolo => código_original => {
    const código = stripLeadingWhitespaceAndComments(código_original);
    // Ensure original `símbolo` logic is correctly called
    if (código.startsWith(valor_símbolo)) return [valor_símbolo, código.slice(valor_símbolo.length)];
    // Return an error object on failure to match token
    const found = código.slice(0, 20).split(/\s/)[0]; // Show what was found instead
    return [{ error: true, message: `Expected token '${valor_símbolo}' but found '${found}...'`, code: código }, código_original];
};

const regex_original = código_input => regex_val => { // Keep original logic for easy wrapping
  const valor = código_input.match(regex_val);
  if (valor && valor.index === 0) return [valor[0], código_input.slice(valor[0].length)];
  return [null, código_input];
};

const regex = valor_regex => código_original => {
    const código = stripLeadingWhitespaceAndComments(código_original);
    // Ensure original `regex` logic is correctly called
    const match = código.match(valor_regex);
    if (match && match.index === 0) return [match[0], código.slice(match[0].length)];
    // Return an error object on failure to match token
    const found = código.slice(0, 20).split(/\s/)[0]; // Show what was found instead
    return [{ error: true, message: `Expected regex '${valor_regex}' but found '${found}...'`, code: código }, código_original];
};

const opcional = (analisador, valor_padrão) => código => {
  const [valor, resto] = analisador(código);
  // If 'valor' is null (parser didn't match traditionally)
  // OR if 'valor' is an error object (parser failed with a structured error)
  if (valor === null || (typeof valor === 'object' && valor !== null && valor.error === true)) {
    return [valor_padrão, código]; // Return default value, and original code position
  }
  return [valor, resto]; // Successful parse by 'analisador', or 'analisador' returned a non-error, non-null value
};

const vários = analisador => código => {
  const resultados = [];
  let código_atual = código;

  while (true) {
    const [valor, resto] = analisador(código_atual);

    if (valor && valor.error) {
      // An error occurred in the sub-parser.
      // If we haven't collected any results yet, 'vários' fails (returns null, original code).
      // If we have collected results, then 'vários' succeeds with what it has.
      return resultados.length > 0 ? [resultados, código_atual] : [null, código];
    }

    if (valor === null) {
      // Sub-parser didn't match (not an error, just no match).
      // If we haven't collected any results yet, 'vários' fails.
      // If we have collected results, then 'vários' succeeds with what it has.
      return resultados.length > 0 ? [resultados, código_atual] : [null, código];
    }

    // Success, got a value
    resultados.push(valor);

    // Critical check for infinite loop: if parser succeeded but didn't consume input.
    if (código_atual === resto) {
      // If it matched but consumed nothing (e.g., a regex like /a*/ on "bbb" or "" on "")
      // And we are in this loop, it means 'valor' is not null and not an error.
      // This indicates a parser that can successfully match zero-length input.
      // `vários` should not loop infinitely on such a parser.
      // It should return the results obtained so far (which includes the current zero-length match).
      return [resultados, código_atual];
    }
    código_atual = resto;
    // If código_atual becomes empty and the parser can't match empty string,
    // it will result in valor === null in the next iteration, exiting the loop.
  }
  // The loop is infinite (`while(true)`) but logic inside handles all exits.
  // This line should technically be unreachable. If somehow reached, implies empty.
  // return resultados.length > 0 ? [resultados, código_atual] : [null, código]; // Fallback, though prior returns should cover.
};

const transformar = (analisador, transformador_fn) => código => {
  const [valor_parsed, resto] = analisador(código);

  // If the underlying parser failed (returned null or a structured error object),
  // 'transformar' should propagate this failure directly, without calling the transformador_fn.
  if (valor_parsed === null || (typeof valor_parsed === 'object' && valor_parsed !== null && valor_parsed.error === true)) {
    // It's important to return the 'resto' from the analisador's attempt if it was an error object,
    // or 'código' if it was a simple null non-match, though 'resto' for errors is often original 'código'.
    // For consistency and to ensure 'resto' reflects what 'analisador' determined:
    return [valor_parsed, resto];
  }

  // If valor_parsed is valid, then call the transformador_fn
  return [transformador_fn(valor_parsed), resto];
};

const operador = (literal, funcao) => transformar(
  símbolo(literal),
  () => funcao
);

const operação = (termo, operadores) => transformar(
  seq(
    termo,
    opcional(vários(seq(
      operadores,
      termo,
    )), []),
  ),
  ([primeiroTermo, operaçõesSequenciais]) => {
    if (operaçõesSequenciais.length === 0) return primeiroTermo;
    return escopo => 
      operaçõesSequenciais.reduce(
        (resultado, [operador, próximoTermo]) => // Adjusted destructuring
          operador(resultado, próximoTermo(escopo)),
        primeiroTermo(escopo)
      );
  },
);

const nome = regex(/[a-zA-ZÀ-ÿ_][a-zA-ZÀ-ÿ0-9_]*/);

const endereço = regex(/\S+/);

const número = transformar(regex(/\d+/), v => () => parseInt(v));

const texto = transformar(regex(/"([^"]*)"/), v => () => v.slice(1, -1));

const não = transformar(
  seq(
    símbolo("!"),
    código => expressão(código),
  ),
  ([, v]) => escopo => v(escopo) === 0 ? 1 : 0,
)

const valor_constante = transformar(
  nome,
  v_nome => escopo => {
      const looked_up_value = escopo[v_nome];
      console.log(`DEBUG_VAL_CONST: Looking up '${v_nome}'. Found (type):`, typeof looked_up_value);
      // To avoid overly verbose logs for functions:
      // if (typeof looked_up_value !== 'function') {
      //    console.log(`DEBUG_VAL_CONST: Value for '${v_nome}':`, looked_up_value);
      // } else {
      //    console.log(`DEBUG_VAL_CONST: Value for '${v_nome}' is a function.`);
      // }
      return looked_up_value;
  }
)

const fatia = transformar(
  seq(
    símbolo("["),
    código => expressão(código),
    opcional(seq(
      símbolo(":"),
      opcional(código => expressão(código)),
    ), []),
    símbolo("]"),
  ),
  ([, i, [faixa, j]]) => (escopo, valor) => {
    if (j !== undefined) return valor.slice(i(escopo), j(escopo))
    if (faixa !== undefined) return valor.slice(i(escopo))
    if (typeof valor === "string") return valor.charCodeAt(i(escopo));
    return valor[i(escopo)];
  },
);

const conteúdo_modelo = transformar(regex(/[^`$]+/), v => () => v);

const expressão_modelo = transformar(
  seq(
    símbolo("${"),
    código => expressão(código),
    símbolo("}"),
  ),
  ([, valor]) => escopo => valor(escopo),
);

const modelo = transformar(
  seq(
    símbolo("`"),
    opcional(vários( // Wrap varios with opcional and default to []
      alt(
        expressão_modelo,
        conteúdo_modelo,
      ),
    ), []),
    símbolo("`"),
  ),
  ([, conteúdo,]) => escopo => conteúdo.map(valor => { // conteúdo is now guaranteed an array
    const valor2 = valor(escopo);
    if (typeof valor2 === "number") return String.fromCharCode(valor2);
    return valor2
  }).join(""),
)

const tamanho = transformar(
  símbolo("[.]"),
  () => (escopo, valor) => valor.length,
);

const lista = transformar(
  seq(
    símbolo("["),
    opcional(
      vários(
        seq(
          opcional(símbolo("..."), ""),
          código => expressão(código),
          opcional(símbolo(",")),
        )
      ),
      [] // Default empty array for opcional
    ),
    símbolo("]"),
  ),
  ([, valores]) => escopo => {
    const resultado_final = [];
    // Check if 'valores' itself is iterable. This should always be true as it's from opcional(..., []).
    if (typeof valores[Symbol.iterator] !== 'function') {
      console.error("CRITICAL_ERROR: 'valores' in lista transformer is not iterable. This should not happen.", valores);
      // This would be a fundamental issue if reached.
      throw new TypeError("Internal Error: 'valores' is not iterable in lista transformer.");
    }

    for (const v of valores) {
      // Defensive checks for 'v' and its structure (from previous attempts, keep them)
      if (!v || !Array.isArray(v) || v.length < 2) {
        console.error(`ERROR: Malformed element 'v' in lista manual loop. v:`, v);
        continue;
      }
      let spreadSymbol = v[0];
      let current_element_expr_fn = v[1];
      if (typeof current_element_expr_fn !== 'function') {
        console.error(`ERROR: Element v[1] is not a function in lista manual loop. v[1]:`, current_element_expr_fn);
        continue;
      }

      try {
        let evaluated_element = current_element_expr_fn(escopo);

        if (spreadSymbol === "...") {
          if (evaluated_element === null || typeof evaluated_element === 'undefined') {
            // This is a critical path to test the hypothesis for the original error
            console.error("CUSTOM_ERROR_PATH: Attempted to spread null or undefined value from list element evaluation.");
            throw new TypeError("Custom: Attempted to spread null or undefined in lista's manual loop.");
          } else if (typeof evaluated_element[Symbol.iterator] === 'function') {
            for (const item of evaluated_element) { // Manually spread
              resultado_final.push(item);
            }
          } else {
            console.error("CUSTOM_ERROR_PATH: Spread element is not iterable.", evaluated_element);
            throw new TypeError("Custom: Spread element is not iterable in lista's manual loop.");
          }
        } else { // Not a spread element
          resultado_final.push(evaluated_element);
        }
      } catch (e) {
        // This catch is for errors during current_element_expr_fn(escopo) or the spread logic
        console.error(`ERROR INSIDE try-catch of lista's manual loop:`);
        console.error("Original Error Message:", e.message);
        console.error("Original Error Stack:", e.stack);
        throw e; // Re-throw
      }
    }
    return resultado_final;
  }
); // transformar ends.

const objeto = transformar(
  seq(
    símbolo("{"),
    opcional(
      vários(
        alt(
          seq(
            alt(
              nome,
              seq(
                símbolo("["),
                código => expressão(código),
                símbolo("]"),
              ),
            ),
            símbolo(":"),
            código => expressão(código),
            opcional(símbolo(",")),
          ),
          seq(
            símbolo("..."),
            código => expressão(código),
            opcional(símbolo(",")),
          ),
        ),
      ),
    ),
    símbolo("}"),
  ),
  ([, valores]) => escopo => { // Adjusted destructuring
    return valores ? valores.reduce((resultado, v) => {
      if (v[0] === "...") {
        return { ...resultado, ...v[1](escopo) };
      } else {
        const chave = typeof v[0] === "string" ? v[0] : v[0][1](escopo);
        // Adjusted index for value from v[3] to v[2]
        return { ...resultado, [chave]: v[2](escopo) };
      }
    }, {}) : {};
  }
);

const atributo = transformar(
  seq(
    símbolo("."),
    nome,
  ),
  ([, atributo]) => (escopo, objeto) => objeto[atributo],
);

const lambda = transformar(
  seq(
    opcional(símbolo("(")),
    opcional(
      vários(
        seq(
          nome,
          opcional(símbolo(",")),
        )
      ),
      []
    ),
    opcional(símbolo(")")),
    símbolo("=>"),
    código => expressão(código),
  ),
  ([, parâmetros, , , valor]) => escopo => (escopo2, ...args) => // Adjusted destructuring
    valor(
      parâmetros.reduce(
        (escopo3, [nome], i) => ({ ...escopo3, [nome]: args[i] }),
        { ...escopo, ...(escopo2 || {}) }
      )
    ),
);

const chamada_função = transformar(
  seq(
    símbolo("("),
    opcional(
      vários(
        seq(
          código => expressão(código),
          opcional(símbolo(",")),
        )
      ),
      []
    ),
    símbolo(")"),
  ),
  // This is the TRANSFORMER_FN for chamada_função
  // It receives the parsed arguments sequence (from opcional(vários(...)))
  // It returns a new function: (scope_for_arg_eval, actual_js_function_val) => result_of_call
  ([, args_details_array]) => { // args_details_array is from opcional(vários(...), [])
      // This outer function is called by 'transformar' when a function call syntax is parsed.
      // It returns the actual evaluator for this specific call.
      return (escopo_for_arg_eval, actual_js_function_val) => {
          // THIS IS THE EVALUATOR FUNCTION. IT MUST BE CALLED FOR THIS LOG TO APPEAR.
          console.log("DEBUG_CALL_EVALUATOR_STEP: Entered function call evaluator. Function to call type:", typeof actual_js_function_val);

          const evaluated_js_args = args_details_array.map(arg_detail_seq => {
              if (typeof arg_detail_seq[0] !== 'function') {
                  console.error("DEBUG_CALL_EVALUATOR_STEP: Argument parser did not return a function for arg an index (problem with `expressão` for arg).");
                  throw new TypeError("Interpreter Error: Argument expression did not yield an evaluator function.");
              }
              return arg_detail_seq[0](escopo_for_arg_eval);
          });

          if (typeof actual_js_function_val !== 'function') {
              console.error("DEBUG_CALL_EVALUATOR_STEP: actual_js_function_val is NOT a function. Type:", typeof actual_js_function_val, "Value:", actual_js_function_val);
              // Ensure this error propagates; a TypeError is good.
              throw new TypeError("Interpreter Error: Attempting to call a non-function.");
          }

          let result_from_js_call;
          try {
              result_from_js_call = actual_js_function_val(escopo_for_arg_eval, ...evaluated_js_args);
          } catch (e) {
              console.error("DEBUG_CALL_EVALUATOR_STEP: Error DURING actual_js_function_val execution:", e.message, e.stack);
              throw e; // Propagate error to be caught by the calling context (e.g. async_transformer_fn)
          }

          // The existing debug logs are good.
          console.log("DEBUG_CALL_EVALUATOR_STEP: Raw result of actual_js_function_val call:", result_from_js_call);
          if (Array.isArray(result_from_js_call)) {
              console.log("DEBUG_CALL_EVALUATOR_STEP: Call result is an array. Length:", result_from_js_call.length);
          } else {
              console.warn("DEBUG_CALL_EVALUATOR_STEP: Call result is NOT an array. Type:", typeof result_from_js_call);
          }

          // Explicitly assign to a new variable before returning, for clarity and to avoid any potential
          // subtle issues with returning directly from the variable that held the try-catch result (highly unlikely to be an issue).
          const final_call_return_value = result_from_js_call;
          return final_call_return_value;
      };
  }
);

const parênteses = transformar(
  seq(
    símbolo("("),
    opcional(código => declarações_constantes(código), []),
    código => expressão(código),
    símbolo(")"),
  ),
  ([, constantes, valor]) => escopo => { // Adjusted destructuring
    const escopoComConstantes = constantes.reduce(
      (escopoAtual, [[nome, , valor]]) => { // Adjusted destructuring
        const novoValor = valor(escopoAtual);
        return { ...escopoAtual, [nome]: novoValor };
      },
      escopo
    );
    return valor(escopoComConstantes);
  }
);

const termo1 = transformar(
  seq(
    alt(valor_constante, parênteses),
    opcional(vários( // Wrap varios with opcional and default to []
      alt(fatia, tamanho, atributo, chamada_função),
    ), [])
  ),
  // ([valor_base_parsed_repr, ops_array_parsed_repr]) is what transformador gets
  // valor_base_parsed_repr is from alt(valor_constante, parênteses)
  // ops_array_parsed_repr is from opcional(vários(...), [])
  ([valor_base_fn, ops_array]) => { // These are already evaluator functions or array of them
      return escopo => { // This is the function returned by termo1's transformar
          console.log("DEBUG_TERMO1: Entered termo1 evaluator.");
          const base_eval_result = valor_base_fn(escopo);
          console.log("DEBUG_TERMO1: Result of valor_base_fn(escopo) (type):", typeof base_eval_result);
          // if (typeof base_eval_result !== 'function') { // Avoid logging full functions
          //    console.log("DEBUG_TERMO1: base_eval_result value:", base_eval_result);
          // }
          console.log("DEBUG_TERMO1: ops_array.length:", ops_array ? ops_array.length : 'ops_array_is_null_or_undefined');

          if (!ops_array || ops_array.length === 0) {
              console.log("DEBUG_TERMO1: ops_array is empty, returning base_eval_result directly.");
              return base_eval_result;
          }

          // The actual reduce logic (keep as is)
          const final_result = ops_array.reduce(
              (accumulator, current_op_fn) => {
                  // console.log("DEBUG_TERMO1_REDUCE: Applying op. Accumulator type:", typeof accumulator);
                  if (typeof current_op_fn !== 'function') {
                        console.error("DEBUG_TERMO1_REDUCE: current_op_fn is not a function!", current_op_fn);
                        throw new TypeError("Interpreter Error: Operation in chain is not a function.");
                  }
                  return current_op_fn(escopo, accumulator);
              },
              base_eval_result
          );
          // console.log("DEBUG_TERMO1: Final result of reduce (type):", typeof final_result);
          return final_result;
      };
  }
);

const termo2 = alt(
  termo1,
  número,
  não,
  texto,
  modelo,
  lista,
  objeto,
  lambda,
  valor_constante,
  parênteses,
)

const termo3 = operação(
  termo2,
  alt(
    operador("*", (v1, v2) => v1 * v2),
    operador("/", (v1, v2) => v1 / v2),
  ),
)

const termo4 = operação(
  termo3,
  alt(
    operador("+", (v1, v2) => v1 + v2),
    operador("-", (v1, v2) => v1 - v2),
  ),
);

const termo5 = operação(
  termo4,
  alt(
    operador(">=", (v1, v2) => v1 >= v2 ? 1 : 0),
    operador("<=", (v1, v2) => v1 <= v2 ? 1 : 0),
    operador(">", (v1, v2) => v1 > v2 ? 1 : 0),
    operador("<", (v1, v2) => v1 < v2 ? 1 : 0),
    operador("==", (v1, v2) => v1 === v2 ? 1 : 0),
    operador("!=", (v1, v2) => v1 !== v2 ? 1 : 0),
  ),
);

const termo6 = transformar(
  seq(
    termo5,
    opcional(seq(
      símbolo("?"),
      código => expressão(código),
      símbolo(":"),
      código => expressão(código),
    )),
  ),
  ([condição, resto]) => {
    if (!resto) return condição;
    // Adjusted destructuring: removed spaces, so indices shift
    const [, valor_se_verdadeiro, , valor_se_valso] = resto;
    return escopo => condição(escopo) !== 0 ? valor_se_verdadeiro(escopo) : valor_se_valso(escopo);
  },
);

const expressão = operação(
  termo6,
  alt(
    operador("&", (v1, v2) => v1 !== 0 ? v2 : 0),
    operador("|", (v1, v2) => v1 !== 0 ? v1 : v2),
  ),
);

const declarações_constantes = vários(
  seq(
    nome,
    símbolo("="),
    expressão,
  )
)

// Need to adjust how _0 is called/defined due to the new transform function signature
// The `transformar` function expects `(analisador, transformador)`
// The `transformador` is `código => { const [valor, resto] = analisador(código); ... }`
// Our new `async ([importações...])` function is the core logic.
// It needs to be wrapped to match the signature `transformador(valor)` where `valor` is `[importações, carregamentos, atribuições, valor_ou_erro_expr]`
// And this wrapper also needs access to the original code for error reporting.

// Let's redefine _0 slightly.
// The `seq(...)` is the `analisador`.
// The second argument to `transformar` needs to be a function that takes the output of `seq`
// and the original code.
const analisador_principal = seq(
  opcional(vários(
    seq(
      seq(
        nome,
        símbolo("#"),
        endereço,
      ),
    ),
  ), []),
  opcional(vários(
    seq(
      seq(
        nome,
        símbolo("@"),
        endereço,
      ),
    ),
  ), []),
  opcional(declarações_constantes, []),
  expressão,
);

const transformador_principal = (código_original_input) => async ([importações, carregamentos, atribuições, valor_ou_erro_expr]) => {
  if (valor_ou_erro_expr && valor_ou_erro_expr.error) {
    return [{
      error: true,
      message: `Syntax Error: ${valor_ou_erro_expr.message}`,
      details: valor_ou_erro_expr
    }, código_original_input];
  }

  const valor_final_expr_fn = valor_ou_erro_expr;

  const escopo_inicial = Object.fromEntries(await Promise.all([
    ...importações.map(async importação_item => {
      const [nome_str, , endereço_str] = importação_item[0];
      const modulo_conteudo_bruto = await (await fetch(endereço_str)).text();
      // _0 now returns [ [value | errorObj, originalCode], remainingCodeAfter_0_finished ]
      // We are interested in the first part of the first part.
      const [resultado_parse_modulo_tupla, ] = _0(modulo_conteudo_bruto);
      const resultado_parse_modulo = resultado_parse_modulo_tupla[0];


      if (resultado_parse_modulo && resultado_parse_modulo.error) {
        throw new Error(`Falha ao parsear módulo: ${nome_str} de ${endereço_str}. Erro: ${resultado_parse_modulo.message}`);
      }
      if (!resultado_parse_modulo && !(resultado_parse_modulo_tupla[0] && resultado_parse_modulo_tupla[0].error) ) { // check if it's not an error already
           throw new Error(`Falha ao importar módulo (resultado nulo ou inválido): ${nome_str} de ${endereço_str}`);
      }
      return [nome_str, await resultado_parse_modulo]; // assuming it's a promise
    }),
    ...carregamentos.map(async carregamento_item => {
      const [nome_str, , endereço_str] = carregamento_item[0];
      return [nome_str, await (await fetch(endereço_str)).text()];
    }),
  ]));

  const escopo_com_atribuições = atribuições.reduce((escopo_atual, atribuição_item) => {
    const [nome_str, , expressão_fn] = atribuição_item;
    return { ...escopo_atual, [nome_str]: expressão_fn(escopo_atual) };
  }, escopo_inicial);

  return valor_final_expr_fn(escopo_com_atribuições);
};


// _0 is a parser function: código_input => [resultado, código_restante]
// transformar(analisador, transformador_fn) returns such a parser function.
// The transformador_fn needs to be `valor_parseado => novo_valor_ou_promessa`
// My current transformador_principal is (código_original_input) => async (valor_parseado) => ...
// This is not quite right for transformar.
// transformar expects: (analisador, fn_que_recebe_valor_do_analisador)
// The fn_que_recebe_valor_do_analisador returns the new "valor" part of the tuple.
// The "resto" part is handled by transformar.

// Let's simplify the transform logic within _0's definition directly.
// The `transformar` itself provides the `código` to its transformation function if structured correctly.
// No, `transformar`'s transform function only gets `valor`. It doesn't get `código`.
// `transformar = (analisador, transformador) => código => { const [valor, resto] = analisador(código); ... return [transformador(valor), resto]; }`

// This means if `valor_final_expr_fn` is an error, `transformar` will just put that error object as the `valor`
// part of the `[valor, resto]` tuple. The `_0` function will then return `[errorObject, remainingCode]`.
// This is ALMOST what we want for the main error handling.
// The change needed is that the `_0`'s final result should be `[ { error: true, ...}, originalCode ]`
// and not `[ errorFromParser, remainingCodeAfterError ]`

// So, _0 cannot be just a `transformar(...)`. It needs to be a function that CALLS `transformar`
// and then adjusts the result if it's an error.

const _0_internal_parser = transformar(
  analisador_principal, // seq(...) defined above
  async ([importações, carregamentos, atribuições, valor_final_expr_fn_or_error]) => {
    // This part is the "transformador" called by `transformar`.
    // It receives the successful parse result of `analisador_principal`.
    // If `valor_final_expr_fn_or_error` is an error object, it will be passed as is.

    if (valor_final_expr_fn_or_error && valor_final_expr_fn_or_error.error) {
      // Propagate the error object so it becomes the "valor" part of _0_internal_parser's result
      return valor_final_expr_fn_or_error;
    }

    const valor_final_expr_fn = valor_final_expr_fn_or_error;

    // ... (rest of the async logic for imports, scope, etc. as defined before)
    // This part is kept the same for creating the scope
    const escopo_inicial = Object.fromEntries(await Promise.all([
      ...importações.map(async importação_item => {
        const [nome_str, , endereço_str] = importação_item[0];
        const modulo_conteudo_bruto = await (await fetch(endereço_str)).text();
        const [resultado_parse_modulo_tupla, ] = _0(modulo_conteudo_bruto); // Recursive call
        const resultado_parse_modulo = resultado_parse_modulo_tupla[0]; // This is the actual value or error object

        if (resultado_parse_modulo && resultado_parse_modulo.error) {
          throw new Error(`Falha ao parsear módulo: ${nome_str} de ${endereço_str}. Erro: ${resultado_parse_modulo.message}`);
        }
        if (resultado_parse_modulo === null || (typeof resultado_parse_modulo === 'object' && !resultado_parse_modulo.error && !Object.keys(resultado_parse_modulo).length && Object.getPrototypeOf(resultado_parse_modulo) === Object.prototype) ) {
            throw new Error(`Falha ao importar módulo (parse não retornou valor nem erro específico): ${nome_str} de ${endereço_str}`);
        }
        return [nome_str, await resultado_parse_modulo]; // await if it's a promise
      }),
      ...carregamentos.map(async carregamento_item => {
        const [nome_str, , endereço_str] = carregamento_item[0];
        return [nome_str, await (await fetch(endereço_str)).text()];
      }),
    ]));

    const escopo_com_atribuições = atribuições.reduce((escopo_atual, atribuição_item) => {
      const [nome_str, , expressão_fn] = atribuição_item;
      return { ...escopo_atual, [nome_str]: expressão_fn(escopo_atual) };
    }, escopo_inicial);
    // End of scope setup part that is kept the same.

    // New logging and execution for valor_final_expr_fn
    const final_scope = escopo_com_atribuições;
    console.log("DEBUG: Type of valor_final_expr_fn:", typeof valor_final_expr_fn);
    if (typeof valor_final_expr_fn === 'function') {
        console.log("DEBUG: valor_final_expr_fn (toString):", valor_final_expr_fn.toString().substring(0, 200)); // Log first 200 chars
        try {
            const evaluation_result = valor_final_expr_fn(final_scope);
            console.log("DEBUG: Raw result of valor_final_expr_fn(scope):", evaluation_result);
            if (typeof evaluation_result === 'undefined') {
                console.warn("WARN_INTERPRETER: The main expression evaluated to 'undefined'. This might indicate an interpreter issue if 'undefined' is not an expected value.");
            }
            // Check if evaluation_result is an array, as expected by uniteste.descrever
            if (Array.isArray(evaluation_result)) {
                console.log("DEBUG: evaluation_result is an array. Length:", evaluation_result.length);
                if (evaluation_result.length > 0) {
                    console.log("DEBUG: First element of evaluation_result:", JSON.stringify(evaluation_result[0]).substring(0, 200));
                }
            } else {
                console.warn("WARN: evaluation_result is NOT an array. Type:", typeof evaluation_result);
            }
            return evaluation_result;
        } catch (e) {
            console.error("ERROR during valor_final_expr_fn(final_scope) execution:", e.message, e.stack);
            throw e; // Re-throw to see if it's caught by rodar_testes.sh
        }
    } else {
        console.error("ERROR: valor_final_expr_fn is NOT a function. This is unexpected if parsing succeeded.");
        return valor_final_expr_fn; // Propagate it if it's not a function (e.g. an error obj not caught by transformar)
    }
  }
);

// The actual _0 function that wraps _0_internal_parser to adjust error reporting format.
const _0 = código_input => {
  const [valor_parseado_ou_erro, código_restante] = _0_internal_parser(código_input);

  if (valor_parseado_ou_erro && valor_parseado_ou_erro.error) {
    // This is an error object from one of the parsers (símbolo, regex, seq failure, or explicitly from _0_internal_parser's transform)
    return [ // This is the first element of the tuple _0 returns
      {
        error: true,
        message: `Syntax Error: ${valor_parseado_ou_erro.message}`,
        details: valor_parseado_ou_erro
      },
      código_input // The second element is the original input code
    ];
  }

  // If not an error, valor_parseado_ou_erro is a Promise for the final value (due to async transform)
  // or it could be a direct value if the transform was not async (but ours is).
  return [valor_parseado_ou_erro, código_restante];
};


export default _0