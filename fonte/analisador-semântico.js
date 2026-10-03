const valor_constante = árvore => {
  if (árvore?.número !== undefined) {
    const número = Number(árvore.número)
    return Number.isNaN(número) ? undefined : número
  }
  if (árvore?.booleano !== undefined) return árvore.booleano
}

const literal = valor => {
  if (typeof valor === "number") {
    if (!Number.isFinite(valor)) return undefined
    return { número: Object.is(valor, -0) ? "-0" : String(valor) }
  }
  if (typeof valor === "boolean") return { booleano: valor }
}

const substituir_por_literal = (árvore, valor) => {
  const nó_literal = literal(valor)
  if (!nó_literal) return árvore
  const árvore_literal = { ...árvore, ...nó_literal }
  delete árvore_literal.operação
  return árvore_literal
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
      const direita = valor_constante(operação.direita)
      if (operação.operador === "!" && direita !== undefined) {
        return substituir_por_literal(resultado, !direita)
      }
      return resultado
    }

    const esquerda = valor_constante(operação.esquerda)
    if (esquerda === undefined) return resultado
    if (operação.operador === "&&" && !esquerda) return operação.esquerda
    if (operação.operador === "||" && esquerda) return operação.esquerda

    const direita = valor_constante(operação.direita)
    if (direita === undefined) return resultado

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

    return substituir_por_literal(resultado, valor)
  }

  return Object.fromEntries(
    Object.entries(árvore).map(([chave, valor]) => [chave, transformar(valor)]),
  )
}

export const analisador_semântico = árvore => transformar(árvore)
