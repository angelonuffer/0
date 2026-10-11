const é_constante = valor => typeof valor === "number" || typeof valor === "boolean"

const valor_literal = (árvore, ambiente) => {
  if (árvore.texto !== undefined) return árvore.texto.slice(1, -1)
  if (Array.isArray(árvore.modelo_texto)) {
    return árvore.modelo_texto.reduce((resultado, item) => {
      if (typeof item === "string") return resultado + item
      const valor = transformar(item, ambiente)
      return resultado + String(valor)
    }, "")
  }
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

  if (árvore.função !== undefined) {
    const tem_guardas = árvore.função.corpo?.bloco?.some(
      instrução => instrução.guarda !== undefined,
    )
    return {
      função: {
        ...árvore.função,
        corpo: tem_guardas
          ? árvore.função.corpo
          : transformar(árvore.função.corpo, ambiente),
        ambiente,
      },
    }
  }

  if (árvore.membros !== undefined) {
    const membros = árvore.membros.map(membro => membro.espalhamento !== undefined
      ? { espalhamento: transformar(membro.espalhamento, ambiente) }
      : [membro[0], transformar(membro[1], ambiente)])
    const entradas = []
    let diferido = false

    for (const membro of membros) {
      if (membro.espalhamento === undefined) {
        entradas.push(membro)
        continue
      }

      const fonte = membro.espalhamento
      if (fonte && typeof fonte === "object" && !Array.isArray(fonte)) {
        if (fonte.membros !== undefined) {
          diferido = true
          continue
        }
        if (fonte.objeto !== undefined) {
          entradas.push(...Object.entries(fonte.objeto))
          continue
        }
        if (["identificador", "aplicação", "operação", "bloco", "lista"].some(
          tipo => fonte[tipo] !== undefined,
        )) {
          diferido = true
          continue
        }
      }
      if (fonte != null) entradas.push(...Object.entries(fonte))
    }

    const objeto = Object.fromEntries(entradas)
    return diferido
      ? { objeto, membros }
      : { objeto }
  }

  if (árvore.lista !== undefined) {
    return árvore.lista.flatMap(item => item.espalhamento !== undefined
      ? [...transformar(item.espalhamento, ambiente)]
      : [transformar(item, ambiente)])
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

    const guardas = árvore.bloco.filter(instrução => instrução.guarda !== undefined)
    if (guardas.length > 0) {
      for (const instrução of guardas) {
        if (instrução.guarda.condição === undefined) {
          return transformar(instrução.guarda.corpo, escopo)
        }
        const condição = transformar(instrução.guarda.condição, escopo)
        if (condição !== null && typeof condição === "object"
          && !Array.isArray(condição)
          && condição.objeto === undefined
          && condição.função === undefined) {
          return árvore
        }
        if (condição) return transformar(instrução.guarda.corpo, escopo)
      }
      return undefined
    }

    const última = árvore.bloco.at(-1)
    return última?.associação ? undefined : transformar(última, escopo)
  }

  if (árvore.aplicação) {
    const função = transformar(árvore.aplicação.função, ambiente)
    const argumento = transformar(árvore.aplicação.argumento, ambiente)
    if (função?.função?.parâmetro !== undefined) {
      const escopo = new Map(função.função.ambiente)
      escopo.set(função.função.parâmetro, {
        avaliada: true,
        valor: argumento,
      })
      return transformar(função.função.corpo, escopo)
    }
    if (função?.objeto !== undefined && typeof argumento === "string") {
      return função.objeto[argumento]
    }
    if ((typeof função === "string" || Array.isArray(função)) && typeof argumento === "number") {
      return função[argumento]
    }
    return { ...árvore, aplicação: { função, argumento } }
  }

  if (árvore.operação) {
    const operação = árvore.operação
    if (operação.esquerda === undefined) {
      const direita = transformar(operação.direita, ambiente)
      const resultado = { ...árvore, operação: { ...operação, direita } }
      if (operação.operador === "!" && é_constante(direita)) return Number(!direita)
      if (operação.operador === "#" && (typeof direita === "string" || Array.isArray(direita))) {
        return direita.length
      }
      return resultado
    }

    const esquerda = transformar(operação.esquerda, ambiente)
    if (!é_constante(esquerda)) {
      const direita = transformar(operação.direita, ambiente)
      const soma_de_constantes = esquerda?.operação?.operador === "+"
        && operação.operador === "+"
        && typeof esquerda.operação.direita === "number"
        && typeof direita === "number"
        ? esquerda.operação.direita + direita
        : undefined
      if (Number.isFinite(soma_de_constantes)) {
        return {
          ...árvore,
          operação: {
            ...operação,
            esquerda: esquerda.operação.esquerda,
            direita: soma_de_constantes,
          },
        }
      }
      return {
        ...árvore,
        operação: {
          ...operação,
          esquerda,
          direita,
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
  const literal = valor_literal(resto, ambiente)
  if (literal !== resto) return literal

  return Object.fromEntries(
    Object.entries(árvore).map(([chave, valor]) => [chave, transformar(valor, ambiente)]),
  )
}

export const árvore_para_valor = árvore => transformar(árvore)
