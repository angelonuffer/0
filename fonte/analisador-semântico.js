const é_constante = valor => typeof valor === "number" || typeof valor === "boolean"

const valor_literal = árvore => {
  if (árvore.texto !== undefined) return árvore.texto.slice(1, -1)
  if (árvore.modelo_texto !== undefined) return árvore.modelo_texto.slice(1, -1)
  if (árvore.número !== undefined) {
    const número = Number(árvore.número)
    return Number.isNaN(número) ? árvore : número
  }
  if (árvore.booleano !== undefined) return árvore.booleano
  return árvore
}

const transformar = (árvore, ambiente = new Map()) => {
  if (Array.isArray(árvore)) return árvore.map(item => transformar(item, ambiente))
  if (árvore === null || typeof árvore !== "object") return árvore

  if (árvore.identificador !== undefined) {
    const associação = ambiente.get(árvore.identificador)
    if (!associação || associação.avaliando) return árvore
    if (associação.avaliada) return associação.valor
    associação.avaliando = true
    associação.valor = transformar(associação.expressão, ambiente)
    associação.avaliando = false
    associação.avaliada = true
    return associação.valor
  }

  if (árvore.bloco) {
    const escopo = new Map(ambiente)
    for (const instrução of árvore.bloco) {
      if (!instrução.associação) continue
      const { identificador, valor } = instrução.associação
      escopo.set(identificador, {
        expressão: valor,
        avaliando: false,
        avaliada: false,
      })
    }

    const última = árvore.bloco.at(-1)
    return última?.associação ? undefined : transformar(última, escopo)
  }

  if (árvore.operação) {
    const operação = árvore.operação
    if (operação.esquerda === undefined) {
      const direita = transformar(operação.direita, ambiente)
      const resultado = { ...árvore, operação: { ...operação, direita } }
      if (operação.operador === "!" && é_constante(direita)) return Number(!direita)
      if (operação.operador === "#" && typeof direita === "string") return direita.length
      return resultado
    }

    const esquerda = transformar(operação.esquerda, ambiente)
    if (!é_constante(esquerda)) {
      return {
        ...árvore,
        operação: {
          ...operação,
          esquerda,
          direita: transformar(operação.direita, ambiente),
        },
      }
    }
    if (operação.operador === "&&" && !esquerda) return esquerda
    if (operação.operador === "||" && esquerda) return esquerda

    const direita = transformar(operação.direita, ambiente)
    if (!é_constante(direita)) {
      return {
        ...árvore,
        operação: { ...operação, esquerda, direita },
      }
    }

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
      default: return {
        ...árvore,
        operação: { ...operação, esquerda, direita },
      }
    }

    if (typeof valor === "number" && !Number.isFinite(valor)) {
      return {
        ...árvore,
        operação: { ...operação, esquerda, direita },
      }
    }
    if (typeof valor === "boolean") return Number(valor)
    return valor
  }

  const { agrupado, ...resto } = árvore
  const literal = valor_literal(resto)
  if (literal !== resto) return literal

  return Object.fromEntries(
    Object.entries(árvore).map(([chave, valor]) => [chave, transformar(valor, ambiente)]),
  )
}

export const analisador_semântico = árvore => transformar(árvore)
