import { bloco } from "../texto.js"
import { teste } from "./comum.js"

export default [
  ...teste({
    entrada: bloco(`
      . 1
    `),
    símbolos: [
      {
        valor: '1',
        início: 0,
        fim: 1,
        tipo: 'número',
      },
    ],
    árvore: {
      "Número": 1,
    },
    saída: bloco(`
      . 1
    `),
  }),
  ...teste({
    entrada: bloco(`
      .  1
    `),
    símbolos: [
      {
        valor: '1',
        início: 1,
        fim: 2,
        tipo: 'número',
      },
    ],
    saída: bloco(`
      . 1
    `),
  }),
  ...teste({
    entrada: bloco(`
      . 1 // comentário
    `),
    símbolos: [
      {
        valor: '1',
        início: 0,
        fim: 1,
        tipo: 'número',
      },
    ],
    saída: bloco(`
      . 1
    `),
  }),
  ...teste({
    entrada: bloco(`
      . +
    `),
    símbolos: [
      {
        valor: '+',
        início: 0,
        fim: 1,
        tipo: 'operador',
      },
    ],
    erro: bloco(`
      . ⛔ "_" | "!" | "(" | "[" | "\\"" | "#" | "\`" | /[0-9]/ | /[a-z]/ | /[A-Z]/
      . 📄 testar.js
      . 👉 1: +
      .       ^ 1
    `),
  }),
  ...teste({
    entrada: bloco(`
      . 42 + 5
    `),
    símbolos: [
      {
        valor: '42',
        início: 0,
        fim: 2,
        tipo: 'número',
      },
      {
        valor: '+',
        início: 3,
        fim: 4,
        tipo: 'operador',
      },
      {
        valor: '5',
        início: 5,
        fim: 6,
        tipo: 'número',
      },
    ],
    saída: bloco(`
      . 47
    `),
  }),
  ...teste({
    entrada: bloco(`
      . 8 - 4
    `),
    símbolos: [
      {
        valor: '8',
        início: 0,
        fim: 1,
        tipo: 'número',
      },
      {
        valor: '-',
        início: 2,
        fim: 3,
        tipo: 'operador',
      },
      {
        valor: '4',
        início: 4,
        fim: 5,
        tipo: 'número',
      },
    ],
    saída: bloco(`
      . 4
    `),
  }),
  ...teste({
    entrada: bloco(`
      . 3 * 4
    `),
    símbolos: [
      {
        valor: '3',
        início: 0,
        fim: 1,
        tipo: 'número',
      },
      {
        valor: '*',
        início: 2,
        fim: 3,
        tipo: 'operador',
      },
      {
        valor: '4',
        início: 4,
        fim: 5,
        tipo: 'número',
      },
    ],
    saída: bloco(`
      . 12
    `),
  }),
  ...teste({
    entrada: bloco(`
      . 8 / 2
    `),
    símbolos: [
      {
        valor: '8',
        início: 0,
        fim: 1,
        tipo: 'número',
      },
      {
        valor: '/',
        início: 2,
        fim: 3,
        tipo: 'operador',
      },
      {
        valor: '2',
        início: 4,
        fim: 5,
        tipo: 'número',
      },
    ],
    saída: bloco(`
      . 4
    `),
  }),
  ...teste({
    entrada: bloco(`
      . 2147483647 + 1
    `),
    símbolos: [
      {
        valor: '2147483647',
        início: 0,
        fim: 10,
        tipo: 'número',
      },
      {
        valor: '+',
        início: 11,
        fim: 12,
        tipo: 'operador',
      },
      {
        valor: '1',
        início: 13,
        fim: 14,
        tipo: 'número',
      },
    ],
    saída: bloco(`
      . 2147483648
    `),
  }),
  ...teste({
    entrada: bloco(`
      . 4 - 2 - 1
    `),
    símbolos: [
      {
        valor: '4',
        início: 0,
        fim: 1,
        tipo: 'número',
      },
      {
        valor: '-',
        início: 2,
        fim: 3,
        tipo: 'operador',
      },
      {
        valor: '2',
        início: 4,
        fim: 5,
        tipo: 'número',
      },
      {
        valor: '-',
        início: 6,
        fim: 7,
        tipo: 'operador',
      },
      {
        valor: '1',
        início: 8,
        fim: 9,
        tipo: 'número',
      },
    ],
    saída: bloco(`
      . 1
    `),
  }),
  ...teste({
    entrada: bloco(`
      . 2 + 3 * 4
    `),
    símbolos: [
      {
        valor: '2',
        início: 0,
        fim: 1,
        tipo: 'número',
      },
      {
        valor: '+',
        início: 2,
        fim: 3,
        tipo: 'operador',
      },
      {
        valor: '3',
        início: 4,
        fim: 5,
        tipo: 'número',
      },
      {
        valor: '*',
        início: 6,
        fim: 7,
        tipo: 'operador',
      },
      {
        valor: '4',
        início: 8,
        fim: 9,
        tipo: 'número',
      },
    ],
    saída: bloco(`
      . 14
    `),
  }),
  ...teste({
    entrada: bloco(`
      . 10 - 6 / 2
    `),
    símbolos: [
      {
        valor: '10',
        início: 0,
        fim: 2,
        tipo: 'número',
      },
      {
        valor: '-',
        início: 3,
        fim: 4,
        tipo: 'operador',
      },
      {
        valor: '6',
        início: 5,
        fim: 6,
        tipo: 'número',
      },
      {
        valor: '/',
        início: 7,
        fim: 8,
        tipo: 'operador',
      },
      {
        valor: '2',
        início: 9,
        fim: 10,
        tipo: 'número',
      },
    ],
    saída: bloco(`
      . 7
    `),
  }),
  ...teste({
    entrada: bloco(`
      . 8 / 2 + 3 * 2
    `),
    símbolos: [
      {
        valor: '8',
        início: 0,
        fim: 1,
        tipo: 'número',
      },
      {
        valor: '/',
        início: 2,
        fim: 3,
        tipo: 'operador',
      },
      {
        valor: '2',
        início: 4,
        fim: 5,
        tipo: 'número',
      },
      {
        valor: '+',
        início: 6,
        fim: 7,
        tipo: 'operador',
      },
      {
        valor: '3',
        início: 8,
        fim: 9,
        tipo: 'número',
      },
      {
        valor: '*',
        início: 10,
        fim: 11,
        tipo: 'operador',
      },
      {
        valor: '2',
        início: 12,
        fim: 13,
        tipo: 'número',
      },
    ],
    saída: bloco(`
      . 10
    `),
  }),
  ...teste({
    entrada: bloco(`
      . (2 + 3) * 4
    `),
    símbolos: [
      {
        valor: '(',
        início: 0,
        fim: 1,
        tipo: 'pontuação',
      },
      {
        valor: '2',
        início: 1,
        fim: 2,
        tipo: 'número',
      },
      {
        valor: '+',
        início: 3,
        fim: 4,
        tipo: 'operador',
      },
      {
        valor: '3',
        início: 5,
        fim: 6,
        tipo: 'número',
      },
      {
        valor: ')',
        início: 6,
        fim: 7,
        tipo: 'pontuação',
      },
      {
        valor: '*',
        início: 8,
        fim: 9,
        tipo: 'operador',
      },
      {
        valor: '4',
        início: 10,
        fim: 11,
        tipo: 'número',
      },
    ],
    saída: bloco(`
      . 20
    `),
  }),
  ...teste({
    entrada: bloco(`
      . 10 - (6 / 2)
    `),
    símbolos: [
      {
        valor: '10',
        início: 0,
        fim: 2,
        tipo: 'número',
      },
      {
        valor: '-',
        início: 3,
        fim: 4,
        tipo: 'operador',
      },
      {
        valor: '(',
        início: 5,
        fim: 6,
        tipo: 'pontuação',
      },
      {
        valor: '6',
        início: 6,
        fim: 7,
        tipo: 'número',
      },
      {
        valor: '/',
        início: 8,
        fim: 9,
        tipo: 'operador',
      },
      {
        valor: '2',
        início: 10,
        fim: 11,
        tipo: 'número',
      },
      {
        valor: ')',
        início: 11,
        fim: 12,
        tipo: 'pontuação',
      },
    ],
    saída: bloco(`
      . 7
    `),
  }),
  ...teste({
    entrada: bloco(`
      . 1 + 2 * 3 - 4 / 2
    `),
    símbolos: [
      {
        valor: '1',
        início: 0,
        fim: 1,
        tipo: 'número',
      },
      {
        valor: '+',
        início: 2,
        fim: 3,
        tipo: 'operador',
      },
      {
        valor: '2',
        início: 4,
        fim: 5,
        tipo: 'número',
      },
      {
        valor: '*',
        início: 6,
        fim: 7,
        tipo: 'operador',
      },
      {
        valor: '3',
        início: 8,
        fim: 9,
        tipo: 'número',
      },
      {
        valor: '-',
        início: 10,
        fim: 11,
        tipo: 'operador',
      },
      {
        valor: '4',
        início: 12,
        fim: 13,
        tipo: 'número',
      },
      {
        valor: '/',
        início: 14,
        fim: 15,
        tipo: 'operador',
      },
      {
        valor: '2',
        início: 16,
        fim: 17,
        tipo: 'número',
      },
    ],
    saída: bloco(`
      . 5
    `),
  }),
]
