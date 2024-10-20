import avaliar from "./sintaxe/avaliar.js"
import jsyaml from "https://cdn.jsdelivr.net/npm/js-yaml@4.1.0/dist/js-yaml.mjs"

const sintaxe = jsyaml.load(await fetch("./0.yaml").then(a => a.text()))

const semântica = {
  exportação: v => {
    if (v[4][0] === "{") return `e["#"]=()=>{return ${v[4]}}`
    return `e["#"]=()=>${v[4]}`
  },
  importação: async v => `e["${v[0]}"]=${(await js(await fetch(v[4].join("")).then(a => a.text()))).valor}`,
  atribuição: v => `e["${v[0]}"]=${v[4]}`,
  espaço: () => "",
  expressão: v => {
    if (v[0] === "!") return `${v[2]}===0?1:0`
    if (v[2] === "&") return `${v[0]}===0?0:${v[4]}===0?0:${v[4]}`
    if (v[2] === "|") return `${v[0]}!==0?${v[0]}:${v[4]}!==0?${v[4]}:0`
    if (v[2] === "==") return `${v[0]}===${v[4]}?1:0`
    if (v[2] === "!=") return `${v[0]}!==${v[4]}?1:0`
    if ([
      ">=",
      "<=",
      ">",
      "<",
    ].indexOf(v[2]) > -1) return `${v[0]}${v[2]}${v[4]}?1:0`
    if (Array.isArray(v)) return `${v[0]}${v[2]}${v[4]}`
    return v
  },
  valor: v => {
    if (Array.isArray(v[0])) return v[0].join("")
    if (v[0] === "\"") return `"${v[1].join("")}"`
    if (v[0] === "`") return `\`${v[1].map(v => v[0] === "${"? v.join(""): v).join("")}\``
    if (v[0] === "[") {
      if (v[2] === "") return "[]"
      if (v[2][1] === "") return `[${v[2][0]}]`
      return `[${v[2][0]},${v[2][1].map(v => v[2]).join(",")}]`
    }
    if (v[0] === "{") {
      if (v[2] === "") return "{}"
      if (v[2][1] === "") return `{${v[1][0]}}`
      return `{${v[2][0]},${v[2][1].map(v => v[2]).join(",")}}`
    }
    if (v[1] === "()") return `e["${v[0]}"]()["#"]()`
    if (v[1] === "[") {
      if (v[3] === ":") return `e["${v[0]}"].slice(${v[2]},${v[4]})`
      return `e["${v[0]}"][${v[2]}]`
    }
    if (v[1] === ".") return `e["${v[0]}"]["${v[2]}"]`
    return `e["${v}"]`
  },
  nome: v => {
    if (v[1] === "") return v[0]
    return `${v[0]}${v[1][0].join("")}`
  },
  item_lista: v => {
    if (Array.isArray(v)) return v.join("")
    return v
  },
  item_objeto: v => {
    if (v[0] === "...") return v.join("")
    return `${v[0]}:${v[3]}`
  },
}

const js = async expressão => {
  const depuração = await avaliar(sintaxe, semântica, expressão)
  depuração.valor = `()=>{const e={};${depuração.valor.filter(item => item !== "").join(";")};return e}`
  return depuração
}

export default js