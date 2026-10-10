import { bloco, teste } from "./comum.js"

export default [
  ...teste({
    entrada: bloco(`
      2 > 8
    `),
    símbolos: [
      { número: '2' },
      { operador: '>' },
      { número: '8' },
    ],
    árvore: {
      operação: {
        operador: ">",
        esquerda: { número: "2" },
        direita: { número: "8" },
      },
    },
    valor: 0,
    js: "0",
  }),
  ...teste({
    entrada: bloco(`
      8 > 2
    `),
    js: "1",
  }),
  ...teste({
    entrada: bloco(`
      8 > 8
    `),
    js: "0",
  }),
  ...teste({
    entrada: bloco(`
      2 < 8
    `),
    js: "1",
  }),
  ...teste({
    entrada: bloco(`
      8 < 2
    `),
    js: "0",
  }),
  ...teste({
    entrada: bloco(`
      8 < 8
    `),
    js: "0",
  }),
  ...teste({
    entrada: bloco(`
      2 == 8
    `),
    js: "0",
  }),
  ...teste({
    entrada: bloco(`
      8 == 2
    `),
    js: "0",
  }),
  ...teste({
    entrada: bloco(`
      8 == 8
    `),
    js: "1",
  }),
  ...teste({
    entrada: bloco(`
      2 != 8
    `),
    js: "1",
  }),
  ...teste({
    entrada: bloco(`
      8 != 2
    `),
    js: "1",
  }),
  ...teste({
    entrada: bloco(`
      8 != 8
    `),
    js: "0",
  }),
  ...teste({
    entrada: bloco(`
      2 >= 8
    `),
    js: "0",
  }),
  ...teste({
    entrada: bloco(`
      8 >= 2
    `),
    js: "1",
  }),
  ...teste({
    entrada: bloco(`
      8 >= 8
    `),
    js: "1",
  }),
  ...teste({
    entrada: bloco(`
      2 <= 8
    `),
    js: "1",
  }),
  ...teste({
    entrada: bloco(`
      8 <= 2
    `),
    js: "0",
  }),
  ...teste({
    entrada: bloco(`
      8 <= 8
    `),
    js: "1",
  }),
]
