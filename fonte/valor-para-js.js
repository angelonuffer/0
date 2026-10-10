const declaração_preguiça = "const _=f=>{let d,v;return()=>d?v:(d=true,v=f())};"
const operadores_booleanos = new Set(["!", ">", ">=", "<", "<=", "==", "!=", "===", "!=="])

const converter = (árvore, topo, corpo_de_função = false) => {
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

  if (Array.isArray(árvore?.modelo_texto)) {
    return "`" + árvore.modelo_texto.map(item => {
      if (typeof item === "string") return item.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${")
      return `\${${converter(item, false)}}`
    }).join("") + "`"
  }

  if (árvore?.modelo_texto !== undefined) return `\`${árvore.modelo_texto.slice(1, -1)}\``

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
    const expressão = esquerda === undefined
      ? `${operador}${converter(direita, false)}`
      : `${converter(esquerda, false)}${operador}${converter(direita, false)}`
    return operadores_booleanos.has(operador) ? `(${expressão}?1:0)` : expressão
  }
}

export const valor_para_js = árvore => converter(árvore, true)