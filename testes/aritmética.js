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
    js_eval: 1,
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
    js: "42+5",
    js_eval: 47,
  }),
  ...teste({
    entrada: bloco(`
      8 - 4
    `),
    valor: 4,
    js: "8-4",
    js_eval: 4,
  }),
  ...teste({
    entrada: bloco(`
      3 * 4
    `),
    valor: 12,
    js: "3*4",
    js_eval: 12,
  }),
  ...teste({
    entrada: bloco(`
      8 / 2
    `),
    valor: 4,
    js: "8/2",
    js_eval: 4,
  }),
  ...teste({
    entrada: bloco(`
      2147483647 + 1
    `),
    valor: 2147483648,
    js: "2147483647+1",
    js_eval: 2147483648,
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
    valor: 1,
    js: "4-2-1",
    js_eval: 1,
  }),
  ...teste({
    entrada: bloco(`
      2 + 3 * 4
    `),
    js: "2+3*4",
    js_eval: 14,
  }),
  ...teste({
    entrada: bloco(`
      10 - 6 / 2
    `),
    js: "10-6/2",
    js_eval: 7,
  }),
  ...teste({
    entrada: bloco(`
      8 / 2 + 3 * 2
    `),
    js: "8/2+3*2",
    js_eval: 10,
  }),
  ...teste({
    entrada: bloco(`
      0 * (0 - 1)
    `),
    valor: -0,
    js: "0*(0-1)",
    js_eval: -0,
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
    js: "(2+3)*4",
    js_eval: 20,
  }),
  ...teste({
    entrada: bloco(`
      10 - (6 / 2)
    `),
    js: "10-(6/2)",
    js_eval: 7,
  }),
  ...teste({
    entrada: bloco(`
      1 + 2 * 3 - 4 / 2
    `),
    js: "1+2*3-4/2",
    js_eval: 5,
  }),
  ...teste({
    entrada: bloco(`
      +
    `),
    símbolos: [
      { operador: '+' },
    ],
    árvore: { erro: "\"!\" | \"(\" | \"$\" | identificador | número", posição: 0 },
    erro: bloco(`
      testar.js
      1: +
         ^ 1
      Erro de sintaxe. Esperava:
        "!" | "(" | "$" | identificador | número
    `)
  }),
  ...teste({
    entrada: bloco(`
      1 +
    `),
    árvore: { erro: "\"!\" | \"(\" | identificador | número", posição: 2 },
    erro: bloco(`
      testar.js
      1: 1 +
            ^ 4
      Erro de sintaxe. Esperava:
        "!" | "(" | identificador | número
    `)
  }),
  ...teste({
    entrada: bloco(`
      (1 + 2
    `),
    árvore: { erro: "\")\"", posição: 4 },
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
    árvore: { erro: "\")\"", posição: 4 },
    erro: bloco(`
      testar.js
      1: (1 + 2 3
                ^ 8
      Erro de sintaxe. Esperava:
        ")"
    `)
  }),
  ...teste({
    entrada: bloco(`
      (1 + 2 a
    `),
    árvore: { erro: "\")\"", posição: 4 },
    erro: bloco(`
      testar.js
      1: (1 + 2 a
                ^ 8
      Erro de sintaxe. Esperava:
        ")"
    `)
  }),
  ...teste({
    entrada: bloco(`
      1 )
    `),
    árvore: { erro: "fim da entrada | operador", posição: 1 },
    erro: bloco(`
      testar.js
      1: 1 )
           ^ 3
      Erro de sintaxe. Esperava:
        fim da entrada | operador
    `)
  }),
  ...teste({
    entrada: bloco(`
      * 2
    `),
    árvore: { erro: "\"!\" | \"(\" | \"$\" | identificador | número", posição: 0 },
    erro: bloco(`
      testar.js
      1: * 2
         ^ 1
      Erro de sintaxe. Esperava:
        "!" | "(" | "$" | identificador | número
    `)
  }),
]
