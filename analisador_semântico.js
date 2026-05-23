import { ordenar } from "./lista.js"

export const avaliar_número = (corpo) => () =>  Number(corpo.join(""))

export const avaliar_negação = ([, , valor]) => escopo => valor(escopo) === 0 ? 1 : 0

export const avaliar_parênteses = ([, , valor, , ]) => valor

export const avaliar_constante = (valor, início, fim) => escopo => {
  if (! (valor in escopo)) return new Error(ordenar(Object.keys(escopo)).join(" | "), {
    cause: { início, fim },
  })
  return escopo[valor](escopo)
}

export const avaliar_texto_literal = ([, caracteres, ]) => () => caracteres.join("")

export const avaliar_interpolação = ([, expr, ]) => escopo => {
  const val = expr(escopo)
  if (val instanceof Error) return val
  return String(val)
}

export const avaliar_modelo_texto = ([, segmentos, ]) => escopo => {
  const partes = segmentos.reduce((acc, seg) => {
    if (acc instanceof Error) return acc
    if (typeof seg === "string") return [...acc, seg]
    const val = seg(escopo)
    if (val instanceof Error) return val
    return [...acc, val]
  }, [])
  if (partes instanceof Error) return partes
  return partes.join("")
}

export const avaliar_tamanho = ([, valor], início, fim) => escopo => {
  const valor_escopo = valor(escopo)
  if (typeof valor_escopo === "string" || Array.isArray(valor_escopo)) return valor_escopo.length
  if (typeof valor_escopo === "function") return valor_escopo("#")
  return new Error("#[] | #\"\"", {
    cause: { início, fim },
  })
}

export const avaliar_lista = ([, , elementos], início, fim) => escopo => {
  const tamanho = (i = 0) => {
    if (i === elementos.length) return 0
    if (elementos[i][0] === "...") return elementos[i][1](escopo)("#") + tamanho(i + 1)
    return 1 + tamanho(i + 1)
  }
  const obter = (i_resultado, i_elementos = 0, i_atual = 0) => {
    if (i_resultado < 0 || i_elementos === elementos.length) return new Error("0-" + (tamanho() - 1), {
      cause: { início, fim },
    })
    if (elementos[i_elementos][0] === "...") {
      if (i_resultado < i_atual + elementos[i_elementos][1](escopo)("#")) {
        return elementos[i_elementos][1](escopo)(i_resultado - i_atual)
      }
      return obter(i_resultado, i_elementos + 1, i_atual + elementos[i_elementos][1](escopo)("#"))
    }
    if (i_resultado === i_atual) {
      return elementos[i_elementos][1](escopo)
    }
    return obter(i_resultado, i_elementos + 1, i_atual + 1)
  }
  return i => {
    if (i === "#") return tamanho()
    if (typeof i !== "number") return new Error("[0-9]+", {
      cause: { início, fim },
    })
    return obter(i)
  }
}

export const avaliar_operação = operadores => ([operação_precedente_a, , operações]) => a => {
  const aplicar = (valor_a, i = 0) => escopo => {
    if (i === operações.length) return valor_a(escopo)
    const [operador, , b, , operação_precedente_b] = operações[i]
    const atual = valor_a(escopo)
    if (atual instanceof Error) return atual
    const valor_b = operação_precedente_b(b)(escopo)
    if (valor_b instanceof Error) return valor_b
    return aplicar(() => operadores[operador](atual, valor_b), i + 1)(escopo)
  }
  return aplicar(operação_precedente_a(a))
}

export const avaliar_expressão_lógica = ([valor, , próximo]) => próximo(valor)

export const avaliar_aplicações = ([argumento, , próxima], início, fim) => função => escopo => {
  const valor_função = função(escopo)
  if (valor_função instanceof Error) return valor_função
  const idx = argumento(escopo)
  const resultado = typeof valor_função === "function" ? valor_função(idx) : valor_função[idx]
  if (! próxima) return resultado
  return próxima(() => resultado)(escopo)
}

export const avaliar_expressão_iniciada_por_identificador = ([identificador_1, , função_aplicação, , próximo_1]) => escopo => {
  const valor_1 = (função_aplicação instanceof Function) ? função_aplicação(() => escopo[identificador_1](escopo)) : () => escopo[identificador_1](escopo)
  if (próximo_1 instanceof Function) return próximo_1(valor_1)(escopo)
  const [, , valor_2, , próximo_2] = próximo_1
  return próximo_2({
    ...escopo,
    [identificador_1]: valor_2,
  })
}

export const operadores_produto = {
  "*": (a, b) => a * b,
  "/": (a, b) => a / b,
}

export const operadores_soma = {
  "+": (a, b) => a + b,
  "-": (a, b) => a - b,
}

export const operadores_comparação = {
  ">=": (a, b) => a >= b ? 1 : 0,
  "<=": (a, b) => a <= b ? 1 : 0,
  "==": (a, b) => a == b ? 1 : 0,
  "!=": (a, b) => a != b ? 1 : 0,
  ">": (a, b) => a > b ? 1 : 0,
  "<": (a, b) => a < b ? 1 : 0,
}

export const operadores_comparação_lógica = {
  "&&": (a, b) => a && b,
  "||": (a, b) => a || b,
}
