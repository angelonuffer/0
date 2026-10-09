import { alternativa, encadeamento, esquerda, falha, fim, mapear, prever, repetição, sequência, símbolo, tente, tipo } from "./dialeto.js"

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

const agrupamento = estado => mapear(
  sequência(
    símbolo("("),
    prever(
      ({ entrada, posição }) => entrada[posição]?.pontuação === "$"
        && entrada[posição + 1]?.identificador !== undefined
        && entrada[posição + 2]?.pontuação === "=",
      esquerda(bloco, símbolo(")")),
      esquerda(expressão, fechamento_de_expressão),
    ),
  ),
  ([, árvore]) => ({ ...árvore, agrupado: true }),
)(estado)

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

átomo = alternativa(
  tipo("identificador"),
  tipo("número"),
  agrupamento,
  prefixo,
)

expressão = encadeamento(
  átomo,
  árvore => operações(árvore, átomo),
)

const associação = mapear(
  sequência(
    símbolo("$"),
    tipo("identificador"),
    símbolo("="),
    expressão,
  ),
  ([, nome, , valor]) => ({
    associação: { identificador: nome.identificador, valor },
  }),
)

const instrução = alternativa(
  tente(associação),
  expressão,
)

const bloco = mapear(
  sequência(instrução, repetição(instrução)),
  ([primeira, demais]) => demais.length === 0 ? primeira : { bloco: [primeira, ...demais] },
)

export const analisador_sintático = esquerda(
  bloco,
  alternativa(
    fim,
    falha("operador"),
  )
)
