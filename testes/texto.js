import { bloco } from "../texto.js"
import { teste } from "./comum.js"

export default [
  ...teste({
    entrada: bloco(`
      . str = "abcdef"
      . str
    `),
    símbolos: [
      {
        valor: 'str',
        início: 0,
        fim: 3,
        tipo: 'identificador',
      },
      {
        valor: '=',
        início: 4,
        fim: 5,
        tipo: 'operador',
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
      . a = "abcd"
      . #a
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
        valor: '"abcd"',
        início: 4,
        fim: 10,
        tipo: 'texto',
      },
      {
        valor: '#',
        início: 11,
        fim: 12,
        tipo: 'pontuação',
      },
      {
        valor: 'a',
        início: 12,
        fim: 13,
        tipo: 'identificador',
      },
    ],
    saída: bloco(`
      . 4
    `),
  }),
  ...teste({
    entrada: bloco(`
      . nome = "Alice"
      . sobrenome = "Silva"
      . \`\${nome} \${sobrenome}\`
    `),
    símbolos: [
      {
        valor: 'nome',
        início: 0,
        fim: 4,
        tipo: 'identificador',
      },
      {
        valor: '=',
        início: 5,
        fim: 6,
        tipo: 'operador',
      },
      {
        valor: '"Alice"',
        início: 7,
        fim: 14,
        tipo: 'texto',
      },
      {
        valor: 'sobrenome',
        início: 15,
        fim: 24,
        tipo: 'identificador',
      },
      {
        valor: '=',
        início: 25,
        fim: 26,
        tipo: 'operador',
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
        início: 38,
        fim: 42,
        tipo: 'identificador',
      },
      {
        valor: '} ${',
        início: 42,
        fim: 46,
        tipo: 'modelo_texto',
      },
      {
        valor: 'sobrenome',
        início: 46,
        fim: 55,
        tipo: 'identificador',
      },
      {
        valor: '}`',
        início: 55,
        fim: 57,
        tipo: 'modelo_texto',
      },
    ],
    saída: bloco(`
      . Alice Silva
    `),
  }),
  ...teste({
    entrada: bloco(`
      . str = "abcdef"
      . str 5
    `),
    símbolos: [
      {
        valor: 'str',
        início: 0,
        fim: 3,
        tipo: 'identificador',
      },
      {
        valor: '=',
        início: 4,
        fim: 5,
        tipo: 'operador',
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
      {
        valor: '5',
        início: 19,
        fim: 20,
        tipo: 'número',
      },
    ],
    saída: bloco(`
      . f
    `),
  }),
]
