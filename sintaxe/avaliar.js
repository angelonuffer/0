export default async (sintaxe, semântica, expressão) => {
  const escopo = {}
  const {
    parte,
    valor,
    caminho,
  } = await item(escopo, sintaxe, Object.values(sintaxe)[0], semântica, expressão)
  return {
    escopo,
    parte,
    valor,
    caminho,
  }
}

const item = async (escopo, sintaxe, declaração, semântica, expressão) => {
  if (typeof declaração === "string") {
    if (! expressão.startsWith(declaração)) return {}
    return {
      parte: declaração,
      valor: declaração,
      caminho: declaração,
    }
  }
  if (declaração["."]) {
    if (typeof declaração["."] === "string") {
      if (expressão[0] !== String.fromCharCode(parseInt(declaração["."], 16))) return {}
    }
    if (Array.isArray(declaração["."])) {
      const código = expressão.charCodeAt(0)
      let de
      if (declaração["."][0].length === 1) de = declaração["."][0].charCodeAt(0)
      else de = parseInt(declaração["."][0], 16)
      let até
      if (declaração["."][1].length === 1) até = declaração["."][1].charCodeAt(0)
      else até = parseInt(declaração["."][1], 16)
      if (código < de || código > até) return {}
      if (declaração["."][2]) {
        let exceto
        if (declaração["."][2].length === 1) exceto = declaração["."][2].charCodeAt(0)
        else exceto = parseInt(declaração["."][2], 16)
        if (código === exceto) return {}
      }
    }
    return {
      parte: expressão[0],
      valor: expressão[0],
      caminho: expressão[0],
    }
  }
  if (declaração["+"]) {
    const {
      parte,
      valor,
      caminho,
    } = await item(escopo, sintaxe, declaração["+"], semântica, expressão)
    if (parte === undefined) return {}
    const resto = await item(escopo, sintaxe, declaração, semântica, expressão.slice(parte.length))
    if (resto.parte === undefined) return {
      parte,
      valor: [valor],
      caminho: [caminho],
    }
    return {
      parte: parte + resto.parte,
      valor: [valor, ...resto.valor],
      caminho: [caminho, ...resto.caminho],
    }
  }
  if (declaração["$"]) {
    const {
      parte,
      valor,
      caminho,
    } = await item(escopo, sintaxe, sintaxe[declaração["$"]], semântica, expressão)
    if (parte === undefined) return {}
    if (semântica[declaração["$"]]) {
      const novo_valor = await semântica[declaração["$"]](valor, escopo)
      return {
        parte,
        valor: novo_valor,
        caminho: {
          nome: declaração["$"],
          caminho_percorrido: caminho,
        },
      }
    }
    return {
      parte,
      valor,
      caminho,
    }
  }
  if (Array.isArray(declaração)) {
    let resultado
    if (Array.isArray(declaração[0]))
      resultado = await sequência(escopo, sintaxe, declaração[0], semântica, expressão)
    else
      resultado = await item(escopo, sintaxe, declaração[0], semântica, expressão)
    if (resultado.parte !== undefined) return resultado
    if (declaração.length === 1) return {}
    return item(escopo, sintaxe, declaração.slice(1), semântica, expressão)
  }
  console.error({declaração, expressão})
  throw new Error("Erro de definição da sintaxe.")
}

const sequência = async (escopo, sintaxe, declaração, semântica, expressão) => {
  const {
    parte,
    valor,
    caminho,
  } = await item(escopo, sintaxe, declaração[0], semântica, expressão)
  if (parte === undefined) return {}
  if (declaração.length === 1) return {
    parte,
    valor: [valor],
    caminho: [caminho],
  }
  const resto = await sequência(escopo, sintaxe, declaração.slice(1), semântica, expressão.slice(parte.length))
  if (resto.parte === undefined) return {}
  return {
    parte: parte + resto.parte,
    valor: [valor, ...resto.valor],
    caminho: [caminho, ...resto.caminho],
  }
}