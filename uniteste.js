import { bloco } from "./texto.js"
import iguais from "./testar/iguais.js"

export const testar = grupos_testes => {
  const total = grupos_testes.reduce((acc, { testes }) => acc + testes.length, 0)
  let atual = 0

  for (const { função, testes } of grupos_testes) {
    for (const { argumento, retorno_esperado } of testes) {
      atual++
      let resultado
      let erro_interno
      try {
        resultado = função(argumento)
      } catch (erro) {
        erro_interno = erro
      }

      if (erro_interno || !iguais(resultado, retorno_esperado)) {
        let mensagem = ""
        mensagem += bloco(`
          . função:
          .   ${função.name || "anônima"}
          . argumento:
          .   ${JSON.stringify(argumento, null, 2).replace(/\n/g, "\n  ")}
          . retorno esperado:
          .   ${JSON.stringify(retorno_esperado, null, 2).replace(/\n/g, "\n  ")}
          . retorno:
          .   ${JSON.stringify(resultado, null, 2).replace(/\n/g, "\n  ")}
        `)

        if (erro_interno) {
          mensagem += (mensagem === "" ? "" : "\n") + bloco(`
            . erro interno:
            .   ${erro_interno.stack}
          `)
        }

        return {
          código: 1,
          saída: mensagem.trimEnd() + `\n\n🚨 Teste ${atual}/${total} falhou!`,
        }
      }
    }
  }

  return {
    código: 0,
    saída: `✅ Todos os ${total} testes passaram!`,
  }
}
