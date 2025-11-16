// Object construction and evaluation

// Forward declaration for recursive avaliar reference
let avaliar;

// Helper to get module address from scope chain
const obterEndereçoMódulo = (escopo) => {
  let atualEscopo = escopo;
  while (atualEscopo) {
    if (atualEscopo.hasOwnProperty('__módulo__')) {
      return atualEscopo.__módulo__;
    }
    atualEscopo = atualEscopo.__parent__;
  }
  return null;
};

export const avaliarObjeto = async (ast, escopo) => {
  if (ast.tipo !== 'objeto') {
    return null; // Not handled by this module
  }

  // Expect object-style semantics (curly braces). Parser enforces no value-only items inside {}.
  if (!ast.usarObjeto) {
    const erro = new Error('Semantic error: object literal expected (curly-brace form)');
    erro.é_erro_semântico = true;
    throw erro;
  }

  // Build object by evaluating keys and values, merging spreads
  const result = {};
  for (const item of ast.items) {
    if (item.tipo === 'espalhamento') {
      const spreadValue = await avaliar(item.expressão, escopo);
      if (Array.isArray(spreadValue)) {
        // Spread array into numeric keys
        for (let i = 0; i < spreadValue.length; i++) {
          result[i] = spreadValue[i];
        }
      } else if (typeof spreadValue === 'object' && spreadValue !== null) {
        for (const key in spreadValue) {
          if (key !== '__parent__') {
            result[key] = spreadValue[key];
          }
        }
      }
    } else if (item.chave !== undefined) {
      const chave = typeof item.chave === 'object' ? await avaliar(item.chave, escopo) : item.chave;
      result[chave] = await avaliar(item.valor, escopo);
    } else {
      // Should not happen for object literals; keep for safety
      const val = await avaliar(item.valor, escopo);
      const nextIndex = Object.keys(result).length;
      result[nextIndex] = val;
    }
  }

  return result;
};

// Function to set the avaliar reference
export const setAvaliar = (fn) => {
  avaliar = fn;
};
