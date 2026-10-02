import { encadeamento, esquerda, fim, mapear, repetição, sequência, tipo } from "./dialeto.js"

const operações = número => mapear(
  repetição(
    sequência(
      tipo("operador"),
      tipo("número"),
    ),
  ),
  operações => operações.reduce((esquerda, [operador, direita]) => ({
    operação: {
      operador,
      esquerda,
      direita,
    },
  }), número),
)

const expressão = encadeamento(
  tipo("número"),
  número => esquerda(
    operações(número),
    fim,
  ),
)

export const analisador_sintático = ({ entrada, posição }) => {
  const resultado = expressão({ entrada, posição })
  if (resultado.erro) return resultado
  return resultado.valor
}