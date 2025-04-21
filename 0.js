const alt = (identificação, ...analisadores) => (código, escopo) => {
  const tentarAnalisadores = async ([analisadorAtual, ...restantes]) => {
    if (!analisadorAtual) {
      throw new Error(`Esperava ${identificação}.`, { cause: { código } });
    }
    try {
      return await analisadorAtual(código, escopo);
    } catch (e) {
      return tentarAnalisadores(restantes);
    }
  };
  return tentarAnalisadores(analisadores);
};

const seq = (...analisadores) => async (código, escopo) => {
  if (analisadores.length === 0) return [[], código, escopo];
  const [resultado, novoRestante, escopo2] = await analisadores[0](código, escopo);
  const [resultadosRestantes, restanteFinal, escopo3] = await seq(...analisadores.slice(1))(novoRestante, escopo2);
  return [[resultado, ...resultadosRestantes], restanteFinal, escopo3];
};

const espaço = (código, escopo) => {
  const i = código.search(/\S/);
  if (i === 0) throw new Error("Espaço não encontrado.", { cause: { código } });
  return [null, código.slice(i), escopo];
};

const número = (código, escopo) => {
  const número = código.match(/^\d+/);
  if (número) {
    return [() => parseInt(número[0], 10), código.slice(número[0].length), escopo];
  }
  throw new Error("Número não encontrado.", {
    cause: { código },
  });
};

const símbolo = símbolo => (código, escopo) => {
  if (código.startsWith(símbolo)) {
    return [símbolo, código.slice(símbolo.length), escopo];
  }
  throw new Error(`Esperava '${símbolo}'.`, {
    cause: { código },
  });
};

const declaração_posterior = analisador => async (código, escopo) => {
  const [resultado, restante, novoEscopo] = await analisador()(código, escopo);
  return [resultado, restante, novoEscopo];
};

const transformar = (analisador, transformador) => async (código, escopo) => {
  const [resultado, restante, novoEscopo] = await analisador(código, escopo);
  const [novoResultado, escopoFinal] = await transformador(resultado, novoEscopo);
  return [novoResultado, restante, escopoFinal];
};

const não = transformar(
  seq(
    símbolo("!"),
    espaço,
    declaração_posterior(() => expressão),
  ),
  ([, , v], escopo) => [escopo => v(escopo) === 0 ? 1 : 0, escopo],
);

const nome = (código, escopo) => {
  const nome = código.match(/^[a-zA-Z_][a-zA-Z0-9_]*/);
  if (nome) {
    return [nome[0], código.slice(nome[0].length), escopo];
  }
  throw new Error("Nome não encontrado.");
};

const texto = (código, escopo) => {
  const texto = código.match(/^"([^"]*)"/);
  if (texto) {
    return [() => texto[1], código.slice(texto[0].length), escopo];
  }
  throw new Error("Texto não encontrado.", {
    cause: { código },
  });
}

const fatia = transformar(
  seq(
    nome,
    símbolo("["),
    declaração_posterior(() => expressão),
    símbolo("]"),
  ),
  ([nome, , índice], escopo) => [escopo2 => escopo2[nome][índice(escopo2)], escopo],
);

const fatia2 = transformar(
  seq(
    nome,
    símbolo("["),
    declaração_posterior(() => expressão),
    símbolo(":"),
    declaração_posterior(() => expressão),
    símbolo("]"),
  ),
  ([nome, , índice1, , índice2], escopo) => [escopo2 => escopo2[nome].slice(índice1(escopo2), índice2(escopo2)), escopo],
);

