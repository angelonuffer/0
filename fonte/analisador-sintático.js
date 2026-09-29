import { encadeamento, esquerda, fim, mapear, opcional, sequência, símbolo, tipo } from "./dialeto.js"

const analisar = encadeamento(
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

const converter_árvore = árvore => {
  if (árvore.tipo === "operação") return {
    operação: {
      operador: converter_árvore(árvore.operador),
      esquerda: converter_árvore(árvore.esquerda),
      direita: converter_árvore(árvore.direita),
    },
  }
  return { [árvore.tipo]: árvore.valor }
}

export const analisador_sintático = ({ entrada, posição }) => {
  const entrada_normalizada = entrada.map(token => {
    const tipo = Object.keys(token).find(chave => chave !== "início" && chave !== "fim")
    return {
      ...token,
      valor: token[tipo],
      tipo,
    }
  })
  const resultado = analisar({ entrada: entrada_normalizada, posição })
  if (resultado.erro) return resultado
  return converter_árvore(resultado.valor)
}