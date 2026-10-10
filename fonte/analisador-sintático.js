import { alternativa, encadeamento, esquerda, fim, mapear, prever, repetição, sequência, símbolo, tente, tipo } from "./dialeto.js"

let expressão
let unário
let átomo

const expressão_diferida = estado => expressão(estado)

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

const texto_inicial = texto => texto
  .replace(/^`/, "")
  .replace(/\$\{$/, "")

const texto_seguinte = texto => texto
  .replace(/^\}/, "")
  .replace(/\$\{$|`$/, "")

const inicia_interpolação = ({ entrada, posição }) =>
  entrada[posição]?.modelo_texto?.includes("${") ?? false

const modelo_texto_simples = mapear(
  tipo("modelo_texto"),
  literal => ({ modelo_texto: literal.modelo_texto }),
)

const modelo_texto_interpolado = mapear(
  sequência(
    tipo("modelo_texto"),
    repetição(
      sequência(
        expressão_diferida,
        tipo("modelo_texto"),
      ),
    ),
  ),
  ([inicial, partes]) => ({
    modelo_texto: partes.reduce(
      (resultado, [valor, literal]) => [
        ...resultado,
        valor,
        texto_seguinte(literal.modelo_texto),
      ],
      [texto_inicial(inicial.modelo_texto)],
    ),
  }),
)

const modelo_texto = prever(
  inicia_interpolação,
  modelo_texto_interpolado,
  modelo_texto_simples,
)

átomo = alternativa(
  tipo("identificador"),
  tipo("número"),
  tipo("texto"),
  modelo_texto,
  agrupamento,
)

unário = alternativa(prefixo, átomo)

const aplicação = encadeamento(
  unário,
  função => ({ entrada, posição }) => {
    const linha = entrada[posição - 1]?.linha
    const argumento = estado => {
      const próximo = entrada[estado.posição]
      if (próximo?.linha !== linha || próximo?.modelo_texto?.startsWith("}")) {
        return { erro: "aplicação", posição: estado.posição }
      }
      return unário(estado)
    }
    const resultado = repetição(argumento)({ entrada, posição })
    if (resultado.erro) return resultado
    return {
      ...resultado,
      valor: resultado.valor.length === 0
        ? função
        : { aplicação: { função, argumentos: resultado.valor } },
    }
  },
)

const produto = operações(aplicação, ["*", "/"])
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
