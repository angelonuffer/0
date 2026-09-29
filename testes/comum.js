import { analisador_léxico } from "../fonte/analisador-léxico.js";
import { analisador_sintático } from "../fonte/analisador-sintático.js";
import { analisador_semântico } from "../fonte/analisador-semântico.js";

export const teste = opções => {
  const chaves_permitidas = ["entrada", "símbolos", "árvore", "saída"]
  const chaves = opções && typeof opções === "object" ? Object.keys(opções) : []
  const ausentes = ["entrada", "símbolos"].filter(chave => !chaves.includes(chave))
  const extras = chaves.filter(chave => !chaves_permitidas.includes(chave))

  if (!opções || typeof opções !== "object" || ausentes.length > 0 || extras.length > 0) {
    const detalhes = [
      ...(ausentes.length > 0 ? [`obrigatórias ausentes: ${ausentes.join(", ")}`] : []),
      ...(extras.length > 0 ? [`chaves não permitidas: ${extras.join(", ")}`] : []),
    ].join("; ")
    return [{
      função: () => { throw new Error(`Definição de teste inválida (${detalhes || "esperado um objeto"})`) },
      argumento: opções,
      retorno_esperado: undefined,
    }]
  }

  const { entrada, símbolos, árvore = undefined, saída = undefined } = opções
  return [
    {
      função: analisador_léxico,
      argumento: entrada,
      retorno_esperado: símbolos,
    },
    ...(árvore !== undefined ? [{
      função: entrada => analisador_sintático({
        entrada: analisador_léxico(entrada),
        posição: 0,
      }),
      argumento: entrada,
      retorno_esperado: árvore,
    }] : []),
    ...(saída !== undefined ? [{
      função: entrada => {
        const sintaxe = analisador_sintático({
          entrada: analisador_léxico(entrada),
          posição: 0,
        })
        return analisador_semântico(sintaxe) ?? ""
      },
      argumento: entrada,
      retorno_esperado: saída,
    }] : []),
  ]
}
