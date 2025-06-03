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
  if (valor === null) return [valor_padrão, código];
  return [valor, resto];
};

const vários = analisador => {
  const analisador2 = código => {
    const [valor, resto] = analisador(código);
    if (valor === null) return [null, código];
    const [valor2, resto2] = analisador2(resto);
    if (valor2 === null) return [[valor], resto];
    return [[valor, ...valor2], resto2];
  };
  return analisador2;
};

const transformar = (analisador, transformador) => código => {
  const [valor, resto] = analisador(código);
  if (valor === null) return [null, código];
  return [transformador(valor), resto];
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
  v => escopo => escopo[v],
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
    vários(
      alt(
        expressão_modelo,
        conteúdo_modelo,
      ),
    ),
    símbolo("`"),
  ),
  ([, conteúdo,]) => escopo => conteúdo.map(valor => {
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
    ),
    símbolo("]"),
  ),
  ([, valores]) => escopo => valores ? valores.flatMap(v => v[0] === "..." ? v[1](escopo) : [v[1](escopo)]) : [],
);

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
        { ...escopo, ...escopo2 }
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
  ([, args]) => (escopo, função) => função(escopo, ...args.map(arg => arg[0](escopo))), // Adjusted destructuring
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
    alt(
      valor_constante,
      parênteses,
    ),
    vários(
      alt(
        fatia,
        tamanho,
        atributo,
        chamada_função,
      ),
    ),
  ),
  ([valor, operações]) => escopo => {
    return operações.reduce(
      (resultado, operação) => operação(escopo, resultado),
      valor(escopo)
    );
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

const _0 = transformar(
  seq(
    opcional(vários( // Removed ignorar_comentários
      seq(
        seq(
          nome,
          símbolo("#"),
          endereço,
        ),
        // espaço, // This was likely for separation between multiple declarations, now handled by stripper
      ),
    ), []),
    opcional(vários( // Removed ignorar_comentários
      seq(
        seq(
          nome,
          símbolo("@"),
          endereço,
        ),
        // espaço, // This was likely for separation, now handled by stripper
      ),
    ), []),
    opcional(declarações_constantes, []), // Removed ignorar_comentários
    expressão, // This is the main parser for the body of the code
  ),
  // The 'transformador' function for the main _0 parser
  (código_original_para_erro) => async ([importações, carregamentos, atribuições, valor_ou_erro_expr]) => {
    // valor_ou_erro_expr is the direct result from the `expressão` parser.
    // It can be either the function to execute (on success) or an error object.

    // Handle parsing error for the main expression before doing any async work
    if (valor_ou_erro_expr && valor_ou_erro_expr.error) {
      // If `expressão` returned an error, valor_ou_erro_expr is the error object.
      // The 'resto' part for _0 would be the original code because the top-level seq's transform is involved.
      return [{
        error: true,
        message: `Syntax Error: ${valor_ou_erro_expr.message}`,
        details: valor_ou_erro_expr
      }, código_original_para_erro]; // Return the original code passed to _0
    }

    // If no error in the main expression, valor_ou_erro_expr is valor_final_expr_fn
    const valor_final_expr_fn = valor_ou_erro_expr;

    const escopo_inicial = Object.fromEntries(await Promise.all([
      ...importações.map(async importação_item => {
        const [nome_str, , endereço_str] = importação_item[0];
        const modulo_conteudo_bruto = await (await fetch(endereço_str)).text();
        const [resultado_parse_modulo, ] = _0(modulo_conteudo_bruto); // _0 itself returns [result, remaining_code]

        // Check if the result of parsing the module is an error object
        if (resultado_parse_modulo && resultado_parse_modulo.error) {
          throw new Error(`Falha ao parsear módulo: ${nome_str} de ${endereço_str}. Erro: ${resultado_parse_modulo.message}`);
        }
        // Also handle the case where _0 might return null or not an error, but still failed (legacy or unexpected)
        if (!resultado_parse_modulo) {
             throw new Error(`Falha ao importar módulo (resultado nulo): ${nome_str} de ${endereço_str}`);
        }
        // Assuming `resultado_parse_modulo` is the promise containing the module's value if not an error
        return [nome_str, await resultado_parse_modulo];
      }),
      ...carregamentos.map(async carregamento_item => {
        const [nome_str, , endereço_str] = carregamento_item[0];
        return [nome_str, await (await fetch(endereço_str)).text()];
      }),
    ]));

    const escopo_com_atribuições = atribuições.reduce((escopo_atual, atribuição_item) => {
      const [nome_str, , expressão_fn] = atribuição_item;
      // What if expressão_fn itself is an error from a failed parse in declarações_constantes?
      // The current structure of `declarações_constantes` using `vários(seq(...))` would mean
      // an error in one constant declaration would make `declarações_constantes` return an error.
      // This error would then be caught by the top-level `seq` in `_0`, and then by the check above.
      // So, `expressão_fn` here should be a valid function if we've passed the error check.
      return { ...escopo_atual, [nome_str]: expressão_fn(escopo_atual) };
    }, escopo_inicial);

    // If valor_final_expr_fn was not an error, it's the function to execute.
    // The result of this function is the final value of the script.
    // This is wrapped in a Promise by the async nature of this transform.
    return valor_final_expr_fn(escopo_com_atribuições);
  },
);

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
           // Heuristic: if it's null, or an empty plain object that's not an error, it's likely a failed parse that didn't return a structured error.
           // This condition tries to catch `[null, code]` or `[{}, code]` if _0 somehow returns that on failure.
           // The `_0` function should ideally always return a value or a structured error.
           // The `await resultado_parse_modulo` below might also fail if it's not a promise (e.g. if it's an error object already)
           // This needs to be robust.
           // If `resultado_parse_modulo` is an error object, `await` on it won't work.
           // The structure of _0's return is `[value_or_error_promise, remaining_code]`
           // So `resultado_parse_modulo_tupla[0]` is the promise or the error object.
           // And `resultado_parse_modulo` is that promise/error object.
           // If it's not an error, it should be a promise.
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

    return valor_final_expr_fn(escopo_com_atribuições); // This will be a Promise<actual_value>
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