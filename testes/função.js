import { bloco, teste } from "./comum.js"

export default [
  ...teste({
    entrada: bloco(`
      x => x + 1
    `),
    símbolos: [
      { identificador: "x" },
      { operador: "=>" },
      { identificador: "x" },
      { operador: "+" },
      { número: "1" },
    ],
    árvore: {
      função: {
        parâmetro: "x",
        corpo: {
          operação: {
            operador: "+",
            esquerda: { identificador: "x" },
            direita: { número: "1" },
          },
        },
      },
    },
    valor: {
      função: {
        parâmetro: "x",
        corpo: {
          operação: {
            operador: "+",
            esquerda: { identificador: "x" },
            direita: 1,
          },
        },
      },
    },
    js: "(x)=>x+1",
  }),
  ...teste({
    entrada: bloco(`
      (x => x + 1) 4
    `),
    valor: 5,
  }),
  ...teste({
    entrada: bloco(`
      $ incrementar = x => x + 1
      incrementar 4
    `),
    valor: 5,
  }),
  ...teste({
    entrada: bloco(`
      $ fator = 3
      $ multiplicar = x => x * fator
      multiplicar 4
    `),
    valor: 12,
  }),
  ...teste({
    entrada: bloco(`
      $ somar = x => y => x + y
      somar 2 3
    `),
    valor: 5,
  }),
]
