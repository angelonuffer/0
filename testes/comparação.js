import { bloco } from "./texto-comum.js"
import { teste } from "./comum.js"

export default [
  ...teste({
    entrada: bloco(`
      2 > 8
    `),
    símbolos: [
      { número: '2' },
      { operador: '>' },
      { número: '8' },
    ],
    /* saída: bloco(`
      0
    `), */
  }),
  ...teste({
    entrada: bloco(`
      8 > 2
    `),
    símbolos: [
      { número: '8' },
      { operador: '>' },
      { número: '2' },
    ],
    /* saída: bloco(`
      1
    `), */
  }),
  ...teste({
    entrada: bloco(`
      8 > 8
    `),
    símbolos: [
      { número: '8' },
      { operador: '>' },
      { número: '8' },
    ],
    /* saída: bloco(`
      0
    `), */
  }),
  ...teste({
    entrada: bloco(`
      2 < 8
    `),
    símbolos: [
      { número: '2' },
      { operador: '<' },
      { número: '8' },
    ],
    /* saída: bloco(`
      1
    `), */
  }),
  ...teste({
    entrada: bloco(`
      8 < 2
    `),
    símbolos: [
      { número: '8' },
      { operador: '<' },
      { número: '2' },
    ],
    /* saída: bloco(`
      0
    `), */
  }),
  ...teste({
    entrada: bloco(`
      8 < 8
    `),
    símbolos: [
      { número: '8' },
      { operador: '<' },
      { número: '8' },
    ],
    /* saída: bloco(`
      0
    `), */
  }),
  ...teste({
    entrada: bloco(`
      2 == 8
    `),
    símbolos: [
      { número: '2' },
      { operador: '==' },
      { número: '8' },
    ],
    /* saída: bloco(`
      0
    `), */
  }),
  ...teste({
    entrada: bloco(`
      8 == 2
    `),
    símbolos: [
      { número: '8' },
      { operador: '==' },
      { número: '2' },
    ],
    /* saída: bloco(`
      0
    `), */
  }),
  ...teste({
    entrada: bloco(`
      8 == 8
    `),
    símbolos: [
      { número: '8' },
      { operador: '==' },
      { número: '8' },
    ],
    /* saída: bloco(`
      1
    `), */
  }),
  ...teste({
    entrada: bloco(`
      2 != 8
    `),
    símbolos: [
      { número: '2' },
      { operador: '!=' },
      { número: '8' },
    ],
    /* saída: bloco(`
      1
    `), */
  }),
  ...teste({
    entrada: bloco(`
      8 != 2
    `),
    símbolos: [
      { número: '8' },
      { operador: '!=' },
      { número: '2' },
    ],
    /* saída: bloco(`
      1
    `), */
  }),
  ...teste({
    entrada: bloco(`
      8 != 8
    `),
    símbolos: [
      { número: '8' },
      { operador: '!=' },
      { número: '8' },
    ],
    /* saída: bloco(`
      0
    `), */
  }),
  ...teste({
    entrada: bloco(`
      2 >= 8
    `),
    símbolos: [
      { número: '2' },
      { operador: '>=' },
      { número: '8' },
    ],
    /* saída: bloco(`
      0
    `), */
  }),
  ...teste({
    entrada: bloco(`
      8 >= 2
    `),
    símbolos: [
      { número: '8' },
      { operador: '>=' },
      { número: '2' },
    ],
    /* saída: bloco(`
      1
    `), */
  }),
  ...teste({
    entrada: bloco(`
      8 >= 8
    `),
    símbolos: [
      { número: '8' },
      { operador: '>=' },
      { número: '8' },
    ],
    /* saída: bloco(`
      1
    `), */
  }),
  ...teste({
    entrada: bloco(`
      2 <= 8
    `),
    símbolos: [
      { número: '2' },
      { operador: '<=' },
      { número: '8' },
    ],
    /* saída: bloco(`
      1
    `), */
  }),
  ...teste({
    entrada: bloco(`
      8 <= 2
    `),
    símbolos: [
      { número: '8' },
      { operador: '<=' },
      { número: '2' },
    ],
    /* saída: bloco(`
      0
    `), */
  }),
  ...teste({
    entrada: bloco(`
      8 <= 8
    `),
    símbolos: [
      { número: '8' },
      { operador: '<=' },
      { número: '8' },
    ],
    /* saída: bloco(`
      1
    `), */
  }),
]
