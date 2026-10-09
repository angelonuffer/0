import { bloco } from "./texto-comum.js"
import { teste } from "./comum.js"

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
    valor: false,
    js: "false",
  }),
  ...teste({
    entrada: bloco(`
      8 > 2
    `),
    js: "true",
  }),
  ...teste({
    entrada: bloco(`
      8 > 8
    `),
    js: "false",
  }),
  ...teste({
    entrada: bloco(`
      2 < 8
    `),
    js: "true",
  }),
  ...teste({
    entrada: bloco(`
      8 < 2
    `),
    js: "false",
  }),
  ...teste({
    entrada: bloco(`
      8 < 8
    `),
    js: "false",
  }),
  ...teste({
    entrada: bloco(`
      2 == 8
    `),
    js: "false",
  }),
  ...teste({
    entrada: bloco(`
      8 == 2
    `),
    js: "false",
  }),
  ...teste({
    entrada: bloco(`
      8 == 8
    `),
    valor: true,
    js: "true",
  }),
  ...teste({
    entrada: bloco(`
      2 != 8
    `),
    js: "true",
  }),
  ...teste({
    entrada: bloco(`
      8 != 2
    `),
    js: "true",
  }),
  ...teste({
    entrada: bloco(`
      8 != 8
    `),
    js: "false",
  }),
  ...teste({
    entrada: bloco(`
      2 >= 8
    `),
    js: "false",
  }),
  ...teste({
    entrada: bloco(`
      8 >= 2
    `),
    js: "true",
  }),
  ...teste({
    entrada: bloco(`
      8 >= 8
    `),
    js: "true",
  }),
  ...teste({
    entrada: bloco(`
      2 <= 8
    `),
    js: "true",
  }),
  ...teste({
    entrada: bloco(`
      8 <= 2
    `),
    js: "false",
  }),
  ...teste({
    entrada: bloco(`
      8 <= 8
    `),
    js: "true",
  }),
]
