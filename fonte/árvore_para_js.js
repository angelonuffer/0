export const árvore_para_js = árvore => {
  if (árvore?.número !== undefined) return árvore.número

  if (árvore?.operação) {
    const { operador, esquerda, direita } = árvore.operação
    return `${árvore_para_js(esquerda)}${operador.operador}${árvore_para_js(direita)}`
  }
}