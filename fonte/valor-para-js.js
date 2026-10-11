const declaração_preguiça = "const _=f=>{let d,v;return()=>d?v:(d=true,v=f())};"
const operadores_booleanos = new Set(["!", ">", ">=", "<", "<=", "==", "!=", "===", "!=="])

const converter = (árvore, topo, corpo_de_função = false, parâmetros = new Set()) => {
  if (Array.isArray(árvore)) return `[${árvore.map(item => converter(item, false, false, parâmetros)).join(",")}]`
  if (typeof árvore === "string") return JSON.stringify(árvore)
  if (typeof árvore === "number" || typeof árvore === "boolean") return String(árvore)

  if (árvore?.agrupado) {
    const { agrupado, ...expressão } = árvore
    if (corpo_de_função && expressão.bloco) return converter(expressão, false, true, parâmetros)
    return `(${converter(expressão, false, false, parâmetros)})`
  }

  if (árvore?.número !== undefined) return árvore.número

  if (árvore?.booleano !== undefined) return String(árvore.booleano)

  if (árvore?.função !== undefined) {
    const { parâmetro, corpo } = árvore.função
    const tem_guardas = corpo?.bloco?.some(instrução => instrução.guarda !== undefined)
    return `(${parâmetro})=>${converter(corpo, false, tem_guardas, new Set([...parâmetros, parâmetro]))}`
  }

  if (árvore?.objeto !== undefined) {
    if (árvore.membros !== undefined) {
      const propriedades = árvore.membros.map(membro => membro.espalhamento !== undefined
        ? `...${converter(membro.espalhamento, false, false, parâmetros)}`
        : `${JSON.stringify(membro[0])}:${converter(membro[1], false, false, parâmetros)}`)
      return `({${propriedades.join(",")}})`
    }
    const propriedades = Object.entries(árvore.objeto)
      .map(([chave, valor]) => `${JSON.stringify(chave)}:${converter(valor, false, false, parâmetros)}`)
      .join(",")
    return `({${propriedades}})`
  }

  if (Array.isArray(árvore?.modelo_texto)) {
    return "`" + árvore.modelo_texto.map(item => {
      if (typeof item === "string") return item.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${")
      return `\${${converter(item, false, false, parâmetros)}}`
    }).join("") + "`"
  }

  if (árvore?.modelo_texto !== undefined) return `\`${árvore.modelo_texto.slice(1, -1)}\``

  if (árvore?.identificador !== undefined) {
    return parâmetros.has(árvore.identificador)
      ? árvore.identificador
      : `${árvore.identificador}()`
  }

  if (árvore?.bloco) {
    const último = árvore.bloco.length - 1
    const instruções = árvore.bloco.map((instrução, i) => {
      if (instrução.associação) {
        const { identificador, valor } = instrução.associação
        return `const ${identificador}=_(()=>${converter(valor, false, true, parâmetros)})`
      }
      if (instrução.guarda) {
        const { condição, corpo } = instrução.guarda
        if (condição === undefined) {
          return `return ${converter(corpo, false, false, parâmetros)}`
        }
        return `if(${converter(condição, false, false, parâmetros)})return ${converter(corpo, false, false, parâmetros)}`
      }
      const código = converter(instrução, false, false, parâmetros)
      return !topo && i === último ? `return ${código}` : código
    }).join(";")
    if (corpo_de_função) {
      const tem_associações = árvore.bloco.some(instrução => instrução.associação !== undefined)
      return `{${tem_associações ? declaração_preguiça : ""}${instruções}}`
    }
    return topo
      ? `${declaração_preguiça}${instruções}`
      : `(()=>{${instruções}})()`
  }

  if (árvore?.operação) {
    const { operador, esquerda, direita } = árvore.operação
    const expressão = esquerda === undefined
      ? `${operador}${converter(direita, false, false, parâmetros)}`
      : `${converter(esquerda, false, false, parâmetros)}${operador}${converter(direita, false, false, parâmetros)}`
    return operadores_booleanos.has(operador) ? `(${expressão}?1:0)` : expressão
  }
}

export const valor_para_js = árvore => converter(árvore, true)