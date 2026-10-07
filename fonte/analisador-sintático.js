import { encadeamento, esquerda, fim, mapear, prever, repetição, sequência, símbolo, tipo } from "./dialeto.js"

const operações = (árvore, analisador_átomo) => mapear(
  repetição(
    sequência(
      tipo("operador"),
      analisador_átomo,
    ),
  ),
  operações => operações.reduce((esquerda, [operador, direita]) => ({
    operação: {
      operador: operador.operador,
      esquerda,
      direita,
    },
  }), árvore),
)

let expressão
let átomo

const fechamento_de_expressão = ({ entrada, posição }) => {
  const resultado = símbolo(")")({ entrada, posição })
  if (resultado.erro) return {
    erro: "\")\" | operador",
    posição: resultado.posição,
  }
  return resultado
}

const agrupamento = encadeamento(
  símbolo("("),
  () => mapear(
    prever(
      ({ entrada, posição }) => entrada[posição]?.pontuação === "$"
        && entrada[posição + 1]?.identificador !== undefined
        && entrada[posição + 2]?.pontuação === "=",
      esquerda(bloco, símbolo(")")),
      esquerda(expressão, fechamento_de_expressão),
    ),
    árvore => ({ ...árvore, agrupado: true }),
  ),
)

const prefixo = encadeamento(
  símbolo("!"),
  operador => mapear(
    átomo,
    direita => ({
      operação: {
        operador: operador.operador,
        direita,
      },
    }),
  ),
)

átomo = ({ entrada, posição }) => {
  const token = entrada[posição]
  if (token?.identificador !== undefined) return tipo("identificador")({ entrada, posição })
  if (token?.número !== undefined) return tipo("número")({ entrada, posição })
  if (token?.pontuação === "(") return agrupamento({ entrada, posição })
  if (token?.operador === "!") return prefixo({ entrada, posição })
  return {
    erro: "\"!\" | \"(\" | identificador | número",
    posição,
  }
}

expressão = encadeamento(
  átomo,
  árvore => operações(árvore, átomo),
)

const associação = encadeamento(
  símbolo("$"),
  () => encadeamento(
    tipo("identificador"),
    nome => encadeamento(
      símbolo("="),
      () => mapear(
        expressão,
        valor => ({ associação: { identificador: nome.identificador, valor } }),
      ),
    ),
  ),
)

const instrução = prever(
  ({ entrada, posição }) => entrada[posição]?.pontuação === "$"
    && entrada[posição + 1]?.identificador !== undefined
    && entrada[posição + 2]?.pontuação === "=",
  associação,
  expressão,
)

const bloco = mapear(
  sequência(instrução, repetição(instrução)),
  ([primeira, demais]) => demais.length === 0 ? primeira : { bloco: [primeira, ...demais] },
)

export const analisador_sintático = ({ entrada, posição }) => {
  const fim_ou_operador = ({ entrada, posição }) => {
    const resultado = fim({ entrada, posição })
    if (resultado.erro) return { ...resultado, erro: "fim da entrada | operador" }
    return resultado
  }
  const resultado = esquerda(bloco, fim_ou_operador)({ entrada, posição })
  if (resultado.erro) return resultado
  return resultado.valor
}