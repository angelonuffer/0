import { bloco } from "./texto-comum.js"
import { teste } from "./comum.js"

export default [
  ...teste({
    entrada: bloco(`
      0 && 0
    `),
    símbolos: [
      { número: '0' },
      { operador: '&&' },
      { número: '0' },
    ],
    árvore: {
      operação: {
        operador: "&&",
        esquerda: { número: "0" },
        direita: { número: "0" },
      },
    },
    valor: 0,
    js: "0",
  }),
  ...teste({
    entrada: bloco(`
      0 && 1
    `),
    js: "0",
  }),
  ...teste({
    entrada: bloco(`
      1 && 0
    `),
    js: "0",
  }),
  ...teste({
    entrada: bloco(`
      1 && 2
    `),
    js: "2",
  }),
  ...teste({
    entrada: bloco(`
      0 || 0
    `),
    js: "0",
  }),
  ...teste({
    entrada: bloco(`
      0 || 1
    `),
    js: "1",
  }),
  ...teste({
    entrada: bloco(`
      1 || 0
    `),
    js: "1",
  }),
  ...teste({
    entrada: bloco(`
      1 || 2
    `),
    js: "1",
  }),
  ...teste({
    entrada: bloco(`
      ! 0
    `),
    js: "1",
  }),
  ...teste({
    entrada: bloco(`
      ! 1
    `),
    js: "0",
  }),
  ...teste({
    entrada: bloco(`
      ! ! 0
    `),
    js: "0",
  }),
  ...teste({
    entrada: bloco(`
      0 && (1 / 0)
    `),
    js: "0",
  }),
]
