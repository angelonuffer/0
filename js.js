import avaliar from "./sintaxe/avaliar.js"
import jsyaml from "https://cdn.jsdelivr.net/npm/js-yaml@4.1.0/dist/js-yaml.mjs"

const sintaxe = jsyaml.load(await fetch("./0.yaml").then(a => a.text()))

function nextNamespaceName(name) {
  if (name === undefined) return "a"

  const validChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$_';
  let nextName = '';

  let carry = true; // Usado para saber se devemos incrementar o próximo caractere
  for (let i = name.length - 1; i >= 0; i--) {
    if (carry) {
      let nextIndex = validChars.indexOf(name[i]) + 1;
      if (nextIndex >= validChars.length) {
        nextName = validChars[0] + nextName;
        carry = true;
      } else {
        nextName = validChars[nextIndex] + nextName;
        carry = false;
      }
    } else {
      nextName = name[i] + nextName;
    }
  }

  if (carry) {
    nextName = validChars[0] + nextName;
  }

  return nextName;
}

const inicializar = (nome, e) => {
  if (! e.nomes) e.nomes = {}
  if (! e.preparação) e.preparação = []
  let inicializador = ""
  if (! e.nomes[nome]) {
    e.nome_atual = nextNamespaceName(e.nome_atual)
    e.nomes[nome] = e.nome_atual
    inicializador = "let "
  }
  return inicializador
}

const semântica = {
  exportação: (v, e) => {
    if (e.preparação) return `()=>{${e.preparação.join(";")};return ${v[4]}}`
    if (v[4][0] === "{") return `()=>{return ${v[4]}}`
    return `()=>${v[4]}`
  },
  importação: async (v, e) => {
    const inicializador = inicializar(v[0], e)
    e.preparação.push(`${inicializador}${e.nomes[v[0]]}=${(await js(await fetch(v[4].join("")).then(a => a.text()))).valor}`)
  },
  atribuição: (v, e) => {
    const inicializador = inicializar(v[0], e)
    e.preparação.push(`${inicializador}${e.nomes[v[0]]}=${v[4]}`)
  },
  declaração_função: async (v, e) => {
    const inicializador = inicializar(v[0], e)
    inicializar(v[2], e)
    e.preparação.push(`${inicializador}${e.nomes[v[0]]}=(${e.nomes[v[2]]})=>${v[7]}`)
  },
  espaço: () => {},
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
  valor: (v, e) => {
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
    if (v[1] === "(") return `${e.nomes[v[0]]}(${v[2]})`
    if (v[1] === "[") {
      if (v[3] === ":") return `${e.nomes[v[0]]}.slice(${v[2]},${v[4]})`
      return `${e.nomes[v[0]]}[${v[2]}]`
    }
    if (v[1] === ".") return `${e.nomes[v[0]]}["${v[2]}"]`
    inicializar(v, e)
    return e.nomes[v]
  },
  nome: v => {
    if (v[1] === "") return v[0]
    return `${v[0]}${v[1][0].join("")}`
  },
  item_lista: v => {
    if (v[0] === "...") return v.join("")
    return v
  },
  item_objeto: v => {
    if (v[0] === "...") return v.join("")
    return `${v[0]}:${v[3]}`
  },
}

const js = async expressão => {
  const depuração = await avaliar(sintaxe, semântica, expressão)
  depuração.valor = depuração.valor.find(item => item !== undefined)
  return depuração
}

export default js