#! /usr/bin/env node

const ordenar = lista => lista.sort((a, b) => a.localeCompare(b))

const símbolo = texto => ({ entrada, posição }) => {
  if (texto[0] !== entrada[posição]) return { erro: `"${texto[0]}"`, posição }
  if (texto.length === 1) return { valor: texto, posição: posição + 1 }
  const resultado = símbolo(texto.slice(1))({ entrada, posição: posição + 1 })
  if (resultado.erro) return { erro: resultado.erro, posição }
  return {
    valor: texto[0] + resultado.valor,
    posição: resultado.posição,
  }
}

const faixa = (de, até) => ({ entrada, posição }) => entrada[posição] >= de && entrada[posição] <= até ? {
  valor: entrada[posição],
  posição: posição + 1,
} : { erro: `/[${de}-${até}]/`, posição }

const alternativa = (...analisadores) => ({ entrada, posição }) => {
  const resultado_1 = analisadores[0]({ entrada, posição })
  if (resultado_1.posição > posição || analisadores.length === 1) return resultado_1
  const resultado_2 = alternativa(...analisadores.slice(1))({ entrada, posição })
  if (resultado_2.posição > posição) return resultado_2
  const mensagens = ordenar([...new Set(`${resultado_1.erro} | ${resultado_2.erro}`.split(" | "))]).join(" | ")
  return { erro: mensagens, posição }
}

const sequência = (...analisadores) => ({ entrada, posição }) => {
  const resultado_1 = analisadores[0]({ entrada, posição })
  if (resultado_1.erro) return resultado_1
  if (analisadores.length === 1) return {
    valor: [resultado_1.valor],
    posição: resultado_1.posição,
  }
  const resultado_2 = sequência(...analisadores.slice(1))({entrada, posição: resultado_1.posição})
  if (resultado_2.erro) return resultado_2
  return {
    valor: [resultado_1.valor, ...resultado_2.valor],
    posição: resultado_2.posição,
  }
}

const sequência_literal = (...analisadores) => ({ entrada, posição }) => {
  const resultado_1 = analisadores[0]({entrada, posição})
  if (resultado_1.erro || analisadores.length === 1) return resultado_1
  const resultado_2 = sequência_literal(...analisadores.slice(1))({ entrada, posição: resultado_1.posição })
  if (resultado_2.erro) return resultado_2
  return {
    valor: resultado_1.valor + resultado_2.valor,
    posição: resultado_2.posição,
  }
}

const opcional = (analisador, valor_padrão = "") => ({ entrada, posição }) => {
  const resultado = analisador({ entrada, posição })
  if (resultado.posição > posição) return resultado
  return {
    valor: valor_padrão,
    posição,
  }
}

const inverso = analisador => ({ entrada, posição }) => {
  if (posição >= entrada.length) return { erro: "/./", posição }
  const resultado = analisador({ entrada, posição })
  if (resultado.erro) return {
    valor: entrada[posição],
    posição: posição + 1,
  }
  return { erro: `! "${entrada[posição]}"`, posição }
}

const encadeamento = (analisador, continuação) => ({ entrada, posição }) => {
  const resultado_1 = analisador({ entrada, posição })
  if (resultado_1.erro) return resultado_1
  return continuação(resultado_1.valor)({ entrada, posição: resultado_1.posição })
}

const transformação = (analisador, transformador) => ({ entrada, posição }) => {
  const resultado = analisador({ entrada, posição })
  if (resultado.erro) return resultado
  return {
    valor: escopo => {
      const valor = transformador(resultado.valor)(escopo)
      if (valor instanceof Error) {
        if (valor.cause !== undefined) return valor
        return new Error(valor.message, {
          cause: {
            início: posição,
            fim: resultado.posição,
          },
        })
      }
      return valor
    },
    posição: resultado.posição,
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
  const resultado_1 = espaço({ entrada, posição: 0 })
  const resultado_2 = expressão({ entrada, posição: resultado_1.posição })
  if (resultado_2.erro) return {
    saída: "",
    erro: formatar_erro(entrada, resultado_2.posição, resultado_2.erro, arquivo),
  }
  if (resultado_2.posição !== entrada.length) return {
    saída: "",
    erro: formatar_erro(entrada, resultado_2.posição, "/$/", arquivo),
  }
  const valor = resultado_2.valor({})
  if (valor instanceof Error) return {
    saída: "",
    erro: formatar_erro(entrada, valor.cause.início, valor.message, arquivo),
  }
  return {
    saída: typeof valor === "number" ? String(valor) : valor,
    erro: "",
  }
}