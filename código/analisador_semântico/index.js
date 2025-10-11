// Semantic analyzer - Evaluation and runtime logic
// This module evaluates AST nodes with a given scope

export const criarEscopo = (parent = null) => ({ __parent__: parent });

export const buscarVariável = (escopo, nome) => {
  let atualEscopo = escopo;
  while (atualEscopo) {
    if (atualEscopo.hasOwnProperty(nome)) {
      return atualEscopo[nome];
    }
    atualEscopo = atualEscopo.__parent__;
  }
  return undefined;
};

export const definirVariável = (escopo, nome, valor) => {
  escopo[nome] = valor;
};

// Main evaluation function - takes an AST node and scope, returns the evaluated value
export const avaliar = (ast, escopo) => {
  if (!ast || typeof ast !== 'object' || !ast.tipo) {
    // Handle literal values (numbers, strings, etc.)
    return ast;
  }

  switch (ast.tipo) {
    case 'número':
    case 'texto':
      return ast.valor;

    case 'variável':
      return buscarVariável(escopo, ast.nome);

    case 'não':
      return avaliar(ast.expressão, escopo) === 0 ? 1 : 0;

    case 'operação_binária': {
      const esquerda = avaliar(ast.esquerda, escopo);
      const direita = avaliar(ast.direita, escopo);
      return ast.operador(esquerda, direita);
    }

    case 'operação_lógica': {
      const esquerda = avaliar(ast.esquerda, escopo);
      if (ast.operador === '&') {
        return esquerda !== 0 ? avaliar(ast.direita, escopo) : 0;
      } else if (ast.operador === '|') {
        return esquerda !== 0 ? esquerda : avaliar(ast.direita, escopo);
      }
      throw new Error(`Unknown logical operator: ${ast.operador}`);
    }

    case 'condicional': {
      const condição = avaliar(ast.condição, escopo);
      return condição !== 0 ? avaliar(ast.seVerdadeiro, escopo) : avaliar(ast.seFalso, escopo);
    }

    case 'lista': {
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
    }

    case 'fatia': {
      const valor = avaliar(ast.valor, escopo);
      const índice = avaliar(ast.índice, escopo);
      const fim = ast.fim ? avaliar(ast.fim, escopo) : undefined;

      if (typeof valor === "string") {
        if (ast.éFaixa || fim !== undefined) {
          return valor.slice(índice, fim);
        } else {
          return valor.charCodeAt(índice);
        }
      } else if (Array.isArray(valor)) {
        if (ast.éFaixa || fim !== undefined) {
          return valor.slice(índice, fim);
        } else {
          return valor[índice];
        }
      } else if (typeof valor === 'object' && valor !== null) {
        if (typeof índice !== 'string' && typeof índice !== 'number') {
          throw new Error(`Object key must be a string or number, got type ${typeof índice}`);
        }
        if (ast.éFaixa || fim !== undefined) {
          if (typeof valor.length === 'number') {
            const arr = [];
            for (let i = 0; i < valor.length; i++) {
              arr[i] = valor[i];
            }
            return arr.slice(índice, fim);
          } else {
            throw new Error(`Slicing syntax not supported for object property access`);
          }
        }
        return valor[índice];
      } else {
        throw new Error(`Cannot apply indexing/slicing to type '${typeof valor}'`);
      }
    }

    case 'tamanho':
      return avaliar(ast.valor, escopo).length;

    case 'chaves': {
      const objeto = avaliar(ast.valor, escopo);
      const keys = Object.keys(objeto);
      
      if (Array.isArray(objeto)) {
        return keys;
      }
      
      if (typeof objeto.length === 'number') {
        return keys.filter(key => key !== 'length' && !/^\d+$/.test(key));
      }
      
      return keys;
    }

    case 'atributo': {
      const objeto = avaliar(ast.objeto, escopo);
      return objeto[ast.nome];
    }

    case 'lambda':
      return (caller_context, ...valoresArgs) => {
        const fn_scope = { __parent__: escopo || null };
        if (ast.parâmetro) {
          if (valoresArgs.length === 1) {
            fn_scope[ast.parâmetro] = valoresArgs[0];
          } else {
            fn_scope[ast.parâmetro] = valoresArgs;
          }
        }
        return avaliar(ast.corpo, fn_scope);
      };

    case 'chamada_função': {
      const função = avaliar(ast.função, escopo);
      if (typeof função !== 'function') {
        throw new Error(`Value is not a function, got ${typeof função}`);
      }
      if (ast.argumento !== undefined) {
        const arg_value = avaliar(ast.argumento, escopo);
        return função(escopo, arg_value);
      } else {
        return função(escopo);
      }
    }

    case 'chamada_função_imediata': {
      const função = buscarVariável(escopo, ast.nome);
      if (typeof função !== 'function') {
        throw new Error(`${ast.nome} is not a function`);
      }
      if (ast.argumento !== undefined) {
        const arg_value = avaliar(ast.argumento, escopo);
        return função(escopo, arg_value);
      } else {
        return função(escopo);
      }
    }

    case 'parênteses':
      return avaliar(ast.expressão, escopo);

    default:
      throw new Error(`Unknown AST node type: ${ast.tipo}`);
  }
};