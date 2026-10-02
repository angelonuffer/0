export const árvore_para_js = árvore => {
  if (árvore?.agrupado) {
    const { agrupado, ...expressão } = árvore
    return `(${árvore_para_js(expressão)})`
  }

  if (árvore?.número !== undefined) return árvore.número

  if (árvore?.operação) {
    const { operador, esquerda, direita } = árvore.operação
    if (esquerda === undefined) return `${operador}${árvore_para_js(direita)}`
    return `${árvore_para_js(esquerda)}${operador}${árvore_para_js(direita)}`
  }
}