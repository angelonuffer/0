const declaração_preguiça = "const _=f=>{let d,v;return()=>d?v:(d=true,v=f())};"

const converter = (árvore, topo, corpo_de_função = false) => {
  if (árvore?.agrupado) {
    const { agrupado, ...expressão } = árvore
    if (corpo_de_função && expressão.bloco) return converter(expressão, false, true)
    return `(${converter(expressão, false)})`
  }

  if (árvore?.número !== undefined) return árvore.número

  if (árvore?.identificador !== undefined) return `${árvore.identificador}()`

  if (árvore?.bloco) {
    const último = árvore.bloco.length - 1
    const instruções = árvore.bloco.map((instrução, i) => {
      if (instrução.associação) {
        const { identificador, valor } = instrução.associação
        return `const ${identificador}=_(()=>${converter(valor, false, true)})`
      }
      const código = converter(instrução, false)
      return !topo && i === último ? `return ${código}` : código
    }).join(";")
    if (corpo_de_função) return `{${instruções}}`
    return topo
      ? `${declaração_preguiça}${instruções}`
      : `(()=>{${instruções}})()`
  }

  if (árvore?.operação) {
    const { operador, esquerda, direita } = árvore.operação
    if (esquerda === undefined) return `${operador}${converter(direita, false)}`
    return `${converter(esquerda, false)}${operador}${converter(direita, false)}`
  }
}

export const árvore_para_js = árvore => converter(árvore, true)