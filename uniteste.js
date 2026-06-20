import { bloco } from "./texto.js"
import iguais from "./testar/iguais.js"

export const testar = testes => testes.reduce(
  ({ código, saída }, { função, argumento, retorno_esperado }, atual) => {
    if (código !== 0) return { código, saída }
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
        `) + `\n\n🚨 Teste ${atual + 1}/${testes.length} falhou!`,
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
        `) + `\n\n🚨 Teste ${atual + 1}/${testes.length} falhou!`,
      }
    }
    return { código: 0, saída: `✅ Todos os ${testes.length} testes passaram!` }
  },
  { código: 0, saída: "" }
)