import { bloco } from "./texto-comum.js"
import { teste } from "./comum.js"

export default [
  ...teste({
    entrada: bloco(`
      a = 11
      12 + a
    `),
    símbolos: [
      { identificador: 'a' },
      { operador: '=' },
      { número: '11' },
      { número: '12' },
      { operador: '+' },
      { identificador: 'a' },
    ],
    árvore: {
      bloco: [
        { associação: { identificador: 'a', valor: { número: '11' } } },
        {
          operação: {
            operador: '+',
            esquerda: { número: '12' },
            direita: { identificador: 'a' },
          },
        },
      ],
    },
    valor: {
      bloco: [
        { associação: { identificador: 'a', valor: { número: '11' } } },
        {
          operação: {
            operador: '+',
            esquerda: { número: '12' },
            direita: { identificador: 'a' },
          },
        },
      ],
    },
    js: "const _=f=>{let d,v;return()=>d?v:(d=true,v=f())};const a=_(()=>11);12+a()",
    js_eval: 23,
  }),
  ...teste({
    entrada: bloco(`
      a = 5
      b = 8
      2 + a + b
    `),
    js: "const _=f=>{let d,v;return()=>d?v:(d=true,v=f())};const a=_(()=>5);const b=_(()=>8);2+a()+b()",
    js_eval: 15,
  }),
    ...teste({
    entrada: bloco(`
      a = 5
      b = 8
      3 + c
    `),
    /* erro: bloco(`
      ⛔ a | b
      📄 testar.js
      👉 3: 3 + c
                ^ 5
    `), */
  }),
  ...teste({
    entrada: bloco(`
      x = 4
      y = 5
      x * y
    `),
    js: "const _=f=>{let d,v;return()=>d?v:(d=true,v=f())};const x=_(()=>4);const y=_(()=>5);x()*y()",
    js_eval: 20,
  }),
  ...teste({
    entrada: bloco(`
      valor = 10
      valor + 5
    `),
    js: "const _=f=>{let d,v;return()=>d?v:(d=true,v=f())};const valor=_(()=>10);valor()+5",
    js_eval: 15,
  }),
  ...teste({
    entrada: bloco(`
      a = 2
      b = 3
      c = 4
      a + b * c
    `),
    js: "const _=f=>{let d,v;return()=>d?v:(d=true,v=f())};const a=_(()=>2);const b=_(()=>3);const c=_(()=>4);a()+b()*c()",
    js_eval: 14,
  }),
  ...teste({
    entrada: bloco(`
      a = 5
      b = a * 2
      b + 3
    `),
    js: "const _=f=>{let d,v;return()=>d?v:(d=true,v=f())};const a=_(()=>5);const b=_(()=>a()*2);b()+3",
    js_eval: 13,
  }),
  ...teste({
    entrada: bloco(`
      a = 2
      b = (
        x = 3
        y = 4
        x + y
      )
      a * b
    `),
    js: "const _=f=>{let d,v;return()=>d?v:(d=true,v=f())};const a=_(()=>2);const b=_(()=>{const x=_(()=>3);const y=_(()=>4);return x()+y()});a()*b()",
    js_eval: 14,
  }),
]
