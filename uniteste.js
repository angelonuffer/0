import { bloco } from "./texto.js"

export const teste = ({
  entrada,
  saída_esperada = "",
  erro_esperado = "",
}) => (interpretar, arquivo) => {
  try {
    const resultado = interpretar({ entrada, arquivo })
    return{
      entrada,
      saída_esperada,
      saída: "",
      erro_esperado,
      erro: "",
      ...resultado,
    }
  } catch (erro) {
    return {
      entrada,
      saída_esperada,
      saída: "",
      erro_esperado,
      erro: "",
      erro_interno: erro,
    }
  }
}

export const testar = (interpretar, arquivo = "uniteste.js", testes, i = 0) => {
  const resultado = testes[i](interpretar, arquivo)
  if (resultado.saída !== resultado.saída_esperada || resultado.erro !== resultado.erro_esperado) {
    return {
      código: 1,
      saída: bloco(`
        . entrada:
        .   ${resultado.entrada.replace(/\n/g, "\n  ")}
      `) + (resultado.saída_esperada !== "" ? bloco(`
        . 
        . saída esperada:
        .   ${resultado.saída_esperada.replace(/\n/g, "\n  ")}
      `) : "") + (resultado.saída !== "" ? bloco(`
        . 
        . saída:
        .   ${resultado.saída.replace(/\n/g, "\n  ")}
      `) : "") + (resultado.erro_esperado !== "" ? bloco(`
        . 
        . erro esperado:
        .   ${resultado.erro_esperado.replace(/\n/g, "\n  ")}
      `) : "") + (resultado.erro !== "" ? bloco(`
        . 
        . erro:
        .   ${resultado.erro.replace(/\n/g, "\n  ")}
      `) : "") + (resultado.erro_interno ? bloco(`
        . 
        . erro interno:
        .   ${resultado.erro_interno.stack}
      `) : "") + `\n\n🚨 Teste ${i + 1}/${testes.length} falhou!`,
    }
  }
  if (i < testes.length - 1) return testar(interpretar, arquivo, testes, i + 1)
  return {
    código: 0,
    saída: `✅ Todos os ${testes.length} testes passaram!`
  }
}