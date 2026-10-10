import { bloco, teste } from "./comum.js"

export default [
  ...teste({
    entrada: bloco(`
      "abc"
    `),
    símbolos: [
      { texto: '"abc"' },
    ],
    árvore: {
      bloco: [
        { texto: '"abc"' },
      ],
    },
    valor: "abc",
    js: "\"abc\"",
  }),
  ...teste({
    entrada: bloco(`
      \`abc\`
    `),
    símbolos: [
      { modelo_texto: '`abc`' },
    ],
    árvore: {
      bloco: [
        { modelo_texto: '`abc`' },
      ],
    },
    valor: "abc",
    js: "\"abc\"",
  }),
  ...teste({
    entrada: bloco(`
      $ str = "abcdef"
      str
    `),
    símbolos: [
      { pontuação: '$' },
      { identificador: 'str' },
      { pontuação: '=' },
      { texto: '"abcdef"' },
      { identificador: 'str' },
    ],
    árvore: {
      bloco: [
        { associação: { identificador: 'str', valor: { texto: '"abcdef"' } } },
        { identificador: 'str' },
      ],
    },
    valor: "abcdef",
    js: "\"abcdef\"",
  }),
  ...teste({
    entrada: bloco(`
      $ a = "abcd"
      #a
    `),
    símbolos: [
      { pontuação: '$' },
      { identificador: 'a' },
      { pontuação: '=' },
      { texto: '"abcd"' },
      { pontuação: '#' },
      { identificador: 'a' },
    ],
    árvore: {
      bloco: [
        { associação: { identificador: 'a', valor: { texto: '"abcd"' } } },
        { operação: { operador: "#", direita: { identificador: 'a' } } },
      ],
    },
    valor: 4,
    js: "4",
  }),
  ...teste({
    entrada: bloco(`
      $ nome = "Alice"
      $ sobrenome = "Silva"
      \`\${nome} \${sobrenome}\`
    `),
    símbolos: [
      { pontuação: '$' },
      { identificador: 'nome' },
      { pontuação: '=' },
      { texto: '"Alice"' },
      { pontuação: '$' },
      { identificador: 'sobrenome' },
      { pontuação: '=' },
      { texto: '"Silva"' },
      { modelo_texto: '`${' },
      { identificador: 'nome' },
      { modelo_texto: '} ${' },
      { identificador: 'sobrenome' },
      { modelo_texto: '}`' },
    ],
    árvore: {
      bloco: [
        { associação: { identificador: 'nome', valor: { texto: '"Alice"' } } },
        { associação: { identificador: 'sobrenome', valor: { texto: '"Silva"' } } },
        { modelo_texto: [
          "",
          { identificador: 'nome' },
          " ",
          { identificador: 'sobrenome' },
          "",
        ] },
      ],
    },
    valor: "Alice Silva",
    js: "\"Alice Silva\"",
  }),
  ...teste({
    entrada: bloco(`
      $ str = "abcdef"
      str 5
    `),
    símbolos: [
      { pontuação: '$' },
      { identificador: 'str' },
      { pontuação: '=' },
      { texto: '"abcdef"' },
      { identificador: 'str' },
      { número: '5' },
    ],
    árvore: {
      bloco: [
        { associação: { identificador: 'str', valor: { texto: '"abcdef"' } } },
        { aplicação: { função: { identificador: 'str' }, argumentos: [ { número: '5' } ] } },
      ],
    },
    valor: "f",
    js: "\"f\"",
  }),
]
