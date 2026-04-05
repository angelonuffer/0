#! /usr/bin/env node

export const interpretar = ({ entrada, arquivo }) => {
  const { valor, resto } = expressão(entrada)
  return {
    saída: valor instanceof Error ? "" : String(valor),
    erro: resto !== "" ? (() => {
      const linhas = entrada.split("\n")
      const número_linha = linhas.length - resto.split("\n").length + 1
      const linha = linhas[número_linha - 1]
      const número_coluna = linha.length - resto.split("\n")[0].length + 1
      return [
        `⛔ ${valor instanceof Error ? valor.message : ""}`,
        `📄 ${arquivo}`,
        `👉 ${número_linha}: ${linha}`,
        `     ${" ".repeat(número_coluna - 1 + String(número_linha).length)}^ ${número_coluna}`,
      ].join("\n")
    })() : "",
  }
}

const sequência = (...analisadores) => entrada => {
  if (analisadores.length === 1) return analisadores[0](entrada)
  const {
    valor,
    resto,
  } = analisadores[0](entrada)
  if (valor instanceof Error) return { valor: [valor], resto }
  const {
    valor: valor_2,
    resto: resto_2,
  } = sequência(...analisadores.slice(1))(resto)
  if (valor_2 instanceof Error) return { valor: [valor_2], resto: resto_2 }
  return {
    valor: [valor, ...valor_2],
    resto: resto_2,
  }
}

const transformação = (analisador, transformador) => entrada => {
  const { valor, resto } = analisador(entrada)
  if (valor instanceof Error) return { valor, resto }
  return {
    valor: transformador(valor),
    resto,
  }
}

const passe = analisador => entrada => analisador(entrada).resto

const casar = regex => {
  const ancorado = new RegExp("^" + regex.source, regex.flags)
  return entrada => {
    const resultado = ancorado.exec(entrada)
    if (resultado) {
      return {
        valor: resultado[0],
        resto: entrada.slice(resultado[0].length),
      }
    }
    return {
      valor: new Error(regex),
      resto: entrada,
    }
  }
}

const número = transformação(
  casar(/-?\d+/),
  Number,
)

const espaço = casar(/\s*/)

const operação = (operando, operadores) => entrada => {
  const { valor: a, resto } = operando(entrada)
  if (a instanceof Error) return { valor: a, resto }
  const resto_2 = passe(espaço)(resto)
  const símbolo_operador = Object.keys(operadores).find(símbolo_operador => resto_2.startsWith(símbolo_operador))
  if (símbolo_operador === undefined) return { valor: a, resto: resto_2 }
  const resto_3 = resto_2.slice(símbolo_operador.length)
  const resto_4 = passe(espaço)(resto_3)
  const { valor: b, resto: resto_5 } = operação(operando, operadores)(resto_4)
  if (b instanceof Error) return { valor: b, resto: resto_5 }
  return {
    valor: operadores[símbolo_operador](a, b),
    resto: resto_5,
  }
}

const parêntese = entrada => {
  if (entrada[0] === "(") {
    const resto_1 = entrada.slice(1)
    const resto_2 = passe(espaço)(resto_1)
    const { valor, resto } = expressão(resto_2)
    if (valor instanceof Error) return { valor, resto }
    const resto_3 = passe(espaço)(resto)
    if (!resto_3.startsWith(")")) return { valor: new Error(")"), resto: resto_3 }
    return {
      valor,
      resto: resto_3.slice(1),
    }
  }
  return número(entrada)
}

const produto = operação(
  parêntese,
  {
    "*": (a, b) => a * b,
    "/": (a, b) => a / b,
  },
)

const soma = operação(
  produto,
  {
    "+": (a, b) => a + b,
    "-": (a, b) => a - b,
  },
)

const comparacao = operação(
  soma,
  {
    ">=": (a, b) => a >= b ? 1 : 0,
    "<=": (a, b) => a <= b ? 1 : 0,
    "==": (a, b) => a == b ? 1 : 0,
    "!=": (a, b) => a != b ? 1 : 0,
    ">": (a, b) => a > b ? 1 : 0,
    "<": (a, b) => a < b ? 1 : 0,
  },
)

const expressão = comparacao