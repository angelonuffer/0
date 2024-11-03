export default async (sintaxe, semântica, expressão) => {
  const escopo = {}
  return (await item(sintaxe, Object.values(sintaxe)[0], semântica, expressão, escopo)).valor.find(item => item !== undefined)
}

const item = async (sintaxe, declaração, semântica, expressão, escopo, tentativas = []) => {
  if (typeof declaração === "string") {
    if (! expressão.startsWith(declaração)) throw new Error("", {cause: {expressão, declaração}})
    return {
      parte: declaração,
      valor: declaração,
    }
  }
  if (declaração["."]) {
    if (typeof declaração["."] === "string") {
      if (expressão[0] !== String.fromCharCode(parseInt(declaração["."], 16))) throw new Error("", {cause: {expressão, declaração}})
    }
    if (Array.isArray(declaração["."])) {
      const código = expressão.charCodeAt(0)
      let de
      if (declaração["."][0].length === 1) de = declaração["."][0].charCodeAt(0)
      else de = parseInt(declaração["."][0], 16)
      let até
      if (declaração["."][1].length === 1) até = declaração["."][1].charCodeAt(0)
      else até = parseInt(declaração["."][1], 16)
      if (código < de || código > até) throw new Error("", {cause: {expressão, declaração}})
      if (declaração["."][2]) {
        let exceto
        if (declaração["."][2].length === 1) exceto = declaração["."][2].charCodeAt(0)
        else exceto = parseInt(declaração["."][2], 16)
        if (código === exceto) throw new Error("", {cause: {expressão, declaração}})
      }
    }
    return {
      parte: expressão[0],
      valor: expressão[0],
    }
  }
  if (declaração["+"]) {
    const {
      parte,
      valor,
    } = await item(sintaxe, declaração["+"], semântica, expressão, escopo)
    try {
      const resto = await item(sintaxe, declaração, semântica, expressão.slice(parte.length), escopo)
      return {
        parte: parte + resto.parte,
        valor: [valor, ...resto.valor],
      }
    }
    catch (erro) {
      return {
        parte,
        valor: [valor],
      }
    }
  }
  if (declaração["$"]) {
    const {
      parte,
      valor,
    } = await item(sintaxe, sintaxe[declaração["$"]], semântica, expressão, escopo)
    if (semântica[declaração["$"]]) {
      const novo_valor = await semântica[declaração["$"]](valor, escopo)
      return {
        parte,
        valor: novo_valor,
      }
    }
    return {
      parte,
      valor,
    }
  }
  if (Array.isArray(declaração)) {
    try {
      if (Array.isArray(declaração[0])) return await sequência(sintaxe, declaração[0], semântica, expressão, escopo)
      else return await item(sintaxe, declaração[0], semântica, expressão, escopo)
    }
    catch (erro) {
      tentativas = [...tentativas, erro]
    }
    if (declaração.length === 1) throw new Error("", {
      cause: {
        expressão,
        declaração,
        tentativas,
      },
    })
    return item(sintaxe, declaração.slice(1), semântica, expressão, escopo, tentativas)
  }
  throw new Error("", {cause: {expressão, declaração}})
}

const sequência = async (sintaxe, declaração, semântica, expressão, escopo) => {
  const {
    parte,
    valor,
  } = await item(sintaxe, declaração[0], semântica, expressão, escopo)
  if (declaração.length === 1) return {
    parte,
    valor: [valor],
  }
  const resto = await sequência(sintaxe, declaração.slice(1), semântica, expressão.slice(parte.length), escopo)
  return {
    parte: parte + resto.parte,
    valor: [valor, ...resto.valor],
  }
}