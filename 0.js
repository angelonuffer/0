#! /usr/bin/env node

const símbolo = texto => ({ entrada, posição }) => {
  const { valor_1, posição_1 } = texto[0] === entrada[posição] ? {
    valor_1: () => texto[0],
    posição_1: posição + 1,
  } : {
    valor_1: new Error(`"${texto[0]}"`),
    posição_1: posição,
  }
  if (valor_1 instanceof Error) return { valor: valor_1, posição: posição_1 }
  if (texto.length === 1) return { valor: () => texto, posição: posição_1 }
  const { valor: valor_2, posição: posição_2 } = símbolo(texto.slice(1))({ entrada, posição: posição_1 })
  if (valor_2 instanceof Error) return { valor: valor_2, posição }
  return {
    valor: escopo => texto[0] + valor_2(escopo),
    posição: posição_2,
  }
}

const faixa = (de, até) => ({ entrada, posição }) => entrada[posição] >= de && entrada[posição] <= até ? {
  valor: () => entrada[posição],
  posição: posição + 1,
} : { valor: new Error(`/[${de}-${até}]/`), posição }

const alternativa = (...analisadores) => ({ entrada, posição }) => {
  const { valor: valor_1, posição: posição_1 } = analisadores[0]({ entrada, posição })
  if (posição_1 > posição) return { valor: valor_1, posição: posição_1 }
  if (analisadores.length === 1) return { valor: valor_1, posição: posição_1 }
  const { valor: valor_2, posição: posição_2 } = alternativa(...analisadores.slice(1))({ entrada, posição })
  if (posição_2 > posição) return { valor: valor_2, posição: posição_2 }
  return { valor: new Error(`${valor_1.message} | ${valor_2.message}`), posição }
}

const sequência = (...analisadores) => ({ entrada, posição }) => {
  const { valor: valor_1, posição: posição_1 } = analisadores[0]({ entrada, posição })
  if (valor_1 instanceof Error) return { valor: valor_1, posição: posição_1 }
  if (analisadores.length === 1) return {
    valor: escopo => [valor_1(escopo)],
    posição: posição_1,
  }
  const { valor: valor_2, posição: posição_2 } = sequência(...analisadores.slice(1))({entrada, posição: posição_1})
  if (valor_2 instanceof Error) return { valor: valor_2, posição: posição_2 }
  return {
    valor: escopo => [valor_1(escopo), ...valor_2(escopo)],
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
    valor: escopo => valor_1(escopo) + valor_2(escopo),
    posição: posição_2,
  }
}

const opcional = analisador => ({ entrada, posição }) => {
  const resultado = analisador({ entrada, posição })
  if (resultado.valor instanceof Error) return { valor: () => "", posição }
  return resultado
}

const inverso = analisador => ({ entrada, posição }) => {
  if (posição >= entrada.length) return { valor: new Error(`/./`), posição }
  const resultado = analisador({ entrada, posição })
  if (resultado.valor instanceof Error) {
    return {
      valor: () => entrada[posição],
      posição: posição + 1,
    }
  }
  return { valor: new Error(`! "${entrada[posição]}"`), posição }
}

const ignorado = analisador => ({ entrada, posição }) => {
  const resultado = analisador({ entrada, posição })
  if (resultado.valor instanceof Error) return { valor: () => "", posição }
  return { valor: () => "", posição: resultado.posição }
}

const transformação = (analisador, transformador) => ({ entrada, posição }) => {
  const { valor, posição: novaPos } = analisador({ entrada, posição })
  if (valor instanceof Error) return { valor, posição: novaPos }
  return {
    valor: escopo => transformador(valor(escopo), escopo),
    posição: novaPos,
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

const espaço = ignorado(
  opcional(
    sequência_literal(
      alternativa(
        símbolo(" "),
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
    return sinal === "-" ? -número : número
  }
)

const negação = transformação(
  sequência(
    símbolo("!"),
    espaço,
    resultado => átomo(resultado),
  ),
  ([, , valor]) => valor === 0 ? 1 : 0
)

const parênteses = transformação(
  sequência(
    símbolo("("),
    resultado => expressão(resultado),
    símbolo(")")
  ),
  ([, valor]) => valor,
)

const átomo = alternativa(
  número,
  negação,
  parênteses,
)

const operação = (operando, operadores) => transformação(
  sequência(
    espaço,
    operando,
    opcional(
      sequência(
        espaço,
        alternativa(
          ...Object.keys(operadores).map(símbolo),
        ),
        espaço,
        resultado => operação(operando, operadores)(resultado),
      ),
    ),
  ),
  ([, a, [, operador, , b]]) => {
    if (operador === undefined) return a
    return operadores[operador](a, b)
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

const expressão = transformação(
  sequência(
    comparação_lógica,
    espaço,
  ),
  ([valor]) => valor
)

export const interpretar = ({ entrada, arquivo }) => {
  const resultado = expressão({ entrada, posição: 0 })
  const { valor, posição } = resultado
  return {
    saída: valor instanceof Error ? "" : String(valor({})),
    erro: (posição !== entrada.length || valor instanceof Error) ? (() => {
      const resto = entrada.slice(posição)
      const linhas = entrada.split("\n")
      const número_linha = linhas.length - resto.split("\n").length + 1
      const linha = linhas[número_linha - 1]
      const número_coluna = linha.length - resto.split("\n")[0].length + 1
      return [
        `⛔ ${valor instanceof Error ? valor.message : "! /./"}`,
        `📄 ${arquivo}`,
        `👉 ${número_linha}: ${linha}`,
        `     ${" ".repeat(número_coluna - 1 + String(número_linha).length)}^ ${número_coluna}`,
      ].join("\n")
    })() : "",
  }
}