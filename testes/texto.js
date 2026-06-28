import { bloco } from "../texto.js"
import { teste } from "./comum.js"

export default [
  ...teste({
    entrada: bloco(`
      . str = "abcdef"
      . str
    `),
    símbolos: [
      { valor: 'str' },
      { valor: '=' },
      { valor: '"abcdef"' },
      { valor: 'str' },
    ],
    saída: bloco(`
      . abcdef
    `),
  }),
  ...teste({
    entrada: bloco(`
      . a = "abcd"
      . #a
    `),
    símbolos: [
      { valor: 'a' },
      { valor: '=' },
      { valor: '"abcd"' },
      { valor: '#' },
      { valor: 'a' },
    ],
    saída: bloco(`
      . 4
    `),
  }),
  ...teste({
    entrada: bloco(`
      . nome = "Alice"
      . sobrenome = "Silva"
      . \`\${nome} \${sobrenome}\`
    `),
    símbolos: [
      { valor: 'nome' },
      { valor: '=' },
      { valor: '"Alice"' },
      { valor: 'sobrenome' },
      { valor: '=' },
      { valor: '"Silva"' },
      { valor: '`${' },
      { valor: 'nome' },
      { valor: '} ${' },
      { valor: 'sobrenome' },
      { valor: '}`' },
    ],
    saída: bloco(`
      . Alice Silva
    `),
  }),
  ...teste({
    entrada: bloco(`
      . str = "abcdef"
      . str 5
    `),
    símbolos: [
      { valor: 'str' },
      { valor: '=' },
      { valor: '"abcdef"' },
      { valor: 'str' },
      { valor: '5' },
    ],
    saída: bloco(`
      . f
    `),
  }),
]
