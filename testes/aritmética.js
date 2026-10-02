import { bloco } from "./texto-comum.js"
import { teste } from "./comum.js"

export default [
  ...teste({
    entrada: bloco(`
      1
      // comentário
    `),
    símbolos: [
      { número: '1' },
    ],
    árvore: { número: "1" },
    saída: 1,
    js: "1",
  }),
  ...teste({
    entrada: bloco(`
      +
    `),
    símbolos: [
      { operador: '+' },
    ],
    árvore: { erro: "\"!\" | \"(\" | número", posição: 0 },
    erro: bloco(`
      testar.js
      1: +
         ^ 1
      Erro de sintaxe. Esperava:
        "!" | "(" | número
    `)
  }),
  ...teste({
    entrada: bloco(`
      42 + 5
    `),
    símbolos: [
      { número: '42' },
      { operador: '+' },
      { número: '5' },
    ],
    árvore: {
      operação: {
        operador: "+",
        esquerda: { número: "42" },
        direita: { número: "5" },
      },
    },
    saída: 47,
    js: "42+5",
  }),
  ...teste({
    entrada: bloco(`
      8 - 4
    `),
    saída: 4,
    js: "8-4",
  }),
  ...teste({
    entrada: bloco(`
      3 * 4
    `),
    saída: 12,
    js: "3*4",
  }),
  ...teste({
    entrada: bloco(`
      8 / 2
    `),
    saída: 4,
    js: "8/2",
  }),
  ...teste({
    entrada: bloco(`
      2147483647 + 1
    `),
    saída: 2147483648,
    js: "2147483647+1",
  }),
  ...teste({
    entrada: bloco(`
      4 - 2 - 1
    `),
    árvore: {
      operação: {
        operador: "-",
        esquerda: {
          operação: {
            operador: "-",
            esquerda: { número: "4" },
            direita: { número: "2" },
          },
        },
        direita: { número: "1" },
      },
    },
    js: "4-2-1",
    /* saída: bloco(`
      1
    `), */
  }),
  ...teste({
    entrada: bloco(`
      2 + 3 * 4
    `),
    js: "2+3*4",
    /* saída: bloco(`
      14
    `), */
  }),
  ...teste({
    entrada: bloco(`
      10 - 6 / 2
    `),
    js: "10-6/2",
    /* saída: bloco(`
      7
    `), */
  }),
  ...teste({
    entrada: bloco(`
      8 / 2 + 3 * 2
    `),
    js: "8/2+3*2",
    /* saída: bloco(`
      10
    `), */
  }),
  ...teste({
    entrada: bloco(`
      (2 + 3) * 4
    `),
    símbolos: [
      { pontuação: '(' },
      { número: '2' },
      { operador: '+' },
      { número: '3' },
      { pontuação: ')' },
      { operador: '*' },
      { número: '4' },
    ],
    árvore: {
      operação: {
        operador: "*",
        esquerda: {
          operação: {
            operador: "+",
            esquerda: { número: "2" },
            direita: { número: "3" },
          },
        },
        direita: { número: "4" },
      },
    },
    js: "(2+3)*4",
    /* saída: bloco(`
      20
    `), */
  }),
  ...teste({
    entrada: bloco(`
      10 - (6 / 2)
    `),
    js: "10-(6/2)",
    /* saída: bloco(`
      7
    `), */
  }),
  ...teste({
    entrada: bloco(`
      1 + 2 * 3 - 4 / 2
    `),
    js: "1+2*3-4/2",
    /* saída: bloco(`
      5
    `), */
  }),
]
