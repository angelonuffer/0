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
      "",
    ),
  )
)

const número_natural_literal = sequência_literal(
  faixa("0", "9"),
  opcional(
    resultado => número_natural_literal(resultado),
    "",
  ),
)

const número = transformação(
  número_natural_literal,
  (corpo) => () =>  Number(corpo),
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
  zero_ou_mais(
    alternativa(
      faixa("a", "z"),
      faixa("A", "Z"),
      símbolo("_"),
      faixa("0", "9"),
    ),
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

const elementos_lista = transformação(
  sequência(
    resultado => expressão(resultado),
    espaço,
    opcional(
      sequência(
        símbolo(";"),
        espaço,
        resultado => elementos_lista(resultado),
      ),
    ),
  ),
  ([primeiro, , resto]) => {
    if (!resto) return [primeiro]
    const [, , restante] = resto
    return [primeiro, ...restante]
  }
)

const lista_literal = transformação(
  sequência(
    símbolo("["),
    espaço,
    opcional(
      resultado => elementos_lista(resultado),
      [],
    ),
    espaço,
    símbolo("]"),
  ),
  ([, , elementos], início, fim) => escopo => i => {
    if (i === "#") return elementos.length
    if (typeof i !== "number") return new Error("[0-9]+", {
      cause: { início, fim },
    })
    if (i < 0 || i >= elementos.length) return new Error("0-" + (elementos.length - 1), {
      cause: { início, fim },
    })
    return elementos[i](escopo)
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
  lista_literal,
)

const operação = (operação_precedente, operadores) => transformação(
  sequência(
    opcional(
      operação_precedente,
      a => a,
    ),
    espaço,
    opcional(
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
        opcional(
          resultado => operação(operação_precedente, operadores)(resultado),
        ),
        espaço,
      ),
      [],
    ),
  ),
  ([operação_precedente_a, , [operador, , b, , operação_precedente_b, , próximo]]) => a => {
    if (operador === undefined) return operação_precedente_a(a)
    return escopo => {
      const valor_a = operação_precedente_a(a)(escopo)
      if (valor_a instanceof Error) return valor_a
      const valor_b = operação_precedente_b(b)(escopo)
      if (valor_b instanceof Error) return valor_b
      const resultado = operadores[operador](valor_a, valor_b)
      if (! próximo) return resultado
      return próximo(() => resultado)(escopo)
    }
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

const aplicação = transformação(
  sequência(
    expressão_lógica,
    espaço,
    opcional(
      resultado => aplicação(resultado),
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
      aplicação,
      comparação_lógica,
    ),
  ),
  ([identificador_1, , próximo_1]) => escopo => {
    if (próximo_1 instanceof Function) return próximo_1(() => escopo[identificador_1](escopo))(escopo)
    const [, , valor_1, , próximo_2] = próximo_1
    return próximo_2({
      ...escopo,
      [identificador_1]: valor_1,
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