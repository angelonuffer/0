import { alternativa, encadeamento, esquerda, fim, mapear, prever, repetição, sequência, símbolo, tipo } from "./dialeto.js"

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

const agrupamento = encadeamento(
  símbolo("("),
  () => mapear(
    esquerda(bloco, símbolo(")")),
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

const átomo = alternativa(
  tipo("identificador"),
  tipo("número"),
  agrupamento,
  prefixo,
)

expressão = encadeamento(
  átomo,
  árvore => operações(árvore, átomo),
)

const associação = encadeamento(
  tipo("identificador"),
  nome => encadeamento(
    símbolo("="),
    () => mapear(
      expressão,
      valor => ({ associação: { identificador: nome.identificador, valor } }),
    ),
  ),
)

const instrução = prever(
  ({ entrada, posição }) => entrada[posição]?.identificador !== undefined
    && entrada[posição + 1]?.operador === "=",
  associação,
  expressão,
)

const bloco = mapear(
  sequência(instrução, repetição(instrução)),
  ([primeira, demais]) => demais.length === 0 ? primeira : { bloco: [primeira, ...demais] },
)

export const analisador_sintático = ({ entrada, posição }) => {
  const resultado = esquerda(bloco, fim)({ entrada, posição })
  if (resultado.erro) return resultado
  return resultado.valor
}