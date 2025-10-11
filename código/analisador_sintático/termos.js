// Term operations - termo1, termo2, termo3, termo4, termo5, termo6
import { alternativa, sequência, opcional, vários, transformar, símbolo, operador } from '../combinadores/index.js';
import { operação } from '../combinadores/avançados.js';
import { espaço, número, número_negativo, texto } from '../analisador_léxico/index.js';

// Forward declaration for recursive expressão reference
let expressão;

// Import basic operations
let não, valor_constante, chamada_função_imediata;

// Import list operations
let fatia, tamanho, chaves, lista, atributo;

// Import function operations
let lambda, chamada_função, parênteses;

// Build termo1 dynamically
const getTermo1 = () => alternativa(
  chamada_função_imediata,  // Try immediate function call first
  transformar(
    sequência(
      alternativa(
        valor_constante,
        parênteses,
        lista,
        número,
        texto,
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
      const [valor_fn, operações_info] = valor;

      return escopo => {
        let operações_fns;
        if (Array.isArray(operações_info) && operações_info.length >= 2 && operações_info[0] === undefined) {
          // This might be the "with space" case where we have [espaço, operations]
          operações_fns = operações_info[1] || [];
        } else if (Array.isArray(operações_info)) {
          // This is likely the "no space" case where operações_info is directly the operations array
          operações_fns = operações_info;
        } else {
          // Fallback
          operações_fns = [];
        }
        
        if (!Array.isArray(operações_fns) || operações_fns.length === 0) {
          return valor_fn(escopo);
        }
        return operações_fns.reduce(
          (resultado, operação_fn) => operação_fn(escopo, resultado),
          valor_fn(escopo)
        );
      };
    }
  )
);

const getTermo2 = () => alternativa(
  lambda,
  getTermo1(),
  número_negativo,
  não,
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
    const [condição_fn, resto_opcional_val] = valor;

    if (!resto_opcional_val) return condição_fn;

    const [, , , valor_se_verdadeiro_fn, , , , valor_se_falso_fn] = resto_opcional_val;
    return escopo => condição_fn(escopo) !== 0 ? valor_se_verdadeiro_fn(escopo) : valor_se_falso_fn(escopo);
  }
);

// Function to set the expressão reference and dependencies
const setDependências = (expr, deps) => {
  expressão = expr;
  não = deps.não;
  valor_constante = deps.valor_constante;
  chamada_função_imediata = deps.chamada_função_imediata;
  fatia = deps.fatia;
  tamanho = deps.tamanho;
  chaves = deps.chaves;
  lista = deps.lista;
  atributo = deps.atributo;
  lambda = deps.lambda;
  chamada_função = deps.chamada_função;
  parênteses = deps.parênteses;
};

export { getTermo1, getTermo2, getTermo3, getTermo4, getTermo5, getTermo6, setDependências };
