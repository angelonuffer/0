import { testar } from "./uniteste.js"
import { analisador_léxico, analisador_sintático, interpretar } from "./0.js";
import { bloco } from "./texto.js"

const teste = ({
  entrada,
  símbolos = [],
  árvore = {},
  saída = "",
  erro = "",
}) => [{
  função: analisador_léxico,
  argumento: entrada,
  retorno_esperado: símbolos,
}, {
  função: entrada => analisador_sintático(
    analisador_léxico(entrada)
  ),
  argumento: entrada,
  retorno_esperado: árvore,
}, {
  função: interpretar,
  argumento: { entrada, arquivo: "testar.js" },
  retorno_esperado: {
    saída,
    erro,
  },
}]

const resultado = testar([
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
  ...teste({
    entrada: bloco(`
      . lista = [ 2 ; 3 ]
      . lista 0
    `),
    símbolos: [
      {
        valor: 'lista',
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
        valor: '[',
        início: 8,
        fim: 9,
        tipo: 'pontuação',
      },
      {
        valor: '2',
        início: 10,
        fim: 11,
        tipo: 'número',
      },
      {
        valor: ';',
        início: 12,
        fim: 13,
        tipo: 'pontuação',
      },
      {
        valor: '3',
        início: 14,
        fim: 15,
        tipo: 'número',
      },
      {
        valor: ']',
        início: 16,
        fim: 17,
        tipo: 'pontuação',
      },
      {
        valor: 'lista',
        início: 18,
        fim: 23,
        tipo: 'identificador',
      },
      {
        valor: '0',
        início: 24,
        fim: 25,
        tipo: 'número',
      },
    ],
    saída: bloco(`
      . 2
    `),
  }),
  ...teste({
    entrada: bloco(`
      . lista = [
      .   4 ;
      .   5 ;
      .   6 ;
      .   7 ;
      . ]
      . \`\${lista 0} \${lista 1} \${lista 2} \${lista 3}\`
    `),
    símbolos: [
      {
        valor: 'lista',
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
        valor: '[',
        início: 8,
        fim: 9,
        tipo: 'pontuação',
      },
      {
        valor: '4',
        início: 12,
        fim: 13,
        tipo: 'número',
      },
      {
        valor: ';',
        início: 14,
        fim: 15,
        tipo: 'pontuação',
      },
      {
        valor: '5',
        início: 18,
        fim: 19,
        tipo: 'número',
      },
      {
        valor: ';',
        início: 20,
        fim: 21,
        tipo: 'pontuação',
      },
      {
        valor: '6',
        início: 24,
        fim: 25,
        tipo: 'número',
      },
      {
        valor: ';',
        início: 26,
        fim: 27,
        tipo: 'pontuação',
      },
      {
        valor: '7',
        início: 30,
        fim: 31,
        tipo: 'número',
      },
      {
        valor: ';',
        início: 32,
        fim: 33,
        tipo: 'pontuação',
      },
      {
        valor: ']',
        início: 34,
        fim: 35,
        tipo: 'pontuação',
      },
      {
        valor: '`${',
        início: 36,
        fim: 39,
        tipo: 'modelo_texto',
      },
      {
        valor: 'lista',
        início: 39,
        fim: 44,
        tipo: 'identificador',
      },
      {
        valor: '0',
        início: 45,
        fim: 46,
        tipo: 'número',
      },
      {
        valor: '} ${',
        início: 46,
        fim: 50,
        tipo: 'modelo_texto',
      },
      {
        valor: 'lista',
        início: 50,
        fim: 55,
        tipo: 'identificador',
      },
      {
        valor: '1',
        início: 56,
        fim: 57,
        tipo: 'número',
      },
      {
        valor: '} ${',
        início: 57,
        fim: 61,
        tipo: 'modelo_texto',
      },
      {
        valor: 'lista',
        início: 61,
        fim: 66,
        tipo: 'identificador',
      },
      {
        valor: '2',
        início: 67,
        fim: 68,
        tipo: 'número',
      },
      {
        valor: '} ${',
        início: 68,
        fim: 72,
        tipo: 'modelo_texto',
      },
      {
        valor: 'lista',
        início: 72,
        fim: 77,
        tipo: 'identificador',
      },
      {
        valor: '3',
        início: 78,
        fim: 79,
        tipo: 'número',
      },
      {
        valor: '}`',
        início: 79,
        fim: 81,
        tipo: 'modelo_texto',
      },
    ],
    saída: bloco(`
      . 4 5 6 7
    `),
  }),
  ...teste({
    entrada: bloco(`
      . lista = [ 2 ; 3 ]
      . lista 1
    `),
    símbolos: [
      {
        valor: 'lista',
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
        valor: '[',
        início: 8,
        fim: 9,
        tipo: 'pontuação',
      },
      {
        valor: '2',
        início: 10,
        fim: 11,
        tipo: 'número',
      },
      {
        valor: ';',
        início: 12,
        fim: 13,
        tipo: 'pontuação',
      },
      {
        valor: '3',
        início: 14,
        fim: 15,
        tipo: 'número',
      },
      {
        valor: ']',
        início: 16,
        fim: 17,
        tipo: 'pontuação',
      },
      {
        valor: 'lista',
        início: 18,
        fim: 23,
        tipo: 'identificador',
      },
      {
        valor: '1',
        início: 24,
        fim: 25,
        tipo: 'número',
      },
    ],
    saída: bloco(`
      . 3
    `),
  }),
  ...teste({
    entrada: bloco(`
      . lista = [ 2 ; 3 ]
      . #lista
    `),
    símbolos: [
      {
        valor: 'lista',
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
        valor: '[',
        início: 8,
        fim: 9,
        tipo: 'pontuação',
      },
      {
        valor: '2',
        início: 10,
        fim: 11,
        tipo: 'número',
      },
      {
        valor: ';',
        início: 12,
        fim: 13,
        tipo: 'pontuação',
      },
      {
        valor: '3',
        início: 14,
        fim: 15,
        tipo: 'número',
      },
      {
        valor: ']',
        início: 16,
        fim: 17,
        tipo: 'pontuação',
      },
      {
        valor: '#',
        início: 18,
        fim: 19,
        tipo: 'pontuação',
      },
      {
        valor: 'lista',
        início: 19,
        fim: 24,
        tipo: 'identificador',
      },
    ],
    saída: bloco(`
      . 2
    `),
  }),
  ...teste({
    entrada: bloco(`
      . lista = [[ 1 ; 2 ] ; [ 3 ; 4 ]]
      . lista 0 1
    `),
    símbolos: [
      {
        valor: 'lista',
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
        valor: '[',
        início: 8,
        fim: 9,
        tipo: 'pontuação',
      },
      {
        valor: '[',
        início: 9,
        fim: 10,
        tipo: 'pontuação',
      },
      {
        valor: '1',
        início: 11,
        fim: 12,
        tipo: 'número',
      },
      {
        valor: ';',
        início: 13,
        fim: 14,
        tipo: 'pontuação',
      },
      {
        valor: '2',
        início: 15,
        fim: 16,
        tipo: 'número',
      },
      {
        valor: ']',
        início: 17,
        fim: 18,
        tipo: 'pontuação',
      },
      {
        valor: ';',
        início: 19,
        fim: 20,
        tipo: 'pontuação',
      },
      {
        valor: '[',
        início: 21,
        fim: 22,
        tipo: 'pontuação',
      },
      {
        valor: '3',
        início: 23,
        fim: 24,
        tipo: 'número',
      },
      {
        valor: ';',
        início: 25,
        fim: 26,
        tipo: 'pontuação',
      },
      {
        valor: '4',
        início: 27,
        fim: 28,
        tipo: 'número',
      },
      {
        valor: ']',
        início: 29,
        fim: 30,
        tipo: 'pontuação',
      },
      {
        valor: ']',
        início: 30,
        fim: 31,
        tipo: 'pontuação',
      },
      {
        valor: 'lista',
        início: 32,
        fim: 37,
        tipo: 'identificador',
      },
      {
        valor: '0',
        início: 38,
        fim: 39,
        tipo: 'número',
      },
      {
        valor: '1',
        início: 40,
        fim: 41,
        tipo: 'número',
      },
    ],
    saída: bloco(`
      . 2
    `),
  }),
  ...teste({
    entrada: bloco(`
      . lista = [ 1 ; 2 ; 3 ]
      . lista 2
    `),
    símbolos: [
      {
        valor: 'lista',
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
        valor: '[',
        início: 8,
        fim: 9,
        tipo: 'pontuação',
      },
      {
        valor: '1',
        início: 10,
        fim: 11,
        tipo: 'número',
      },
      {
        valor: ';',
        início: 12,
        fim: 13,
        tipo: 'pontuação',
      },
      {
        valor: '2',
        início: 14,
        fim: 15,
        tipo: 'número',
      },
      {
        valor: ';',
        início: 16,
        fim: 17,
        tipo: 'pontuação',
      },
      {
        valor: '3',
        início: 18,
        fim: 19,
        tipo: 'número',
      },
      {
        valor: ']',
        início: 20,
        fim: 21,
        tipo: 'pontuação',
      },
      {
        valor: 'lista',
        início: 22,
        fim: 27,
        tipo: 'identificador',
      },
      {
        valor: '2',
        início: 28,
        fim: 29,
        tipo: 'número',
      },
    ],
    saída: bloco(`
      . 3
    `),
  }),
  ...teste({
    entrada: bloco(`
      . lista = [ 10 ; 20 ; 30 ]
      . lista 1 + 1
    `),
    símbolos: [
      {
        valor: 'lista',
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
        valor: '[',
        início: 8,
        fim: 9,
        tipo: 'pontuação',
      },
      {
        valor: '10',
        início: 10,
        fim: 12,
        tipo: 'número',
      },
      {
        valor: ';',
        início: 13,
        fim: 14,
        tipo: 'pontuação',
      },
      {
        valor: '20',
        início: 15,
        fim: 17,
        tipo: 'número',
      },
      {
        valor: ';',
        início: 18,
        fim: 19,
        tipo: 'pontuação',
      },
      {
        valor: '30',
        início: 20,
        fim: 22,
        tipo: 'número',
      },
      {
        valor: ']',
        início: 23,
        fim: 24,
        tipo: 'pontuação',
      },
      {
        valor: 'lista',
        início: 25,
        fim: 30,
        tipo: 'identificador',
      },
      {
        valor: '1',
        início: 31,
        fim: 32,
        tipo: 'número',
      },
      {
        valor: '+',
        início: 33,
        fim: 34,
        tipo: 'operador',
      },
      {
        valor: '1',
        início: 35,
        fim: 36,
        tipo: 'número',
      },
    ],
    saída: bloco(`
      . 21
    `),
  }),
  ...teste({
    entrada: bloco(`
      . lista_1 = [ 10 ; 20 ; 30 ]
      . lista_2 = [ lista_1 2 ; 40 ]
      . lista_2 0
    `),
    símbolos: [
      {
        valor: 'lista_1',
        início: 0,
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
        valor: '[',
        início: 10,
        fim: 11,
        tipo: 'pontuação',
      },
      {
        valor: '10',
        início: 12,
        fim: 14,
        tipo: 'número',
      },
      {
        valor: ';',
        início: 15,
        fim: 16,
        tipo: 'pontuação',
      },
      {
        valor: '20',
        início: 17,
        fim: 19,
        tipo: 'número',
      },
      {
        valor: ';',
        início: 20,
        fim: 21,
        tipo: 'pontuação',
      },
      {
        valor: '30',
        início: 22,
        fim: 24,
        tipo: 'número',
      },
      {
        valor: ']',
        início: 25,
        fim: 26,
        tipo: 'pontuação',
      },
      {
        valor: 'lista_2',
        início: 27,
        fim: 34,
        tipo: 'identificador',
      },
      {
        valor: '=',
        início: 35,
        fim: 36,
        tipo: 'operador',
      },
      {
        valor: '[',
        início: 37,
        fim: 38,
        tipo: 'pontuação',
      },
      {
        valor: 'lista_1',
        início: 39,
        fim: 46,
        tipo: 'identificador',
      },
      {
        valor: '2',
        início: 47,
        fim: 48,
        tipo: 'número',
      },
      {
        valor: ';',
        início: 49,
        fim: 50,
        tipo: 'pontuação',
      },
      {
        valor: '40',
        início: 51,
        fim: 53,
        tipo: 'número',
      },
      {
        valor: ']',
        início: 54,
        fim: 55,
        tipo: 'pontuação',
      },
      {
        valor: 'lista_2',
        início: 56,
        fim: 63,
        tipo: 'identificador',
      },
      {
        valor: '0',
        início: 64,
        fim: 65,
        tipo: 'número',
      },
    ],
    saída: bloco(`
      . 30
    `),
  }),
  ...teste({
    entrada: bloco(`
      . lista_1 = [ 10 ; 20 ; 30 ]
      . lista_2 = [ ...lista_1 ; 40 ]
      . #lista_2
    `),
    símbolos: [
      {
        valor: 'lista_1',
        início: 0,
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
        valor: '[',
        início: 10,
        fim: 11,
        tipo: 'pontuação',
      },
      {
        valor: '10',
        início: 12,
        fim: 14,
        tipo: 'número',
      },
      {
        valor: ';',
        início: 15,
        fim: 16,
        tipo: 'pontuação',
      },
      {
        valor: '20',
        início: 17,
        fim: 19,
        tipo: 'número',
      },
      {
        valor: ';',
        início: 20,
        fim: 21,
        tipo: 'pontuação',
      },
      {
        valor: '30',
        início: 22,
        fim: 24,
        tipo: 'número',
      },
      {
        valor: ']',
        início: 25,
        fim: 26,
        tipo: 'pontuação',
      },
      {
        valor: 'lista_2',
        início: 27,
        fim: 34,
        tipo: 'identificador',
      },
      {
        valor: '=',
        início: 35,
        fim: 36,
        tipo: 'operador',
      },
      {
        valor: '[',
        início: 37,
        fim: 38,
        tipo: 'pontuação',
      },
      {
        valor: '...',
        início: 39,
        fim: 42,
        tipo: 'pontuação',
      },
      {
        valor: 'lista_1',
        início: 42,
        fim: 49,
        tipo: 'identificador',
      },
      {
        valor: ';',
        início: 50,
        fim: 51,
        tipo: 'pontuação',
      },
      {
        valor: '40',
        início: 52,
        fim: 54,
        tipo: 'número',
      },
      {
        valor: ']',
        início: 55,
        fim: 56,
        tipo: 'pontuação',
      },
      {
        valor: '#',
        início: 57,
        fim: 58,
        tipo: 'pontuação',
      },
      {
        valor: 'lista_2',
        início: 58,
        fim: 65,
        tipo: 'identificador',
      },
    ],
    saída: bloco(`
      . 4
    `),
  }),
  ...teste({
    entrada: bloco(`
      . lista_1 = [ 10 ; 20 ; 30 ]
      . lista_2 = [ ...lista_1 ; 40 ]
      . \`\${lista_2 0} \${lista_2 1} \${lista_2 2} \${lista_2 3}\`
    `),
    símbolos: [
      {
        valor: 'lista_1',
        início: 0,
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
        valor: '[',
        início: 10,
        fim: 11,
        tipo: 'pontuação',
      },
      {
        valor: '10',
        início: 12,
        fim: 14,
        tipo: 'número',
      },
      {
        valor: ';',
        início: 15,
        fim: 16,
        tipo: 'pontuação',
      },
      {
        valor: '20',
        início: 17,
        fim: 19,
        tipo: 'número',
      },
      {
        valor: ';',
        início: 20,
        fim: 21,
        tipo: 'pontuação',
      },
      {
        valor: '30',
        início: 22,
        fim: 24,
        tipo: 'número',
      },
      {
        valor: ']',
        início: 25,
        fim: 26,
        tipo: 'pontuação',
      },
      {
        valor: 'lista_2',
        início: 27,
        fim: 34,
        tipo: 'identificador',
      },
      {
        valor: '=',
        início: 35,
        fim: 36,
        tipo: 'operador',
      },
      {
        valor: '[',
        início: 37,
        fim: 38,
        tipo: 'pontuação',
      },
      {
        valor: '...',
        início: 39,
        fim: 42,
        tipo: 'pontuação',
      },
      {
        valor: 'lista_1',
        início: 42,
        fim: 49,
        tipo: 'identificador',
      },
      {
        valor: ';',
        início: 50,
        fim: 51,
        tipo: 'pontuação',
      },
      {
        valor: '40',
        início: 52,
        fim: 54,
        tipo: 'número',
      },
      {
        valor: ']',
        início: 55,
        fim: 56,
        tipo: 'pontuação',
      },
      {
        valor: '`${',
        início: 57,
        fim: 60,
        tipo: 'modelo_texto',
      },
      {
        valor: 'lista_2',
        início: 60,
        fim: 67,
        tipo: 'identificador',
      },
      {
        valor: '0',
        início: 68,
        fim: 69,
        tipo: 'número',
      },
      {
        valor: '} ${',
        início: 69,
        fim: 73,
        tipo: 'modelo_texto',
      },
      {
        valor: 'lista_2',
        início: 73,
        fim: 80,
        tipo: 'identificador',
      },
      {
        valor: '1',
        início: 81,
        fim: 82,
        tipo: 'número',
      },
      {
        valor: '} ${',
        início: 82,
        fim: 86,
        tipo: 'modelo_texto',
      },
      {
        valor: 'lista_2',
        início: 86,
        fim: 93,
        tipo: 'identificador',
      },
      {
        valor: '2',
        início: 94,
        fim: 95,
        tipo: 'número',
      },
      {
        valor: '} ${',
        início: 95,
        fim: 99,
        tipo: 'modelo_texto',
      },
      {
        valor: 'lista_2',
        início: 99,
        fim: 106,
        tipo: 'identificador',
      },
      {
        valor: '3',
        início: 107,
        fim: 108,
        tipo: 'número',
      },
      {
        valor: '}`',
        início: 108,
        fim: 110,
        tipo: 'modelo_texto',
      },
    ],
    saída: bloco(`
      . 10 20 30 40
    `),
  }),
  ...teste({
    entrada: bloco(`
      . lista_1 = [ 10 ; 20 ]
      . lista_2 = [ 30 ; 40 ]
      . lista_3 = [ ...lista_1 ; ...lista_2 ]
      . \`\${lista_3 0} \${lista_3 1} \${lista_3 2} \${lista_3 3}\`
    `),
    símbolos: [
      {
        valor: 'lista_1',
        início: 0,
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
        valor: '[',
        início: 10,
        fim: 11,
        tipo: 'pontuação',
      },
      {
        valor: '10',
        início: 12,
        fim: 14,
        tipo: 'número',
      },
      {
        valor: ';',
        início: 15,
        fim: 16,
        tipo: 'pontuação',
      },
      {
        valor: '20',
        início: 17,
        fim: 19,
        tipo: 'número',
      },
      {
        valor: ']',
        início: 20,
        fim: 21,
        tipo: 'pontuação',
      },
      {
        valor: 'lista_2',
        início: 22,
        fim: 29,
        tipo: 'identificador',
      },
      {
        valor: '=',
        início: 30,
        fim: 31,
        tipo: 'operador',
      },
      {
        valor: '[',
        início: 32,
        fim: 33,
        tipo: 'pontuação',
      },
      {
        valor: '30',
        início: 34,
        fim: 36,
        tipo: 'número',
      },
      {
        valor: ';',
        início: 37,
        fim: 38,
        tipo: 'pontuação',
      },
      {
        valor: '40',
        início: 39,
        fim: 41,
        tipo: 'número',
      },
      {
        valor: ']',
        início: 42,
        fim: 43,
        tipo: 'pontuação',
      },
      {
        valor: 'lista_3',
        início: 44,
        fim: 51,
        tipo: 'identificador',
      },
      {
        valor: '=',
        início: 52,
        fim: 53,
        tipo: 'operador',
      },
      {
        valor: '[',
        início: 54,
        fim: 55,
        tipo: 'pontuação',
      },
      {
        valor: '...',
        início: 56,
        fim: 59,
        tipo: 'pontuação',
      },
      {
        valor: 'lista_1',
        início: 59,
        fim: 66,
        tipo: 'identificador',
      },
      {
        valor: ';',
        início: 67,
        fim: 68,
        tipo: 'pontuação',
      },
      {
        valor: '...',
        início: 69,
        fim: 72,
        tipo: 'pontuação',
      },
      {
        valor: 'lista_2',
        início: 72,
        fim: 79,
        tipo: 'identificador',
      },
      {
        valor: ']',
        início: 80,
        fim: 81,
        tipo: 'pontuação',
      },
      {
        valor: '`${',
        início: 82,
        fim: 85,
        tipo: 'modelo_texto',
      },
      {
        valor: 'lista_3',
        início: 85,
        fim: 92,
        tipo: 'identificador',
      },
      {
        valor: '0',
        início: 93,
        fim: 94,
        tipo: 'número',
      },
      {
        valor: '} ${',
        início: 94,
        fim: 98,
        tipo: 'modelo_texto',
      },
      {
        valor: 'lista_3',
        início: 98,
        fim: 105,
        tipo: 'identificador',
      },
      {
        valor: '1',
        início: 106,
        fim: 107,
        tipo: 'número',
      },
      {
        valor: '} ${',
        início: 107,
        fim: 111,
        tipo: 'modelo_texto',
      },
      {
        valor: 'lista_3',
        início: 111,
        fim: 118,
        tipo: 'identificador',
      },
      {
        valor: '2',
        início: 119,
        fim: 120,
        tipo: 'número',
      },
      {
        valor: '} ${',
        início: 120,
        fim: 124,
        tipo: 'modelo_texto',
      },
      {
        valor: 'lista_3',
        início: 124,
        fim: 131,
        tipo: 'identificador',
      },
      {
        valor: '3',
        início: 132,
        fim: 133,
        tipo: 'número',
      },
      {
        valor: '}`',
        início: 133,
        fim: 135,
        tipo: 'modelo_texto',
      },
    ],
    saída: bloco(`
      . 10 20 30 40
    `),
  }),
  ...teste({
    entrada: bloco(`
      . lista_1 = [ 10 ; 20 ]
      . lista_2 = [ ...lista_1 ; 30 ]
      . lista_3 = [ ...lista_2 ; 40 ]
      . \`\${lista_3 0} \${lista_3 1} \${lista_3 2} \${lista_3 3}\`
    `),
    símbolos: [
      {
        valor: 'lista_1',
        início: 0,
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
        valor: '[',
        início: 10,
        fim: 11,
        tipo: 'pontuação',
      },
      {
        valor: '10',
        início: 12,
        fim: 14,
        tipo: 'número',
      },
      {
        valor: ';',
        início: 15,
        fim: 16,
        tipo: 'pontuação',
      },
      {
        valor: '20',
        início: 17,
        fim: 19,
        tipo: 'número',
      },
      {
        valor: ']',
        início: 20,
        fim: 21,
        tipo: 'pontuação',
      },
      {
        valor: 'lista_2',
        início: 22,
        fim: 29,
        tipo: 'identificador',
      },
      {
        valor: '=',
        início: 30,
        fim: 31,
        tipo: 'operador',
      },
      {
        valor: '[',
        início: 32,
        fim: 33,
        tipo: 'pontuação',
      },
      {
        valor: '...',
        início: 34,
        fim: 37,
        tipo: 'pontuação',
      },
      {
        valor: 'lista_1',
        início: 37,
        fim: 44,
        tipo: 'identificador',
      },
      {
        valor: ';',
        início: 45,
        fim: 46,
        tipo: 'pontuação',
      },
      {
        valor: '30',
        início: 47,
        fim: 49,
        tipo: 'número',
      },
      {
        valor: ']',
        início: 50,
        fim: 51,
        tipo: 'pontuação',
      },
      {
        valor: 'lista_3',
        início: 52,
        fim: 59,
        tipo: 'identificador',
      },
      {
        valor: '=',
        início: 60,
        fim: 61,
        tipo: 'operador',
      },
      {
        valor: '[',
        início: 62,
        fim: 63,
        tipo: 'pontuação',
      },
      {
        valor: '...',
        início: 64,
        fim: 67,
        tipo: 'pontuação',
      },
      {
        valor: 'lista_2',
        início: 67,
        fim: 74,
        tipo: 'identificador',
      },
      {
        valor: ';',
        início: 75,
        fim: 76,
        tipo: 'pontuação',
      },
      {
        valor: '40',
        início: 77,
        fim: 79,
        tipo: 'número',
      },
      {
        valor: ']',
        início: 80,
        fim: 81,
        tipo: 'pontuação',
      },
      {
        valor: '`${',
        início: 82,
        fim: 85,
        tipo: 'modelo_texto',
      },
      {
        valor: 'lista_3',
        início: 85,
        fim: 92,
        tipo: 'identificador',
      },
      {
        valor: '0',
        início: 93,
        fim: 94,
        tipo: 'número',
      },
      {
        valor: '} ${',
        início: 94,
        fim: 98,
        tipo: 'modelo_texto',
      },
      {
        valor: 'lista_3',
        início: 98,
        fim: 105,
        tipo: 'identificador',
      },
      {
        valor: '1',
        início: 106,
        fim: 107,
        tipo: 'número',
      },
      {
        valor: '} ${',
        início: 107,
        fim: 111,
        tipo: 'modelo_texto',
      },
      {
        valor: 'lista_3',
        início: 111,
        fim: 118,
        tipo: 'identificador',
      },
      {
        valor: '2',
        início: 119,
        fim: 120,
        tipo: 'número',
      },
      {
        valor: '} ${',
        início: 120,
        fim: 124,
        tipo: 'modelo_texto',
      },
      {
        valor: 'lista_3',
        início: 124,
        fim: 131,
        tipo: 'identificador',
      },
      {
        valor: '3',
        início: 132,
        fim: 133,
        tipo: 'número',
      },
      {
        valor: '}`',
        início: 133,
        fim: 135,
        tipo: 'modelo_texto',
      },
    ],
    saída: bloco(`
      . 10 20 30 40
    `),
  }),
  ...teste({
    entrada: bloco(`
      . lista_1 = [ 20 ; 30 ]
      . lista_2 = [ 50 ; 60 ]
      . lista_3 = [ 10 ; ...lista_1 ; 40 ; ...lista_2 ; 70 ]
      . \`\${lista_3 0} \${lista_3 1} \${lista_3 2} \${lista_3 3} \${lista_3 4} \${lista_3 5} \${lista_3 6}\`
    `),
    símbolos: [
      {
        valor: 'lista_1',
        início: 0,
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
        valor: '[',
        início: 10,
        fim: 11,
        tipo: 'pontuação',
      },
      {
        valor: '20',
        início: 12,
        fim: 14,
        tipo: 'número',
      },
      {
        valor: ';',
        início: 15,
        fim: 16,
        tipo: 'pontuação',
      },
      {
        valor: '30',
        início: 17,
        fim: 19,
        tipo: 'número',
      },
      {
        valor: ']',
        início: 20,
        fim: 21,
        tipo: 'pontuação',
      },
      {
        valor: 'lista_2',
        início: 22,
        fim: 29,
        tipo: 'identificador',
      },
      {
        valor: '=',
        início: 30,
        fim: 31,
        tipo: 'operador',
      },
      {
        valor: '[',
        início: 32,
        fim: 33,
        tipo: 'pontuação',
      },
      {
        valor: '50',
        início: 34,
        fim: 36,
        tipo: 'número',
      },
      {
        valor: ';',
        início: 37,
        fim: 38,
        tipo: 'pontuação',
      },
      {
        valor: '60',
        início: 39,
        fim: 41,
        tipo: 'número',
      },
      {
        valor: ']',
        início: 42,
        fim: 43,
        tipo: 'pontuação',
      },
      {
        valor: 'lista_3',
        início: 44,
        fim: 51,
        tipo: 'identificador',
      },
      {
        valor: '=',
        início: 52,
        fim: 53,
        tipo: 'operador',
      },
      {
        valor: '[',
        início: 54,
        fim: 55,
        tipo: 'pontuação',
      },
      {
        valor: '10',
        início: 56,
        fim: 58,
        tipo: 'número',
      },
      {
        valor: ';',
        início: 59,
        fim: 60,
        tipo: 'pontuação',
      },
      {
        valor: '...',
        início: 61,
        fim: 64,
        tipo: 'pontuação',
      },
      {
        valor: 'lista_1',
        início: 64,
        fim: 71,
        tipo: 'identificador',
      },
      {
        valor: ';',
        início: 72,
        fim: 73,
        tipo: 'pontuação',
      },
      {
        valor: '40',
        início: 74,
        fim: 76,
        tipo: 'número',
      },
      {
        valor: ';',
        início: 77,
        fim: 78,
        tipo: 'pontuação',
      },
      {
        valor: '...',
        início: 79,
        fim: 82,
        tipo: 'pontuação',
      },
      {
        valor: 'lista_2',
        início: 82,
        fim: 89,
        tipo: 'identificador',
      },
      {
        valor: ';',
        início: 90,
        fim: 91,
        tipo: 'pontuação',
      },
      {
        valor: '70',
        início: 92,
        fim: 94,
        tipo: 'número',
      },
      {
        valor: ']',
        início: 95,
        fim: 96,
        tipo: 'pontuação',
      },
      {
        valor: '`${',
        início: 97,
        fim: 100,
        tipo: 'modelo_texto',
      },
      {
        valor: 'lista_3',
        início: 100,
        fim: 107,
        tipo: 'identificador',
      },
      {
        valor: '0',
        início: 108,
        fim: 109,
        tipo: 'número',
      },
      {
        valor: '} ${',
        início: 109,
        fim: 113,
        tipo: 'modelo_texto',
      },
      {
        valor: 'lista_3',
        início: 113,
        fim: 120,
        tipo: 'identificador',
      },
      {
        valor: '1',
        início: 121,
        fim: 122,
        tipo: 'número',
      },
      {
        valor: '} ${',
        início: 122,
        fim: 126,
        tipo: 'modelo_texto',
      },
      {
        valor: 'lista_3',
        início: 126,
        fim: 133,
        tipo: 'identificador',
      },
      {
        valor: '2',
        início: 134,
        fim: 135,
        tipo: 'número',
      },
      {
        valor: '} ${',
        início: 135,
        fim: 139,
        tipo: 'modelo_texto',
      },
      {
        valor: 'lista_3',
        início: 139,
        fim: 146,
        tipo: 'identificador',
      },
      {
        valor: '3',
        início: 147,
        fim: 148,
        tipo: 'número',
      },
      {
        valor: '} ${',
        início: 148,
        fim: 152,
        tipo: 'modelo_texto',
      },
      {
        valor: 'lista_3',
        início: 152,
        fim: 159,
        tipo: 'identificador',
      },
      {
        valor: '4',
        início: 160,
        fim: 161,
        tipo: 'número',
      },
      {
        valor: '} ${',
        início: 161,
        fim: 165,
        tipo: 'modelo_texto',
      },
      {
        valor: 'lista_3',
        início: 165,
        fim: 172,
        tipo: 'identificador',
      },
      {
        valor: '5',
        início: 173,
        fim: 174,
        tipo: 'número',
      },
      {
        valor: '} ${',
        início: 174,
        fim: 178,
        tipo: 'modelo_texto',
      },
      {
        valor: 'lista_3',
        início: 178,
        fim: 185,
        tipo: 'identificador',
      },
      {
        valor: '6',
        início: 186,
        fim: 187,
        tipo: 'número',
      },
      {
        valor: '}`',
        início: 187,
        fim: 189,
        tipo: 'modelo_texto',
      },
    ],
    saída: bloco(`
      . 10 20 30 40 50 60 70
    `),
  }),
])

process.stdout.write(resultado.saída + "\n")
process.exit(resultado.código)