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
  alternativa(símbolo("!"), símbolo("#")),
  operador => mapear(
    unário,
    direita => ({
      operação: {
        operador: operador.operador ?? operador.pontuação,
        direita,
      },
    }),
  ),
)

const modelo_texto = ({ entrada, posição }) => {
  const primeiro = tipo("modelo_texto")({ entrada, posição })
  if (primeiro.erro) return primeiro

  const literal_inicial = primeiro.valor.modelo_texto
  if (!literal_inicial.includes("${")) {
    return {
      valor: { modelo_texto: literal_inicial },
      posição: primeiro.posição,
    }
  }

  const partes = []
  const inicial = literal_inicial
    .replace(/^`/, "")
    .replace(/\$\{$/, "")
  partes.push(inicial)

  let posição_atual = primeiro.posição
  while (true) {
    const valor = expressão({ entrada, posição: posição_atual })
    if (valor.erro) break
    partes.push(valor.valor)
    posição_atual = valor.posição

    const literal = tipo("modelo_texto")({ entrada, posição: posição_atual })
    if (literal.erro) return literal
    const texto = literal.valor.modelo_texto.includes("${")
      ? literal.valor.modelo_texto.replace(/^\}/, "").replace(/\$\{$/, "")
      : literal.valor.modelo_texto.replace(/^\}/, "").replace(/`$/, "")
    partes.push(texto)
    posição_atual = literal.posição
  }

  return { valor: { modelo_texto: partes }, posição: posição_atual }
}

átomo = alternativa(
  tipo("identificador"),
  tipo("número"),
  tipo("texto"),
  modelo_texto,
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
