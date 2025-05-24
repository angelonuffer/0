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

const símbolo = símbolo => código => {
  if (código.startsWith(símbolo)) return [símbolo, código.slice(símbolo.length)];
  return [null, código];
};

const regex = regex => código => {
  const valor = código.match(regex);
  if (valor) if (valor.index === 0) return [valor[0], código.slice(valor[0].length)];
  return [null, código];
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
      opcional(espaço),
      operadores,
      opcional(espaço),
      termo,
    )), []),
  ),
  ([primeiroTermo, operaçõesSequenciais]) => {
    if (operaçõesSequenciais.length === 0) return primeiroTermo;
    return escopo => 
      operaçõesSequenciais.reduce(
        (resultado, [, operador, , próximoTermo]) => 
          operador(resultado, próximoTermo(escopo)),
        primeiroTermo(escopo)
      );
  },
);

const nome = regex(/[a-zA-ZÀ-ÿ_][a-zA-ZÀ-ÿ0-9_]*/);

const endereço = regex(/\S+/);

const espaço = regex(/\s+/);

const número = transformar(regex(/\d+/), v => () => parseInt(v));

const texto = transformar(regex(/"([^"]*)"/), v => () => v.slice(1, -1));

const não = transformar(
  seq(
    símbolo("!"),
    opcional(espaço),
    código => expressão(código),
  ),
  ([, , v]) => escopo => v(escopo) === 0 ? 1 : 0,
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
  ([, conteúdo,]) => escopo => conteúdo.map(v => v(escopo)).join(""),
)

const tamanho = transformar(
  símbolo("[.]"),
  () => (escopo, valor) => valor.length,
);

const lista = transformar(
  seq(
    símbolo("["),
    opcional(espaço),
    opcional(
      vários(
        seq(
          opcional(símbolo("..."), ""),
          código => expressão(código),
          opcional(símbolo(",")),
          opcional(espaço),
        )
      ),
    ),
    símbolo("]"),
  ),
  ([, , valores]) => escopo => valores ? valores.flatMap(v => v[0] === "..." ? v[1](escopo) : [v[1](escopo)]) : [],
);

const objeto = transformar(
  seq(
    símbolo("{"),
    opcional(espaço),
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
            opcional(espaço),
            código => expressão(código),
            opcional(símbolo(",")),
            opcional(espaço),
          ),
          seq(
            símbolo("..."),
            código => expressão(código),
            opcional(símbolo(",")),
            opcional(espaço),
          ),
        ),
      ),
    ),
    símbolo("}"),
  ),
  ([, , valores]) => escopo => {
    return valores ? valores.reduce((resultado, v) => {
      if (v[0] === "...") {
        return { ...resultado, ...v[1](escopo) };
      } else {
        const chave = typeof v[0] === "string" ? v[0] : v[0][1](escopo);
        return { ...resultado, [chave]: v[3](escopo) };
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
          opcional(espaço),
          opcional(símbolo(",")),
          opcional(espaço),
        )
      ),
      []
    ),
    opcional(símbolo(")")),
    opcional(espaço),
    símbolo("=>"),
    opcional(espaço),
    código => expressão(código),
  ),
  ([, parâmetros, , , , , valor]) => escopo => (escopo2, ...args) =>
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
    opcional(espaço),
    opcional(
      vários(
        seq(
          código => expressão(código),
          opcional(espaço),
          opcional(símbolo(",")),
          opcional(espaço),
        )
      ),
      []
    ),
    opcional(espaço),
    símbolo(")"),
  ),
  ([, , args]) => (escopo, função) => função(escopo, ...args.map(arg => arg[0](escopo))),
);

const parênteses = transformar(
  seq(
    símbolo("("),
    opcional(espaço),
    opcional(código => declarações_constantes(código), []),
    opcional(espaço),
    código => expressão(código),
    opcional(espaço),
    símbolo(")"),
  ),
  ([, , constantes, , valor]) => escopo => {
    const escopoComConstantes = constantes.reduce(
      (escopoAtual, [[nome, , , , valor]]) => {
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
    opcional(espaço),
    vários(
      alt(
        fatia,
        tamanho,
        atributo,
        chamada_função,
      ),
    ),
  ),
  ([valor, , operações]) => escopo => {
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
      opcional(espaço),
      símbolo("?"),
      opcional(espaço),
      código => expressão(código),
      opcional(espaço),
      símbolo(":"),
      opcional(espaço),
      código => expressão(código),
    )),
  ),
  ([condição, resto]) => {
    if (!resto) return condição;
    const [, , , valor_se_verdadeiro, , , , valor_se_valso] = resto;
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

const comentário = transformar(
  seq(
    símbolo("//"),
    regex(/[^\n]*/),
    opcional(espaço),
  ),
  () => () => null
);

const ignorar_comentários = vários(comentário);

const declarações_constantes = vários(
  seq(
    seq(
      nome,
      opcional(espaço),
      símbolo("="),
      opcional(espaço),
      expressão,
    ),
    espaço,
  ),
)

const _0 = transformar(
  seq(
    opcional(ignorar_comentários),
    opcional(vários(
      seq(
        seq(
          nome,
          opcional(espaço),
          símbolo("#"),
          opcional(espaço),
          endereço,
        ),
        espaço,
      ),
    ), []),
    opcional(vários(
      seq(
        seq(
          nome,
          opcional(espaço),
          símbolo("@"),
          opcional(espaço),
          endereço,
        ),
        espaço,
      ),
    ), []),
    opcional(ignorar_comentários),
    opcional(declarações_constantes, []),
    opcional(ignorar_comentários),
    expressão,
  ),
  async ([, importações, carregamentos, , atribuições, , valor]) => {
    return valor(atribuições.reduce((escopo, [[nome, , , , valor]]) => {
      return {
        ...escopo,
        [nome]: valor(escopo),
      };
    }, Object.fromEntries(await Promise.all([
      ...importações.map(async importação => {
        const [[nome, , , , endereço]] = importação;
        return [nome, await _0(await (await fetch(endereço)).text())[0]]
      }),
      ...carregamentos.map(async carregamento => {
        const [[nome, , , , endereço]] = carregamento;
        return [nome, await (await fetch(endereço)).text()]
      }),
    ]))))
  },
);

export default _0