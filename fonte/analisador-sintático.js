import { alternativa, encadeamento, esquerda, fim, mapear, repetição, sequência, símbolo, tipo } from "./dialeto.js"

const operações = (árvore, analisador_átomo) => mapear(
  repetição(
    sequência(
      tipo("operador"),
      analisador_átomo,
    ),
  ),
  operações => operações.reduce((esquerda, [operador, direita]) => ({
    operação: {
      operador,
      esquerda,
      direita,
    },
  }), árvore),
)

let expressão

const agrupamento = encadeamento(
  símbolo("("),
  () => mapear(
    esquerda(expressão, símbolo(")")),
    árvore => ({ ...árvore, agrupado: true }),
  ),
)

const átomo = alternativa(
  tipo("número"),
  agrupamento,
)

expressão = encadeamento(
  átomo,
  árvore => operações(árvore, átomo),
)

export const analisador_sintático = ({ entrada, posição }) => {
  const resultado = esquerda(expressão, fim)({ entrada, posição })
  if (resultado.erro) return resultado
  return resultado.valor
}