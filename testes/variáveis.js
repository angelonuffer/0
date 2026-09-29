import { bloco } from "./texto-comum.js"
import { teste } from "./comum.js"

export default [
  ...teste({
    entrada: bloco(`
      a = 11
      12 + a
    `),
    símbolos: [
      { identificador: 'a' },
      { operador: '=' },
      { número: '11' },
      { número: '12' },
      { operador: '+' },
      { identificador: 'a' },
    ],
    /* saída: bloco(`
      23
    `), */
  }),
  ...teste({
    entrada: bloco(`
      a = 5
      b = 8
      2 + a + b
    `),
    símbolos: [
      { identificador: 'a' },
      { operador: '=' },
      { número: '5' },
      { identificador: 'b' },
      { operador: '=' },
      { número: '8' },
      { número: '2' },
      { operador: '+' },
      { identificador: 'a' },
      { operador: '+' },
      { identificador: 'b' },
    ],
    /* saída: bloco(`
      15
    `), */
  }),
  ...teste({
    entrada: bloco(`
      a = 5
      b = 8
      3 + c
    `),
    símbolos: [
      { identificador: 'a' },
      { operador: '=' },
      { número: '5' },
      { identificador: 'b' },
      { operador: '=' },
      { número: '8' },
      { número: '3' },
      { operador: '+' },
      { identificador: 'c' },
    ],
    /* erro: bloco(`
      ⛔ a | b
      📄 testar.js
      👉 3: 3 + c
                ^ 5
    `), */
  }),
  ...teste({
    entrada: bloco(`
      a = 5
      b = 8
      a + b
    `),
    símbolos: [
      { identificador: 'a' },
      { operador: '=' },
      { número: '5' },
      { identificador: 'b' },
      { operador: '=' },
      { número: '8' },
      { identificador: 'a' },
      { operador: '+' },
      { identificador: 'b' },
    ],
    /* saída: bloco(`
      13
    `), */
  }),
  ...teste({
    entrada: bloco(`
      a = 2
      b = 3
      a + b
    `),
    símbolos: [
      { identificador: 'a' },
      { operador: '=' },
      { número: '2' },
      { identificador: 'b' },
      { operador: '=' },
      { número: '3' },
      { identificador: 'a' },
      { operador: '+' },
      { identificador: 'b' },
    ],
    /* saída: bloco(`
      5
    `), */
  }),
  ...teste({
    entrada: bloco(`
      x = 4
      y = 5
      x * y
    `),
    símbolos: [
      { identificador: 'x' },
      { operador: '=' },
      { número: '4' },
      { identificador: 'y' },
      { operador: '=' },
      { número: '5' },
      { identificador: 'x' },
      { operador: '*' },
      { identificador: 'y' },
    ],
    /* saída: bloco(`
      20
    `), */
  }),
  ...teste({
    entrada: bloco(`
      valor = 10
      valor + 5
    `),
    símbolos: [
      { identificador: 'valor' },
      { operador: '=' },
      { número: '10' },
      { identificador: 'valor' },
      { operador: '+' },
      { número: '5' },
    ],
    /* saída: bloco(`
      15
    `), */
  }),
  ...teste({
    entrada: bloco(`
      a = 2
      b = 3
      c = 4
      a + b * c
    `),
    símbolos: [
      { identificador: 'a' },
      { operador: '=' },
      { número: '2' },
      { identificador: 'b' },
      { operador: '=' },
      { número: '3' },
      { identificador: 'c' },
      { operador: '=' },
      { número: '4' },
      { identificador: 'a' },
      { operador: '+' },
      { identificador: 'b' },
      { operador: '*' },
      { identificador: 'c' },
    ],
    /* saída: bloco(`
      14
    `), */
  }),
  ...teste({
    entrada: bloco(`
      a = 5
      b = a * 2
      b + 3
    `),
    símbolos: [
      { identificador: 'a' },
      { operador: '=' },
      { número: '5' },
      { identificador: 'b' },
      { operador: '=' },
      { identificador: 'a' },
      { operador: '*' },
      { número: '2' },
      { identificador: 'b' },
      { operador: '+' },
      { número: '3' },
    ],
    /* saída: bloco(`
      13
    `), */
  }),
  ...teste({
    entrada: bloco(`
      a = 2
      b = (
        x = 3
        y = 4
        x + y
      )
      a * b
    `),
    símbolos: [
      { identificador: 'a' },
      { operador: '=' },
      { número: '2' },
      { identificador: 'b' },
      { operador: '=' },
      { pontuação: '(' },
      { identificador: 'x' },
      { operador: '=' },
      { número: '3' },
      { identificador: 'y' },
      { operador: '=' },
      { número: '4' },
      { identificador: 'x' },
      { operador: '+' },
      { identificador: 'y' },
      { pontuação: ')' },
      { identificador: 'a' },
      { operador: '*' },
      { identificador: 'b' },
    ],
    /* saída: bloco(`
      14
    `), */
  }),
  ...teste({
    entrada: bloco(`
      x = 5
      y = (
        a = 2
        b = 3
        a + b
      )
      x + y
    `),
    símbolos: [
      { identificador: 'x' },
      { operador: '=' },
      { número: '5' },
      { identificador: 'y' },
      { operador: '=' },
      { pontuação: '(' },
      { identificador: 'a' },
      { operador: '=' },
      { número: '2' },
      { identificador: 'b' },
      { operador: '=' },
      { número: '3' },
      { identificador: 'a' },
      { operador: '+' },
      { identificador: 'b' },
      { pontuação: ')' },
      { identificador: 'x' },
      { operador: '+' },
      { identificador: 'y' },
    ],
    /* saída: bloco(`
      10
    `), */
  }),
  ...teste({
    entrada: bloco(`
      x = 2
      y = 3
      x + y
    `),
    símbolos: [
      { identificador: 'x' },
      { operador: '=' },
      { número: '2' },
      { identificador: 'y' },
      { operador: '=' },
      { número: '3' },
      { identificador: 'x' },
      { operador: '+' },
      { identificador: 'y' },
    ],
    /* saída: bloco(`
      5
    `), */
  }),
  ...teste({
    entrada: bloco(`
      a = 4
      a + 5
    `),
    símbolos: [
      { identificador: 'a' },
      { operador: '=' },
      { número: '4' },
      { identificador: 'a' },
      { operador: '+' },
      { número: '5' },
    ],
    /* saída: bloco(`
      9
    `), */
  }),
  ...teste({
    entrada: bloco(`
      x = 7
      x * 2
    `),
    símbolos: [
      { identificador: 'x' },
      { operador: '=' },
      { número: '7' },
      { identificador: 'x' },
      { operador: '*' },
      { número: '2' },
    ],
    /* saída: bloco(`
      14
    `), */
  }),
]
