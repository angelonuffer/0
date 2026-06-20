import { bloco } from "./texto.js"
import iguais from "./testar/iguais.js"

export const testar = testes => {
  const total = testes.length
  let atual = 0
  for (const { função, argumento, retorno_esperado } of testes) {
    atual++
    try {
      const resultado = função(argumento)
      if (! iguais(resultado, retorno_esperado)) {
        return {
          código: 1,
          saída: bloco(`
          . função:
          .   ${função.name || "anônima"}
          . argumento:
          .   ${JSON.stringify(argumento, null, 2).replace(/\n/g, "\n  ")}
          . retorno esperado:
          .   ${JSON.stringify(retorno_esperado, null, 2).replace(/\n/g, "\n  ")}
          . retorno:
          .   ${JSON.stringify(resultado, null, 2).replace(/\n/g, "\n  ")}
        `) + `\n\n🚨 Teste ${atual}/${total} falhou!`,
        }
      }
    } catch (erro) {
      return {
        código: 1,
        saída: bloco(`
          . função:
          .   ${função.name || "anônima"}
          . argumento:
          .   ${JSON.stringify(argumento, null, 2).replace(/\n/g, "\n  ")}
          . erro interno:
          .   ${erro.stack}
        `) + `\n\n🚨 Teste ${atual}/${total} falhou!`,
      }
    }
  }
  return {
    código: 0,
    saída: `✅ Todos os ${total} testes passaram!`,
  }
}
