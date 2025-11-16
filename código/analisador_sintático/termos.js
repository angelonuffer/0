// Term operations - termo1, termo2, termo3, termo4, termo5, termo6
import { alternativa, sequência, opcional, vários, transformar, símbolo, operador } from '../combinadores/index.js';
import { operação } from '../combinadores/avançados.js';
import { espaço, número, número_negativo, texto, endereço_literal } from '../analisador_léxico/index.js';
import { TIPO_AST } from '../constantes.js';

// Forward declaration for recursive expressão reference
let expressão;

// Import basic operations
let não, depuração, carregar, valor_constante, chamada_função_imediata;

// Import object operations
let fatia, tamanho, chaves, lista, objeto, atributo;

// Import function operations
let lambda, chamada_função, parênteses;

// Build termo1 dynamically
const getTermo1 = () => alternativa(
  chamada_função_imediata,  // Try immediate function call first
  transformar(
    sequência(
      alternativa(
        endereço_literal,
        parênteses,
        lista,
        objeto,
        número,
        texto,
        valor_constante,
      ),
      alternativa(
        // No space - allow all operations including function calls
        vários(
          alternativa(
            fatia,
            tamanho,
            chaves,
            atributo,
            chamada_função,
          ),
        ),
        // With space - only allow operations that are not function calls
        sequência(
          espaço,
          vários(
            alternativa(
              fatia,
              tamanho,
              chaves,
              atributo,
              // Deliberately exclude chamada_função here
            ),
          ),
        )
      )
    ),
    valor => {
      const [valorAst, operações_info] = valor;

      let operações;
      if (Array.isArray(operações_info) && operações_info.length >= 2 && operações_info[0] === undefined) {
        // This might be the "with space" case where we have [espaço, operations]
        operações = operações_info[1] || [];
      } else if (Array.isArray(operações_info)) {
        // This is likely the "no space" case where operações_info is directly the operations array
        operações = operações_info;
      } else {
        // Fallback
        operações = [];
      }
      
      if (!Array.isArray(operações) || operações.length === 0) {
        return valorAst;
      }
      
      // Chain operations by creating nested AST nodes
      return operações.reduce((ast, operação) => {
        if (operação.tipo === TIPO_AST.OPERAÇÃO_FATIA) {
          return {
            tipo: TIPO_AST.FATIA,
            valor: ast,
            índice: operação.índice,
            fim: operação.fim,
            éFaixa: operação.éFaixa
          };
        } else if (operação.tipo === TIPO_AST.OPERAÇÃO_TAMANHO) {
          return {
            tipo: TIPO_AST.TAMANHO,
            valor: ast
          };
        } else if (operação.tipo === TIPO_AST.OPERAÇÃO_CHAVES) {
          return {
            tipo: TIPO_AST.CHAVES,
            valor: ast
          };
        } else if (operação.tipo === TIPO_AST.OPERAÇÃO_ATRIBUTO) {
          return {
            tipo: TIPO_AST.ATRIBUTO,
            objeto: ast,
            nome: operação.nome
          };
        } else if (operação.tipo === TIPO_AST.OPERAÇÃO_CHAMADA_FUNÇÃO) {
          return {
            tipo: TIPO_AST.CHAMADA_FUNÇÃO,
            função: ast,
            argumento: operação.argumento
          };
        }
        return ast;
      }, valorAst);
    }
  )
);

const getTermo2 = () => alternativa(
  lambda,
  getTermo1(),
  número_negativo,
  não,
  depuração,
  carregar,
  valor_constante,
  parênteses
);

