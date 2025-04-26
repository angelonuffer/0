export default código => _0(código)

const _0 = async código => {
  const [escopo, resto] = opcional(importações, [])(código)
  const [escopo2, resto2] = opcional(atribuições, e => e)(resto)
  const [valor, resto3] = expressão(resto2)
  if (resto3.length > 0) {
    throw new Error("Erro de sintaxe.", {
      cause: {
        código: resto3,
      },
    })
  }
  const escopo3 = await Promise.all(escopo)
  return () => valor(escopo2(Object.fromEntries(escopo3)))
}

const alt = (identificação, ...analisadores) => {
  if (analisadores.length === 0) {
    return código => {
      throw new Error(`Esperava ${identificação}.`, { cause: { código } });
    };
  }
  const próximo_alt = alt(identificação, ...analisadores.slice(1));
  return código => {
    try {
      return analisadores[0](código);
    } catch (e) {
      if (analisadores.length === 1) {
        throw new Error(`Esperava ${identificação}.`, { cause: { código } });
      }
    }
    return próximo_alt(código);
  }
}

const seq = (...analisadores) => {
  if (analisadores.length === 0) {
    return código => [[], código];
  }
  const próximo_seq = seq(...analisadores.slice(1));
  return código => {
    const [valor, resto] = analisadores[0](código);
    const [valor2, resto2] = próximo_seq(resto);
    return [[valor, ...valor2], resto2];
  };
}

const símbolo = símbolo => código => {
  if (código.startsWith(símbolo)) {
    return [símbolo, código.slice(símbolo.length)];
  }
  throw new Error(`Esperava '${símbolo}'.`, {
    cause: { código },
  });
};

const regex = regex => código => {
  const valor = código.match(regex);
  if (valor) {
    return [valor[0], código.slice(valor[0].length)];
  }
  throw new Error(`Esperava ${regex}.`, {
    cause: { código },
  });
};

const opcional = (analisador, valor_padrão) => código => {
  try {
    return analisador(código);
  } catch (e) {
    return [valor_padrão, código];
  }
};

const vários = analisador => código => {
  const [valor, resto] = analisador(código);
  try {
    const [valor2, resto2] = vários(analisador)(resto);
    return [[valor, ...valor2], resto2];
  } catch (e) {
    return [[valor], resto];
  }
};

const transformar = (analisador, transformador) => código => {
  const [valor, resto] = analisador(código);
  return [transformador(valor), resto];
};

const operação = (operador, transformador) => transformar(
  seq(
    código => termo(código),
    espaço,
    símbolo(operador),
    espaço,
    código => expressão(código),
  ),
  ([valor1, , , , valor2]) => escopo => transformador(valor1(escopo), valor2(escopo)),
);

const nome = regex(/^[a-zA-Z_][a-zA-Z0-9_]*/);

const endereço = regex(/\S+/);

const espaço = regex(/\s+/);

const número = transformar(regex(/^\d+/), v => () => parseInt(v));

const texto = transformar(regex(/^"([^"]*)"/), v => () => v.slice(1, -1));

const importação = transformar(
  seq(
    nome,
    espaço,
    símbolo("#"),
    espaço,
    endereço,
    espaço,
  ),
  async ([nome, , , , endereço]) => [nome, await _0(await (await fetch(endereço)).text())],
);

const importações = vários(importação)

const atribuição = seq(
  nome,
  espaço,
  símbolo("="),
  espaço,
  código => expressão(código),
  espaço,
)

const atribuições = transformar(
  vários(atribuição),
  atribuições => escopo => atribuições.reduce((escopo2, [nome, , , , valor]) => ({
    ...escopo2,
    [nome]: valor(escopo2),
  }), escopo),
);

const chamada_função = transformar(
  seq(
    nome,
    símbolo("("),
    opcional(código => expressão(código), () => {}),
    símbolo(")"),
  ),
  ([nome, , arg]) => escopo => escopo[nome](arg(escopo)),
);

const fatia = transformar(
  seq(
    nome,
    símbolo("["),
    código => expressão(código),
    símbolo("]"),
  ),
  ([nome, , índice]) => escopo => escopo[nome][índice(escopo)],
);

const fatia2 = transformar(
  seq(
    nome,
    símbolo("["),
    código => expressão(código),
    símbolo(":"),
    código => expressão(código),
    símbolo("]"),
  ),
  ([nome, , índice1, , índice2]) => escopo => escopo[nome].slice(índice1(escopo), índice2(escopo)),
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
      alt("conteúdo do modelo",
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
          símbolo(","),
          espaço,
        )
      ),
    ),
    opcional(símbolo("..."), ""),
    código => expressão(código),
    símbolo("]"),
  ),
  ([, valores, espalhamento, valor]) => escopo => [
    ...(valores ? valores.flatMap(v => v[0] === "..." ? v[1](escopo) : [v[1](escopo)]) : []),
    ...(espalhamento ? valor(escopo) : [valor(escopo)]),
  ]
);

const objeto = transformar(
  seq(
    símbolo("{"),
    opcional(espaço),
    opcional(
      vários(
        alt("atributo",
          seq(
            nome,
            símbolo(":"),
            espaço,
            código => expressão(código),
            símbolo(","),
            espaço,
          ),
          seq(
            símbolo("..."),
            código => expressão(código),
            símbolo(","),
            espaço,
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
    nome,
    símbolo(")"),
    espaço,
    símbolo("=>"),
    espaço,
    código => expressão(código),
  ),
  ([, parâmetro, , , , , valor]) => escopo => (arg) => valor({ ...escopo, [parâmetro]: arg }),
);

const termo = alt("termo",
  chamada_função,
  número,
  texto,
  fatia,
  fatia2,
  modelo,
  tamanho,
  lista,
  objeto,
  atributo,
  lambda,
  transformar(nome, v => escopo => escopo[v]),
)

const não = transformar(
  seq(
    símbolo("!"),
    espaço,
    código => expressão(código),
  ),
  ([, , v]) => escopo => v(escopo) === 0 ? 1 : 0,
);

const expressão = alt("expressão",
  operação("&", (v1, v2) => v1 === 0 ? 0 : v2),
  operação("|", (v1, v2) => v1 !== 0 ? v1 : v2),
  não,
  operação("+", (v1, v2) => v1 + v2),
  operação("-", (v1, v2) => v1 - v2),
  operação("*", (v1, v2) => v1 * v2),
  operação("/", (v1, v2) => v1 / v2),
  operação(">", (v1, v2) => v1 > v2 ? 1 : 0),
  operação("<", (v1, v2) => v1 < v2 ? 1 : 0),
  operação("==", (v1, v2) => v1 === v2 ? 1 : 0),
  operação("!=", (v1, v2) => v1 !== v2 ? 1 : 0),
  operação(">=", (v1, v2) => v1 >= v2 ? 1 : 0),
  operação("<=", (v1, v2) => v1 <= v2 ? 1 : 0),
  operação(":", (v1, v2) => typeof v1 === typeof v2 ? 1 : 0),
  termo,
)