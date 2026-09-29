import { encadeamento, esquerda, fim, mapear, opcional, sequência, símbolo, tipo } from "./dialeto.js"

export const analisador_sintático = encadeamento(
  tipo("número"),
  número => esquerda(
    opcional(
      mapear(
        sequência(
          símbolo("+"),
          tipo("número"),
        ),
        ([operador, direita]) => ({
          tipo: "operação",
          operador,
          esquerda: número,
          direita,
        }),
      ),
      número,
    ),
    fim,
  ),
)