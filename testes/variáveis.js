import { bloco } from "../texto.js"
import { teste } from "./comum.js"

export default [
  ...teste({
    entrada: bloco(`
      . a = 11
      . 12 + a
    `),
    símbolos: [
      {
        valor: 'a',
        início: 0,
        fim: 1,
        tipo: 'identificador',
      },
      {
        valor: '=',
        início: 2,
        fim: 3,
        tipo: 'operador',
      },
      {
        valor: '11',
        início: 4,
        fim: 6,
        tipo: 'número',
      },
      {
        valor: '12',
        início: 7,
        fim: 9,
        tipo: 'número',
      },
      {
        valor: '+',
        início: 10,
        fim: 11,
        tipo: 'operador',
      },
      {
        valor: 'a',
        início: 12,
        fim: 13,
        tipo: 'identificador',
      },
    ],
    saída: bloco(`
      . 23
    `),
  }),
  ...teste({
    entrada: bloco(`
      . a = 5
      . b = 8
      . 2 + a + b
    `),
    símbolos: [
      {
        valor: 'a',
        início: 0,
        fim: 1,
        tipo: 'identificador',
      },
      {
        valor: '=',
        início: 2,
        fim: 3,
        tipo: 'operador',
      },
      {
        valor: '5',
        início: 4,
        fim: 5,
        tipo: 'número',
      },
      {
        valor: 'b',
        início: 6,
        fim: 7,
        tipo: 'identificador',
      },
      {
        valor: '=',
        início: 8,
        fim: 9,
        tipo: 'operador',
      },
      {
        valor: '8',
        início: 10,
        fim: 11,
        tipo: 'número',
      },
      {
        valor: '2',
        início: 12,
        fim: 13,
        tipo: 'número',
      },
      {
        valor: '+',
        início: 14,
        fim: 15,
        tipo: 'operador',
      },
      {
        valor: 'a',
        início: 16,
        fim: 17,
        tipo: 'identificador',
      },
      {
        valor: '+',
        início: 18,
        fim: 19,
        tipo: 'operador',
      },
      {
        valor: 'b',
        início: 20,
        fim: 21,
        tipo: 'identificador',
      },
    ],
    saída: bloco(`
      . 15
    `),
  }),
  ...teste({
    entrada: bloco(`
      . a = 5
      . b = 8
      . 3 + c
    `),
    símbolos: [
      {
        valor: 'a',
        início: 0,
        fim: 1,
        tipo: 'identificador',
      },
      {
        valor: '=',
        início: 2,
        fim: 3,
        tipo: 'operador',
      },
      {
        valor: '5',
        início: 4,
        fim: 5,
        tipo: 'número',
      },
      {
        valor: 'b',
        início: 6,
        fim: 7,
        tipo: 'identificador',
      },
      {
        valor: '=',
        início: 8,
        fim: 9,
        tipo: 'operador',
      },
      {
        valor: '8',
        início: 10,
        fim: 11,
        tipo: 'número',
      },
      {
        valor: '3',
        início: 12,
        fim: 13,
        tipo: 'número',
      },
      {
        valor: '+',
        início: 14,
        fim: 15,
        tipo: 'operador',
      },
      {
        valor: 'c',
        início: 16,
        fim: 17,
        tipo: 'identificador',
      },
    ],
    erro: bloco(`
      . ⛔ a | b
      . 📄 testar.js
      . 👉 3: 3 + c
      .           ^ 5
    `),
  }),
  ...teste({
    entrada: bloco(`
      . a = 5
      . b = 8
      . a + b
    `),
    símbolos: [
      {
        valor: 'a',
        início: 0,
        fim: 1,
        tipo: 'identificador',
      },
      {
        valor: '=',
        início: 2,
        fim: 3,
        tipo: 'operador',
      },
      {
        valor: '5',
        início: 4,
        fim: 5,
        tipo: 'número',
      },
      {
        valor: 'b',
        início: 6,
        fim: 7,
        tipo: 'identificador',
      },
      {
        valor: '=',
        início: 8,
        fim: 9,
        tipo: 'operador',
      },
      {
        valor: '8',
        início: 10,
        fim: 11,
        tipo: 'número',
      },
      {
        valor: 'a',
        início: 12,
        fim: 13,
        tipo: 'identificador',
      },
      {
        valor: '+',
        início: 14,
        fim: 15,
        tipo: 'operador',
      },
      {
        valor: 'b',
        início: 16,
        fim: 17,
        tipo: 'identificador',
      },
    ],
    saída: bloco(`
      . 13
    `),
  }),
  ...teste({
    entrada: bloco(`
      . a = 2
      . b = 3
      . a + b
    `),
    símbolos: [
      {
        valor: 'a',
        início: 0,
        fim: 1,
        tipo: 'identificador',
      },
      {
        valor: '=',
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
        valor: 'b',
        início: 6,
        fim: 7,
        tipo: 'identificador',
      },
      {
        valor: '=',
        início: 8,
        fim: 9,
        tipo: 'operador',
      },
      {
        valor: '3',
        início: 10,
        fim: 11,
        tipo: 'número',
      },
      {
        valor: 'a',
        início: 12,
        fim: 13,
        tipo: 'identificador',
      },
      {
        valor: '+',
        início: 14,
        fim: 15,
        tipo: 'operador',
      },
      {
        valor: 'b',
        início: 16,
        fim: 17,
        tipo: 'identificador',
      },
    ],
    saída: bloco(`
      . 5
    `),
  }),
  ...teste({
    entrada: bloco(`
      . x = 4
      . y = 5
      . x * y
    `),
    símbolos: [
      {
        valor: 'x',
        início: 0,
        fim: 1,
        tipo: 'identificador',
      },
      {
        valor: '=',
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
      {
        valor: 'y',
        início: 6,
        fim: 7,
        tipo: 'identificador',
      },
      {
        valor: '=',
        início: 8,
        fim: 9,
        tipo: 'operador',
      },
      {
        valor: '5',
        início: 10,
        fim: 11,
        tipo: 'número',
      },
      {
        valor: 'x',
        início: 12,
        fim: 13,
        tipo: 'identificador',
      },
      {
        valor: '*',
        início: 14,
        fim: 15,
        tipo: 'operador',
      },
      {
        valor: 'y',
        início: 16,
        fim: 17,
        tipo: 'identificador',
      },
    ],
    saída: bloco(`
      . 20
    `),
  }),
  ...teste({
    entrada: bloco(`
      . valor = 10
      . valor + 5
    `),
    símbolos: [
      {
        valor: 'valor',
        início: 0,
        fim: 5,
        tipo: 'identificador',
      },
      {
        valor: '=',
        início: 6,
        fim: 7,
        tipo: 'operador',
      },
      {
        valor: '10',
        início: 8,
        fim: 10,
        tipo: 'número',
      },
      {
        valor: 'valor',
        início: 11,
        fim: 16,
        tipo: 'identificador',
      },
      {
        valor: '+',
        início: 17,
        fim: 18,
        tipo: 'operador',
      },
      {
        valor: '5',
        início: 19,
        fim: 20,
        tipo: 'número',
      },
    ],
    saída: bloco(`
      . 15
    `),
  }),
  ...teste({
    entrada: bloco(`
      . a = 2
      . b = 3
      . c = 4
      . a + b * c
    `),
    símbolos: [
      {
        valor: 'a',
        início: 0,
        fim: 1,
        tipo: 'identificador',
      },
      {
        valor: '=',
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
        valor: 'b',
        início: 6,
        fim: 7,
        tipo: 'identificador',
      },
      {
        valor: '=',
        início: 8,
        fim: 9,
        tipo: 'operador',
      },
      {
        valor: '3',
        início: 10,
        fim: 11,
        tipo: 'número',
      },
      {
        valor: 'c',
        início: 12,
        fim: 13,
        tipo: 'identificador',
      },
      {
        valor: '=',
        início: 14,
        fim: 15,
        tipo: 'operador',
      },
      {
        valor: '4',
        início: 16,
        fim: 17,
        tipo: 'número',
      },
      {
        valor: 'a',
        início: 18,
        fim: 19,
        tipo: 'identificador',
      },
      {
        valor: '+',
        início: 20,
        fim: 21,
        tipo: 'operador',
      },
      {
        valor: 'b',
        início: 22,
        fim: 23,
        tipo: 'identificador',
      },
      {
        valor: '*',
        início: 24,
        fim: 25,
        tipo: 'operador',
      },
      {
        valor: 'c',
        início: 26,
        fim: 27,
        tipo: 'identificador',
      },
    ],
    saída: bloco(`
      . 14
    `),
  }),
  ...teste({
    entrada: bloco(`
      . a = 5
      . b = a * 2
      . b + 3
    `),
    símbolos: [
      {
        valor: 'a',
        início: 0,
        fim: 1,
        tipo: 'identificador',
      },
      {
        valor: '=',
        início: 2,
        fim: 3,
        tipo: 'operador',
      },
      {
        valor: '5',
        início: 4,
        fim: 5,
        tipo: 'número',
      },
      {
        valor: 'b',
        início: 6,
        fim: 7,
        tipo: 'identificador',
      },
      {
        valor: '=',
        início: 8,
        fim: 9,
        tipo: 'operador',
      },
      {
        valor: 'a',
        início: 10,
        fim: 11,
        tipo: 'identificador',
      },
      {
        valor: '*',
        início: 12,
        fim: 13,
        tipo: 'operador',
      },
      {
        valor: '2',
        início: 14,
        fim: 15,
        tipo: 'número',
      },
      {
        valor: 'b',
        início: 16,
        fim: 17,
        tipo: 'identificador',
      },
      {
        valor: '+',
        início: 18,
        fim: 19,
        tipo: 'operador',
      },
      {
        valor: '3',
        início: 20,
        fim: 21,
        tipo: 'número',
      },
    ],
    saída: bloco(`
      . 13
    `),
  }),
  ...teste({
    entrada: bloco(`
      . a = 2
      . b = (
      .   x = 3
      .   y = 4
      .   x + y
      . )
      . a * b
    `),
    símbolos: [
      {
        valor: 'a',
        início: 0,
        fim: 1,
        tipo: 'identificador',
      },
      {
        valor: '=',
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
        valor: 'b',
        início: 6,
        fim: 7,
        tipo: 'identificador',
      },
      {
        valor: '=',
        início: 8,
        fim: 9,
        tipo: 'operador',
      },
      {
        valor: '(',
        início: 10,
        fim: 11,
        tipo: 'pontuação',
      },
      {
        valor: 'x',
        início: 14,
        fim: 15,
        tipo: 'identificador',
      },
      {
        valor: '=',
        início: 16,
        fim: 17,
        tipo: 'operador',
      },
      {
        valor: '3',
        início: 18,
        fim: 19,
        tipo: 'número',
      },
      {
        valor: 'y',
        início: 22,
        fim: 23,
        tipo: 'identificador',
      },
      {
        valor: '=',
        início: 24,
        fim: 25,
        tipo: 'operador',
      },
      {
        valor: '4',
        início: 26,
        fim: 27,
        tipo: 'número',
      },
      {
        valor: 'x',
        início: 30,
        fim: 31,
        tipo: 'identificador',
      },
      {
        valor: '+',
        início: 32,
        fim: 33,
        tipo: 'operador',
      },
      {
        valor: 'y',
        início: 34,
        fim: 35,
        tipo: 'identificador',
      },
      {
        valor: ')',
        início: 36,
        fim: 37,
        tipo: 'pontuação',
      },
      {
        valor: 'a',
        início: 38,
        fim: 39,
        tipo: 'identificador',
      },
      {
        valor: '*',
        início: 40,
        fim: 41,
        tipo: 'operador',
      },
      {
        valor: 'b',
        início: 42,
        fim: 43,
        tipo: 'identificador',
      },
    ],
    saída: bloco(`
      . 14
    `),
  }),
  ...teste({
    entrada: bloco(`
      . x = 5
      . y = (
      .   a = 2
      .   b = 3
      .   a + b
      . )
      . x + y
    `),
    símbolos: [
      {
        valor: 'x',
        início: 0,
        fim: 1,
        tipo: 'identificador',
      },
      {
        valor: '=',
        início: 2,
        fim: 3,
        tipo: 'operador',
      },
      {
        valor: '5',
        início: 4,
        fim: 5,
        tipo: 'número',
      },
      {
        valor: 'y',
        início: 6,
        fim: 7,
        tipo: 'identificador',
      },
      {
        valor: '=',
        início: 8,
        fim: 9,
        tipo: 'operador',
      },
      {
        valor: '(',
        início: 10,
        fim: 11,
        tipo: 'pontuação',
      },
      {
        valor: 'a',
        início: 14,
        fim: 15,
        tipo: 'identificador',
      },
      {
        valor: '=',
        início: 16,
        fim: 17,
        tipo: 'operador',
      },
      {
        valor: '2',
        início: 18,
        fim: 19,
        tipo: 'número',
      },
      {
        valor: 'b',
        início: 22,
        fim: 23,
        tipo: 'identificador',
      },
      {
        valor: '=',
        início: 24,
        fim: 25,
        tipo: 'operador',
      },
      {
        valor: '3',
        início: 26,
        fim: 27,
        tipo: 'número',
      },
      {
        valor: 'a',
        início: 30,
        fim: 31,
        tipo: 'identificador',
      },
      {
        valor: '+',
        início: 32,
        fim: 33,
        tipo: 'operador',
      },
      {
        valor: 'b',
        início: 34,
        fim: 35,
        tipo: 'identificador',
      },
      {
        valor: ')',
        início: 36,
        fim: 37,
        tipo: 'pontuação',
      },
      {
        valor: 'x',
        início: 38,
        fim: 39,
        tipo: 'identificador',
      },
      {
        valor: '+',
        início: 40,
        fim: 41,
        tipo: 'operador',
      },
      {
        valor: 'y',
        início: 42,
        fim: 43,
        tipo: 'identificador',
      },
    ],
    saída: bloco(`
      . 10
    `),
  }),
  ...teste({
    entrada: bloco(`
      . x = 2
      . y = 3
      . x + y
    `),
    símbolos: [
      {
        valor: 'x',
        início: 0,
        fim: 1,
        tipo: 'identificador',
      },
      {
        valor: '=',
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
        valor: 'y',
        início: 6,
        fim: 7,
        tipo: 'identificador',
      },
      {
        valor: '=',
        início: 8,
        fim: 9,
        tipo: 'operador',
      },
      {
        valor: '3',
        início: 10,
        fim: 11,
        tipo: 'número',
      },
      {
        valor: 'x',
        início: 12,
        fim: 13,
        tipo: 'identificador',
      },
      {
        valor: '+',
        início: 14,
        fim: 15,
        tipo: 'operador',
      },
      {
        valor: 'y',
        início: 16,
        fim: 17,
        tipo: 'identificador',
      },
    ],
    saída: bloco(`
      . 5
    `),
  }),
  ...teste({
    entrada: bloco(`
      . a = 4
      . a + 5
    `),
    símbolos: [
      {
        valor: 'a',
        início: 0,
        fim: 1,
        tipo: 'identificador',
      },
      {
        valor: '=',
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
      {
        valor: 'a',
        início: 6,
        fim: 7,
        tipo: 'identificador',
      },
      {
        valor: '+',
        início: 8,
        fim: 9,
        tipo: 'operador',
      },
      {
        valor: '5',
        início: 10,
        fim: 11,
        tipo: 'número',
      },
    ],
    saída: bloco(`
      . 9
    `),
  }),
  ...teste({
    entrada: bloco(`
      . x = 7
      . x * 2
    `),
    símbolos: [
      {
        valor: 'x',
        início: 0,
        fim: 1,
        tipo: 'identificador',
      },
      {
        valor: '=',
        início: 2,
        fim: 3,
        tipo: 'operador',
      },
      {
        valor: '7',
        início: 4,
        fim: 5,
        tipo: 'número',
      },
      {
        valor: 'x',
        início: 6,
        fim: 7,
        tipo: 'identificador',
      },
      {
        valor: '*',
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
    ],
    saída: bloco(`
      . 14
    `),
  }),
]
