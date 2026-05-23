#! /usr/bin/env node

import { espaço } from "./analisador_léxico.js"
import { expressão } from "./analisador_sintático.js"

const formatar_erro = (entrada, posição, mensagem, arquivo) => {
  const linhas = entrada.split("\n")
  const número_linha = linhas.length - entrada.slice(posição).split("\n").length + 1
  const linha = linhas[número_linha - 1]
  const número_coluna = linha.length - entrada.slice(posição).split("\n")[0].length + 1
  return [
    `⛔ ${mensagem}`,
    `📄 ${arquivo}`,
    `👉 ${número_linha}: ${linha}`,
    `     ${" ".repeat(número_coluna - 1 + String(número_linha).length)}^ ${número_coluna}`,
  ].join("\n")
}

export const interpretar = ({ entrada, arquivo }) => {
  const resultado_1 = espaço({ entrada, posição: 0 })
  const resultado_2 = expressão({ entrada, posição: resultado_1.posição })
  if (resultado_2.erro) return {
    saída: "",
    erro: formatar_erro(entrada, resultado_2.posição, resultado_2.erro, arquivo),
  }
  if (resultado_2.posição !== entrada.length) return {
    saída: "",
    erro: formatar_erro(entrada, resultado_2.posição, "/$/", arquivo),
  }
  const valor = resultado_2.valor({})
  if (valor instanceof Error) return {
    saída: "",
    erro: formatar_erro(entrada, valor.cause.início, valor.message, arquivo),
  }
  return {
    saída: typeof valor === "number" ? String(valor) : valor,
    erro: "",
  }
}
