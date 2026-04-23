#! /usr/bin/env node

const ordenar = lista => lista.sort((a, b) => a.localeCompare(b))

const símbolo = texto => ({ entrada, posição }) => {
  if (texto[0] !== entrada[posição]) return { valor: new Error(`"${texto[0]}"`), posição }
  if (texto.length === 1) return { valor: texto, posição: posição + 1 }
  const { valor, posição: posição_2 } = símbolo(texto.slice(1))({ entrada, posição: posição + 1 })
  if (valor instanceof Error) return { valor, posição }
  return {
    valor: texto[0] + valor,
    posição: posição_2,
  }
}

const faixa = (de, até) => ({ entrada, posição }) => entrada[posição] >= de && entrada[posição] <= até ? {
  valor: entrada[posição],
  posição: posição + 1,
} : { valor: new Error(`/[${de}-${até}]/`), posição }

const alternativa = (...analisadores) => ({ entrada, posição }) => {
  const { valor: valor_1, posição: posição_1 } = analisadores[0]({ entrada, posição })
  if (posição_1 > posição) return { valor: valor_1, posição: posição_1 }
  if (analisadores.length === 1) return { valor: valor_1, posição: posição_1 }
  const { valor: valor_2, posição: posição_2 } = alternativa(...analisadores.slice(1))({ entrada, posição })
  if (posição_2 > posição) return { valor: valor_2, posição: posição_2 }
  const mensagens = ordenar([...new Set(`${valor_1.message} | ${valor_2.message}`.split(" | "))]).join(" | ")
  return { valor: new Error(mensagens), posição }
}

const sequência = (...analisadores) => ({ entrada, posição }) => {
  const { valor: valor_1, posição: posição_1 } = analisadores[0]({ entrada, posição })
  if (valor_1 instanceof Error) return { valor: valor_1, posição: posição_1 }
  if (analisadores.length === 1) return {
    valor: [valor_1],
    posição: posição_1,
  }
  const { valor: valor_2, posição: posição_2 } = sequência(...analisadores.slice(1))({entrada, posição: posição_1})
  if (valor_2 instanceof Error) return { valor: valor_2, posição: posição_2 }
  return {
    valor: [valor_1, ...valor_2],
    posição: posição_2,
  }
}

const sequência_literal = (...analisadores) => ({ entrada, posição }) => {
  const { valor: valor_1, posição: posição_1 } = analisadores[0]({entrada, posição})
  if (valor_1 instanceof Error) return { valor: valor_1, posição: posição_1 }
  if (analisadores.length === 1) return { valor: valor_1, posição: posição_1 }
  const { valor: valor_2, posição: posição_2 } = sequência_literal(...analisadores.slice(1))({ entrada, posição: posição_1 })
  if (valor_2 instanceof Error) return { valor: valor_2, posição: posição_2 }
  return {
    valor: valor_1 + valor_2,
    posição: posição_2,
  }
}

const opcional = (analisador, valor_padrão = "") => ({ entrada, posição }) => {
  const { valor, posição: posição_2 } = analisador({ entrada, posição })
  if (posição_2 > posição) return { valor, posição: posição_2 }
  return {
    valor: valor instanceof Error ? valor_padrão : valor,
    posição,
  }
}

const inverso = analisador => ({ entrada, posição }) => {
  if (posição >= entrada.length) return { valor: new Error("/./"), posição }
  const { valor, } = analisador({ entrada, posição })
  if (valor instanceof Error) return {
    valor: entrada[posição],
    posição: posição + 1,
  }
  return { valor: new Error(`! "${entrada[posição]}"`), posição }
}

const encadeamento = (analisador, continuação) => ({ entrada, posição }) => {
  const { valor: valor_1, posição: posição_1 } = analisador({ entrada, posição })
  if (valor_1 instanceof Error) return { valor: valor_1, posição: posição_1 }
  const { valor: valor_2, posição: posição_2 } = continuação(valor_1)({ entrada, posição: posição_1 })
  if (valor_2 instanceof Error) return { valor: valor_2, posição: posição_2 }
  return {
    valor: valor_2,
    posição: posição_2,
  }
}

const transformação = (analisador, transformador) => ({ entrada, posição }) => {
  const { valor: valor_1, posição: posição_2 } = analisador({ entrada, posição })
  if (valor_1 instanceof Error) return { valor: valor_1, posição: posição_2 }
  return {
    valor: escopo => {
      const valor_2 = transformador(valor_1)(escopo)
      if (valor_2 instanceof Error) {
        if (valor_2.cause !== undefined) return valor_2
        return new Error(valor_2.message, {
          cause: {
            início: posição,
            fim: posição_2,
          },
        })
      }
      return valor_2
    },
    posição: posição_2,
  }
}

const conteúdo_comentário = sequência_literal(
  inverso(
    símbolo("\n"),
  ),
  opcional(
    resultado => conteúdo_comentário(resultado)
  ),
)