const getTermo3 = () => operação(
  getTermo2(),
  alternativa(
    operador("*", (v1, v2) => {
      // If one operand is a list and the other is a string, perform join
      if (Array.isArray(v1) && typeof v2 === "string") {
        // Special case: when joining with empty string, convert numbers to characters
        if (v2 === "") {
          return v1.map(item => typeof item === "number" ? String.fromCharCode(item) : item).join(v2);
        }
        return v1.join(v2);
      }
      if (typeof v1 === "string" && Array.isArray(v2)) {
        // Special case: when joining with empty string, convert numbers to characters
        if (v1 === "") {
          return v2.map(item => typeof item === "number" ? String.fromCharCode(item) : item).join(v1);
        }
        return v2.join(v1);
      }
      // Check for list objects (with length property and numeric indices)
      if (typeof v1 === "object" && v1 !== null && typeof v1.length === "number" && typeof v2 === "string") {
        const arr = [];
        for (let i = 0; i < v1.length; i++) {
          arr.push(v1[i]);
        }
        // Special case: when joining with empty string, convert numbers to characters
        if (v2 === "") {
          return arr.map(item => typeof item === "number" ? String.fromCharCode(item) : item).join(v2);
        }
        return arr.join(v2);
      }
      if (typeof v1 === "string" && typeof v2 === "object" && v2 !== null && typeof v2.length === "number") {
        const arr = [];
        for (let i = 0; i < v2.length; i++) {
          arr.push(v2[i]);
        }
        // Special case: when joining with empty string, convert numbers to characters
        if (v1 === "") {
          return arr.map(item => typeof item === "number" ? String.fromCharCode(item) : item).join(v1);
        }
        return arr.join(v1);
      }
      // Otherwise, perform numeric multiplication
      return v1 * v2;
    }),
    operador("/", (v1, v2) => {
      // If both operands are strings, perform string split
      if (typeof v1 === "string" && typeof v2 === "string") {
        return v1.split(v2);
      }
      // Otherwise, perform numeric division
      return v1 / v2;
    }),
  ),
);

const getTermo4 = () => operação(
  getTermo3(),
  alternativa(
    operador("+", (v1, v2) => v1 + v2),
    operador("-", (v1, v2) => v1 - v2),
  ),
);

const getTermo5 = () => operação(
  getTermo4(),
  alternativa(
    operador(">=", (v1, v2) => v1 >= v2 ? 1 : 0),
    operador("<=", (v1, v2) => v1 <= v2 ? 1 : 0),
    operador(">", (v1, v2) => v1 > v2 ? 1 : 0),
    operador("<", (v1, v2) => v1 < v2 ? 1 : 0),
    operador("==", (v1, v2) => v1 === v2 ? 1 : 0),
    operador("!=", (v1, v2) => v1 !== v2 ? 1 : 0),
  ),
);

const getTermo6 = () => transformar(
  sequência(
    getTermo5(),
    opcional(sequência(
      opcional(espaço),
      símbolo("?"),
      opcional(espaço),
      código => expressão(código),
      opcional(espaço),
      símbolo(":"),
      opcional(espaço),
      código => expressão(código),
    ), undefined)
  ),
  valor => {
    const [condição, resto_opcional_val] = valor;

    if (!resto_opcional_val) return condição;

    const [, , , seVerdadeiro, , , , seFalso] = resto_opcional_val;
    return {
      tipo: TIPO_AST.CONDICIONAL,
      condição: condição,
      seVerdadeiro: seVerdadeiro,
      seFalso: seFalso
    };
  }
);

// Function to set the expressão reference and dependencies
const setDependências = (expr, deps) => {
  expressão = expr;
  não = deps.não;
  depuração = deps.depuração;
  carregar = deps.carregar;
  valor_constante = deps.valor_constante;
  chamada_função_imediata = deps.chamada_função_imediata;
  fatia = deps.fatia;
  tamanho = deps.tamanho;
  chaves = deps.chaves;
  lista = deps.lista;
  objeto = deps.objeto;
  atributo = deps.atributo;
  lambda = deps.lambda;
  chamada_função = deps.chamada_função;
  parênteses = deps.parênteses;
};

export { getTermo1, getTermo2, getTermo3, getTermo4, getTermo5, getTermo6, setDependências };
