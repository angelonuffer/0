import { bloco } from "./texto-comum.js"
import { teste } from "./comum.js"

export default [
  ...teste({
    entrada: bloco(`
      . str = "abcdef"
      . str
    `),
    símbolos: [
      { identificador: 'str' },
      { operador: '=' },
      { texto: '"abcdef"' },
      { identificador: 'str' },
    ],
    /* saída: bloco(`
      . abcdef
    `), */
  }),
  ...teste({
    entrada: bloco(`
      . a = "abcd"
      . #a
    `),
    símbolos: [
      { identificador: 'a' },
      { operador: '=' },
      { texto: '"abcd"' },
      { pontuação: '#' },
      { identificador: 'a' },
    ],
    /* saída: bloco(`
      . 4
    `), */
  }),
  ...teste({
    entrada: bloco(`
      . nome = "Alice"
      . sobrenome = "Silva"
      . \`\${nome} \${sobrenome}\`
    `),
    símbolos: [
      { identificador: 'nome' },
      { operador: '=' },
      { texto: '"Alice"' },
      { identificador: 'sobrenome' },
      { operador: '=' },
      { texto: '"Silva"' },
      { modelo_texto: '`${' },
      { identificador: 'nome' },
      { modelo_texto: '} ${' },
      { identificador: 'sobrenome' },
      { modelo_texto: '}`' },
    ],
    /* saída: bloco(`
      . Alice Silva
    `), */
  }),
  ...teste({
    entrada: bloco(`
      . str = "abcdef"
      . str 5
    `),
    símbolos: [
      { identificador: 'str' },
      { operador: '=' },
      { texto: '"abcdef"' },
      { identificador: 'str' },
      { número: '5' },
    ],
    /* saída: bloco(`
      . f
    `), */
  }),
]
