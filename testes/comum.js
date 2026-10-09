import { analisador_léxico } from "../fonte/analisador-léxico.js";
import { analisador_sintático } from "../fonte/analisador-sintático.js";
import { analisador_semântico } from "../fonte/analisador-semântico.js";
import { árvore_para_js } from "../fonte/árvore-para-js.js";
import { formatar_erro } from "../fonte/erro.js";

export const teste = opções => {
  const chaves_permitidas = ["entrada", "símbolos", "árvore", "valor", "js", "js_eval", "erro"]
  const chaves = opções && typeof opções === "object" ? Object.keys(opções) : []
  const ausentes = ["entrada"].filter(chave => !chaves.includes(chave))
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

  const { entrada, símbolos, árvore = undefined, valor = undefined, js = undefined, js_eval = undefined, erro = undefined } = opções
  return [
    ...(símbolos !== undefined ? [{
      função: analisador_léxico,
      argumento: entrada,
      retorno_esperado: símbolos,
    }] : []),
    ...(árvore !== undefined ? [{
      função: entrada => {
        const sintaxe = analisador_sintático({
          entrada: analisador_léxico(entrada),
          posição: 0,
        })
        return sintaxe.erro ? sintaxe : sintaxe.valor
      },
      argumento: entrada,
      retorno_esperado: árvore,
    }] : []),
    ...(erro !== undefined ? [{
      função: entrada => {
        const tokens = analisador_léxico(entrada)
        const sintaxe = analisador_sintático({ entrada: tokens, posição: 0 })
        if (!sintaxe.erro) return undefined
        return formatar_erro({ ...sintaxe, entrada, tokens })
      },
      argumento: entrada,
      retorno_esperado: erro,
    }] : []),
    ...(valor !== undefined ? [{
      função: entrada => {
        const sintaxe = analisador_sintático({
          entrada: analisador_léxico(entrada),
          posição: 0,
        })
        return analisador_semântico(sintaxe.valor)
      },
      argumento: entrada,
      retorno_esperado: valor,
    }] : []),
    ...(js !== undefined ? [{
      função: entrada => {
        const sintaxe = analisador_sintático({
          entrada: analisador_léxico(entrada),
          posição: 0,
        })
        return árvore_para_js(sintaxe.valor) ?? ""
      },
      argumento: entrada,
      retorno_esperado: js,
    }] : []),
    ...(js_eval !== undefined ? [{
      função: entrada => {
        const sintaxe = analisador_sintático({
          entrada: analisador_léxico(entrada),
          posição: 0,
        })
        return eval(árvore_para_js(sintaxe.valor) ?? "")
      },
      argumento: entrada,
      retorno_esperado: js_eval,
    }] : [])
  ]
}
