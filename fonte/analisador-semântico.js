const é_constante = valor => typeof valor === "number" || typeof valor === "boolean"

const valor_literal = árvore => {
  if (árvore.número !== undefined) {
    const número = Number(árvore.número)
    return Number.isNaN(número) ? árvore : número
  }
  if (árvore.booleano !== undefined) return árvore.booleano
  return árvore
}

const transformar = árvore => {
  if (Array.isArray(árvore)) return árvore.map(transformar)
  if (árvore === null || typeof árvore !== "object") return árvore

  if (árvore.operação) {
    const operação = {
      ...árvore.operação,
      ...(árvore.operação.esquerda !== undefined
        ? { esquerda: transformar(árvore.operação.esquerda) }
        : {}),
      ...(árvore.operação.direita !== undefined
        ? { direita: transformar(árvore.operação.direita) }
        : {}),
    }
    const resultado = { ...árvore, operação }

    if (operação.esquerda === undefined) {
      const direita = operação.direita
      if (operação.operador === "!" && é_constante(direita)) return !direita
      return resultado
    }

    const esquerda = operação.esquerda
    if (!é_constante(esquerda)) return resultado
    if (operação.operador === "&&" && !esquerda) return esquerda
    if (operação.operador === "||" && esquerda) return esquerda

    const direita = operação.direita
    if (!é_constante(direita)) return resultado

    let valor
    switch (operação.operador) {
      case "+": valor = esquerda + direita; break
      case "-": valor = esquerda - direita; break
      case "*": valor = esquerda * direita; break
      case "/": valor = esquerda / direita; break
      case ">": valor = esquerda > direita; break
      case ">=": valor = esquerda >= direita; break
      case "<": valor = esquerda < direita; break
      case "<=": valor = esquerda <= direita; break
      case "==": valor = esquerda == direita; break
      case "!=": valor = esquerda != direita; break
      case "===": valor = esquerda === direita; break
      case "!==": valor = esquerda !== direita; break
      case "&&": valor = esquerda && direita; break
      case "||": valor = esquerda || direita; break
      default: return resultado
    }

    if (typeof valor === "number" && !Number.isFinite(valor)) return resultado
    return valor
  }

  const { agrupado, ...resto } = árvore
  const literal = valor_literal(resto)
  if (literal !== resto) return literal

  return Object.fromEntries(
    Object.entries(árvore).map(([chave, valor]) => [chave, transformar(valor)]),
  )
}

export const analisador_semântico = árvore => transformar(árvore)
