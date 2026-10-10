import { bloco, teste } from "./comum.js"

export default [
  ...teste({
    entrada: bloco(`
      { "nome": "Alice" ; "idade": 42 }
    `),
    símbolos: [
      { pontuação: '{' },
      { texto: '"nome"' },
      { pontuação: ':' },
      { texto: '"Alice"' },
      { pontuação: ';' },
      { texto: '"idade"' },
      { pontuação: ':' },
      { número: '42' },
      { pontuação: '}' },
    ],
    árvore: {
      objeto: {
        nome: { texto: '"Alice"' },
        idade: { número: '42' },
      },
    },
    valor: {
      objeto: {
        nome: "Alice",
        idade: 42,
      },
    },
    js: '({"nome":"Alice","idade":42})',
  }),
  ...teste({
    entrada: bloco(`
      { "perfil": { "ativo": 1 } ; }
    `),
    árvore: {
      objeto: {
        perfil: {
          objeto: {
            ativo: { número: '1' },
          },
        },
      },
    },
    valor: {
      objeto: {
        perfil: {
          objeto: {
            ativo: 1,
          },
        },
      },
    },
    js: '({"perfil":({"ativo":1})})',
  }),
  ...teste({
    entrada: bloco(`
      { }
    `),
    símbolos: [
      { pontuação: '{' },
      { pontuação: '}' },
    ],
    árvore: { objeto: {} },
    valor: { objeto: {} },
    js: '({})',
  }),
]
