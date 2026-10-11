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
      { nome: "Alice" ; idade: 42 }
    `),
    símbolos: [
      { pontuação: '{' },
      { identificador: 'nome' },
      { pontuação: ':' },
      { texto: '"Alice"' },
      { pontuação: ';' },
      { identificador: 'idade' },
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
  ...teste({
    entrada: bloco(`
      { "nome": "Alice" } "nome"
    `),
    js: '"Alice"',
  }),
  ...teste({
    entrada: bloco(`
      { "perfil": { "ativo": 1 } } "perfil"
    `),
    js: '({"ativo":1})',
  }),
  ...teste({
    entrada: bloco(`
      $ pessoa = { "nome": "Alice" }
      pessoa "nome"
    `),
    js: '"Alice"',
  }),
  ...teste({
    entrada: bloco(`
      $ pessoa = { "nome": "Alice" ; "idade": 42 }
      { ...pessoa ; "ativo": 1 }
    `),
    js: '({"nome":"Alice","idade":42,"ativo":1})',
  }),
  ...teste({
    entrada: bloco(`
      $ pessoa = { "nome": "Alice" }
      { "nome": "Beatriz" ; ...pessoa }
    `),
    js: '({"nome":"Alice"})',
  }),
  ...teste({
    entrada: bloco(`
      $ pessoa = { "nome": "Alice" }
      { ...pessoa ; "nome": "Beatriz" }
    `),
    js: '({"nome":"Beatriz"})',
  }),
]
