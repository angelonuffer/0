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
  tipo("texto"),
  tipo("modelo_texto"),
  agrupamento,
)

unário = alternativa(prefixo, átomo)

const produto = operações(unário, ["*", "/"])
const soma = operações(produto, ["+", "-"])
const comparação = operações(soma, [">", ">=", "<", "<="])
const igualdade = operações(comparação, ["==", "!="])
const conjunção = operações(igualdade, ["&&"])
expressão = operações(conjunção, ["||"])

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

const elemento_do_bloco = alternativa(tente(associação), expressão)

const bloco = mapear(
  sequência(elemento_do_bloco, repetição(elemento_do_bloco)),
  ([primeira, demais]) => demais.length === 0
    && primeira.texto === undefined
    && primeira.modelo_texto === undefined
    ? primeira
    : { bloco: [primeira, ...demais] },
)

export const analisador_sintático = esquerda(
  bloco,
  fim,
)
