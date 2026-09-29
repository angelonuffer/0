import { encadeamento, esquerda, fim, mapear, opcional, sequência, tipo } from "./dialeto.js"

const analisar = encadeamento(
  tipo("número"),
  número => esquerda(
    opcional(
      mapear(
        sequência(
          tipo("operador"),
          tipo("número"),
        ),
        ([operador, direita]) => ({
          operação: {
            operador,
            esquerda: número,
            direita,
          },
        }),
      ),
      número,
    ),
    fim,
  ),
)

export const analisador_sintático = ({ entrada, posição }) => {
  const resultado = analisar({ entrada, posição })
  if (resultado.erro) return resultado
  return resultado.valor
}