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
    árvore: {
      operação: {
        operador: ">",
        esquerda: { número: "2" },
        direita: { número: "8" },
      },
    },
    js: `2>8`,
    /* saída: bloco(`
      0
    `), */
  }),
  ...teste({
    entrada: bloco(`
      8 > 2
    `),
    js: `8>2`,
    /* saída: bloco(`
      1
    `), */
  }),
  ...teste({
    entrada: bloco(`
      8 > 8
    `),
    js: `8>8`,
    /* saída: bloco(`
      0
    `), */
  }),
  ...teste({
    entrada: bloco(`
      2 < 8
    `),
    js: `2<8`,
    /* saída: bloco(`
      1
    `), */
  }),
  ...teste({
    entrada: bloco(`
      8 < 2
    `),
    js: `8<2`,
    /* saída: bloco(`
      0
    `), */
  }),
  ...teste({
    entrada: bloco(`
      8 < 8
    `),
    js: `8<8`,
    /* saída: bloco(`
      0
    `), */
  }),
  ...teste({
    entrada: bloco(`
      2 == 8
    `),
    js: `2==8`,
    /* saída: bloco(`
      0
    `), */
  }),
  ...teste({
    entrada: bloco(`
      8 == 2
    `),
    js: `8==2`,
    /* saída: bloco(`
      0
    `), */
  }),
  ...teste({
    entrada: bloco(`
      8 == 8
    `),
    js: `8==8`,
    /* saída: bloco(`
      1
    `), */
  }),
  ...teste({
    entrada: bloco(`
      2 != 8
    `),
    js: `2!=8`,
    /* saída: bloco(`
      1
    `), */
  }),
  ...teste({
    entrada: bloco(`
      8 != 2
    `),
    js: `8!=2`,
    /* saída: bloco(`
      1
    `), */
  }),
  ...teste({
    entrada: bloco(`
      8 != 8
    `),
    js: `8!=8`,
    /* saída: bloco(`
      0
    `), */
  }),
  ...teste({
    entrada: bloco(`
      2 >= 8
    `),
    js: `2>=8`,
    /* saída: bloco(`
      0
    `), */
  }),
  ...teste({
    entrada: bloco(`
      8 >= 2
    `),
    js: `8>=2`,
    /* saída: bloco(`
      1
    `), */
  }),
  ...teste({
    entrada: bloco(`
      8 >= 8
    `),
    js: `8>=8`,
    /* saída: bloco(`
      1
    `), */
  }),
  ...teste({
    entrada: bloco(`
      2 <= 8
    `),
    js: `2<=8`,
    /* saída: bloco(`
      1
    `), */
  }),
  ...teste({
    entrada: bloco(`
      8 <= 2
    `),
    js: `8<=2`,
    /* saída: bloco(`
      0
    `), */
  }),
  ...teste({
    entrada: bloco(`
      8 <= 8
    `),
    js: `8<=8`,
    /* saída: bloco(`
      1
    `), */
  }),
]
