import { bloco } from "./texto-comum.js"
import { teste } from "./comum.js"

export default [
  ...teste({
    entrada: bloco(`
      . 1
    `),
    símbolos: [
      { número: '1' },
    ],
    árvore: { número: "1" },
    saída: bloco(`
      . 1
    `),
  }),
  ...teste({
    entrada: bloco(`
      .  1
    `),
    símbolos: [
      { número: '1' },
    ],
    árvore: { número: "1" },
    saída: bloco(`
      . 1
    `),
  }),
  ...teste({
    entrada: bloco(`
      . 1 // comentário
    `),
    símbolos: [
      { número: '1' },
    ],
    árvore: { número: "1" },
    saída: bloco(`
      . 1
    `),
  }),
  ...teste({
    entrada: bloco(`
      . +
    `),
    símbolos: [
      { operador: '+' },
    ],
    /* erro: bloco(`
      . ⛔ "_" | "!" | "(" | "[" | "\\"" | "#" | "\`" | /[0-9]/ | /[a-z]/ | /[A-Z]/
      . 📄 testar.js
      . 👉 1: +
      .       ^ 1
    `), */
  }),
  ...teste({
    entrada: bloco(`
      . 42 + 5
    `),
    símbolos: [
      { número: '42' },
      { operador: '+' },
      { número: '5' },
    ],
    árvore: {
      operação: {
        operador: { operador: "+" },
        esquerda: { número: "42" },
        direita: { número: "5" },
      },
    },
    /* saída: bloco(`
      . 47
    `), */
  }),
  ...teste({
    entrada: bloco(`
      . 8 - 4
    `),
    símbolos: [
      { número: '8' },
      { operador: '-' },
      { número: '4' },
    ],
    /* saída: bloco(`
      . 4
    `), */
  }),
  ...teste({
    entrada: bloco(`
      . 3 * 4
    `),
    símbolos: [
      { número: '3' },
      { operador: '*' },
      { número: '4' },
    ],
    /* saída: bloco(`
      . 12
    `), */
  }),
  ...teste({
    entrada: bloco(`
      . 8 / 2
    `),
    símbolos: [
      { número: '8' },
      { operador: '/' },
      { número: '2' },
    ],
    /* saída: bloco(`
      . 4
    `), */
  }),
  ...teste({
    entrada: bloco(`
      . 2147483647 + 1
    `),
    símbolos: [
      { número: '2147483647' },
      { operador: '+' },
      { número: '1' },
    ],
    /* saída: bloco(`
      . 2147483648
    `), */
  }),
  ...teste({
    entrada: bloco(`
      . 4 - 2 - 1
    `),
    símbolos: [
      { número: '4' },
      { operador: '-' },
      { número: '2' },
      { operador: '-' },
      { número: '1' },
    ],
    /* saída: bloco(`
      . 1
    `), */
  }),
  ...teste({
    entrada: bloco(`
      . 2 + 3 * 4
    `),
    símbolos: [
      { número: '2' },
      { operador: '+' },
      { número: '3' },
      { operador: '*' },
      { número: '4' },
    ],
    /* saída: bloco(`
      . 14
    `), */
  }),
  ...teste({
    entrada: bloco(`
      . 10 - 6 / 2
    `),
    símbolos: [
      { número: '10' },
      { operador: '-' },
      { número: '6' },
      { operador: '/' },
      { número: '2' },
    ],
    /* saída: bloco(`
      . 7
    `), */
  }),
  ...teste({
    entrada: bloco(`
      . 8 / 2 + 3 * 2
    `),
    símbolos: [
      { número: '8' },
      { operador: '/' },
      { número: '2' },
      { operador: '+' },
      { número: '3' },
      { operador: '*' },
      { número: '2' },
    ],
    /* saída: bloco(`
      . 10
    `), */
  }),
  ...teste({
    entrada: bloco(`
      . (2 + 3) * 4
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
    /* saída: bloco(`
      . 20
    `), */
  }),
  ...teste({
    entrada: bloco(`
      . 10 - (6 / 2)
    `),
    símbolos: [
      { número: '10' },
      { operador: '-' },
      { pontuação: '(' },
      { número: '6' },
      { operador: '/' },
      { número: '2' },
      { pontuação: ')' },
    ],
    /* saída: bloco(`
      . 7
    `), */
  }),
  ...teste({
    entrada: bloco(`
      . 1 + 2 * 3 - 4 / 2
    `),
    símbolos: [
      { número: '1' },
      { operador: '+' },
      { número: '2' },
      { operador: '*' },
      { número: '3' },
      { operador: '-' },
      { número: '4' },
      { operador: '/' },
      { número: '2' },
    ],
    /* saída: bloco(`
      . 5
    `), */
  }),
]
