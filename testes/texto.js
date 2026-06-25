import { bloco } from "../texto.js"
import { teste } from "./comum.js"

export default [
  ...teste({
    entrada: bloco(`
      . = str "abcdef"
      . str
    `),
    símbolos: [
      {
        valor: '=',
        início: 0,
        fim: 1,
        tipo: 'operador',
      },
      {
        valor: 'str',
        início: 2,
        fim: 5,
        tipo: 'identificador',
      },
      {
        valor: '"abcdef"',
        início: 6,
        fim: 14,
        tipo: 'texto',
      },
      {
        valor: 'str',
        início: 15,
        fim: 18,
        tipo: 'identificador',
      },
    ],
    saída: bloco(`
      . abcdef
    `),
  }),
  ...teste({
    entrada: bloco(`
      . = a "abcd"
      . # a
    `),
    símbolos: [
      {
        valor: '=',
        início: 0,
        fim: 1,
        tipo: 'operador',
      },
      {
        valor: 'a',
        início: 2,
        fim: 3,
        tipo: 'identificador',
      },
      {
        valor: '"abcd"',
        início: 4,
        fim: 10,
        tipo: 'texto',
      },
      {
        valor: '#',
        início: 11,
        fim: 12,
        tipo: 'operador',
      },
      {
        valor: 'a',
        início: 13,
        fim: 14,
        tipo: 'identificador',
      },
    ],
    saída: bloco(`
      . 4
    `),
  }),
  ...teste({
    entrada: bloco(`
      . = nome "Alice"
      . = sobrenome "Silva"
      . \`\${ nome } \${ sobrenome }\`
    `),
    símbolos: [
      {
        valor: '=',
        início: 0,
        fim: 1,
        tipo: 'operador',
      },
      {
        valor: 'nome',
        início: 2,
        fim: 6,
        tipo: 'identificador',
      },
      {
        valor: '"Alice"',
        início: 7,
        fim: 14,
        tipo: 'texto',
      },
      {
        valor: '=',
        início: 15,
        fim: 16,
        tipo: 'operador',
      },
      {
        valor: 'sobrenome',
        início: 17,
        fim: 26,
        tipo: 'identificador',
      },
      {
        valor: '"Silva"',
        início: 27,
        fim: 34,
        tipo: 'texto',
      },
      {
        valor: '`${',
        início: 35,
        fim: 38,
        tipo: 'modelo_texto',
      },
      {
        valor: 'nome',
        início: 39,
        fim: 43,
        tipo: 'identificador',
      },
      {
        valor: '} ${',
        início: 44,
        fim: 48,
        tipo: 'modelo_texto',
      },
      {
        valor: 'sobrenome',
        início: 49,
        fim: 58,
        tipo: 'identificador',
      },
      {
        valor: '}`',
        início: 59,
        fim: 61,
        tipo: 'modelo_texto',
      },
    ],
    saída: bloco(`
      . Alice Silva
    `),
  }),
  ...teste({
    entrada: bloco(`
      . = str "abcdef"
      . $ str 5
    `),
    símbolos: [
      {
        valor: '=',
        início: 0,
        fim: 1,
        tipo: 'operador',
      },
      {
        valor: 'str',
        início: 2,
        fim: 5,
        tipo: 'identificador',
      },
      {
        valor: '"abcdef"',
        início: 6,
        fim: 14,
        tipo: 'texto',
      },
      {
        valor: '$',
        início: 15,
        fim: 16,
        tipo: 'operador',
      },
      {
        valor: 'str',
        início: 17,
        fim: 20,
        tipo: 'identificador',
      },
      {
        valor: '5',
        início: 21,
        fim: 22,
        tipo: 'número',
      },
    ],
    saída: bloco(`
      . f
    `),
  }),
]
