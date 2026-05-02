#! /usr/bin/env node

import {
  sequência_literal,
  inverso,
  símbolo,
  alternativa,
  faixa,
  opcional,
  transformação,
  encadeamento,
  sequência,
} from "./dialeto.js"
import { ordenar } from "./lista.js"

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
  (valor, início, fim) => escopo => {
    if (! (valor in escopo)) return new Error(ordenar(Object.keys(escopo)).join(" | "), {
      cause: { início, fim },
    })
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