import * as fs from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const regras = [
  { regex: /(?:\/\/[^\r\n]*|\s+)/g, ignore: true },
  { token: "texto", regex: /"([^\"]*)"/g },
  { token: "modelo_texto", regex: /(?:`|})[^`]*?(?:\$\{|`)/g },
  { token: "número", regex: /[0-9]+/g },
  { token: "identificador", regex: /[a-zA-Z_][a-zA-Z_0-9]*/g },
  { token: "operador", regex: />=|<=|==|!=|&&|\|\||[+*/><!\-=]/g },
  { token: "pontuação", regex: /\.\.\.|[\[\]();#]/g },
];

export const analisador_léxico = entrada => {
  const tokens = [];
  let posição = 0;

  while (posição < entrada.length) {
    let correspondência;
    let regra_encontrada;

    for (const regra of regras) {
      const regex = new RegExp(`^(?:${regra.regex.source})`, regra.regex.flags.replace(/[gy]/g, ""));
      correspondência = regex.exec(entrada.slice(posição));
      if (correspondência) {
        regra_encontrada = regra;
        break;
      }
    }

    if (!correspondência) throw new Error(`Erro léxico na posição ${posição}`);

    const fim = posição + correspondência[0].length;
    if (!regra_encontrada.ignore) {
      tokens.push({
        valor: correspondência[0],
        início: posição,
        fim,
        tipo: regra_encontrada.token,
      });
    }
    posição = fim;
  }

  return tokens;
};
