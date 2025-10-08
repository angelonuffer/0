// Parser combinators - Generic reusable parsing functions
// These combinators are not specific to the project and can be reused by other projects

const símbolo = símbolo_esperado => ({
  tipo: "símbolo",
  símbolo: símbolo_esperado,
  analisar: código => {
    if (código.startsWith(símbolo_esperado)) return {
      valor: símbolo_esperado,
      resto: código.slice(símbolo_esperado.length),
    }
    return { resto: código, menor_resto: código }
  }
})

const alternativa = (...analisadores) => {
  return {
    tipo: "alternativa",
    analisadores,
    analisar: código => {
      let menor_resto = código
      for (const analisador of analisadores) {
        const resultado = analisador.analisar(código)
        if (resultado.resto !== código || resultado.hasOwnProperty("valor")) return resultado
        if (resultado.menor_resto && resultado.menor_resto.length < menor_resto.length) {
          menor_resto = resultado.menor_resto
        }
      }
      return { resto: código, menor_resto }
    }
  };
}

const sequência = (...analisadores) => ({
  tipo: "sequência",
  analisadores,
  analisar: código => {
    const valores = []
    let resto = código

    for (const analisador of analisadores) {
      const resultado = analisador.analisar(resto)
      if (!resultado.hasOwnProperty("valor")) return {
        resto: código,
        menor_resto: resultado.menor_resto || resto,
      }

      valores.push(resultado.valor)
      resto = resultado.resto
    }

    return { valor: valores, resto }
  }
})

const opcional = (analisador, valor_padrão) => ({
  tipo: "opcional",
  analisador,
  valor_padrão,
  analisar: código => {
    const resultado = analisador.analisar(código)
    if (resultado.hasOwnProperty("valor")) return resultado
    return { valor: valor_padrão, resto: código, menor_resto: resultado.menor_resto, erro: resultado.erro }
  }
})

const vários = analisador => ({
  tipo: "vários",
  analisador,
  analisar: código => {
    const valores = []
    let resto = código

    while (true) {
      const { valor, resto: novo_resto } = analisador.analisar(resto)
      if (novo_resto === resto) break
      valores.push(valor)
      resto = novo_resto
    }

    return { valor: valores, resto }
  }
})

const transformar = (analisador, transformador) => ({
  tipo: "transformar",
  analisador,
  transformador,
  analisar: código => {
    const { valor, resto, menor_resto } = analisador.analisar(código)
    if (resto === código) return { resto: código, menor_resto }
    try {
      return { valor: transformador(valor), resto, menor_resto }
    } catch (erro) {
      return { resto: código, menor_resto, erro }
    }
  }
})

const inversão = analisador => ({
  tipo: "inversão",
  analisador,
  analisar: código => {
    const { resto, menor_resto } = analisador.analisar(código)
    if (resto === código) return {
      valor: código[0],
      resto: código.slice(1),
    }
    return { resto: código, menor_resto }
  }
})

const faixa = (inicial, final) => ({
  tipo: "faixa",
  inicial,
  final,
  analisar: código => {
    if (código.length === 0 || código[0] < inicial || código[0] > final) return { resto: código, menor_resto: código }
    return {
      valor: código[0],
      resto: código.slice(1),
    }
  }
})

const operador = (literal, funcao) => transformar(
  símbolo(literal),
  () => funcao
);

// operação is a higher-level combinator that depends on espaço
// It will be exported from a separate module to avoid circular dependencies
const createOperação = (espaço) => (termo, operadores) => transformar(
  sequência(
    termo,
    vários(sequência(
      opcional(espaço),
      operadores,
      opcional(espaço),
      termo
    ))
  ),
  v => {
    const [primeiroTermo, operaçõesSequenciais] = v;
    if (operaçõesSequenciais.length === 0) return primeiroTermo;

    return escopo =>
      operaçõesSequenciais.reduce(
        (resultado, valSeq) => {
          const operador = valSeq[1];
          const próximoTermo = valSeq[3];
          return operador(resultado, próximoTermo(escopo));
        },
        primeiroTermo(escopo)
      );
  }
);

export {
  símbolo,
  alternativa,
  sequência,
  opcional,
  vários,
  transformar,
  inversão,
  faixa,
  operador,
  createOperação
};