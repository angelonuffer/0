import { bloco } from "./texto-comum.js"
import { teste } from "./comum.js"

export default [
  ...teste({
    entrada: bloco(`
      1
      // comentário
    `),
    símbolos: [
      { número: '1' },
    ],
    árvore: { número: "1" },
    valor: 1,
    js: "1",
  }),
  ...teste({
    entrada: bloco(`
      42 + 5
    `),
    símbolos: [
      { número: '42' },
      { operador: '+' },
      { número: '5' },
    ],
    árvore: {
      operação: {
        operador: "+",
        esquerda: { número: "42" },
        direita: { número: "5" },
      },
    },
    valor: 47,
    js: "47",
  }),
  ...teste({
    entrada: bloco(`
      8 - 4
    `),
    js: "4",
  }),
  ...teste({
    entrada: bloco(`
      3 * 4
    `),
    js: "12",
  }),
  ...teste({
    entrada: bloco(`
      8 / 2
    `),
    js: "4",
  }),
  ...teste({
    entrada: bloco(`
      2147483647 + 1
    `),
    js: "2147483648",
  }),
  ...teste({
    entrada: bloco(`
      4 - 2 - 1
    `),
    árvore: {
      operação: {
        operador: "-",
        esquerda: {
          operação: {
            operador: "-",
            esquerda: { número: "4" },
            direita: { número: "2" },
          },
        },
        direita: { número: "1" },
      },
    },
    js: "1",
  }),
  ...teste({
    entrada: bloco(`
      2 + 3 * 4
    `),
    árvore: {
      operação: {
        operador: "+",
        esquerda: { número: "2" },
        direita: {
          operação: {
            operador: "*",
            esquerda: { número: "3" },
            direita: { número: "4" },
          },
        },
      },
    },
    js: "14",
  }),
  ...teste({
    entrada: bloco(`
      10 - 6 / 2
    `),
    js: "7",
  }),
  ...teste({
    entrada: bloco(`
      8 / 2 + 3 * 2
    `),
    js: "10",
  }),
  ...teste({
    entrada: bloco(`
      0 * (0 - 1)
    `),
    valor: -0,
    js: "0",
  }),
  ...teste({
    entrada: bloco(`
      (2 + 3) * 4
    `),
    símbolos: [
      { pontuação: '(' },
      { número: '2' },
      { operador: '+' },
      { número: '3' },
      { pontuação: ')' },
      { operador: '*' },
      { número: '4' },
    ],
    árvore: {
      operação: {
        operador: "*",
        esquerda: {
          operação: {
            operador: "+",
            esquerda: { número: "2" },
            direita: { número: "3" },
          },
        },
        direita: { número: "4" },
      },
    },
    valor: 20,
    js: "20",
  }),
  ...teste({
    entrada: bloco(`
      10 - (6 / 2)
    `),
    js: "7",
  }),
  ...teste({
    entrada: bloco(`
      1 + 2 * 3 - 4 / 2
    `),
    js: "5",
  }),
  ...teste({
    entrada: bloco(`
      +
    `),
    símbolos: [
      { operador: '+' },
    ],
    árvore: { erro: "\"!\" | \"(\" | \"#\" | \"$\" | identificador | modelo_texto | número | texto", posição: 0 },
    erro: bloco(`
      testar.js
      1: +
         ^ 1
      Erro de sintaxe. Esperava:
        "!" | "(" | "#" | "$" | identificador | modelo_texto | número | texto
    `)
  }),
  ...teste({
    entrada: bloco(`
      1 +
    `),
    erro: bloco(`
      testar.js
      1: 1 +
            ^ 4
      Erro de sintaxe. Esperava:
        "!" | "(" | "#" | identificador | modelo_texto | número | texto
    `)
  }),
  ...teste({
    entrada: bloco(`
      (1 + 2
    `),
    erro: bloco(`
      testar.js
      1: (1 + 2
               ^ 7
      Erro de sintaxe. Esperava:
        ")"
    `)
  }),
  ...teste({
    entrada: bloco(`
      (1 + 2 3
    `),
    erro: bloco(`
      testar.js
      1: (1 + 2 3
                 ^ 9
      Erro de sintaxe. Esperava:
        ")"
    `)
  }),
  ...teste({
    entrada: bloco(`
      (1 + 2 a
    `),
    erro: bloco(`
      testar.js
      1: (1 + 2 a
                 ^ 9
      Erro de sintaxe. Esperava:
        ")"
    `)
  }),
  ...teste({
    entrada: bloco(`
      1 )
    `),
    erro: bloco(`
      testar.js
      1: 1 )
           ^ 3
      Erro de sintaxe. Esperava:
        fim da entrada
    `)
  }),
  ...teste({
    entrada: bloco(`
      * 2
    `),
    erro: bloco(`
      testar.js
      1: * 2
         ^ 1
      Erro de sintaxe. Esperava:
        "!" | "(" | "#" | "$" | identificador | modelo_texto | número | texto
    `)
  }),
]