const espaço = opcional(
  sequência_literal(
    alternativa(
      símbolo(" "),
      símbolo("\n"),
      sequência_literal(
        símbolo("//"),
        conteúdo_comentário,
        opcional(
          símbolo("\n"),
        ),
      ),
    ),
    opcional(
      resultado => espaço(resultado),
    ),
  )
)

const número_natural_literal = sequência_literal(
  faixa("0", "9"),
  opcional(
    resultado => número_natural_literal(resultado),
  ),
)

const número = transformação(
  sequência(
    opcional(
      símbolo("-"),
    ),
    número_natural_literal,
  ),
  ([sinal, corpo]) => {
    const número = Number(corpo)
    return () => sinal === "-" ? -número : número
  }
)

const negação = transformação(
  sequência(
    símbolo("!"),
    espaço,
    resultado => átomo(resultado),
  ),
  ([, , valor]) => escopo => valor(escopo) === 0 ? 1 : 0
)

const parênteses = transformação(
  sequência(
    símbolo("("),
    espaço,
    resultado => expressão(resultado),
    espaço,
    símbolo(")")
  ),
  ([, , valor, , ]) => valor,
)

const identificador_literal = sequência_literal(
  alternativa(
    faixa("a", "z"),
    faixa("A", "Z"),
    símbolo("_"),
  ),
  opcional(
    resultado => identificador_literal(resultado),
  ),
)

const constante = transformação(
  identificador_literal,
  valor => escopo => {
    if (! (valor in escopo)) return new Error(ordenar(Object.keys(escopo)).join(" | "))
    return escopo[valor](escopo)
  }
)

const átomo = alternativa(
  número,
  negação,
  parênteses,
  constante,
)

const operação = (operando, operadores) => transformação(
  sequência(
    operando,
    espaço,
    opcional(
      sequência(
        alternativa(
          ...Object.keys(operadores).map(símbolo),
        ),
        espaço,
        resultado => operação(operando, operadores)(resultado),
        espaço,
      ),
    ),
  ),
  ([a, , [operador, , b]]) => {
    if (operador === undefined) return a
    return escopo => {
      const valor_a = a(escopo)
      if (valor_a instanceof Error) return valor_a
      const valor_b = b(escopo)
      if (valor_b instanceof Error) return valor_b
      return operadores[operador](valor_a, valor_b)
    }
  }
)

const produto = operação(átomo, {
  "*": (a, b) => a * b,
  "/": (a, b) => a / b,
})

const soma = operação(produto, {
  "+": (a, b) => a + b,
  "-": (a, b) => a - b,
})

const comparação = operação(soma, {
  ">=": (a, b) => a >= b ? 1 : 0,
  "<=": (a, b) => a <= b ? 1 : 0,
  "==": (a, b) => a == b ? 1 : 0,
  "!=": (a, b) => a != b ? 1 : 0,
  ">": (a, b) => a > b ? 1 : 0,
  "<": (a, b) => a < b ? 1 : 0,
})

const comparação_lógica = operação(comparação, {
  "&&": (a, b) => a && b,
  "||": (a, b) => a || b,
})

const expressão_com_declarações = nome => transformação(
  sequência(
    símbolo("="),
    espaço,
    comparação_lógica,
    espaço,
    opcional(
      expressão,
    ),
  ),
  ([, , valor, , próximo]) => escopo => próximo({
    ...escopo,
    [nome]: () => valor(escopo),
  }),
)

const expressão = alternativa(
  encadeamento(
    sequência(
      identificador_literal,
      espaço,
    ),
    ([nome]) => expressão_com_declarações(nome),
  ),
  comparação_lógica,
)

const formatar_erro = (entrada, posição, mensagem, arquivo) => {
  const linhas = entrada.split("\n")
  const número_linha = linhas.length - entrada.slice(posição).split("\n").length + 1
  const linha = linhas[número_linha - 1]
  const número_coluna = linha.length - entrada.slice(posição).split("\n")[0].length + 1
  return [
    `⛔ ${mensagem}`,
    `📄 ${arquivo}`,
    `👉 ${número_linha}: ${linha}`,
    `     ${" ".repeat(número_coluna - 1 + String(número_linha).length)}^ ${número_coluna}`,
  ].join("\n")
}

export const interpretar = ({ entrada, arquivo }) => {
  const { posição: posição_1 } = espaço({ entrada, posição: 0 })
  const { valor: valor_2, posição: posição_2 } = expressão({ entrada, posição: posição_1 })
  if (valor_2 instanceof Error) return {
    saída: "",
    erro: formatar_erro(entrada, posição_2, valor_2.message, arquivo),
  }
  if (posição_2 !== entrada.length) return {
    saída: "",
    erro: formatar_erro(entrada, posição_2, "/$/", arquivo),
  }
  const valor_3 = valor_2({})
  if (valor_3 instanceof Error) return {
    saída: "",
    erro: formatar_erro(entrada, valor_3.cause.início, valor_3.message, arquivo),
  }
  return {
    saída: String(valor_3),
    erro: "",
  }
}