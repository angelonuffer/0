import { bloco } from "./texto.js"
import iguais from "./testar/iguais.js"

export const testar = testes => {
  const falhas = testes.map(({ função, argumento, retorno_esperado }) => {
    try {
      const retorno = função(argumento)
      if (! iguais(retorno, retorno_esperado)) {
        return bloco(`
          . função:
          .   ${função.name || "anônima"}
          . argumento:
          .   ${JSON.stringify(argumento, null, 2).replace(/\n/g, "\n  ")}
          . retorno esperado:
          .   ${JSON.stringify(retorno_esperado, null, 2).replace(/\n/g, "\n  ")}
          . retorno:
          .   ${JSON.stringify(retorno, null, 2).replace(/\n/g, "\n  ")}
        `)
      }
    } catch (erro) {
      return bloco(`
        . função:
        .   ${função.name || "anônima"}
        . argumento:
        .   ${JSON.stringify(argumento, null, 2).replace(/\n/g, "\n  ")}
        . erro interno:
        .   ${erro.stack}
      `)
    }
    return null
  }).filter(resultado => resultado !== null)
  if (falhas.length === 0) return {
    código: 0,
    saída: `✅ Todos os ${testes.length} testes passaram!`,
  }
  if (falhas.length === 1) return {
    código: 1,
    saída: `${falhas[0]}\n\n🚨 1 de ${testes.length} teste falhou.`,
  }
  return {
    código: 1,
    saída: `${falhas.join("\n\n")}\n\n🚨 ${falhas.length} de ${testes.length} testes falharam.`,
  }
}