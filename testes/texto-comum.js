export const bloco = texto => {
  const linhas = texto.split("\n")
  if (linhas[0].trim() === "") linhas.shift()
  if (linhas.at(-1).trim() === "") linhas.pop()

  const indentação = linhas[0]?.match(/^ */)?.[0].length ?? 0
  return linhas
    .map(linha => linha.replace(new RegExp(`^ {0,${indentação}}`), ""))
    .join("\n")
}