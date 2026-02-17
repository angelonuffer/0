// Collection operations - fatia, tamanho, chaves, atributo
import { TIPO_AST, NAO_MANIPULADO } from '../constantes.js';

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

export const avaliarColeção = async (ast, escopo) => {
  switch (ast.tipo) {
    case TIPO_AST.FATIA: {
      const valor = await avaliar(ast.valor, escopo);
      const índice = await avaliar(ast.índice, escopo);
      const fim = ast.fim ? await avaliar(ast.fim, escopo) : undefined;

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
          // Attach frame
          erro.pilha_semântica = erro.pilha_semântica || [];
          erro.pilha_semântica.push({ endereço: erro.módulo_endereço, termo_busca: String(índice), comprimento: String(índice).length, valor: índice });
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
            erro.pilha_semântica = erro.pilha_semântica || [];
            erro.pilha_semântica.push({ endereço: erro.módulo_endereço, termo_busca: undefined, comprimento: 1 });
            throw erro;
          }
        }
        return valor[índice];
      } else {
        const erro = new Error(`Cannot apply indexing/slicing to type '${typeof valor}'`);
        erro.é_erro_semântico = true;
        erro.módulo_endereço = obterEndereçoMódulo(escopo);
        erro.pilha_semântica = erro.pilha_semântica || [];
        try { erro.pilha_semântica.push({ endereço: erro.módulo_endereço, termo_busca: undefined, comprimento: 1, valor }); } catch(e) { erro.pilha_semântica.push({ endereço: erro.módulo_endereço }); }
        throw erro;
      }
    }

    case TIPO_AST.TAMANHO:
      const valor = await avaliar(ast.valor, escopo);
      if (valor?.length !== undefined) {
        return valor.length;
      }
      const erro = new Error(`'${ast.valor.nome}' do tipo '${typeof valor}' não tem um tamanho`);
      erro.é_erro_semântico = true;
      erro.módulo_endereço = obterEndereçoMódulo(escopo);
      erro.pilha_semântica = erro.pilha_semântica || [];
      erro.pilha_semântica.push({ endereço: erro.módulo_endereço, termo_busca: ast.valor?.nome, comprimento: String(ast.valor?.nome || '').length, valor });
      throw erro;

    case TIPO_AST.CHAVES: {
      const objeto = await avaliar(ast.valor, escopo);
      const keys = Object.keys(objeto);
      
      if (Array.isArray(objeto)) {
        return keys;
      }
      
      if (typeof objeto.length === 'number') {
        return keys.filter(key => key !== 'length' && !/^\d+$/.test(key));
      }
      
      return keys;
    }

    case TIPO_AST.ATRIBUTO: {
      const objeto = await avaliar(ast.objeto, escopo);

      // If null or undefined, throw semantic error
      if (objeto === null || objeto === undefined) {
        const erro = new Error(`Cannot access property '${ast.nome}' of ${objeto}`);
        erro.é_erro_semântico = true;
        erro.módulo_endereço = obterEndereçoMódulo(escopo);
        erro.termo_busca = String(ast.nome);
        erro.pilha_semântica = erro.pilha_semântica || [];
        erro.pilha_semântica.push({ endereço: erro.módulo_endereço, termo_busca: String(ast.nome), comprimento: String(ast.nome).length, valor: objeto });
        throw erro;
      }

      // If primitive (number/string/boolean), only allow string indexing/certain behavior via fatia
      if (typeof objeto !== 'object') {
        const erro = new Error(`Cannot access attribute '${ast.nome}' on value of type '${typeof objeto}'`);
        erro.é_erro_semântico = true;
        erro.módulo_endereço = obterEndereçoMódulo(escopo);
        erro.termo_busca = String(ast.nome);
        erro.pilha_semântica = erro.pilha_semântica || [];
        erro.pilha_semântica.push({ endereço: erro.módulo_endereço, termo_busca: String(ast.nome), comprimento: String(ast.nome).length, valor: objeto });
        throw erro;
      }

      // If property exists, return it
      if (Object.prototype.hasOwnProperty.call(objeto, ast.nome)) {
        return objeto[ast.nome];
      }

      // Property does not exist -> semantic "name not found" error with available names
      const nomesDisponíveis = Object.keys(objeto).filter(k => k !== '__parent__');
      const erro = new Error(`Nome não encontrado: ${ast.nome}`);
      erro.é_erro_semântico = true;
      erro.nome_variável = ast.nome;
      erro.nomes_disponíveis = nomesDisponíveis;
      erro.módulo_endereço = obterEndereçoMódulo(escopo);
      erro.pilha_semântica = erro.pilha_semântica || [];
      erro.pilha_semântica.push({ endereço: erro.módulo_endereço, termo_busca: ast.nome, comprimento: String(ast.nome).length });
      throw erro;
    }

    default:
      return NAO_MANIPULADO; // Not handled by this module
  }
};

// Function to set the avaliar reference
export const setAvaliar = (fn) => {
  avaliar = fn;
};
