import * as fs from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const regras = {
  ignore: /(?:\/\/[^\r\n]*|\s+)/g,
  texto: /"([^\"]*)"/g,
  modelo_texto: /(?:`|})[^`]*?(?:\$\{|`)/g,
  número: /[0-9]+/g,
  identificador: /[a-zA-Z_][a-zA-Z_0-9]*/g,
  operador: />=|<=|==|!=|&&|\|\||[+*/><!\-=]/g,
  pontuação: /\.\.\.|[\[\]();#]/g,
}

export const analisador_léxico = entrada => {
  const tokens = [];
  let posição = 0;

  while (posição < entrada.length) {
    let correspondência;
    let regra_encontrada;

    for (const [tipo, regra] of Object.entries(regras)) {
      const regex = new RegExp(`^(?:${regra.source})`, regra.flags.replace(/[gy]/g, ""));
      correspondência = regex.exec(entrada.slice(posição));
      if (correspondência) {
        regra_encontrada = tipo;
        break;
      }
    }

    if (!correspondência) throw new Error(`Erro léxico na posição ${posição}`);

    const fim = posição + correspondência[0].length;
    if (regra_encontrada !== "ignore") {
      tokens.push({
        valor: correspondência[0],
        início: posição,
        fim,
        tipo: regra_encontrada,
      });
    }
    posição = fim;
  }

  return tokens;
};
