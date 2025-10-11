// Collection operations - fatia, tamanho, chaves, atributo

// Forward declaration for recursive avaliar reference
let avaliar;

export const avaliarColeção = (ast, escopo) => {
  switch (ast.tipo) {
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
      } else if (typeof valor === 'function' || (typeof valor === 'object' && valor !== null)) {
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

    default:
      return null; // Not handled by this module
  }
};

// Function to set the avaliar reference
export const setAvaliar = (fn) => {
  avaliar = fn;
};
