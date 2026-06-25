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
        valor: 'lista',
        início: 18,
        fim: 23,
        tipo: 'identificador',
      },
      {
        valor: '0',
        início: 24,
        fim: 25,
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
        valor: 'lista',
        início: 39,
        fim: 44,
        tipo: 'identificador',
      },
      {
        valor: '0',
        início: 45,
        fim: 46,
        tipo: 'número',
      },
      {
        valor: '} ${',
        início: 46,
        fim: 50,
        tipo: 'modelo_texto',
      },
      {
        valor: 'lista',
        início: 50,
        fim: 55,
        tipo: 'identificador',
      },
      {
        valor: '1',
        início: 56,
        fim: 57,
        tipo: 'número',
      },
      {
        valor: '} ${',
        início: 57,
        fim: 61,
        tipo: 'modelo_texto',
      },
      {
        valor: 'lista',
        início: 61,
        fim: 66,
        tipo: 'identificador',
      },
      {
        valor: '2',
        início: 67,
        fim: 68,
        tipo: 'número',
      },
      {
        valor: '} ${',
        início: 68,
        fim: 72,
        tipo: 'modelo_texto',
      },
      {
        valor: 'lista',
        início: 72,
        fim: 77,
        tipo: 'identificador',
      },
      {
        valor: '3',
        início: 78,
        fim: 79,
        tipo: 'número',
      },
      {
        valor: '}`',
        início: 79,
        fim: 81,
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
        valor: 'lista',
        início: 18,
        fim: 23,
        tipo: 'identificador',
      },
      {
        valor: '1',
        início: 24,
        fim: 25,
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
        tipo: 'pontuação',
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
        valor: 'lista',
        início: 32,
        fim: 37,
        tipo: 'identificador',
      },
      {
        valor: '0',
        início: 38,
        fim: 39,
        tipo: 'número',
      },
      {
        valor: '1',
        início: 40,
        fim: 41,
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
        valor: 'lista',
        início: 22,
        fim: 27,
        tipo: 'identificador',
      },
      {
        valor: '2',
        início: 28,
        fim: 29,
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
        valor: 'lista',
        início: 27,
        fim: 32,
        tipo: 'identificador',
      },
      {
        valor: '1',
        início: 33,
        fim: 34,
        tipo: 'número',
      },
      {
        valor: '1',
        início: 35,
        fim: 36,
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
        valor: 'lista_1',
        início: 39,
        fim: 46,
        tipo: 'identificador',
      },
      {
        valor: '2',
        início: 47,
        fim: 48,
        tipo: 'número',
      },
      {
        valor: ';',
        início: 49,
        fim: 50,
        tipo: 'pontuação',
      },
      {
        valor: '40',
        início: 51,
        fim: 53,
        tipo: 'número',
      },
      {
        valor: ']',
        início: 54,
        fim: 55,
        tipo: 'pontuação',
      },
      {
        valor: 'lista_2',
        início: 56,
        fim: 63,
        tipo: 'identificador',
      },
      {
        valor: '0',
        início: 64,
        fim: 65,
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
        tipo: 'pontuação',
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
        valor: 'lista_2',
        início: 61,
        fim: 68,
        tipo: 'identificador',
      },
      {
        valor: '0',
        início: 69,
        fim: 70,
        tipo: 'número',
      },
      {
        valor: '} ${',
        início: 70,
        fim: 74,
        tipo: 'modelo_texto',
      },
      {
        valor: 'lista_2',
        início: 74,
        fim: 81,
        tipo: 'identificador',
      },
      {
        valor: '1',
        início: 82,
        fim: 83,
        tipo: 'número',
      },
      {
        valor: '} ${',
        início: 83,
        fim: 87,
        tipo: 'modelo_texto',
      },
      {
        valor: 'lista_2',
        início: 87,
        fim: 94,
        tipo: 'identificador',
      },
      {
        valor: '2',
        início: 95,
        fim: 96,
        tipo: 'número',
      },
      {
        valor: '} ${',
        início: 96,
        fim: 100,
        tipo: 'modelo_texto',
      },
      {
        valor: 'lista_2',
        início: 100,
        fim: 107,
        tipo: 'identificador',
      },
      {
        valor: '3',
        início: 108,
        fim: 109,
        tipo: 'número',
      },
      {
        valor: '}`',
        início: 109,
        fim: 111,
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
        valor: 'lista_3',
        início: 87,
        fim: 94,
        tipo: 'identificador',
      },
      {
        valor: '0',
        início: 95,
        fim: 96,
        tipo: 'número',
      },
      {
        valor: '} ${',
        início: 96,
        fim: 100,
        tipo: 'modelo_texto',
      },
      {
        valor: 'lista_3',
        início: 100,
        fim: 107,
        tipo: 'identificador',
      },
      {
        valor: '1',
        início: 108,
        fim: 109,
        tipo: 'número',
      },
      {
        valor: '} ${',
        início: 109,
        fim: 113,
        tipo: 'modelo_texto',
      },
      {
        valor: 'lista_3',
        início: 113,
        fim: 120,
        tipo: 'identificador',
      },
      {
        valor: '2',
        início: 121,
        fim: 122,
        tipo: 'número',
      },
      {
        valor: '} ${',
        início: 122,
        fim: 126,
        tipo: 'modelo_texto',
      },
      {
        valor: 'lista_3',
        início: 126,
        fim: 133,
        tipo: 'identificador',
      },
      {
        valor: '3',
        início: 134,
        fim: 135,
        tipo: 'número',
      },
      {
        valor: '}`',
        início: 135,
        fim: 137,
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
        valor: 'lista_3',
        início: 87,
        fim: 94,
        tipo: 'identificador',
      },
      {
        valor: '0',
        início: 95,
        fim: 96,
        tipo: 'número',
      },
      {
        valor: '} ${',
        início: 96,
        fim: 100,
        tipo: 'modelo_texto',
      },
      {
        valor: 'lista_3',
        início: 100,
        fim: 107,
        tipo: 'identificador',
      },
      {
        valor: '1',
        início: 108,
        fim: 109,
        tipo: 'número',
      },
      {
        valor: '} ${',
        início: 109,
        fim: 113,
        tipo: 'modelo_texto',
      },
      {
        valor: 'lista_3',
        início: 113,
        fim: 120,
        tipo: 'identificador',
      },
      {
        valor: '2',
        início: 121,
        fim: 122,
        tipo: 'número',
      },
      {
        valor: '} ${',
        início: 122,
        fim: 126,
        tipo: 'modelo_texto',
      },
      {
        valor: 'lista_3',
        início: 126,
        fim: 133,
        tipo: 'identificador',
      },
      {
        valor: '3',
        início: 134,
        fim: 135,
        tipo: 'número',
      },
      {
        valor: '}`',
        início: 135,
        fim: 137,
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
        valor: 'lista_3',
        início: 102,
        fim: 109,
        tipo: 'identificador',
      },
      {
        valor: '0',
        início: 110,
        fim: 111,
        tipo: 'número',
      },
      {
        valor: '} ${',
        início: 111,
        fim: 115,
        tipo: 'modelo_texto',
      },
      {
        valor: 'lista_3',
        início: 115,
        fim: 122,
        tipo: 'identificador',
      },
      {
        valor: '1',
        início: 123,
        fim: 124,
        tipo: 'número',
      },
      {
        valor: '} ${',
        início: 124,
        fim: 128,
        tipo: 'modelo_texto',
      },
      {
        valor: 'lista_3',
        início: 128,
        fim: 135,
        tipo: 'identificador',
      },
      {
        valor: '2',
        início: 136,
        fim: 137,
        tipo: 'número',
      },
      {
        valor: '} ${',
        início: 137,
        fim: 141,
        tipo: 'modelo_texto',
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
        valor: '} ${',
        início: 150,
        fim: 154,
        tipo: 'modelo_texto',
      },
      {
        valor: 'lista_3',
        início: 154,
        fim: 161,
        tipo: 'identificador',
      },
      {
        valor: '4',
        início: 162,
        fim: 163,
        tipo: 'número',
      },
      {
        valor: '} ${',
        início: 163,
        fim: 167,
        tipo: 'modelo_texto',
      },
      {
        valor: 'lista_3',
        início: 167,
        fim: 174,
        tipo: 'identificador',
      },
      {
        valor: '5',
        início: 175,
        fim: 176,
        tipo: 'número',
      },
      {
        valor: '} ${',
        início: 176,
        fim: 180,
        tipo: 'modelo_texto',
      },
      {
        valor: 'lista_3',
        início: 180,
        fim: 187,
        tipo: 'identificador',
      },
      {
        valor: '6',
        início: 188,
        fim: 189,
        tipo: 'número',
      },
      {
        valor: '}`',
        início: 189,
        fim: 191,
        tipo: 'modelo_texto',
      },
    ],
    saída: bloco(`
      . 10 20 30 40 50 60 70
    `),
  }),
]
