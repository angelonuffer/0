import { bloco, teste } from "./comum.js"

export default [
  ...teste({
    entrada: bloco(`
      [ 2 ; 3 ]
    `),
    símbolos: [
      { pontuação: '[' },
      { número: '2' },
      { pontuação: ';' },
      { número: '3' },
      { pontuação: ']' },
    ],
    árvore: {
      lista: [
        { número: '2' },
        { número: '3' },
      ],
    },
    valor: [2, 3],
    js: "[2,3]",
  }),
  ...teste({
    entrada: bloco(`
      $ lista = [ 2 ; 3 ]
      lista 0
    `),
    símbolos: [
      { pontuação: '$' },
      { identificador: 'lista' },
      { pontuação: '=' },
      { pontuação: '[' },
      { número: '2' },
      { pontuação: ';' },
      { número: '3' },
      { pontuação: ']' },
      { identificador: 'lista' },
      { número: '0' },
    ],
    árvore: {
      bloco: [
        { associação: { identificador: 'lista', valor: { lista: [ { número: '2' }, { número: '3' } ] } } },
        { aplicação: { função: { identificador: 'lista' }, argumento: { número: '0' } } },
      ],
    },
    valor: 2,
    js: "2",
  }),
  ...teste({
    entrada: bloco(`
      $ lista = [
        4 ;
        5 ;
        6 ;
        7 ;
      ]
      \`\${lista 0} \${lista 1} \${lista 2} \${lista 3}\`
    `),
    js: "\"4 5 6 7\"",
  }),
  ...teste({
    entrada: bloco(`
      $ lista = [ 2 ; 3 ]
      lista 1
    `),
    js: "3",
  }),
  ...teste({
    entrada: bloco(`
      $ lista = [ 2 ; 3 ]
      #lista
    `),
    js: "2",
  }),
  ...teste({
    entrada: bloco(`
      $lista = [[ 1 ; 2 ] ; [ 3 ; 4 ]]
      lista 0 1
    `),
    símbolos: [
      { pontuação: '$' },
      { identificador: 'lista' },
      { pontuação: '=' },
      { pontuação: '[' },
      { pontuação: '[' },
      { número: '1' },
      { pontuação: ';' },
      { número: '2' },
      { pontuação: ']' },
      { pontuação: ';' },
      { pontuação: '[' },
      { número: '3' },
      { pontuação: ';' },
      { número: '4' },
      { pontuação: ']' },
      { pontuação: ']' },
      { identificador: 'lista' },
      { número: '0' },
      { número: '1' },
    ],
    árvore: {
      bloco: [
        { associação: { identificador: 'lista', valor: { lista: [ { lista: [ { número: '1' }, { número: '2' } ] }, { lista: [ { número: '3' }, { número: '4' } ] } ] } } },
        {
          aplicação: {
            função: {
              aplicação: {
                função: {
                  identificador: 'lista',
                },
                argumento: {
                  número: '0',
                },
              },
            },
            argumento: {
              número: '1',
            },
          },
        },
      ],
    },
    /* saída: bloco(`
      2
    `), */
  }),
  ...teste({
    entrada: bloco(`
      $ lista = [ 1 ; 2 ; 3 ]
      lista 2
    `),
    símbolos: [
      { pontuação: '$' },
      { identificador: 'lista' },
      { pontuação: '=' },
      { pontuação: '[' },
      { número: '1' },
      { pontuação: ';' },
      { número: '2' },
      { pontuação: ';' },
      { número: '3' },
      { pontuação: ']' },
      { identificador: 'lista' },
      { número: '2' },
    ],
    /* saída: bloco(`
      3
    `), */
  }),
  ...teste({
    entrada: bloco(`
      $ lista = [ 10 ; 20 ; 30 ]
      lista 1 + 1
    `),
    símbolos: [
      { pontuação: '$' },
      { identificador: 'lista' },
      { pontuação: '=' },
      { pontuação: '[' },
      { número: '10' },
      { pontuação: ';' },
      { número: '20' },
      { pontuação: ';' },
      { número: '30' },
      { pontuação: ']' },
      { identificador: 'lista' },
      { número: '1' },
      { operador: '+' },
      { número: '1' },
    ],
    /* saída: bloco(`
      21
    `), */
  }),
  ...teste({
    entrada: bloco(`
      $ lista_1 = [ 10 ; 20 ; 30 ]
      $ lista_2 = [ lista_1 2 ; 40 ]
      lista_2 0
    `),
    símbolos: [
      { pontuação: '$' },
      { identificador: 'lista_1' },
      { pontuação: '=' },
      { pontuação: '[' },
      { número: '10' },
      { pontuação: ';' },
      { número: '20' },
      { pontuação: ';' },
      { número: '30' },
      { pontuação: ']' },
      { pontuação: '$' },
      { identificador: 'lista_2' },
      { pontuação: '=' },
      { pontuação: '[' },
      { identificador: 'lista_1' },
      { número: '2' },
      { pontuação: ';' },
      { número: '40' },
      { pontuação: ']' },
      { identificador: 'lista_2' },
      { número: '0' },
    ],
    /* saída: bloco(`
      30
    `), */
  }),
  ...teste({
    entrada: bloco(`
      $ lista_1 = [ 10 ; 20 ; 30 ]
      $ lista_2 = [ ...lista_1 ; 40 ]
      #lista_2
    `),
    símbolos: [
      { pontuação: '$' },
      { identificador: 'lista_1' },
      { pontuação: '=' },
      { pontuação: '[' },
      { número: '10' },
      { pontuação: ';' },
      { número: '20' },
      { pontuação: ';' },
      { número: '30' },
      { pontuação: ']' },
      { pontuação: '$' },
      { identificador: 'lista_2' },
      { pontuação: '=' },
      { pontuação: '[' },
      { pontuação: '...' },
      { identificador: 'lista_1' },
      { pontuação: ';' },
      { número: '40' },
      { pontuação: ']' },
      { pontuação: '#' },
      { identificador: 'lista_2' },
    ],
    /* saída: bloco(`
      4
    `), */
  }),
  ...teste({
    entrada: bloco(`
      $ lista_1 = [ 10 ; 20 ; 30 ]
      $ lista_2 = [ ...lista_1 ; 40 ]
      \`\${lista_2 0} \${lista_2 1} \${lista_2 2} \${lista_2 3}\`
    `),
    símbolos: [
      { pontuação: '$' },
      { identificador: 'lista_1' },
      { pontuação: '=' },
      { pontuação: '[' },
      { número: '10' },
      { pontuação: ';' },
      { número: '20' },
      { pontuação: ';' },
      { número: '30' },
      { pontuação: ']' },
      { pontuação: '$' },
      { identificador: 'lista_2' },
      { pontuação: '=' },
      { pontuação: '[' },
      { pontuação: '...' },
      { identificador: 'lista_1' },
      { pontuação: ';' },
      { número: '40' },
      { pontuação: ']' },
      { modelo_texto: '`${' },
      { identificador: 'lista_2' },
      { número: '0' },
      { modelo_texto: '} ${' },
      { identificador: 'lista_2' },
      { número: '1' },
      { modelo_texto: '} ${' },
      { identificador: 'lista_2' },
      { número: '2' },
      { modelo_texto: '} ${' },
      { identificador: 'lista_2' },
      { número: '3' },
      { modelo_texto: '}`' },
    ],
    /* saída: bloco(`
      10 20 30 40
    `), */
  }),
  ...teste({
    entrada: bloco(`
      $ lista_1 = [ 10 ; 20 ]
      $ lista_2 = [ 30 ; 40 ]
      $ lista_3 = [ ...lista_1 ; ...lista_2 ]
      \`\${lista_3 0} \${lista_3 1} \${lista_3 2} \${lista_3 3}\`
    `),
    símbolos: [
      { pontuação: '$' },
      { identificador: 'lista_1' },
      { pontuação: '=' },
      { pontuação: '[' },
      { número: '10' },
      { pontuação: ';' },
      { número: '20' },
      { pontuação: ']' },
      { pontuação: '$' },
      { identificador: 'lista_2' },
      { pontuação: '=' },
      { pontuação: '[' },
      { número: '30' },
      { pontuação: ';' },
      { número: '40' },
      { pontuação: ']' },
      { pontuação: '$' },
      { identificador: 'lista_3' },
      { pontuação: '=' },
      { pontuação: '[' },
      { pontuação: '...' },
      { identificador: 'lista_1' },
      { pontuação: ';' },
      { pontuação: '...' },
      { identificador: 'lista_2' },
      { pontuação: ']' },
      { modelo_texto: '`${' },
      { identificador: 'lista_3' },
      { número: '0' },
      { modelo_texto: '} ${' },
      { identificador: 'lista_3' },
      { número: '1' },
      { modelo_texto: '} ${' },
      { identificador: 'lista_3' },
      { número: '2' },
      { modelo_texto: '} ${' },
      { identificador: 'lista_3' },
      { número: '3' },
      { modelo_texto: '}`' },
    ],
    /* saída: bloco(`
      10 20 30 40
    `), */
  }),
  ...teste({
    entrada: bloco(`
      $ lista_1 = [ 10 ; 20 ]
      $ lista_2 = [ ...lista_1 ; 30 ]
      $ lista_3 = [ ...lista_2 ; 40 ]
      \`\${lista_3 0} \${lista_3 1} \${lista_3 2} \${lista_3 3}\`
    `),
    símbolos: [
      { pontuação: '$' },
      { identificador: 'lista_1' },
      { pontuação: '=' },
      { pontuação: '[' },
      { número: '10' },
      { pontuação: ';' },
      { número: '20' },
      { pontuação: ']' },
      { pontuação: '$' },
      { identificador: 'lista_2' },
      { pontuação: '=' },
      { pontuação: '[' },
      { pontuação: '...' },
      { identificador: 'lista_1' },
      { pontuação: ';' },
      { número: '30' },
      { pontuação: ']' },
      { pontuação: '$' },
      { identificador: 'lista_3' },
      { pontuação: '=' },
      { pontuação: '[' },
      { pontuação: '...' },
      { identificador: 'lista_2' },
      { pontuação: ';' },
      { número: '40' },
      { pontuação: ']' },
      { modelo_texto: '`${' },
      { identificador: 'lista_3' },
      { número: '0' },
      { modelo_texto: '} ${' },
      { identificador: 'lista_3' },
      { número: '1' },
      { modelo_texto: '} ${' },
      { identificador: 'lista_3' },
      { número: '2' },
      { modelo_texto: '} ${' },
      { identificador: 'lista_3' },
      { número: '3' },
      { modelo_texto: '}`' },
    ],
    /* saída: bloco(`
      10 20 30 40
    `), */
  }),
  ...teste({
    entrada: bloco(`
      $ lista_1 = [ 20 ; 30 ]
      $ lista_2 = [ 50 ; 60 ]
      $ lista_3 = [ 10 ; ...lista_1 ; 40 ; ...lista_2 ; 70 ]
      \`\${lista_3 0} \${lista_3 1} \${lista_3 2} \${lista_3 3} \${lista_3 4} \${lista_3 5} \${lista_3 6}\`
    `),
    símbolos: [
      { pontuação: '$' },
      { identificador: 'lista_1' },
      { pontuação: '=' },
      { pontuação: '[' },
      { número: '20' },
      { pontuação: ';' },
      { número: '30' },
      { pontuação: ']' },
      { pontuação: '$' },
      { identificador: 'lista_2' },
      { pontuação: '=' },
      { pontuação: '[' },
      { número: '50' },
      { pontuação: ';' },
      { número: '60' },
      { pontuação: ']' },
      { pontuação: '$' },
      { identificador: 'lista_3' },
      { pontuação: '=' },
      { pontuação: '[' },
      { número: '10' },
      { pontuação: ';' },
      { pontuação: '...' },
      { identificador: 'lista_1' },
      { pontuação: ';' },
      { número: '40' },
      { pontuação: ';' },
      { pontuação: '...' },
      { identificador: 'lista_2' },
      { pontuação: ';' },
      { número: '70' },
      { pontuação: ']' },
      { modelo_texto: '`${' },
      { identificador: 'lista_3' },
      { número: '0' },
      { modelo_texto: '} ${' },
      { identificador: 'lista_3' },
      { número: '1' },
      { modelo_texto: '} ${' },
      { identificador: 'lista_3' },
      { número: '2' },
      { modelo_texto: '} ${' },
      { identificador: 'lista_3' },
      { número: '3' },
      { modelo_texto: '} ${' },
      { identificador: 'lista_3' },
      { número: '4' },
      { modelo_texto: '} ${' },
      { identificador: 'lista_3' },
      { número: '5' },
      { modelo_texto: '} ${' },
      { identificador: 'lista_3' },
      { número: '6' },
      { modelo_texto: '}`' },
    ],
    /* saída: bloco(`
      10 20 30 40 50 60 70
    `), */
  }),
]
