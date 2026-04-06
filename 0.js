#! /usr/bin/env node

export const interpretar = ({ entrada, arquivo }) => {
  const { valor, resto } = expressão(entrada)
  return {
    saída: valor instanceof Error ? "" : String(valor({})),
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

const transformação = (analisador, transformador) => entrada => {
  const { valor, resto } = analisador(entrada)
  if (valor instanceof Error) return { valor, resto }
  return {
    valor: escopo => transformador(valor, escopo),
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

const identificador = casar(/[_\p{L}][_\p{L}\p{N}]*/u)
 
const variável = transformação(
  identificador,
  (nome, escopo) => {
    const valor = escopo[nome]
    if (valor === undefined) return new Error(new RegExp(nome))
    return valor(escopo)
  },
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
    valor: escopo => operadores[símbolo_operador](a(escopo), b(escopo)),
    resto: resto_5,
  }
}

const itens_lista = entrada => {
  const resto_1 = passe(espaço)(entrada)
  if (resto_1.startsWith("]")) return { valor: () => [], resto: resto_1 }
  const { valor: valor_1, resto: resto_2 } = expressão(resto_1)
  if (valor_1 instanceof Error) return { valor: valor_1, resto: resto_2 }
  const resto_3 = passe(espaço)(resto_2)
  if (resto_3.startsWith("]")) return {
    valor: escopo => [valor_1(escopo)],
    resto: resto_3.slice(1),
  }
  if (resto_3.startsWith(",")) {
    const resto_4 = passe(espaço)(resto_3.slice(1))
    const { valor: valor_2, resto: resto_5 } = itens_lista(resto_4)
    if (valor_2 instanceof Error) return { valor: valor_2, resto: resto_5 }
    return {
      valor: escopo => [valor_1(escopo), ...valor_2(escopo)],
      resto: resto_5,
    }
  }
  return { valor: new Error(/,|\]/), resto: resto_3 }
}

const literal = entrada => {
  if (entrada.startsWith('"') || entrada.startsWith("'")) {
    const { valor, resto } = transformação(casar(/"[^"\\]*"|'[^'\\]*'/), s => s.slice(1, -1))(entrada)
    return { valor, resto }
  }
  if (entrada.startsWith("[")) {
    const resto_1 = entrada.slice(1)
    return itens_lista(resto_1)
  }
  return número(entrada)
}

const parênteses = entrada => {
  if (entrada.startsWith("(")) {
    const resto_1 = entrada.slice(1)
    const resto_2 = passe(espaço)(resto_1)
    const { valor, resto } = expressão(resto_2)
    if (valor instanceof Error) return { valor, resto }
    const resto_3 = passe(espaço)(resto)
    if (resto_3.startsWith(")")) return {
      valor,
      resto: resto_3.slice(1),
    }
    return { valor: new Error(/\)/), resto: resto_3 }
  }
  const { valor, resto } = variável(entrada)
  if (valor instanceof Error) return literal(entrada)
  return { valor, resto }
}

const unário = entrada => {
  if (entrada.startsWith("!")) {
    const resto_1 = passe(espaço)(entrada.slice(1))
    const { valor, resto } = unário(resto_1)
    if (valor instanceof Error) return { valor, resto }
    return {
      valor: escopo => Number(valor(escopo)) === 0 ? 1 : 0,
      resto,
    }
  }
  return parênteses(entrada)
}

const produto = operação(
  unário,
  {
    "*": (a, b) => {
      if (Array.isArray(a) && typeof b === "string") return a.join(b)
      return a * b
    },
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

const comparação = operação(
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

const comparação_lógica = operação(
  comparação,
  {
    "&": (a, b) => a && b,
    "|": (a, b) => a || b,
  },
)

const declarações = entrada => {
  const { valor: nome, resto } = identificador(entrada)
  if (nome instanceof Error) return { valor: {}, resto: entrada }
  const resto_2 = passe(espaço)(resto)
  if (!resto_2.startsWith("=")) return { valor: {}, resto: entrada }
  const resto_3 = resto_2.slice(1)
  const resto_4 = passe(espaço)(resto_3)
  const { valor: valor, resto: resto_5 } = expressão(resto_4)
  if (valor instanceof Error) return { valor: new Error(), resto: resto_5 }
  const { valor: outras_declaracoes, resto: resto_6 } = declarações(resto_5)
  if (outras_declaracoes instanceof Error) return { valor: outras_declaracoes, resto: resto_6 }
  return {
    valor: { [nome]: valor, ...outras_declaracoes },
    resto: resto_6,
  }
}

const expressão = entrada => {
  const {
    valor: escopo_declarado,
    resto,
  } = declarações(entrada)
  const { valor, resto: resto_2 } = comparação_lógica(resto)
  if (valor instanceof Error) return { valor, resto: resto_2 }
  return {
    valor: escopo => valor({ ...escopo_declarado, ...escopo }),
    resto: resto_2,
  }
}