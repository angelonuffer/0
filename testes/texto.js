import { bloco } from "./texto-comum.js"
import { teste } from "./comum.js"

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
    /* saída: bloco(`
      abcdef
    `), */
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
    /* saída: bloco(`
      4
    `), */
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
    /* saída: bloco(`
      Alice Silva
    `), */
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
    /* saída: bloco(`
      f
    `), */
  }),
]
