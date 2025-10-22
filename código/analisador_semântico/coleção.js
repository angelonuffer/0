// Collection operations - fatia, tamanho, chaves, atributo

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
      } else if (typeof valor === 'object' && valor !== null) {
        if (typeof índice !== 'string' && typeof índice !== 'number') {
          const erro = new Error(`Object key must be a string or number, got type ${typeof índice}`);
          erro.é_erro_semântico = true;
          erro.módulo_endereço = obterEndereçoMódulo(escopo);
          // No good search term for this error
          throw erro;
        }
        if (ast.éFaixa || fim !== undefined) {
          if (typeof valor.length === 'number') {
            const arr = [];
            for (let i = 0; i < valor.length; i++) {
              arr[i] = valor[i];
            }
            return arr.slice(índice, fim);
          } else {
            const erro = new Error(`Slicing syntax not supported for object property access`);
            erro.é_erro_semântico = true;
            erro.módulo_endereço = obterEndereçoMódulo(escopo);
            throw erro;
          }
        }
        return valor[índice];
      } else {
        const erro = new Error(`Cannot apply indexing/slicing to type '${typeof valor}'`);
        erro.é_erro_semântico = true;
        erro.módulo_endereço = obterEndereçoMódulo(escopo);
        throw erro;
      }
    }

    case 'tamanho':
      const valor = avaliar(ast.valor, escopo);
      if (typeof valor === 'string' || Array.isArray(valor)) {
        return valor.length;
      }
      const erro = new Error(`'${ast.valor.nome}' do tipo '${typeof valor}' não tem um tamanho`);
      erro.é_erro_semântico = true;
      erro.módulo_endereço = obterEndereçoMódulo(escopo);
      throw erro;

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
