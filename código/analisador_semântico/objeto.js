// Object construction and evaluation

// Forward declaration for recursive avaliar reference
let avaliar;

export const avaliarObjeto = (ast, escopo) => {
  if (ast.tipo !== 'objeto') {
    return null; // Not handled by this module
  }

  if (ast.usarObjeto) {
    const listScope = { __parent__: escopo };
    let autoIndex = 0;
    
    // First pass: declare all property names
    for (const item of ast.items) {
      if (item.tipo === 'espalhamento') {
        continue;
      } else if (item.chave !== undefined) {
        const chave = typeof item.chave === 'object' ? avaliar(item.chave, escopo) : item.chave;
        if (typeof chave !== 'string' && typeof chave !== 'number') {
          throw new Error(`Object key must be a string or number, got ${typeof chave}`);
        }
        listScope[chave] = undefined;
      } else {
        listScope[autoIndex++] = undefined;
      }
    }
    
    // Second pass: evaluate and assign values
    autoIndex = 0;
    for (const item of ast.items) {
      if (item.tipo === 'espalhamento') {
        const spreadValue = avaliar(item.expressão, escopo);
        if (Array.isArray(spreadValue)) {
          for (const v of spreadValue) {
            listScope[autoIndex++] = v;
          }
        } else if (typeof spreadValue === 'object' && spreadValue !== null) {
          for (const key in spreadValue) {
            if (key !== '__parent__' && key !== 'length') {
              listScope[key] = spreadValue[key];
            }
          }
        }
      } else if (item.chave !== undefined) {
        const chave = typeof item.chave === 'object' ? avaliar(item.chave, escopo) : item.chave;
        listScope[chave] = avaliar(item.valor, listScope);
      } else {
        listScope[autoIndex] = avaliar(item.valor, listScope);
        autoIndex++;
      }
    }
    
    listScope.length = autoIndex;
    
    // Convert to real array if it only has numeric properties and length
    const hasNamedProps = Object.keys(listScope).some(key => 
      key !== 'length' && key !== '__parent__' && !/^\d+$/.test(key)
    );
    
    if (!hasNamedProps) {
      // Convert to real array
      const realArray = [];
      for (let i = 0; i < autoIndex; i++) {
        realArray[i] = listScope[i];
      }
      return realArray;
    }
    
    // Create result object without __parent__
    const result = {};
    for (const key in listScope) {
      if (key !== '__parent__') {
        result[key] = listScope[key];
      }
    }
    return result;
  } else {
    // Simple array implementation
    const result = [];
    for (const item of ast.items) {
      if (item.tipo === 'espalhamento') {
        const spreadValue = avaliar(item.expressão, escopo);
        if (Array.isArray(spreadValue)) {
          result.push(...spreadValue);
        }
      } else {
        result.push(avaliar(item.valor, escopo));
      }
    }
    return result;
  }
};

// Function to set the avaliar reference
export const setAvaliar = (fn) => {
  avaliar = fn;
};
