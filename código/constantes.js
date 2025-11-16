// Constantes compartilhadas usadas em todo o projeto

// Códigos ANSI para formatação de terminal
export const ANSI = {
  RESET: '\x1b[0m',
  VERMELHO_FUNDO: '\x1b[41m',
  VERDE_FUNDO: '\x1b[42m',
  AMARELO_FUNDO: '\x1b[43m',
};

// Tipos de nós da AST (Abstract Syntax Tree)
export const TIPO_AST = {
  // Básico
  NÚMERO: 'número',
  TEXTO: 'texto',
  VARIÁVEL: 'variável',
  NÃO: 'não',
  DEPURAÇÃO: 'depuração',
  CARREGAR: 'carregar',
  
  // Estruturas
  PARÊNTESES: 'parênteses',
  PARÊNTESES_COM_DECLARAÇÕES: 'parênteses_com_declarações',
  LISTA: 'lista',
  OBJETO: 'objeto',
  
  // Funções
  LAMBDA: 'lambda',
  CHAMADA_FUNÇÃO: 'chamada_função',
  CHAMADA_FUNÇÃO_IMEDIATA: 'chamada_função_imediata',
  DESTRUCTURING: 'destructuring',
  
  // Guards
  GUARDS: 'guards',
  GUARD: 'guard',
  GUARD_BODY: 'guard_body',
  GUARD_DEFAULT: 'guard_default',
  
  // Operações
  OPERAÇÃO_BINÁRIA: 'operação_binária',
  OPERAÇÃO_FATIA: 'operação_fatia',
  OPERAÇÃO_TAMANHO: 'operação_tamanho',
  OPERAÇÃO_CHAVES: 'operação_chaves',
  OPERAÇÃO_ATRIBUTO: 'operação_atributo',
  OPERAÇÃO_CHAMADA_FUNÇÃO: 'operação_chamada_função',
  OPERAÇÃO_LÓGICA: 'operação_lógica',
  
  // Acessos
  FATIA: 'fatia',
  TAMANHO: 'tamanho',
  CHAVES: 'chaves',
  ATRIBUTO: 'atributo',
  
  // Outros
  CONDICIONAL: 'condicional',
  ESPALHAMENTO: 'espalhamento',
  ENDEREÇO_LITERAL: 'endereço_literal',
};
