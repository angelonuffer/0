export const formatar_erro = ({ erro, posição, entrada, tokens, arquivo = "testar.js" }) => {
  const posição_na_entrada = tokens[posição]?.início ?? entrada.length
  const antes = entrada.slice(0, posição_na_entrada)
  const linhas_anteriores = antes.split(/\r\n|\n|\r/)
  const número_linha = linhas_anteriores.length
  const coluna = linhas_anteriores.at(-1).length
  const linha = entrada.split(/\r\n|\n|\r/)[número_linha - 1]
  const prefixo = `${número_linha}: `

  return [
    arquivo,
    `${prefixo}${linha}`,
    `${" ".repeat(prefixo.length + coluna)}^ ${coluna + 1}`,
    "Erro de sintaxe. Esperava:",
    `  ${erro}`,
  ].join("\n")
}