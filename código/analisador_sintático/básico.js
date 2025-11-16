// Basic operations - não, valor_constante, chamada_função_imediata
import { alternativa, sequência, opcional, transformar, símbolo, vários } from '../combinadores/index.js';
import { espaço, nome } from '../analisador_léxico/index.js';
import { TIPO_AST } from '../constantes.js';

// Forward declaration for recursive expressão reference
let expressão;

// Forward declarations for operations
let fatia, tamanho, chaves, atributo, chamada_função;

const não = transformar(
  sequência(
    símbolo("!"),
    opcional(espaço),
    código => expressão(código),
  ),
  ([, , expr]) => ({
    tipo: TIPO_AST.NÃO,
    expressão: expr
  })
)

const depuração = transformar(
  sequência(
    símbolo("%"),
    opcional(espaço),
    código => expressão(código),
  ),
  ([, , expr]) => ({
    tipo: TIPO_AST.DEPURAÇÃO,
    expressão: expr
  })
)

const carregar = transformar(
  sequência(
    símbolo("@"),
    opcional(espaço),
    código => expressão(código),
  ),
  ([, , expr]) => ({
    tipo: TIPO_AST.CARREGAR,
    expressão: expr
  })
)

const valor_constante = transformar(
  nome,
  nome_var => ({
    tipo: TIPO_AST.VARIÁVEL,
    nome: nome_var
  })
)

// Immediate function call - identifier directly followed by parentheses (no space)
// Now supports chaining operations like soma(2)(3)
const chamada_função_imediata = transformar(
  sequência(
    nome,
    símbolo("("),
    opcional(espaço),
    opcional(
      sequência(
        código => expressão(código),
        opcional(espaço),
      )
    ),
    opcional(espaço),
    símbolo(")"),
    // Allow chaining operations (no space required)
    código => {
      // Lazy evaluation of operations parser
      return vários(
        alternativa(
          fatia,
          tamanho,
          chaves,
          atributo,
          chamada_função,
        ),
      )(código);
    }
  ),
  (valor) => {
    const [nome_var, , , arg_seq_optional, , , operações] = valor;
    
    // Create the initial function call AST
    let ast = {
      tipo: TIPO_AST.CHAMADA_FUNÇÃO_IMEDIATA,
      nome: nome_var,
      argumento: arg_seq_optional ? arg_seq_optional[0] : undefined
    };
    
    // Chain operations if any
    if (!Array.isArray(operações) || operações.length === 0) {
      return ast;
    }
    
    return operações.reduce((currentAst, operação) => {
      if (operação.tipo === TIPO_AST.OPERAÇÃO_FATIA) {
        return {
          tipo: TIPO_AST.FATIA,
          valor: currentAst,
          índice: operação.índice,
          fim: operação.fim,
          éFaixa: operação.éFaixa
        };
      } else if (operação.tipo === TIPO_AST.OPERAÇÃO_TAMANHO) {
        return {
          tipo: TIPO_AST.TAMANHO,
          valor: currentAst
        };
      } else if (operação.tipo === TIPO_AST.OPERAÇÃO_CHAVES) {
        return {
          tipo: TIPO_AST.CHAVES,
          valor: currentAst
        };
      } else if (operação.tipo === TIPO_AST.OPERAÇÃO_ATRIBUTO) {
        return {
          tipo: TIPO_AST.ATRIBUTO,
          objeto: currentAst,
          nome: operação.nome
        };
      } else if (operação.tipo === TIPO_AST.OPERAÇÃO_CHAMADA_FUNÇÃO) {
        return {
          tipo: TIPO_AST.CHAMADA_FUNÇÃO,
          função: currentAst,
          argumento: operação.argumento
        };
      }
      return currentAst;
    }, ast);
  }
)

// Function to set the expressão reference
const setExpressão = (expr) => {
  expressão = expr;
};

// Function to set operation references
const setOperações = (ops) => {
  fatia = ops.fatia;
  tamanho = ops.tamanho;
  chaves = ops.chaves;
  atributo = ops.atributo;
  chamada_função = ops.chamada_função;
};

export { não, depuração, carregar, valor_constante, chamada_função_imediata, setExpressão, setOperações };
