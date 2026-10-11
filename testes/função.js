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
      $ x = 10
      x => x + 1
    `),
    js: "(x)=>x+1",
  }),
  ...teste({
    entrada: bloco(`
      $ somar = x => y => x + y
      somar 2 3
    `),
    valor: 5,
  }),
  ...teste({
    entrada: bloco(`
      x =>
        $ y = x + 1
        y + 3
    `),
    valor: {
      função: {
        parâmetro: "x",
        corpo: {
          operação: {
            operador: "+",
            esquerda: { identificador: "x" },
            direita: 4,
          },
        },
        ambiente: {},
      },
    },
    js: "(x)=>x+4",
  }),
  ...teste({
    entrada: bloco(`
      x => (
        $ y = x + 1
        y + 3
      )
    `),
    árvore: { erro: "fim da entrada", posição: 1 },
  }),
  ...teste({
    entrada: bloco(`
      x =>
        $ y = x + 1
        | y > 0 => y
        | 0
    `),
    árvore: {
      função: {
        parâmetro: "x",
        corpo: {
          bloco: [
            { associação: { identificador: "y", valor: { operação: {
              operador: "+",
              esquerda: { identificador: "x" },
              direita: { número: "1" },
            } } } },
            { guarda: {
              condição: { operação: {
                operador: ">",
                esquerda: { identificador: "y" },
                direita: { número: "0" },
              } },
              corpo: { identificador: "y" },
            } },
            { guarda: {
              corpo: { número: "0" },
            } },
          ],
        },
      },
    },
  }),
  ...teste({
    entrada: bloco(`
      (x =>
        $ y = x + 1
        | y > 0 => y
        | 0
      ) 4
    `),
    valor: 5,
  }),
  ...teste({
    entrada: bloco(`
      x =>
        $ y = x + 1
        | y > 0 => y
        | 0
    `),
    js: "(x)=>x+1>0?x+1:0",
  }),
  ...teste({
    entrada: bloco(`
      x =>
        $ unused = 1 / 0
        $ y = x + 1
        | y > 0 => y
        | 0
    `),
    js: "(x)=>x+1>0?x+1:0",
  }),
  ...teste({
    entrada: bloco(`
      (x =>
        | x > 0 => x
        | 0
      ) 0
    `),
    valor: 0,
  }),
]
