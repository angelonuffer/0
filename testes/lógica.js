import { bloco } from "./texto-comum.js"
import { teste } from "./comum.js"

export default [
  ...teste({
    entrada: bloco(`
      . 0 && 0
    `),
    símbolos: [
      { número: '0' },
      { operador: '&&' },
      { número: '0' },
    ],
    /* saída: bloco(`
      . 0
    `), */
  }),
  ...teste({
    entrada: bloco(`
      . 0 && 1
    `),
    símbolos: [
      { número: '0' },
      { operador: '&&' },
      { número: '1' },
    ],
    /* saída: bloco(`
      . 0
    `), */
  }),
  ...teste({
    entrada: bloco(`
      . 1 && 0
    `),
    símbolos: [
      { número: '1' },
      { operador: '&&' },
      { número: '0' },
    ],
    /* saída: bloco(`
      . 0
    `), */
  }),
  ...teste({
    entrada: bloco(`
      . 1 && 2
    `),
    símbolos: [
      { número: '1' },
      { operador: '&&' },
      { número: '2' },
    ],
    /* saída: bloco(`
      . 2
    `), */
  }),
  ...teste({
    entrada: bloco(`
      . 0 || 0
    `),
    símbolos: [
      { número: '0' },
      { operador: '||' },
      { número: '0' },
    ],
    /* saída: bloco(`
      . 0
    `), */
  }),
  ...teste({
    entrada: bloco(`
      . 0 || 1
    `),
    símbolos: [
      { número: '0' },
      { operador: '||' },
      { número: '1' },
    ],
    /* saída: bloco(`
      . 1
    `), */
  }),
  ...teste({
    entrada: bloco(`
      . 1 || 0
    `),
    símbolos: [
      { número: '1' },
      { operador: '||' },
      { número: '0' },
    ],
    /* saída: bloco(`
      . 1
    `), */
  }),
  ...teste({
    entrada: bloco(`
      . 1 || 2
    `),
    símbolos: [
      { número: '1' },
      { operador: '||' },
      { número: '2' },
    ],
    /* saída: bloco(`
      . 1
    `), */
  }),
  ...teste({
    entrada: bloco(`
      . ! 0
    `),
    símbolos: [
      { operador: '!' },
      { número: '0' },
    ],
    /* saída: bloco(`
      . 1
    `), */
  }),
  ...teste({
    entrada: bloco(`
      . ! 1
    `),
    símbolos: [
      { operador: '!' },
      { número: '1' },
    ],
    /* saída: bloco(`
      . 0
    `), */
  }),
  ...teste({
    entrada: bloco(`
      . ! ! 0
    `),
    símbolos: [
      { operador: '!' },
      { operador: '!' },
      { número: '0' },
    ],
    /* saída: bloco(`
      . 0
    `), */
  }),
  ...teste({
    entrada: bloco(`
      . 0 && (1 / 0)
    `),
    símbolos: [
      { número: '0' },
      { operador: '&&' },
      { pontuação: '(' },
      { número: '1' },
      { operador: '/' },
      { número: '0' },
      { pontuação: ')' },
    ],
    /* saída: bloco(`
      . 0
    `), */
  }),
]
