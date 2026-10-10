import { bloco } from "./texto-comum.js"
import { teste } from "./comum.js"

export default [
  ...teste({
    entrada: bloco(`
      $ a = 11
      12 + a
    `),
    símbolos: [
      { pontuação: '$' },
      { identificador: 'a' },
      { pontuação: '=' },
      { número: '11' },
      { número: '12' },
      { operador: '+' },
      { identificador: 'a' },
    ],
    árvore: {
      bloco: [
        { associação: { identificador: 'a', valor: { número: '11' } } },
        {
          operação: {
            operador: '+',
            esquerda: { número: '12' },
            direita: { identificador: 'a' },
          },
        },
      ],
    },
    valor: 23,
    js: "23",
  }),
  ...teste({
    entrada: bloco(`
      $ a = 5
      $ b = 8
      2 + a + b
    `),
    js: "15",
  }),
  ...teste({
    entrada: bloco(`
      $ a = b + 1
      $ b = 10
      a
    `),
    valor: 11,
    js: "11",
  }),
    ...teste({
    entrada: bloco(`
      $ a = 5
      $ b = 8
      3 + c
    `),
    /* erro: bloco(`
      ⛔ a | b
      📄 testar.js
      👉 3: 3 + c
                ^ 5
    `), */
  }),
  ...teste({
    entrada: bloco(`
      $ x = 4
      $ y = 5
      x * y
    `),
    js: "20",
  }),
  ...teste({
    entrada: bloco(`
      $ valor = 10
      valor + 5
    `),
    js: "15",
  }),
  ...teste({
    entrada: bloco(`
      $ a = 2
      $ b = 3
      $ c = 4
      a + b * c
    `),
    js: "20",
  }),
  ...teste({
    entrada: bloco(`
      $ a = 5
      $ b = a * 2
      b + 3
    `),
    js: "13",
  }),
  ...teste({
    entrada: bloco(`
      $ a = 2
      $ b = (
        $ x = 3
        $ y = 4
        x + y
      )
      a * b
    `),
    árvore: { erro: "fim da entrada", posição: 4 },
  }),
  ...teste({
    entrada: bloco(`
      a = 11
    `),
    árvore: { erro: "fim da entrada", posição: 1 },
  }),
]
