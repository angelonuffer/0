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
        // Check if it's array-like (has length and numeric indices)
        const isArrayLike = (Array.isArray(spreadValue) || 
                             (typeof spreadValue === 'function' && typeof spreadValue.length === 'number')) ||
                            ((typeof spreadValue === 'object' && spreadValue !== null && typeof spreadValue.length === 'number'));
        
        if (isArrayLike) {
          // Spread as array
          for (let i = 0; i < spreadValue.length; i++) {
            listScope[autoIndex++] = spreadValue[i];
          }
        } else if (typeof spreadValue === 'function' || (typeof spreadValue === 'object' && spreadValue !== null)) {
          // Spread as object (named properties only)
          for (const key in spreadValue) {
            if (key !== '__parent__' && key !== 'length' && !/^\d+$/.test(key)) {
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
      // Make array callable by creating a function that also acts as an array
      const fn = new Proxy((caller_context, key) => realArray[key], {
        get(target, prop) {
          return realArray[prop];
        },
        has(target, prop) {
          return prop in realArray;
        },
        ownKeys(target) {
          return Reflect.ownKeys(realArray);
        },
        getOwnPropertyDescriptor(target, prop) {
          const desc = Object.getOwnPropertyDescriptor(realArray, prop);
          if (desc) {
            // Make all properties configurable to avoid proxy issues
            desc.configurable = true;
          }
          return desc;
        }
      });
      return fn;
    }
    
    // Create result object without __parent__
    const result = {};
    for (const key in listScope) {
      if (key !== '__parent__') {
        result[key] = listScope[key];
      }
    }
    // Make object callable by creating a function that also acts as an object
    const fn = new Proxy((caller_context, key) => result[key], {
      get(target, prop) {
        return result[prop];
      },
      has(target, prop) {
        return prop in result;
      },
      ownKeys(target) {
        return Reflect.ownKeys(result);
      },
      getOwnPropertyDescriptor(target, prop) {
        const desc = Object.getOwnPropertyDescriptor(result, prop);
        if (desc) {
          // Make all properties configurable to avoid proxy issues
          desc.configurable = true;
        }
        return desc;
      }
    });
    return fn;
  } else {
    // Simple array implementation
    const result = [];
    for (const item of ast.items) {
      if (item.tipo === 'espalhamento') {
        const spreadValue = avaliar(item.expressão, escopo);
        // Check if it's array-like (has length and numeric indices)
        const isArrayLike = Array.isArray(spreadValue) || 
                           (typeof spreadValue === 'function' && typeof spreadValue.length === 'number') ||
                           (typeof spreadValue === 'object' && spreadValue !== null && typeof spreadValue.length === 'number');
        
        if (isArrayLike) {
          for (let i = 0; i < spreadValue.length; i++) {
            result.push(spreadValue[i]);
          }
        }
      } else {
        result.push(avaliar(item.valor, escopo));
      }
    }
    // Make array callable by creating a function that also acts as an array
    const fn = new Proxy((caller_context, key) => result[key], {
      get(target, prop) {
        return result[prop];
      },
      has(target, prop) {
        return prop in result;
      },
      ownKeys(target) {
        return Reflect.ownKeys(result);
      },
      getOwnPropertyDescriptor(target, prop) {
        const desc = Object.getOwnPropertyDescriptor(result, prop);
        if (desc) {
          // Make all properties configurable to avoid proxy issues
          desc.configurable = true;
        }
        return desc;
      }
    });
    return fn;
  }
};

// Function to set the avaliar reference
export const setAvaliar = (fn) => {
  avaliar = fn;
};
