import * as fs from 'fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export const analisador_semântico = ast => {
  if (ast?.tipo === 'número') return ast.valor;

  if (ast?.declaracoes) {
    const variaveis = {};
    for (const decl of ast.declaracoes) {
      variaveis[decl.identificador] = decl.valor.texto;
    }

    if (ast.retorno?.texto !== undefined) return ast.retorno.texto;
    if (ast.retorno?.tamanho) {
      const valor = variaveis[ast.retorno.tamanho];
      if (valor !== undefined) return String(valor.length);
    }
  }
}
