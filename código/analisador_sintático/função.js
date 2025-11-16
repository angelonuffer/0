// Function operations - lambda, chamada_função, parênteses
import { sequência, opcional, transformar, símbolo, alternativa, vários } from '../combinadores/index.js';
import { espaço, nome } from '../analisador_léxico/index.js';
import { TIPO_AST } from '../constantes.js';

// Forward declaration for recursive expressão reference
let expressão;
let getTermo6;

// Parser for object destructuring pattern: { a b c }
const objeto_destructuring = transformar(
  sequência(
    símbolo("{"),
    opcional(espaço),
    vários(
      sequência(
        nome,
        opcional(espaço),
      )
    ),
    símbolo("}")
  ),
  ([, , nomes_seq,]) => {
    if (!nomes_seq) {
      return {
        tipo: TIPO_AST.DESTRUCTURING,
        nomes: []
      };
    }
    const nomes = nomes_seq.map(seq => seq[0]);
    return {
      tipo: TIPO_AST.DESTRUCTURING,
      nomes: nomes
    };
  }
);

// Parser for guard expressions: | condition = expression or | expression (default)
// Note: expects to be called after whitespace has been consumed
// Uses getTermo6 instead of expressão to avoid parsing | as logical operator
const guardExpression = transformar(
  sequência(
    símbolo("|"),
    opcional(espaço),
    código => getTermo6()(código),
    opcional(
      sequência(
        opcional(espaço),
        símbolo("="),
        opcional(espaço),
        código => getTermo6()(código)
      )
    ),
    opcional(espaço)
  ),
  ([, , conditionOrDefault, assignmentOpt,]) => {
    if (assignmentOpt) {
      // This is a guard with condition: | condition = expression
      const [, , , resultExpr] = assignmentOpt;
      return {
        tipo: TIPO_AST.GUARD,
        condição: conditionOrDefault,
        expressão: resultExpr
      };
    } else {
      // This is the default case: | expression
      return {
        tipo: TIPO_AST.GUARD_DEFAULT,
        expressão: conditionOrDefault
      };
    }
  }
);

// Parser for guard body - requires at least one guard
const guardBody = código => {
  // First, consume required space
  const spaceResult = espaço(código);
  if (!spaceResult.sucesso) {
    return spaceResult;
  }
  
  // Then try to parse guards using vários
  const guardsResult = vários(guardExpression)(spaceResult.resto);
  
  // Check if we got at least one guard
  if (guardsResult.sucesso && guardsResult.valor.length > 0) {
    return {
      sucesso: true,
      valor: { tipo: TIPO_AST.GUARD_BODY, guards: guardsResult.valor },
      resto: guardsResult.resto,
      menor_resto: guardsResult.menor_resto
    };
  }
  
  // Failed - no guards found
  return {
    sucesso: false,
    valor: undefined,
    resto: código,
    menor_resto: guardsResult.menor_resto || spaceResult.menor_resto || código
  };
};

const lambda = transformar(
  sequência(
    alternativa(
      objeto_destructuring,
      nome
    ),
    opcional(espaço),
    símbolo("=>"),
    alternativa(
      // Try guard body first (requires space before | and at least one guard)
      guardBody,
      // Fall back to regular expression
      sequência(
        opcional(espaço),
        código => expressão(código)
      )
    )
  ),
  (valorBrutoLambda) => {
    const [paramsResultado, , , corpoInfo] = valorBrutoLambda;

    let nomeParam = null;
    let destructuringParam = null;
    
    if (typeof paramsResultado === 'object' && paramsResultado.tipo === 'destructuring') {
      // Object destructuring case: { a b c }
      destructuringParam = paramsResultado.nomes;
    } else if (Array.isArray(paramsResultado) && paramsResultado[0] === '(') {
      // Parentheses case: (param) or ()
      nomeParam = paramsResultado[2] || null;
    } else {
      // No parentheses case: param
      nomeParam = paramsResultado;
    }

    // Check if corpoInfo is guards or regular expression
    let corpo;
    if (corpoInfo && typeof corpoInfo === 'object' && corpoInfo.tipo === TIPO_AST.GUARD_BODY) {
      // This is the guards case
      corpo = {
        tipo: TIPO_AST.GUARDS,
        guards: corpoInfo.guards
      };
    } else if (Array.isArray(corpoInfo) && corpoInfo.length === 2) {
      // This is the regular expression case: [opcional(espaço), expressão]
      corpo = corpoInfo[1];
    } else {
      // Fallback
      corpo = corpoInfo;
    }

    return {
      tipo: TIPO_AST.LAMBDA,
      parâmetro: nomeParam,
      destructuring: destructuringParam,
      corpo: corpo
    };
  }
);

const chamada_função = transformar(
  sequência(
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
  ),
  ([, , arg_seq_optional,]) => ({
    tipo: TIPO_AST.OPERAÇÃO_CHAMADA_FUNÇÃO,
    argumento: arg_seq_optional ? arg_seq_optional[0] : undefined
  })
);

const parênteses = transformar(
  sequência(
    símbolo("("),
    opcional(espaço),
    // Try to parse declarations first (name = expr pairs)
    vários(
      sequência(
        nome,
        opcional(espaço),
        símbolo("="),
        opcional(espaço),
        código => expressão(código),
        espaço,
      )
    ),
    código => expressão(código),
    opcional(espaço),
    símbolo(")"),
  ),
  valorSeq => {
    const [, , declarações_vários, expr,] = valorSeq;
    
    // If we have declarations, create a parentheses node with declarations
    if (declarações_vários && declarações_vários.length > 0) {
      const declarações = declarações_vários.map(([nome_var, , , , valorExpr]) => ({
        nome: nome_var,
        valor: valorExpr
      }));
      
      return {
        tipo: TIPO_AST.PARÊNTESES_COM_DECLARAÇÕES,
        declarações: declarações,
        expressão: expr
      };
    }
    
    // Otherwise, simple parentheses
    return {
      tipo: TIPO_AST.PARÊNTESES,
      expressão: expr
    };
  }
);

// Function to set the expressão reference
const setExpressão = (expr) => {
  expressão = expr;
};

// Function to set the getTermo6 reference
const setGetTermo6 = (getter) => {
  getTermo6 = getter;
};

export { lambda, chamada_função, parênteses, setExpressão, setGetTermo6 };
