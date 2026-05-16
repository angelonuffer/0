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
  vazio,
  zero_ou_mais,
  um_ou_mais,
} from "./dialeto.js"
import { ordenar } from "./lista.js"

const espaço_na_linha = zero_ou_mais(
  alternativa(
    símbolo(" "),
    sequência_literal(
      símbolo("//"),
      zero_ou_mais(
        inverso(
          símbolo("\n"),
        ),
      ),
    ),
  ),
)

const espaço = zero_ou_mais(
  alternativa(
    símbolo("\n"),
    espaço_na_linha,
  ),
)

const número = transformação(
  um_ou_mais(
    faixa("0", "9"),
  ),
  (corpo) => () =>  Number(corpo.join("")),
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

const identificador_literal = transformação(
  sequência(
    alternativa(
      faixa("a", "z"),
      faixa("A", "Z"),
      símbolo("_"),
    ),
    zero_ou_mais(
      alternativa(
        faixa("a", "z"),
        faixa("A", "Z"),
        símbolo("_"),
        faixa("0", "9"),
      ),
    ),
  ),
  ([primeira_letra, resto]) => primeira_letra + resto.join(""),
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

const texto_literal = transformação(
  sequência(
    símbolo('"'),
    zero_ou_mais(
      inverso(
        símbolo('"'),
      ),
    ),
    símbolo('"'),
  ),
  ([, caracteres, ]) => () => caracteres.join(""),
)

const interpolação = transformação(
  sequência(
    símbolo("${"),
    resultado => expressão(resultado),
    símbolo("}"),
  ),
  ([, expr, ]) => escopo => {
    const val = expr(escopo)
    if (val instanceof Error) return val
    return String(val)
  },
)

const modelo_texto = transformação(
  sequência(
    símbolo("`"),
    zero_ou_mais(
      alternativa(
        interpolação,
        inverso(símbolo("`")),
      ),
    ),
    símbolo("`"),
  ),
  ([, segmentos, ]) => escopo => {
    const partes = segmentos.reduce((acc, seg) => {
      if (acc instanceof Error) return acc
      if (typeof seg === "string") return [...acc, seg]
      const val = seg(escopo)
      if (val instanceof Error) return val
      return [...acc, val]
    }, [])
    if (partes instanceof Error) return partes
    return partes.join("")
  },
)

const tamanho = transformação(
  sequência(
    símbolo("#"),
    resultado => átomo(resultado),
  ),
  ([, valor], início, fim) => escopo => {
    const valor_escopo = valor(escopo)
    if (typeof valor_escopo === "string" || Array.isArray(valor_escopo)) return valor_escopo.length
    if (typeof valor_escopo === "function") return valor_escopo("#")
    return new Error("#[] | #\"\"", {
      cause: { início, fim },
    })
  }
)

const lista = transformação(
  sequência(
    símbolo("["),
    espaço,
    zero_ou_mais(
      sequência(
        opcional(
          símbolo("..."),
        ),
        resultado => expressão(resultado),
        espaço,
      ),
      sequência(
        símbolo(";"),
        espaço,
      ),
    ),
    espaço,
    opcional(
      símbolo(";"),
    ),
    espaço,
    símbolo("]"),
  ),
  ([, , elementos], início, fim) => escopo => {
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
)

const átomo = alternativa(
  número,
  negação,
  parênteses,
  constante,
  texto_literal,
  modelo_texto,
  tamanho,
  lista,
)

const operação = (operação_precedente, operadores) => transformação(
  sequência(
    opcional(
      operação_precedente,
      a => a,
    ),
    espaço,
    zero_ou_mais(
      sequência(
        alternativa(
          ...Object.keys(operadores).map(símbolo),
        ),
        espaço,
        átomo,
        espaço,
        opcional(
          operação_precedente,
          b => b,
        ),
        espaço,
      ),
    ),
  ),
  ([operação_precedente_a, , operações]) => a => {
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
)

const produto = operação(vazio, {
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

const expressão_lógica = transformação(
  sequência(
    átomo,
    espaço,
    comparação_lógica,
  ),
  ([valor, , próximo]) => próximo(valor)
)

const aplicações = transformação(
 sequência(
   átomo,
   espaço,
   opcional(
     resultado => aplicações(resultado),
   ),
 ),
 ([argumento, , próxima], início, fim) => função => escopo => {
   const valor_função = função(escopo)
   if (valor_função instanceof Error) return valor_função
   const idx = argumento(escopo)
   const resultado = typeof valor_função === "function" ? valor_função(idx) : valor_função[idx]
   if (! próxima) return resultado
   return próxima(() => resultado)(escopo)
 },
)

const expressão_iniciada_por_identificador = transformação(
  sequência(
    identificador_literal,
    espaço,
    opcional(
      aplicações,
    ),
    espaço,
    alternativa(
      sequência(
        símbolo("="),
        espaço,
        expressão_lógica,
        espaço,
        alternativa(
          resultado => expressão_iniciada_por_identificador(resultado),
          expressão_lógica,
        ),
        espaço,
      ),
      comparação_lógica,
    ),
  ),
  ([identificador_1, , função_aplicação, , próximo_1]) => escopo => {
    const valor_1 = (função_aplicação instanceof Function) ? função_aplicação(() => escopo[identificador_1](escopo)) : () => escopo[identificador_1](escopo)
    if (próximo_1 instanceof Function) return próximo_1(valor_1)(escopo)
    const [, , valor_2, , próximo_2] = próximo_1
    return próximo_2({
      ...escopo,
      [identificador_1]: valor_2,
    })
  }
)

const expressão = alternativa(
  expressão_iniciada_por_identificador,
  expressão_lógica,
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