const conteúdo_modelo = (código, escopo) => {
  const conteúdo = código.match(/[^`$]+/);
  if (conteúdo) {
    return [() => conteúdo[0], código.slice(conteúdo[0].length), escopo];
  }
  throw new Error("Modelo não encontrado.", {
    cause: { código },
  });
};

const expressão_modelo = transformar(
  seq(
    símbolo("${"),
    declaração_posterior(() => expressão),
    símbolo("}"),
  ),
  ([, valor], escopo) => [escopo2 => valor(escopo2), escopo],
);

const vários = analisador => async (código, escopo) => {
  try {
    const [resultado, restante, escopoAtualizado] = await analisador(código, escopo);
    const [resultadosRestantes, restanteFinal, escopoFinal] = await vários(analisador)(restante, escopoAtualizado);
    return [[resultado, ...resultadosRestantes], restanteFinal, escopoFinal];
  } catch (e) {
    return [[], código, escopo];
  }
};

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
  ([, conteúdo,], escopo) => [
    escopo2 => {
      const valor = conteúdo.map(item => (typeof item === 'function' ? item(escopo2) : item)).join('');
      return valor.replace(/\$\{([^}]+)\}/g, (_, nome) => escopo2[nome] || '');
    },
    escopo,
  ],
)

const tamanho = transformar(
  seq(
    nome,
    símbolo("[.]"),
  ),
  ([nome], escopo) => [escopo2 => escopo2[nome].length, escopo],
);

const opcional = analisador => async (código, escopo) => {
  try {
    return await analisador(código, escopo);
  } catch (e) {
    return [null, código, escopo];
  }
};

const lista = transformar(
  seq(
    símbolo("["),
    opcional(
      vários(
        seq(
          opcional(símbolo("...")),
          declaração_posterior(() => expressão),
          opcional(símbolo(",")),
          espaço,
        )
      ),
    ),
    opcional(símbolo("...")),
    declaração_posterior(() => expressão),
    símbolo("]"),
  ),
  ([, valores, espalhamento, valor], escopo) => {
    const valoresLista = valores
      ? valores.flatMap(v => v[0] === "..." ? v[1](escopo) : [v[1](escopo)])
      : [];
    return [escopo2 => [
      ...valoresLista,
      ...(espalhamento ? valor(escopo2) : [valor(escopo2)]),
    ], escopo];
  },
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
            declaração_posterior(() => expressão),
            símbolo(","),
            espaço,
          ),
          seq(
            símbolo("..."),
            declaração_posterior(() => termo),
            símbolo(","),
            espaço,
          ),
        ),
      ),
    ),
    símbolo("}"),
  ),
  ([, , valores], escopo) => {
    return [escopo2 => {
      const valoresObjeto = valores
      ? valores.flatMap(v => 
        v[0] === "..."
          ? Object.entries(v[1](escopo2))
          : [[v[0], v[3](escopo2)]]
        )
      : [];
      return Object.fromEntries(valoresObjeto);
    }, escopo];
  },
);

const atributo = transformar(
  seq(
    nome,
    símbolo("."),
    nome,
  ),
  ([objeto, , atributo], escopo) => [escopo2 => escopo2[objeto][atributo], escopo],
);

const termo = alt("termo",
  número,
  texto,
  fatia,
  fatia2,
  modelo,
  tamanho,
  lista,
  objeto,
  atributo,
  transformar(nome, (variável, escopo) => [escopo2 => escopo2[variável], escopo]),
);

const operação = (operador, transformador) => transformar(
  seq(
    termo,
    espaço,
    símbolo(operador),
    espaço,
    declaração_posterior(() => expressão),
  ),
  ([valor1, , , , valor2], escopo) => [escopo2 => transformador(valor1(escopo2), valor2(escopo2)), escopo],
);

const chamada_função = transformar(
  seq(
    nome,
    símbolo("("),
    opcional(declaração_posterior(() => expressão)),
    símbolo(")"),
  ),
  ([nome, , arg], escopo) => [escopo2 => escopo2[nome](arg ? arg(escopo2) : undefined), escopo],
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
  chamada_função,
  termo,
);

const exportação = transformar(
  seq(
    símbolo("#()"),
    espaço,
    símbolo("="),
    espaço,
    expressão,
  ),
  ([, , , , valor], escopo) => [() => valor(escopo), escopo],
);

const conteúdo = (código, escopo) => {
  const conteúdo = código.match(/\S+/);
  if (conteúdo) {
    return [conteúdo[0], código.slice(conteúdo[0].length), escopo];
  }
  throw new Error("Endereço não encontrado.", {
    cause: { código },
  });
};

const importação = transformar(
  seq(
    nome,
    espaço,
    símbolo("#"),
    espaço,
    conteúdo,
  ),
  async ([nome, , , , endereço], escopo) => {
    const valor = await avaliar(await (await fetch(endereço)).text(), escopo);
    const novoEscopo = { ...escopo, [nome]: valor };
    return [null, novoEscopo];
  },
);

const atribuição = transformar(
  seq(
    nome,
    espaço,
    símbolo("="),
    espaço,
    expressão,
  ),
  ([nome, , , , valor], escopo) => {
    const novoEscopo = { ...escopo, [nome]: valor(escopo) };
    return [null, novoEscopo];
  },
);

const declaração_função = transformar(
  seq(
    nome,
    símbolo("("),
    nome,
    símbolo(")"),
    espaço,
    símbolo("="),
    espaço,
    expressão,
  ),
  ([nome, , parâmetro, , , , , valor], escopo) => {
    const escopo2 = { ...escopo, [nome]: (arg) => {
      const escopo3 = { ...escopo2, [parâmetro]: arg };
      return valor(escopo3);
    }};
    return [null, escopo2];
  },
);

const avaliar = async código => {
  const [[, , resultado], restante] = await seq(
    opcional(
      vários(
        alt("importação",
          importação,
          espaço,
        ),
      ),
    ),
    opcional(
      vários(
        alt("declaração",
          atribuição,
          declaração_função,
          espaço,
        ),
      ),
    ),
    exportação,
  )(código, {});
  if (restante.length > 0) {
    throw new Error("Erro de sintaxe.", {
      cause: {
        código: restante,
      },
    });
  }
  return resultado;
};

export default avaliar;