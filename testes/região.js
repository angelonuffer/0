import { bloco } from "../texto.js"
import { teste } from "./comum.js"

export default [
  ...teste({
    entrada: "123",
    símbolos: [
      { valor: "123", início: 0, fim: 3, tipo: "número" }
    ]
  }),
  ...teste({
    entrada: "  abc",
    símbolos: [
      { valor: "abc", início: 2, fim: 5, tipo: "identificador" }
    ]
  }),
  ...teste({
    entrada: "a + b",
    símbolos: [
      { valor: "a", início: 0, fim: 1, tipo: "identificador" },
      { valor: "+", início: 2, fim: 3, tipo: "operador" },
      { valor: "b", início: 4, fim: 5, tipo: "identificador" }
    ]
  }),
  ...teste({
    entrada: "&& || ==",
    símbolos: [
      { valor: "&&", início: 0, fim: 2, tipo: "operador" },
      { valor: "||", início: 3, fim: 5, tipo: "operador" },
      { valor: "==", início: 6, fim: 8, tipo: "operador" }
    ]
  }),
  ...teste({
    entrada: "( [ ] )",
    símbolos: [
      { valor: "(", início: 0, fim: 1, tipo: "pontuação" },
      { valor: "[", início: 2, fim: 3, tipo: "pontuação" },
      { valor: "]", início: 4, fim: 5, tipo: "pontuação" },
      { valor: ")", início: 6, fim: 7, tipo: "pontuação" }
    ]
  }),
  ...teste({
    entrada: '"texto"',
    símbolos: [
      { valor: '"texto"', início: 0, fim: 7, tipo: "texto" }
    ]
  }),
  ...teste({
    entrada: '`modelo ${ expressao }`',
    símbolos: [
      { valor: '`modelo ${', início: 0, fim: 10, tipo: "modelo_texto" },
      { valor: "expressao", início: 11, fim: 20, tipo: "identificador" },
      { valor: "}`", início: 21, fim: 23, tipo: "modelo_texto" }
    ]
  }),
  ...teste({
    entrada: "// comentário\n42",
    símbolos: [
      { valor: "42", início: 14, fim: 16, tipo: "número" }
    ]
  }),
  ...teste({
    entrada: bloco(`
      . a
      . b
    `),
    símbolos: [
      { valor: "a", início: 0, fim: 1, tipo: "identificador" },
      { valor: "b", início: 2, fim: 3, tipo: "identificador" }
    ]
  }),
  ...teste({
    entrada: "#lista",
    símbolos: [
      { valor: "#", início: 0, fim: 1, tipo: "pontuação" },
      { valor: "lista", início: 1, fim: 6, tipo: "identificador" }
    ]
  }),
  ...teste({
    entrada: "...spread",
    símbolos: [
      { valor: "...", início: 0, fim: 3, tipo: "pontuação" },
      { valor: "spread", início: 3, fim: 9, tipo: "identificador" }
    ]
  }),
  ...teste({
    entrada: ">= <= != !",
    símbolos: [
      { valor: ">=", início: 0, fim: 2, tipo: "operador" },
      { valor: "<=", início: 3, fim: 5, tipo: "operador" },
      { valor: "!=", início: 6, fim: 8, tipo: "operador" },
      { valor: "!", início: 9, fim: 10, tipo: "operador" }
    ]
  }),
  ...teste({
    entrada: bloco(`
      . \`multilinha
      .   \${ 1 }
      . \`
    `),
    símbolos: [
      { valor: "`multilinha\n  ${", início: 0, fim: 16, tipo: "modelo_texto" },
      { valor: "1", início: 17, fim: 18, tipo: "número" },
      { valor: "}\n`", início: 19, fim: 22, tipo: "modelo_texto" }
    ]
  })
]
