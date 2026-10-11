const operadores_booleanos = new Set(["!", ">", ">=", "<", "<=", "==", "!=", "===", "!=="])

const converter = (árvore, topo, corpo_de_função = false, condição = false) => {
  if (Array.isArray(árvore)) return `[${árvore.map(item => converter(item, false)).join(",")}]`
  if (typeof árvore === "string") return JSON.stringify(árvore)
  if (typeof árvore === "number" || typeof árvore === "boolean") return String(árvore)

  if (árvore?.agrupado) {
    const { agrupado, ...expressão } = árvore
    if (corpo_de_função && expressão.bloco) return converter(expressão, false, true)
    return `(${converter(expressão, false)})`
  }

  if (árvore?.número !== undefined) return árvore.número

  if (árvore?.booleano !== undefined) return String(árvore.booleano)

  if (árvore?.função !== undefined) {
    const { parâmetro, corpo } = árvore.função
    const tem_guardas = corpo?.bloco?.some(instrução => instrução.guarda !== undefined)
    return `(${parâmetro})=>${converter(corpo, false, tem_guardas)}`
  }

  if (árvore?.objeto !== undefined) {
    if (árvore.membros !== undefined) {
      const propriedades = árvore.membros.map(membro => membro.espalhamento !== undefined
        ? `...${converter(membro.espalhamento, false)}`
        : `${JSON.stringify(membro[0])}:${converter(membro[1], false)}`)
      return `({${propriedades.join(",")}})`
    }
    const propriedades = Object.entries(árvore.objeto)
      .map(([chave, valor]) => `${JSON.stringify(chave)}:${converter(valor, false)}`)
      .join(",")
    return `({${propriedades}})`
  }

  if (Array.isArray(árvore?.modelo_texto)) {
    return "`" + árvore.modelo_texto.map(item => {
      if (typeof item === "string") return item.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${")
      return `\${${converter(item, false)}}`
    }).join("") + "`"
  }

  if (árvore?.modelo_texto !== undefined) return `\`${árvore.modelo_texto.slice(1, -1)}\``

  if (árvore?.identificador !== undefined) {
    return árvore.identificador
  }

  if (árvore?.bloco) {
    if (corpo_de_função && árvore.bloco.some(instrução => instrução.guarda !== undefined)) {
      return árvore.bloco
        .filter(instrução => instrução.guarda !== undefined)
        .reduceRight((alternativa, instrução) => {
          const { condição, corpo } = instrução.guarda
          if (condição === undefined) return converter(corpo, false)
          return `${converter(condição, false, false, true)}?${converter(corpo, false)}:${alternativa}`
        }, "undefined")
    }

    const último = árvore.bloco.length - 1
    const instruções = árvore.bloco.map((instrução, i) => {
      if (instrução.associação) {
        const { identificador, valor } = instrução.associação
        return `const ${identificador}=${converter(valor, false, true)}`
      }
      if (instrução.guarda) {
        const { condição, corpo } = instrução.guarda
        if (condição === undefined) {
          return `return ${converter(corpo, false)}`
        }
        return `if(${converter(condição, false)})return ${converter(corpo, false)}`
      }
      const código = converter(instrução, false)
      return !topo && i === último ? `return ${código}` : código
    }).join(";")
    if (corpo_de_função) {
      return `{${instruções}}`
    }
    return topo ? instruções : `(()=>{${instruções}})()`
  }

  if (árvore?.operação) {
    const { operador, esquerda, direita } = árvore.operação
    const contexto_condicional = condição && ["!", "&&", "||"].includes(operador)
    const expressão = esquerda === undefined
      ? `${operador}${converter(direita, false, false, contexto_condicional)}`
      : `${converter(esquerda, false, false, contexto_condicional)}${operador}${converter(direita, false, false, contexto_condicional)}`
    if (condição) return expressão
    return operadores_booleanos.has(operador) ? `(${expressão}?1:0)` : expressão
  }
}

export const valor_para_js = árvore => converter(árvore, true)