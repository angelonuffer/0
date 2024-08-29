const avaliar = async (escopo, expressão) => {
  expressão = expressão.trim()
  if (escopo[expressão]) return escopo[expressão]
  if (! isNaN(expressão)) return parseFloat(expressão)
  if (expressão.startsWith('"') && expressão.endsWith('"')) return expressão.slice(1, -1)
  const soma = expressão.indexOf("+")
  if (soma > -1) return await avaliar(escopo, expressão.slice(0, soma)) + await avaliar(escopo, expressão.slice(soma + 1))
  const subtração = expressão.indexOf("-")
  if (subtração > -1) return await avaliar(escopo, expressão.slice(0, subtração)) - await avaliar(escopo, expressão.slice(subtração + 1))
  const início_chamada = expressão.indexOf("(")
  if (início_chamada > -1) {
    const fim_chamada = expressão.lastIndexOf(")")
    const função = escopo[expressão.slice(0, início_chamada)]
    return função(await avaliar(escopo, expressão.slice(início_chamada + 1, fim_chamada)))
  }
}

export default avaliar