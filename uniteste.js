import { bloco } from "./texto.js"
import iguais from "./testar/iguais.js"

export const testar = ({ nome_arquivo, testes: grupos_testes }) => {
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
        if (argumento && argumento.entrada) {
          mensagem += bloco(`
            . entrada:
            .   ${argumento.entrada.replace(/\n/g, "\n  ")}
          `)
        }

        const esperado_saída = retorno_esperado?.saída
        const atual_saída = resultado?.saída
        const esperado_erro = retorno_esperado?.erro
        const atual_erro = resultado?.erro

        let mostrado_saída = false
        if (esperado_saída !== undefined || atual_saída !== undefined) {
          if (esperado_saída !== "") {
            mensagem += (mensagem === "" ? "" : "\n") + bloco(`
              . saída esperada:
              .   ${String(esperado_saída).replace(/\n/g, "\n  ")}
            `)
          }
          if (atual_saída !== "" && atual_saída !== undefined) {
            mensagem += (mensagem === "" ? "" : "\n") + bloco(`
              . saída:
              .   ${String(atual_saída).replace(/\n/g, "\n  ")}
            `)
          }
          mostrado_saída = true
        }

        let mostrado_erro = false
        if (esperado_erro !== undefined || atual_erro !== undefined) {
          if (esperado_erro !== "") {
            mensagem += (mensagem === "" ? "" : "\n") + bloco(`
              . erro esperado:
              .   ${String(esperado_erro).replace(/\n/g, "\n  ")}
            `)
          }
          if (atual_erro !== "" && atual_erro !== undefined) {
            mensagem += (mensagem === "" ? "" : "\n") + bloco(`
              . erro:
              .   ${String(atual_erro).replace(/\n/g, "\n  ")}
            `)
          }
          mostrado_erro = true
        }

        if (erro_interno) {
          mensagem += (mensagem === "" ? "" : "\n") + bloco(`
            . erro interno:
            .   ${erro_interno.stack}
          `)
        }

        if (!mostrado_saída && !mostrado_erro) {
          mensagem += (mensagem === "" ? "" : "\n") + `argumento: ${JSON.stringify(argumento, null, 2)}\n`
          mensagem += `retorno esperado: ${JSON.stringify(retorno_esperado, null, 2)}\n`
          mensagem += `retorno: ${JSON.stringify(resultado, null, 2)}\n`
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
