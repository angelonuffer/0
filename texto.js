export const bloco = texto => {
  const indentação = texto.match(/^\n( *)/)?.[1].length ?? 0
  return texto
    .trim()
    .slice(2)
    .replace(new RegExp(`\n {${indentação}}\\. `, "g"), "\n")
}