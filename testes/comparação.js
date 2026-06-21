import { bloco } from "../texto.js"
import { teste } from "./comum.js"

export default [
  ...teste({
    entrada: bloco(`
      . 2 > 8
    `),
    símbolos: [
      {
        valor: '2',
        início: 0,
        fim: 1,
        tipo: 'número',
      },
      {
        valor: '>',
        início: 2,
        fim: 3,
        tipo: 'operador',
      },
      {
        valor: '8',
        início: 4,
        fim: 5,
        tipo: 'número',
      },
    ],
    saída: bloco(`
      . 0
    `),
  }),
  ...teste({
    entrada: bloco(`
      . 8 > 2
    `),
    símbolos: [
      {
        valor: '8',
        início: 0,
        fim: 1,
        tipo: 'número',
      },
      {
        valor: '>',
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
      . 1
    `),
  }),
  ...teste({
    entrada: bloco(`
      . 8 > 8
    `),
    símbolos: [
      {
        valor: '8',
        início: 0,
        fim: 1,
        tipo: 'número',
      },
      {
        valor: '>',
        início: 2,
        fim: 3,
        tipo: 'operador',
      },
      {
        valor: '8',
        início: 4,
        fim: 5,
        tipo: 'número',
      },
    ],
    saída: bloco(`
      . 0
    `),
  }),
  ...teste({
    entrada: bloco(`
      . 2 < 8
    `),
    símbolos: [
      {
        valor: '2',
        início: 0,
        fim: 1,
        tipo: 'número',
      },
      {
        valor: '<',
        início: 2,
        fim: 3,
        tipo: 'operador',
      },
      {
        valor: '8',
        início: 4,
        fim: 5,
        tipo: 'número',
      },
    ],
    saída: bloco(`
      . 1
    `),
  }),
  ...teste({
    entrada: bloco(`
      . 8 < 2
    `),
    símbolos: [
      {
        valor: '8',
        início: 0,
        fim: 1,
        tipo: 'número',
      },
      {
        valor: '<',
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
      . 0
    `),
  }),
  ...teste({
    entrada: bloco(`
      . 8 < 8
    `),
    símbolos: [
      {
        valor: '8',
        início: 0,
        fim: 1,
        tipo: 'número',
      },
      {
        valor: '<',
        início: 2,
        fim: 3,
        tipo: 'operador',
      },
      {
        valor: '8',
        início: 4,
        fim: 5,
        tipo: 'número',
      },
    ],
    saída: bloco(`
      . 0
    `),
  }),
  ...teste({
    entrada: bloco(`
      . 2 == 8
    `),
    símbolos: [
      {
        valor: '2',
        início: 0,
        fim: 1,
        tipo: 'número',
      },
      {
        valor: '==',
        início: 2,
        fim: 4,
        tipo: 'operador',
      },
      {
        valor: '8',
        início: 5,
        fim: 6,
        tipo: 'número',
      },
    ],
    saída: bloco(`
      . 0
    `),
  }),
  ...teste({
    entrada: bloco(`
      . 8 == 2
    `),
    símbolos: [
      {
        valor: '8',
        início: 0,
        fim: 1,
        tipo: 'número',
      },
      {
        valor: '==',
        início: 2,
        fim: 4,
        tipo: 'operador',
      },
      {
        valor: '2',
        início: 5,
        fim: 6,
        tipo: 'número',
      },
    ],
    saída: bloco(`
      . 0
    `),
  }),
  ...teste({
    entrada: bloco(`
      . 8 == 8
    `),
    símbolos: [
      {
        valor: '8',
        início: 0,
        fim: 1,
        tipo: 'número',
      },
      {
        valor: '==',
        início: 2,
        fim: 4,
        tipo: 'operador',
      },
      {
        valor: '8',
        início: 5,
        fim: 6,
        tipo: 'número',
      },
    ],
    saída: bloco(`
      . 1
    `),
  }),
  ...teste({
    entrada: bloco(`
      . 2 != 8
    `),
    símbolos: [
      {
        valor: '2',
        início: 0,
        fim: 1,
        tipo: 'número',
      },
      {
        valor: '!=',
        início: 2,
        fim: 4,
        tipo: 'operador',
      },
      {
        valor: '8',
        início: 5,
        fim: 6,
        tipo: 'número',
      },
    ],
    saída: bloco(`
      . 1
    `),
  }),
  ...teste({
    entrada: bloco(`
      . 8 != 2
    `),
    símbolos: [
      {
        valor: '8',
        início: 0,
        fim: 1,
        tipo: 'número',
      },
      {
        valor: '!=',
        início: 2,
        fim: 4,
        tipo: 'operador',
      },
      {
        valor: '2',
        início: 5,
        fim: 6,
        tipo: 'número',
      },
    ],
    saída: bloco(`
      . 1
    `),
  }),
  ...teste({
    entrada: bloco(`
      . 8 != 8
    `),
    símbolos: [
      {
        valor: '8',
        início: 0,
        fim: 1,
        tipo: 'número',
      },
      {
        valor: '!=',
        início: 2,
        fim: 4,
        tipo: 'operador',
      },
      {
        valor: '8',
        início: 5,
        fim: 6,
        tipo: 'número',
      },
    ],
    saída: bloco(`
      . 0
    `),
  }),
  ...teste({
    entrada: bloco(`
      . 2 >= 8
    `),
    símbolos: [
      {
        valor: '2',
        início: 0,
        fim: 1,
        tipo: 'número',
      },
      {
        valor: '>=',
        início: 2,
        fim: 4,
        tipo: 'operador',
      },
      {
        valor: '8',
        início: 5,
        fim: 6,
        tipo: 'número',
      },
    ],
    saída: bloco(`
      . 0
    `),
  }),
  ...teste({
    entrada: bloco(`
      . 8 >= 2
    `),
    símbolos: [
      {
        valor: '8',
        início: 0,
        fim: 1,
        tipo: 'número',
      },
      {
        valor: '>=',
        início: 2,
        fim: 4,
        tipo: 'operador',
      },
      {
        valor: '2',
        início: 5,
        fim: 6,
        tipo: 'número',
      },
    ],
    saída: bloco(`
      . 1
    `),
  }),
  ...teste({
    entrada: bloco(`
      . 8 >= 8
    `),
    símbolos: [
      {
        valor: '8',
        início: 0,
        fim: 1,
        tipo: 'número',
      },
      {
        valor: '>=',
        início: 2,
        fim: 4,
        tipo: 'operador',
      },
      {
        valor: '8',
        início: 5,
        fim: 6,
        tipo: 'número',
      },
    ],
    saída: bloco(`
      . 1
    `),
  }),
  ...teste({
    entrada: bloco(`
      . 2 <= 8
    `),
    símbolos: [
      {
        valor: '2',
        início: 0,
        fim: 1,
        tipo: 'número',
      },
      {
        valor: '<=',
        início: 2,
        fim: 4,
        tipo: 'operador',
      },
      {
        valor: '8',
        início: 5,
        fim: 6,
        tipo: 'número',
      },
    ],
    saída: bloco(`
      . 1
    `),
  }),
  ...teste({
    entrada: bloco(`
      . 8 <= 2
    `),
    símbolos: [
      {
        valor: '8',
        início: 0,
        fim: 1,
        tipo: 'número',
      },
      {
        valor: '<=',
        início: 2,
        fim: 4,
        tipo: 'operador',
      },
      {
        valor: '2',
        início: 5,
        fim: 6,
        tipo: 'número',
      },
    ],
    saída: bloco(`
      . 0
    `),
  }),
  ...teste({
    entrada: bloco(`
      . 8 <= 8
    `),
    símbolos: [
      {
        valor: '8',
        início: 0,
        fim: 1,
        tipo: 'número',
      },
      {
        valor: '<=',
        início: 2,
        fim: 4,
        tipo: 'operador',
      },
      {
        valor: '8',
        início: 5,
        fim: 6,
        tipo: 'número',
      },
    ],
    saída: bloco(`
      . 1
    `),
  }),
]
