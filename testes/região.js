import { bloco } from "./texto-comum.js"
import { teste } from "./comum.js"

export default [
  ...teste({
    entrada: "123",
    símbolos: [
      { número: "123", início: 0, fim: 3 }
    ]
  }),
  ...teste({
    entrada: "  abc",
    símbolos: [
      { identificador: "abc", início: 2, fim: 5 }
    ]
  }),
  ...teste({
    entrada: "\t123\r\nabc",
    símbolos: [
      { número: "123", início: 1, fim: 4 },
      { identificador: "abc", início: 6, fim: 9 }
    ]
  }),
  ...teste({
    entrada: "a + b",
    símbolos: [
      { identificador: "a", início: 0, fim: 1 },
      { operador: "+", início: 2, fim: 3 },
      { identificador: "b", início: 4, fim: 5 }
    ]
  }),
  ...teste({
    entrada: "&& || ==",
    símbolos: [
      { operador: "&&", início: 0, fim: 2 },
      { operador: "||", início: 3, fim: 5 },
      { operador: "==", início: 6, fim: 8 }
    ]
  }),
  ...teste({
    entrada: "( [ ] )",
    símbolos: [
      { pontuação: "(", início: 0, fim: 1 },
      { pontuação: "[", início: 2, fim: 3 },
      { pontuação: "]", início: 4, fim: 5 },
      { pontuação: ")", início: 6, fim: 7 }
    ]
  }),
  ...teste({
    entrada: '"texto"',
    símbolos: [
      { texto: '"texto"', início: 0, fim: 7 }
    ]
  }),
  ...teste({
    entrada: '`modelo ${ expressao }`',
    símbolos: [
      { modelo_texto: '`modelo ${', início: 0, fim: 10 },
      { identificador: "expressao", início: 11, fim: 20 },
      { modelo_texto: "}`", início: 21, fim: 23 }
    ]
  }),
  ...teste({
    entrada: "// comentário\n42",
    símbolos: [
      { número: "42", início: 14, fim: 16 }
    ]
  }),
  ...teste({
    entrada: bloco(`
      . a
      . b
    `),
    símbolos: [
      { identificador: "a", início: 0, fim: 1 },
      { identificador: "b", início: 2, fim: 3 }
    ]
  }),
  ...teste({
    entrada: "#lista",
    símbolos: [
      { pontuação: "#", início: 0, fim: 1 },
      { identificador: "lista", início: 1, fim: 6 }
    ]
  }),
  ...teste({
    entrada: "...spread",
    símbolos: [
      { pontuação: "...", início: 0, fim: 3 },
      { identificador: "spread", início: 3, fim: 9 }
    ]
  }),
  ...teste({
    entrada: ">= <= != !",
    símbolos: [
      { operador: ">=", início: 0, fim: 2 },
      { operador: "<=", início: 3, fim: 5 },
      { operador: "!=", início: 6, fim: 8 },
      { operador: "!", início: 9, fim: 10 }
    ]
  }),
  ...teste({
    entrada: bloco(`
      . \`multilinha
      .   \${ 1 }
      . \`
    `),
    símbolos: [
      { modelo_texto: "`multilinha\n  ${", início: 0, fim: 16 },
      { número: "1", início: 17, fim: 18 },
      { modelo_texto: "}\n`", início: 19, fim: 22 }
    ]
  })
]
