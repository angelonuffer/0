const avaliar = async (expressão, escopo) => {
  let é_comando = false
  if (escopo !== undefined) é_comando = true
  escopo = {
    ...escopo,
    "#0": caminho => {
      return async () => {
        const resposta = await fetch(caminho)
        return avaliar(await resposta.text())
      }
    },
  }
  expressão = expressão.trim()
  if (escopo[expressão]) return escopo[expressão]
  if (! isNaN(expressão)) return parseFloat(expressão)
  if (expressão.startsWith('"') && expressão.endsWith('"')) return expressão.slice(1, -1)
  const fim_linha = expressão.indexOf("\n")
  if (fim_linha > -1) {
    escopo = await avaliar(expressão.slice(0, fim_linha), escopo)
    escopo = await avaliar(expressão.slice(fim_linha), escopo)
    if (é_comando) return escopo
    return escopo["#1"]
  }
  const atribuição = expressão.indexOf("=")
  if (atribuição > -1) {
    escopo[expressão.slice(0, atribuição).trim()] = await avaliar(expressão.slice(atribuição + 1), escopo)
    if (é_comando) return escopo
    return escopo["#1"]
  }
  const soma = expressão.indexOf("+")
  if (soma > -1) return await avaliar(expressão.slice(0, soma), escopo) + await avaliar(expressão.slice(soma + 1), escopo)
  const subtração = expressão.indexOf("-")
  if (subtração > -1) return await avaliar(expressão.slice(0, subtração), escopo) - await avaliar(expressão.slice(subtração + 1), escopo)
  const início_chamada = expressão.indexOf("(")
  if (início_chamada > -1) {
    const fim_chamada = expressão.lastIndexOf(")")
    const função = escopo[expressão.slice(0, início_chamada)]
    return função(await avaliar(expressão.slice(início_chamada + 1, fim_chamada), escopo))
  }
}

export default avaliar