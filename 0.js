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

const nome = regex(/[a-zA-ZÀ-ÿ_][a-zA-ZÀ-ÿ0-9_]*/);

const endereço = regex(/\S+/);

const espaço = regex(/\s+/);

const número = transformar(regex(/\d+/), v => () => parseInt(v));

const texto = transformar(regex(/"([^"]*)"/), v => () => v.slice(1, -1));

const operações = {
  "&": (v1, v2) => v1 === 0 ? 0 : v2,
  "|": (v1, v2) => v1 !== 0 ? v1 : v2,
  "+": (v1, v2) => v1 + v2,
  "-": (v1, v2) => v1 - v2,
  "*": (v1, v2) => v1 * v2,
  "/": (v1, v2) => v1 / v2,
  ">=": (v1, v2) => v1 >= v2 ? 1 : 0,
  "<=": (v1, v2) => v1 <= v2 ? 1 : 0,
  ">": (v1, v2) => v1 > v2 ? 1 : 0,
  "<": (v1, v2) => v1 < v2 ? 1 : 0,
  "==": (v1, v2) => v1 === v2 ? 1 : 0,
  "!=": (v1, v2) => v1 !== v2 ? 1 : 0,
}

const não = transformar(
  seq(
    símbolo("!"),
    opcional(espaço),
    código => termo(código),
  ),
  ([, , v]) => escopo => v(escopo) === 0 ? 1 : 0,
)

const valor_constante = transformar(
  nome,
  v => escopo => escopo[v],
)

const fatia = transformar(
  seq(
    nome,
    símbolo("["),
    código => expressão(código),
    opcional(seq(
      símbolo(":"),
      código => expressão(código),
    ), []),
    símbolo("]"),
  ),
  ([nome, , índice1, [, índice2]]) => escopo => {
    if (índice2 === undefined) return escopo[nome][índice1(escopo)];
    return escopo[nome].slice(índice1(escopo), índice2(escopo))
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
  seq(
    nome,
    símbolo("[.]"),
  ),
  ([nome]) => escopo => escopo[nome].length,
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
          opcional(espaço),
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
    opcional(espaço),
    opcional(
      vários(
        alt(
          seq(
            nome,
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
  ([, , valores]) => escopo => Object.fromEntries(valores ? valores.flatMap(v => 
    v[0] === "..."
      ? Object.entries(v[1](escopo))
      : [[v[0], v[3](escopo)]]
    ) : [])
);

const atributo = transformar(
  seq(
    nome,
    símbolo("."),
    nome,
  ),
  ([objeto, , atributo]) => escopo => escopo[objeto][atributo],
);

const lambda = transformar(
  seq(
    símbolo("("),
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
    símbolo(")"),
    opcional(espaço),
    símbolo("=>"),
    opcional(espaço),
    código => expressão(código),
  ),
  ([, parâmetros, , , , , valor]) => escopo => (...args) =>
    valor(
      parâmetros.reduce(
        (novoEscopo, [nome], i) => ({ ...novoEscopo, [nome]: args[i] }),
        { ...escopo }
      )
    ),
);

const chamada_função = transformar(
  seq(
    nome,
    símbolo("("),
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
    símbolo(")"),
  ),
  ([nome, , args]) => escopo => escopo[nome](...args.map(arg => arg[0](escopo))),
);

const termo = alt(
  número,
  não,
  texto,
  fatia,
  modelo,
  tamanho,
  lista,
  objeto,
  atributo,
  lambda,
  chamada_função,
  valor_constante,
)

const expressão = transformar(
  seq(
    termo,
    opcional(vários(seq(
      opcional(espaço),
      alt(...Object.keys(operações).map(literal => símbolo(literal))),
      opcional(espaço),
      termo,
    )), []),
  ),
  ([primeiroTermo, operaçõesSequenciais]) => {
    if (operaçõesSequenciais.length === 0) return primeiroTermo;
    return escopo => 
      operaçõesSequenciais.reduce(
      (resultado, [, operador, , próximoTermo]) => 
        operações[operador](resultado, próximoTermo(escopo)),
      primeiroTermo(escopo)
      );
  }
);

const _0 = transformar(
  seq(
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
          símbolo("="),
          opcional(espaço),
          expressão,
        ),
        espaço,
      ),
    ), []),
    expressão,
  ),
  async ([importações, atribuições, valor]) => {
    return valor(atribuições.reduce((escopo, [[nome, , , , valor]]) => {
      return {
        ...escopo,
        [nome]: valor(escopo),
      };
    }, Object.fromEntries(await Promise.all(importações.map(async importação => {
      const [[nome, , , , endereço]] = importação;
      return [nome, await _0(await (await fetch(endereço)).text())[0]]
    })))))
  },
)

export default _0