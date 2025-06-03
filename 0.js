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
  if (analisadores.length === 0) return código => [null, código];
  const próximo_alt = alt(...analisadores.slice(1));
  return código => {
    const [valor, resto] = analisadores[0](código);
    if (valor === null) return próximo_alt(código);
    return [valor, resto];
  };
}

const seq = (...analisadores) => {
  if (analisadores.length === 0) {
    return código => [[], código];
  }
  const próximo_seq = seq(...analisadores.slice(1));
  return código => {
    const [valor, resto] = analisadores[0](código);
    if (valor === null) return [null, código];
    const [valor2, resto2] = próximo_seq(resto);
    if (valor2 === null) return [null, código];
    return [[valor, ...valor2], resto2];
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
    return [null, código]; // Return the stripped code on failure to match token
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
    return [null, código]; // Return the stripped code on failure to match token
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
    expressão,
  ),
  async ([importações, carregamentos, atribuições, valor_final_expr_fn]) => {
    const escopo_inicial = Object.fromEntries(await Promise.all([
      ...importações.map(async importação_item => {
        // importação_item from vários(seq(nome, símbolo("#"), endereço))
        // seq(nome, "#", endereço) produces [nome_str, "#", endereço_str]
        const [nome_str, , endereço_str] = importação_item[0]; // importação_item is [ [nome,tok,endr] ] due to outer seq in _0's vários
        const modulo_conteudo_bruto = await (await fetch(endereço_str)).text();
        const modulo_valor_parse_resultado = _0(modulo_conteudo_bruto); // Retorna [Promise | null, String]
        if (!modulo_valor_parse_resultado || modulo_valor_parse_resultado[0] === null) {
            throw new Error(`Falha ao importar módulo: ${nome_str} de ${endereço_str}`);
        }
        const modulo_promessa = modulo_valor_parse_resultado[0];
        return [nome_str, await modulo_promessa];
      }),
      ...carregamentos.map(async carregamento_item => {
        // carregamento_item from vários(seq(nome, símbolo("@"), endereço))
        // seq(nome, "@", endereço) produces [nome_str, "@", endereço_str]
        const [nome_str, , endereço_str] = carregamento_item[0]; // carregamento_item is [ [nome,tok,endr] ]
        return [nome_str, await (await fetch(endereço_str)).text()];
      }),
    ]));

    const escopo_com_atribuições = atribuições.reduce((escopo_atual, atribuição_item) => {
      // atribuição_item from vários(seq(nome, símbolo("="), expressão))
      // seq(nome, "=", expressão) produces [nome_str, "=", expressão_fn]
      const [nome_str, , expressão_fn] = atribuição_item;
      return { ...escopo_atual, [nome_str]: expressão_fn(escopo_atual) };
    }, escopo_inicial);

    return valor_final_expr_fn(escopo_com_atribuições);
  },
);

export default _0