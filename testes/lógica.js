import { bloco } from "../texto.js"
import { teste } from "./comum.js"

export default [
  ...teste({
    entrada: bloco(`
      . 0 && 0
    `),
    símbolos: [
      {
        valor: '0',
        início: 0,
        fim: 1,
        tipo: 'número',
      },
      {
        valor: '&&',
        início: 2,
        fim: 4,
        tipo: 'operador',
      },
      {
        valor: '0',
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
      . 0 && 1
    `),
    símbolos: [
      {
        valor: '0',
        início: 0,
        fim: 1,
        tipo: 'número',
      },
      {
        valor: '&&',
        início: 2,
        fim: 4,
        tipo: 'operador',
      },
      {
        valor: '1',
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
      . 1 && 0
    `),
    símbolos: [
      {
        valor: '1',
        início: 0,
        fim: 1,
        tipo: 'número',
      },
      {
        valor: '&&',
        início: 2,
        fim: 4,
        tipo: 'operador',
      },
      {
        valor: '0',
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
      . 1 && 2
    `),
    símbolos: [
      {
        valor: '1',
        início: 0,
        fim: 1,
        tipo: 'número',
      },
      {
        valor: '&&',
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
      . 2
    `),
  }),
  ...teste({
    entrada: bloco(`
      . 0 || 0
    `),
    símbolos: [
      {
        valor: '0',
        início: 0,
        fim: 1,
        tipo: 'número',
      },
      {
        valor: '||',
        início: 2,
        fim: 4,
        tipo: 'operador',
      },
      {
        valor: '0',
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
      . 0 || 1
    `),
    símbolos: [
      {
        valor: '0',
        início: 0,
        fim: 1,
        tipo: 'número',
      },
      {
        valor: '||',
        início: 2,
        fim: 4,
        tipo: 'operador',
      },
      {
        valor: '1',
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
      . 1 || 0
    `),
    símbolos: [
      {
        valor: '1',
        início: 0,
        fim: 1,
        tipo: 'número',
      },
      {
        valor: '||',
        início: 2,
        fim: 4,
        tipo: 'operador',
      },
      {
        valor: '0',
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
      . 1 || 2
    `),
    símbolos: [
      {
        valor: '1',
        início: 0,
        fim: 1,
        tipo: 'número',
      },
      {
        valor: '||',
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
      . ! 0
    `),
    símbolos: [
      {
        valor: '!',
        início: 0,
        fim: 1,
        tipo: 'operador',
      },
      {
        valor: '0',
        início: 2,
        fim: 3,
        tipo: 'número',
      },
    ],
    saída: bloco(`
      . 1
    `),
  }),
  ...teste({
    entrada: bloco(`
      . ! 1
    `),
    símbolos: [
      {
        valor: '!',
        início: 0,
        fim: 1,
        tipo: 'operador',
      },
      {
        valor: '1',
        início: 2,
        fim: 3,
        tipo: 'número',
      },
    ],
    saída: bloco(`
      . 0
    `),
  }),
  ...teste({
    entrada: bloco(`
      . ! ! 0
    `),
    símbolos: [
      {
        valor: '!',
        início: 0,
        fim: 1,
        tipo: 'operador',
      },
      {
        valor: '!',
        início: 2,
        fim: 3,
        tipo: 'operador',
      },
      {
        valor: '0',
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
      . 0 && (1 / 0)
    `),
    símbolos: [
      {
        valor: '0',
        início: 0,
        fim: 1,
        tipo: 'número',
      },
      {
        valor: '&&',
        início: 2,
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
        valor: '1',
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
        valor: '0',
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
      . 0
    `),
  }),
]
