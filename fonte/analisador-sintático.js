import { alternativa, encadeamento, esquerda, fim, mapear, repetição, sequência, símbolo, tente, tipo } from "./dialeto.js"

let expressão
let unário
let átomo

const operações = (analisador, operadores) => encadeamento(
  analisador,
  árvore => mapear(
    repetição(sequência(alternativa(...operadores.map(símbolo)), analisador)),
    operações => operações.reduce((esquerda, [operador, direita]) => ({
      operação: {
        operador: operador.operador,
        esquerda,
        direita,
      },
    }), árvore),
  ),
)

const agrupamento = estado => mapear(
  sequência(
    símbolo("("),
    expressão,
    símbolo(")"),
  ),
  ([, árvore]) => ({ ...árvore, agrupado: true }),
)(estado)

const prefixo = encadeamento(
  símbolo("!"),
  operador => mapear(
    unário,
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
)

unário = alternativa(prefixo, átomo)

const produto = operações(unário, ["*", "/"])
const soma = operações(produto, ["+", "-"])
const comparação = operações(soma, [">", ">=", "<", "<="])
const igualdade = operações(comparação, ["==", "!="])
const conjunção = operações(igualdade, ["&&"])
expressão = operações(conjunção, ["||"])

const valor = alternativa(
  tipo("texto"),
  tipo("modelo_texto"),
  expressão,
)

const associação = mapear(
  sequência(
    símbolo("$"),
    tipo("identificador"),
    símbolo("="),
    valor,
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
  fim,
)
