import { bloco } from "../texto.js"
import { teste } from "./comum.js"

export default [
  ...teste({
    entrada: bloco(`
      . = lista [ 2 ; 3 ]
      . $ lista 0
    `),
    símbolos: [
      {
        valor: '=',
        início: 0,
        fim: 1,
        tipo: 'operador',
      },
      {
        valor: 'lista',
        início: 2,
        fim: 7,
        tipo: 'identificador',
      },
      {
        valor: '[',
        início: 8,
        fim: 9,
        tipo: 'pontuação',
      },
      {
        valor: '2',
        início: 10,
        fim: 11,
        tipo: 'número',
      },
      {
        valor: ';',
        início: 12,
        fim: 13,
        tipo: 'pontuação',
      },
      {
        valor: '3',
        início: 14,
        fim: 15,
        tipo: 'número',
      },
      {
        valor: ']',
        início: 16,
        fim: 17,
        tipo: 'pontuação',
      },
      {
        valor: '$',
        início: 18,
        fim: 19,
        tipo: 'operador',
      },
      {
        valor: 'lista',
        início: 20,
        fim: 25,
        tipo: 'identificador',
      },
      {
        valor: '0',
        início: 26,
        fim: 27,
        tipo: 'número',
      },
    ],
    saída: bloco(`
      . 2
    `),
  }),
  ...teste({
    entrada: bloco(`
      . = lista [
      .   4 ;
      .   5 ;
      .   6 ;
      .   7 ;
      . ]
      . \`\${ $ lista 0 } \${ $ lista 1 } \${ $ lista 2 } \${ $ lista 3 }\`
    `),
    símbolos: [
      {
        valor: '=',
        início: 0,
        fim: 1,
        tipo: 'operador',
      },
      {
        valor: 'lista',
        início: 2,
        fim: 7,
        tipo: 'identificador',
      },
      {
        valor: '[',
        início: 8,
        fim: 9,
        tipo: 'pontuação',
      },
      {
        valor: '4',
        início: 12,
        fim: 13,
        tipo: 'número',
      },
      {
        valor: ';',
        início: 14,
        fim: 15,
        tipo: 'pontuação',
      },
      {
        valor: '5',
        início: 18,
        fim: 19,
        tipo: 'número',
      },
      {
        valor: ';',
        início: 20,
        fim: 21,
        tipo: 'pontuação',
      },
      {
        valor: '6',
        início: 24,
        fim: 25,
        tipo: 'número',
      },
      {
        valor: ';',
        início: 26,
        fim: 27,
        tipo: 'pontuação',
      },
      {
        valor: '7',
        início: 30,
        fim: 31,
        tipo: 'número',
      },
      {
        valor: ';',
        início: 32,
        fim: 33,
        tipo: 'pontuação',
      },
      {
        valor: ']',
        início: 34,
        fim: 35,
        tipo: 'pontuação',
      },
      {
        valor: '`${',
        início: 36,
        fim: 39,
        tipo: 'modelo_texto',
      },
      {
        valor: '$',
        início: 40,
        fim: 41,
        tipo: 'operador',
      },
      {
        valor: 'lista',
        início: 42,
        fim: 47,
        tipo: 'identificador',
      },
      {
        valor: '0',
        início: 48,
        fim: 49,
        tipo: 'número',
      },
      {
        valor: '} ${',
        início: 50,
        fim: 54,
        tipo: 'modelo_texto',
      },
      {
        valor: '$',
        início: 55,
        fim: 56,
        tipo: 'operador',
      },
      {
        valor: 'lista',
        início: 57,
        fim: 62,
        tipo: 'identificador',
      },
      {
        valor: '1',
        início: 63,
        fim: 64,
        tipo: 'número',
      },
      {
        valor: '} ${',
        início: 65,
        fim: 69,
        tipo: 'modelo_texto',
      },
      {
        valor: '$',
        início: 70,
        fim: 71,
        tipo: 'operador',
      },
      {
        valor: 'lista',
        início: 72,
        fim: 77,
        tipo: 'identificador',
      },
      {
        valor: '2',
        início: 78,
        fim: 79,
        tipo: 'número',
      },
      {
        valor: '} ${',
        início: 80,
        fim: 84,
        tipo: 'modelo_texto',
      },
      {
        valor: '$',
        início: 85,
        fim: 86,
        tipo: 'operador',
      },
      {
        valor: 'lista',
        início: 87,
        fim: 92,
        tipo: 'identificador',
      },
      {
        valor: '3',
        início: 93,
        fim: 94,
        tipo: 'número',
      },
      {
        valor: '}`',
        início: 95,
        fim: 97,
        tipo: 'modelo_texto',
      },
    ],
    saída: bloco(`
      . 4 5 6 7
    `),
  }),
  ...teste({
    entrada: bloco(`
      . = lista [ 2 ; 3 ]
      . $ lista 1
    `),
    símbolos: [
      {
        valor: '=',
        início: 0,
        fim: 1,
        tipo: 'operador',
      },
      {
        valor: 'lista',
        início: 2,
        fim: 7,
        tipo: 'identificador',
      },
      {
        valor: '[',
        início: 8,
        fim: 9,
        tipo: 'pontuação',
      },
      {
        valor: '2',
        início: 10,
        fim: 11,
        tipo: 'número',
      },
      {
        valor: ';',
        início: 12,
        fim: 13,
        tipo: 'pontuação',
      },
      {
        valor: '3',
        início: 14,
        fim: 15,
        tipo: 'número',
      },
      {
        valor: ']',
        início: 16,
        fim: 17,
        tipo: 'pontuação',
      },
      {
        valor: '$',
        início: 18,
        fim: 19,
        tipo: 'operador',
      },
      {
        valor: 'lista',
        início: 20,
        fim: 25,
        tipo: 'identificador',
      },
      {
        valor: '1',
        início: 26,
        fim: 27,
        tipo: 'número',
      },
    ],
    saída: bloco(`
      . 3
    `),
  }),
  ...teste({
    entrada: bloco(`
      . = lista [ 2 ; 3 ]
      . # lista
    `),
    símbolos: [
      {
        valor: '=',
        início: 0,
        fim: 1,
        tipo: 'operador',
      },
      {
        valor: 'lista',
        início: 2,
        fim: 7,
        tipo: 'identificador',
      },
      {
        valor: '[',
        início: 8,
        fim: 9,
        tipo: 'pontuação',
      },
      {
        valor: '2',
        início: 10,
        fim: 11,
        tipo: 'número',
      },
      {
        valor: ';',
        início: 12,
        fim: 13,
        tipo: 'pontuação',
      },
      {
        valor: '3',
        início: 14,
        fim: 15,
        tipo: 'número',
      },
      {
        valor: ']',
        início: 16,
        fim: 17,
        tipo: 'pontuação',
      },
      {
        valor: '#',
        início: 18,
        fim: 19,
        tipo: 'operador',
      },
      {
        valor: 'lista',
        início: 20,
        fim: 25,
        tipo: 'identificador',
      },
    ],
    saída: bloco(`
      . 2
    `),
  }),
  ...teste({
    entrada: bloco(`
      . = lista [[ 1 ; 2 ] ; [ 3 ; 4 ]]
      . $ $ lista 0 1
    `),
    símbolos: [
      {
        valor: '=',
        início: 0,
        fim: 1,
        tipo: 'operador',
      },
      {
        valor: 'lista',
        início: 2,
        fim: 7,
        tipo: 'identificador',
      },
      {
        valor: '[',
        início: 8,
        fim: 9,
        tipo: 'pontuação',
      },
      {
        valor: '[',
        início: 9,
        fim: 10,
        tipo: 'pontuação',
      },
      {
        valor: '1',
        início: 11,
        fim: 12,
        tipo: 'número',
      },
      {
        valor: ';',
        início: 13,
        fim: 14,
        tipo: 'pontuação',
      },
      {
        valor: '2',
        início: 15,
        fim: 16,
        tipo: 'número',
      },
      {
        valor: ']',
        início: 17,
        fim: 18,
        tipo: 'pontuação',
      },
      {
        valor: ';',
        início: 19,
        fim: 20,
        tipo: 'pontuação',
      },
      {
        valor: '[',
        início: 21,
        fim: 22,
        tipo: 'pontuação',
      },
      {
        valor: '3',
        início: 23,
        fim: 24,
        tipo: 'número',
      },
      {
        valor: ';',
        início: 25,
        fim: 26,
        tipo: 'pontuação',
      },
      {
        valor: '4',
        início: 27,
        fim: 28,
        tipo: 'número',
      },
      {
        valor: ']',
        início: 29,
        fim: 30,
        tipo: 'pontuação',
      },
      {
        valor: ']',
        início: 30,
        fim: 31,
        tipo: 'pontuação',
      },
      {
        valor: '$',
        início: 32,
        fim: 33,
        tipo: 'operador',
      },
      {
        valor: '$',
        início: 34,
        fim: 35,
        tipo: 'operador',
      },
      {
        valor: 'lista',
        início: 36,
        fim: 41,
        tipo: 'identificador',
      },
      {
        valor: '0',
        início: 42,
        fim: 43,
        tipo: 'número',
      },
      {
        valor: '1',
        início: 44,
        fim: 45,
        tipo: 'número',
      },
    ],
    saída: bloco(`
      . 2
    `),
  }),
  ...teste({
    entrada: bloco(`
      . = lista [ 1 ; 2 ; 3 ]
      . $ lista 2
    `),
    símbolos: [
      {
        valor: '=',
        início: 0,
        fim: 1,
        tipo: 'operador',
      },
      {
        valor: 'lista',
        início: 2,
        fim: 7,
        tipo: 'identificador',
      },
      {
        valor: '[',
        início: 8,
        fim: 9,
        tipo: 'pontuação',
      },
      {
        valor: '1',
        início: 10,
        fim: 11,
        tipo: 'número',
      },
      {
        valor: ';',
        início: 12,
        fim: 13,
        tipo: 'pontuação',
      },
      {
        valor: '2',
        início: 14,
        fim: 15,
        tipo: 'número',
      },
      {
        valor: ';',
        início: 16,
        fim: 17,
        tipo: 'pontuação',
      },
      {
        valor: '3',
        início: 18,
        fim: 19,
        tipo: 'número',
      },
      {
        valor: ']',
        início: 20,
        fim: 21,
        tipo: 'pontuação',
      },
      {
        valor: '$',
        início: 22,
        fim: 23,
        tipo: 'operador',
      },
      {
        valor: 'lista',
        início: 24,
        fim: 29,
        tipo: 'identificador',
      },
      {
        valor: '2',
        início: 30,
        fim: 31,
        tipo: 'número',
      },
    ],
    saída: bloco(`
      . 3
    `),
  }),
  ...teste({
    entrada: bloco(`
      . = lista [ 10 ; 20 ; 30 ]
      . + $ lista 1 1
    `),
    símbolos: [
      {
        valor: '=',
        início: 0,
        fim: 1,
        tipo: 'operador',
      },
      {
        valor: 'lista',
        início: 2,
        fim: 7,
        tipo: 'identificador',
      },
      {
        valor: '[',
        início: 8,
        fim: 9,
        tipo: 'pontuação',
      },
      {
        valor: '10',
        início: 10,
        fim: 12,
        tipo: 'número',
      },
      {
        valor: ';',
        início: 13,
        fim: 14,
        tipo: 'pontuação',
      },
      {
        valor: '20',
        início: 15,
        fim: 17,
        tipo: 'número',
      },
      {
        valor: ';',
        início: 18,
        fim: 19,
        tipo: 'pontuação',
      },
      {
        valor: '30',
        início: 20,
        fim: 22,
        tipo: 'número',
      },
      {
        valor: ']',
        início: 23,
        fim: 24,
        tipo: 'pontuação',
      },
      {
        valor: '+',
        início: 25,
        fim: 26,
        tipo: 'operador',
      },
      {
        valor: '$',
        início: 27,
        fim: 28,
        tipo: 'operador',
      },
      {
        valor: 'lista',
        início: 29,
        fim: 34,
        tipo: 'identificador',
      },
      {
        valor: '1',
        início: 35,
        fim: 36,
        tipo: 'número',
      },
      {
        valor: '1',
        início: 37,
        fim: 38,
        tipo: 'número',
      },
    ],
    saída: bloco(`
      . 21
    `),
  }),
  ...teste({
    entrada: bloco(`
      . = lista_1 [ 10 ; 20 ; 30 ]
      . = lista_2 [ $ lista_1 2 ; 40 ]
      . $ lista_2 0
    `),
    símbolos: [
      {
        valor: '=',
        início: 0,
        fim: 1,
        tipo: 'operador',
      },
      {
        valor: 'lista_1',
        início: 2,
        fim: 9,
        tipo: 'identificador',
      },
      {
        valor: '[',
        início: 10,
        fim: 11,
        tipo: 'pontuação',
      },
      {
        valor: '10',
        início: 12,
        fim: 14,
        tipo: 'número',
      },
      {
        valor: ';',
        início: 15,
        fim: 16,
        tipo: 'pontuação',
      },
      {
        valor: '20',
        início: 17,
        fim: 19,
        tipo: 'número',
      },
      {
        valor: ';',
        início: 20,
        fim: 21,
        tipo: 'pontuação',
      },
      {
        valor: '30',
        início: 22,
        fim: 24,
        tipo: 'número',
      },
      {
        valor: ']',
        início: 25,
        fim: 26,
        tipo: 'pontuação',
      },
      {
        valor: '=',
        início: 27,
        fim: 28,
        tipo: 'operador',
      },
      {
        valor: 'lista_2',
        início: 29,
        fim: 36,
        tipo: 'identificador',
      },
      {
        valor: '[',
        início: 37,
        fim: 38,
        tipo: 'pontuação',
      },
      {
        valor: '$',
        início: 39,
        fim: 40,
        tipo: 'operador',
      },
      {
        valor: 'lista_1',
        início: 41,
        fim: 48,
        tipo: 'identificador',
      },
      {
        valor: '2',
        início: 49,
        fim: 50,
        tipo: 'número',
      },
      {
        valor: ';',
        início: 51,
        fim: 52,
        tipo: 'pontuação',
      },
      {
        valor: '40',
        início: 53,
        fim: 55,
        tipo: 'número',
      },
      {
        valor: ']',
        início: 56,
        fim: 57,
        tipo: 'pontuação',
      },
      {
        valor: '$',
        início: 58,
        fim: 59,
        tipo: 'operador',
      },
      {
        valor: 'lista_2',
        início: 60,
        fim: 67,
        tipo: 'identificador',
      },
      {
        valor: '0',
        início: 68,
        fim: 69,
        tipo: 'número',
      },
    ],
    saída: bloco(`
      . 30
    `),
  }),
  ...teste({
    entrada: bloco(`
      . = lista_1 [ 10 ; 20 ; 30 ]
      . = lista_2 [ ... lista_1 ; 40 ]
      . # lista_2
    `),
    símbolos: [
      {
        valor: '=',
        início: 0,
        fim: 1,
        tipo: 'operador',
      },
      {
        valor: 'lista_1',
        início: 2,
        fim: 9,
        tipo: 'identificador',
      },
      {
        valor: '[',
        início: 10,
        fim: 11,
        tipo: 'pontuação',
      },
      {
        valor: '10',
        início: 12,
        fim: 14,
        tipo: 'número',
      },
      {
        valor: ';',
        início: 15,
        fim: 16,
        tipo: 'pontuação',
      },
      {
        valor: '20',
        início: 17,
        fim: 19,
        tipo: 'número',
      },
      {
        valor: ';',
        início: 20,
        fim: 21,
        tipo: 'pontuação',
      },
      {
        valor: '30',
        início: 22,
        fim: 24,
        tipo: 'número',
      },
      {
        valor: ']',
        início: 25,
        fim: 26,
        tipo: 'pontuação',
      },
      {
        valor: '=',
        início: 27,
        fim: 28,
        tipo: 'operador',
      },
      {
        valor: 'lista_2',
        início: 29,
        fim: 36,
        tipo: 'identificador',
      },
      {
        valor: '[',
        início: 37,
        fim: 38,
        tipo: 'pontuação',
      },
      {
        valor: '...',
        início: 39,
        fim: 42,
        tipo: 'pontuação',
      },
      {
        valor: 'lista_1',
        início: 43,
        fim: 50,
        tipo: 'identificador',
      },
      {
        valor: ';',
        início: 51,
        fim: 52,
        tipo: 'pontuação',
      },
      {
        valor: '40',
        início: 53,
        fim: 55,
        tipo: 'número',
      },
      {
        valor: ']',
        início: 56,
        fim: 57,
        tipo: 'pontuação',
      },
      {
        valor: '#',
        início: 58,
        fim: 59,
        tipo: 'operador',
      },
      {
        valor: 'lista_2',
        início: 60,
        fim: 67,
        tipo: 'identificador',
      },
    ],
    saída: bloco(`
      . 4
    `),
  }),
  ...teste({
    entrada: bloco(`
      . = lista_1 [ 10 ; 20 ; 30 ]
      . = lista_2 [ ... lista_1 ; 40 ]
      . \`\${ $ lista_2 0 } \${ $ lista_2 1 } \${ $ lista_2 2 } \${ $ lista_2 3 }\`
    `),
    símbolos: [
      {
        valor: '=',
        início: 0,
        fim: 1,
        tipo: 'operador',
      },
      {
        valor: 'lista_1',
        início: 2,
        fim: 9,
        tipo: 'identificador',
      },
      {
        valor: '[',
        início: 10,
        fim: 11,
        tipo: 'pontuação',
      },
      {
        valor: '10',
        início: 12,
        fim: 14,
        tipo: 'número',
      },
      {
        valor: ';',
        início: 15,
        fim: 16,
        tipo: 'pontuação',
      },
      {
        valor: '20',
        início: 17,
        fim: 19,
        tipo: 'número',
      },
      {
        valor: ';',
        início: 20,
        fim: 21,
        tipo: 'pontuação',
      },
      {
        valor: '30',
        início: 22,
        fim: 24,
        tipo: 'número',
      },
      {
        valor: ']',
        início: 25,
        fim: 26,
        tipo: 'pontuação',
      },
      {
        valor: '=',
        início: 27,
        fim: 28,
        tipo: 'operador',
      },
      {
        valor: 'lista_2',
        início: 29,
        fim: 36,
        tipo: 'identificador',
      },
      {
        valor: '[',
        início: 37,
        fim: 38,
        tipo: 'pontuação',
      },
      {
        valor: '...',
        início: 39,
        fim: 42,
        tipo: 'pontuação',
      },
      {
        valor: 'lista_1',
        início: 43,
        fim: 50,
        tipo: 'identificador',
      },
      {
        valor: ';',
        início: 51,
        fim: 52,
        tipo: 'pontuação',
      },
      {
        valor: '40',
        início: 53,
        fim: 55,
        tipo: 'número',
      },
      {
        valor: ']',
        início: 56,
        fim: 57,
        tipo: 'pontuação',
      },
      {
        valor: '`${',
        início: 58,
        fim: 61,
        tipo: 'modelo_texto',
      },
      {
        valor: '$',
        início: 62,
        fim: 63,
        tipo: 'operador',
      },
      {
        valor: 'lista_2',
        início: 64,
        fim: 71,
        tipo: 'identificador',
      },
      {
        valor: '0',
        início: 72,
        fim: 73,
        tipo: 'número',
      },
      {
        valor: '} ${',
        início: 74,
        fim: 78,
        tipo: 'modelo_texto',
      },
      {
        valor: '$',
        início: 79,
        fim: 80,
        tipo: 'operador',
      },
      {
        valor: 'lista_2',
        início: 81,
        fim: 88,
        tipo: 'identificador',
      },
      {
        valor: '1',
        início: 89,
        fim: 90,
        tipo: 'número',
      },
      {
        valor: '} ${',
        início: 91,
        fim: 95,
        tipo: 'modelo_texto',
      },
      {
        valor: '$',
        início: 96,
        fim: 97,
        tipo: 'operador',
      },
      {
        valor: 'lista_2',
        início: 98,
        fim: 105,
        tipo: 'identificador',
      },
      {
        valor: '2',
        início: 106,
        fim: 107,
        tipo: 'número',
      },
      {
        valor: '} ${',
        início: 108,
        fim: 112,
        tipo: 'modelo_texto',
      },
      {
        valor: '$',
        início: 113,
        fim: 114,
        tipo: 'operador',
      },
      {
        valor: 'lista_2',
        início: 115,
        fim: 122,
        tipo: 'identificador',
      },
      {
        valor: '3',
        início: 123,
        fim: 124,
        tipo: 'número',
      },
      {
        valor: '}`',
        início: 125,
        fim: 127,
        tipo: 'modelo_texto',
      },
    ],
    saída: bloco(`
      . 10 20 30 40
    `),
  }),
  ...teste({
    entrada: bloco(`
      . = lista_1 [ 10 ; 20 ]
      . = lista_2 [ 30 ; 40 ]
      . = lista_3 [ ... lista_1 ; ... lista_2 ]
      . \`\${ $ lista_3 0 } \${ $ lista_3 1 } \${ $ lista_3 2 } \${ $ lista_3 3 }\`
    `),
    símbolos: [
      {
        valor: '=',
        início: 0,
        fim: 1,
        tipo: 'operador',
      },
      {
        valor: 'lista_1',
        início: 2,
        fim: 9,
        tipo: 'identificador',
      },
      {
        valor: '[',
        início: 10,
        fim: 11,
        tipo: 'pontuação',
      },
      {
        valor: '10',
        início: 12,
        fim: 14,
        tipo: 'número',
      },
      {
        valor: ';',
        início: 15,
        fim: 16,
        tipo: 'pontuação',
      },
      {
        valor: '20',
        início: 17,
        fim: 19,
        tipo: 'número',
      },
      {
        valor: ']',
        início: 20,
        fim: 21,
        tipo: 'pontuação',
      },
      {
        valor: '=',
        início: 22,
        fim: 23,
        tipo: 'operador',
      },
      {
        valor: 'lista_2',
        início: 24,
        fim: 31,
        tipo: 'identificador',
      },
      {
        valor: '[',
        início: 32,
        fim: 33,
        tipo: 'pontuação',
      },
      {
        valor: '30',
        início: 34,
        fim: 36,
        tipo: 'número',
      },
      {
        valor: ';',
        início: 37,
        fim: 38,
        tipo: 'pontuação',
      },
      {
        valor: '40',
        início: 39,
        fim: 41,
        tipo: 'número',
      },
      {
        valor: ']',
        início: 42,
        fim: 43,
        tipo: 'pontuação',
      },
      {
        valor: '=',
        início: 44,
        fim: 45,
        tipo: 'operador',
      },
      {
        valor: 'lista_3',
        início: 46,
        fim: 53,
        tipo: 'identificador',
      },
      {
        valor: '[',
        início: 54,
        fim: 55,
        tipo: 'pontuação',
      },
      {
        valor: '...',
        início: 56,
        fim: 59,
        tipo: 'pontuação',
      },
      {
        valor: 'lista_1',
        início: 60,
        fim: 67,
        tipo: 'identificador',
      },
      {
        valor: ';',
        início: 68,
        fim: 69,
        tipo: 'pontuação',
      },
      {
        valor: '...',
        início: 70,
        fim: 73,
        tipo: 'pontuação',
      },
      {
        valor: 'lista_2',
        início: 74,
        fim: 81,
        tipo: 'identificador',
      },
      {
        valor: ']',
        início: 82,
        fim: 83,
        tipo: 'pontuação',
      },
      {
        valor: '`${',
        início: 84,
        fim: 87,
        tipo: 'modelo_texto',
      },
      {
        valor: '$',
        início: 88,
        fim: 89,
        tipo: 'operador',
      },
      {
        valor: 'lista_3',
        início: 90,
        fim: 97,
        tipo: 'identificador',
      },
      {
        valor: '0',
        início: 98,
        fim: 99,
        tipo: 'número',
      },
      {
        valor: '} ${',
        início: 100,
        fim: 104,
        tipo: 'modelo_texto',
      },
      {
        valor: '$',
        início: 105,
        fim: 106,
        tipo: 'operador',
      },
      {
        valor: 'lista_3',
        início: 107,
        fim: 114,
        tipo: 'identificador',
      },
      {
        valor: '1',
        início: 115,
        fim: 116,
        tipo: 'número',
      },
      {
        valor: '} ${',
        início: 117,
        fim: 121,
        tipo: 'modelo_texto',
      },
      {
        valor: '$',
        início: 122,
        fim: 123,
        tipo: 'operador',
      },
      {
        valor: 'lista_3',
        início: 124,
        fim: 131,
        tipo: 'identificador',
      },
      {
        valor: '2',
        início: 132,
        fim: 133,
        tipo: 'número',
      },
      {
        valor: '} ${',
        início: 134,
        fim: 138,
        tipo: 'modelo_texto',
      },
      {
        valor: '$',
        início: 139,
        fim: 140,
        tipo: 'operador',
      },
      {
        valor: 'lista_3',
        início: 141,
        fim: 148,
        tipo: 'identificador',
      },
      {
        valor: '3',
        início: 149,
        fim: 150,
        tipo: 'número',
      },
      {
        valor: '}`',
        início: 151,
        fim: 153,
        tipo: 'modelo_texto',
      },
    ],
    saída: bloco(`
      . 10 20 30 40
    `),
  }),
  ...teste({
    entrada: bloco(`
      . = lista_1 [ 10 ; 20 ]
      . = lista_2 [ ... lista_1 ; 30 ]
      . = lista_3 [ ... lista_2 ; 40 ]
      . \`\${ $ lista_3 0 } \${ $ lista_3 1 } \${ $ lista_3 2 } \${ $ lista_3 3 }\`
    `),
    símbolos: [
      {
        valor: '=',
        início: 0,
        fim: 1,
        tipo: 'operador',
      },
      {
        valor: 'lista_1',
        início: 2,
        fim: 9,
        tipo: 'identificador',
      },
      {
        valor: '[',
        início: 10,
        fim: 11,
        tipo: 'pontuação',
      },
      {
        valor: '10',
        início: 12,
        fim: 14,
        tipo: 'número',
      },
      {
        valor: ';',
        início: 15,
        fim: 16,
        tipo: 'pontuação',
      },
      {
        valor: '20',
        início: 17,
        fim: 19,
        tipo: 'número',
      },
      {
        valor: ']',
        início: 20,
        fim: 21,
        tipo: 'pontuação',
      },
      {
        valor: '=',
        início: 22,
        fim: 23,
        tipo: 'operador',
      },
      {
        valor: 'lista_2',
        início: 24,
        fim: 31,
        tipo: 'identificador',
      },
      {
        valor: '[',
        início: 32,
        fim: 33,
        tipo: 'pontuação',
      },
      {
        valor: '...',
        início: 34,
        fim: 37,
        tipo: 'pontuação',
      },
      {
        valor: 'lista_1',
        início: 38,
        fim: 45,
        tipo: 'identificador',
      },
      {
        valor: ';',
        início: 46,
        fim: 47,
        tipo: 'pontuação',
      },
      {
        valor: '30',
        início: 48,
        fim: 50,
        tipo: 'número',
      },
      {
        valor: ']',
        início: 51,
        fim: 52,
        tipo: 'pontuação',
      },
      {
        valor: '=',
        início: 53,
        fim: 54,
        tipo: 'operador',
      },
      {
        valor: 'lista_3',
        início: 55,
        fim: 62,
        tipo: 'identificador',
      },
      {
        valor: '[',
        início: 63,
        fim: 64,
        tipo: 'pontuação',
      },
      {
        valor: '...',
        início: 65,
        fim: 68,
        tipo: 'pontuação',
      },
      {
        valor: 'lista_2',
        início: 69,
        fim: 76,
        tipo: 'identificador',
      },
      {
        valor: ';',
        início: 77,
        fim: 78,
        tipo: 'pontuação',
      },
      {
        valor: '40',
        início: 79,
        fim: 81,
        tipo: 'número',
      },
      {
        valor: ']',
        início: 82,
        fim: 83,
        tipo: 'pontuação',
      },
      {
        valor: '`${',
        início: 84,
        fim: 87,
        tipo: 'modelo_texto',
      },
      {
        valor: '$',
        início: 88,
        fim: 89,
        tipo: 'operador',
      },
      {
        valor: 'lista_3',
        início: 90,
        fim: 97,
        tipo: 'identificador',
      },
      {
        valor: '0',
        início: 98,
        fim: 99,
        tipo: 'número',
      },
      {
        valor: '} ${',
        início: 100,
        fim: 104,
        tipo: 'modelo_texto',
      },
      {
        valor: '$',
        início: 105,
        fim: 106,
        tipo: 'operador',
      },
      {
        valor: 'lista_3',
        início: 107,
        fim: 114,
        tipo: 'identificador',
      },
      {
        valor: '1',
        início: 115,
        fim: 116,
        tipo: 'número',
      },
      {
        valor: '} ${',
        início: 117,
        fim: 121,
        tipo: 'modelo_texto',
      },
      {
        valor: '$',
        início: 122,
        fim: 123,
        tipo: 'operador',
      },
      {
        valor: 'lista_3',
        início: 124,
        fim: 131,
        tipo: 'identificador',
      },
      {
        valor: '2',
        início: 132,
        fim: 133,
        tipo: 'número',
      },
      {
        valor: '} ${',
        início: 134,
        fim: 138,
        tipo: 'modelo_texto',
      },
      {
        valor: '$',
        início: 139,
        fim: 140,
        tipo: 'operador',
      },
      {
        valor: 'lista_3',
        início: 141,
        fim: 148,
        tipo: 'identificador',
      },
      {
        valor: '3',
        início: 149,
        fim: 150,
        tipo: 'número',
      },
      {
        valor: '}`',
        início: 151,
        fim: 153,
        tipo: 'modelo_texto',
      },
    ],
    saída: bloco(`
      . 10 20 30 40
    `),
  }),
  ...teste({
    entrada: bloco(`
      . = lista_1 [ 20 ; 30 ]
      . = lista_2 [ 50 ; 60 ]
      . = lista_3 [ 10 ; ... lista_1 ; 40 ; ... lista_2 ; 70 ]
      . \`\${ $ lista_3 0} \${ $ lista_3 1} \${ $ lista_3 2} \${ $ lista_3 3} \${ $ lista_3 4} \${ $ lista_3 5} \${ $ lista_3 6}\`
    `),
    símbolos: [
      {
        valor: '=',
        início: 0,
        fim: 1,
        tipo: 'operador',
      },
      {
        valor: 'lista_1',
        início: 2,
        fim: 9,
        tipo: 'identificador',
      },
      {
        valor: '[',
        início: 10,
        fim: 11,
        tipo: 'pontuação',
      },
      {
        valor: '20',
        início: 12,
        fim: 14,
        tipo: 'número',
      },
      {
        valor: ';',
        início: 15,
        fim: 16,
        tipo: 'pontuação',
      },
      {
        valor: '30',
        início: 17,
        fim: 19,
        tipo: 'número',
      },
      {
        valor: ']',
        início: 20,
        fim: 21,
        tipo: 'pontuação',
      },
      {
        valor: '=',
        início: 22,
        fim: 23,
        tipo: 'operador',
      },
      {
        valor: 'lista_2',
        início: 24,
        fim: 31,
        tipo: 'identificador',
      },
      {
        valor: '[',
        início: 32,
        fim: 33,
        tipo: 'pontuação',
      },
      {
        valor: '50',
        início: 34,
        fim: 36,
        tipo: 'número',
      },
      {
        valor: ';',
        início: 37,
        fim: 38,
        tipo: 'pontuação',
      },
      {
        valor: '60',
        início: 39,
        fim: 41,
        tipo: 'número',
      },
      {
        valor: ']',
        início: 42,
        fim: 43,
        tipo: 'pontuação',
      },
      {
        valor: '=',
        início: 44,
        fim: 45,
        tipo: 'operador',
      },
      {
        valor: 'lista_3',
        início: 46,
        fim: 53,
        tipo: 'identificador',
      },
      {
        valor: '[',
        início: 54,
        fim: 55,
        tipo: 'pontuação',
      },
      {
        valor: '10',
        início: 56,
        fim: 58,
        tipo: 'número',
      },
      {
        valor: ';',
        início: 59,
        fim: 60,
        tipo: 'pontuação',
      },
      {
        valor: '...',
        início: 61,
        fim: 64,
        tipo: 'pontuação',
      },
      {
        valor: 'lista_1',
        início: 65,
        fim: 72,
        tipo: 'identificador',
      },
      {
        valor: ';',
        início: 73,
        fim: 74,
        tipo: 'pontuação',
      },
      {
        valor: '40',
        início: 75,
        fim: 77,
        tipo: 'número',
      },
      {
        valor: ';',
        início: 78,
        fim: 79,
        tipo: 'pontuação',
      },
      {
        valor: '...',
        início: 80,
        fim: 83,
        tipo: 'pontuação',
      },
      {
        valor: 'lista_2',
        início: 84,
        fim: 91,
        tipo: 'identificador',
      },
      {
        valor: ';',
        início: 92,
        fim: 93,
        tipo: 'pontuação',
      },
      {
        valor: '70',
        início: 94,
        fim: 96,
        tipo: 'número',
      },
      {
        valor: ']',
        início: 97,
        fim: 98,
        tipo: 'pontuação',
      },
      {
        valor: '`${',
        início: 99,
        fim: 102,
        tipo: 'modelo_texto',
      },
      {
        valor: '$',
        início: 103,
        fim: 104,
        tipo: 'operador',
      },
      {
        valor: 'lista_3',
        início: 105,
        fim: 112,
        tipo: 'identificador',
      },
      {
        valor: '0',
        início: 113,
        fim: 114,
        tipo: 'número',
      },
      {
        valor: '} ${',
        início: 114,
        fim: 118,
        tipo: 'modelo_texto',
      },
      {
        valor: '$',
        início: 119,
        fim: 120,
        tipo: 'operador',
      },
      {
        valor: 'lista_3',
        início: 121,
        fim: 128,
        tipo: 'identificador',
      },
      {
        valor: '1',
        início: 129,
        fim: 130,
        tipo: 'número',
      },
      {
        valor: '} ${',
        início: 130,
        fim: 134,
        tipo: 'modelo_texto',
      },
      {
        valor: '$',
        início: 135,
        fim: 136,
        tipo: 'operador',
      },
      {
        valor: 'lista_3',
        início: 137,
        fim: 144,
        tipo: 'identificador',
      },
      {
        valor: '2',
        início: 145,
        fim: 146,
        tipo: 'número',
      },
      {
        valor: '} ${',
        início: 146,
        fim: 150,
        tipo: 'modelo_texto',
      },
      {
        valor: '$',
        início: 151,
        fim: 152,
        tipo: 'operador',
      },
      {
        valor: 'lista_3',
        início: 153,
        fim: 160,
        tipo: 'identificador',
      },
      {
        valor: '3',
        início: 161,
        fim: 162,
        tipo: 'número',
      },
      {
        valor: '} ${',
        início: 162,
        fim: 166,
        tipo: 'modelo_texto',
      },
      {
        valor: '$',
        início: 167,
        fim: 168,
        tipo: 'operador',
      },
      {
        valor: 'lista_3',
        início: 169,
        fim: 176,
        tipo: 'identificador',
      },
      {
        valor: '4',
        início: 177,
        fim: 178,
        tipo: 'número',
      },
      {
        valor: '} ${',
        início: 178,
        fim: 182,
        tipo: 'modelo_texto',
      },
      {
        valor: '$',
        início: 183,
        fim: 184,
        tipo: 'operador',
      },
      {
        valor: 'lista_3',
        início: 185,
        fim: 192,
        tipo: 'identificador',
      },
      {
        valor: '5',
        início: 193,
        fim: 194,
        tipo: 'número',
      },
      {
        valor: '} ${',
        início: 194,
        fim: 198,
        tipo: 'modelo_texto',
      },
      {
        valor: '$',
        início: 199,
        fim: 200,
        tipo: 'operador',
      },
      {
        valor: 'lista_3',
        início: 201,
        fim: 208,
        tipo: 'identificador',
      },
      {
        valor: '6',
        início: 209,
        fim: 210,
        tipo: 'número',
      },
      {
        valor: '}`',
        início: 210,
        fim: 212,
        tipo: 'modelo_texto',
      },
    ],
    saída: bloco(`
      . 10 20 30 40 50 60 70
    `),
  }),
]
