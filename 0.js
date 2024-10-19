import avaliar from "./sintaxe/avaliar.js"
import jsyaml from "https://cdn.jsdelivr.net/npm/js-yaml@4.1.0/dist/js-yaml.mjs"

const sintaxe = jsyaml.load(await fetch("./0.yaml").then(a => a.text()))
const semântica = {
  exportação: (exportação, escopo) => {
    escopo["#"] = () => exportação[4]
  },
  atribuição: (atribuição, escopo) => {
    escopo[atribuição[0]] = atribuição[4]
    return atribuição[4]
  },
  nome: nome => {
    if (nome[1][0]) return nome[0] + nome[1][0].join("")
    return nome[0]
  },
  e: e => e[0] !== 0 && e[4] !== 0 ? e[4] : 0,
  ou: ou => ou[0] !== 0 ? ou[0] : ou[4] !== 0 ? ou[4] : 0,
  não: não => não[2] !== 0? 0 : 1,
  maior_que: v => v[0] > v[4] ? 1 : 0,
  menor_que: v => v[0] < v[4] ? 1 : 0,
  igual_a: v => v[0] == v[4] ? 1 : 0,
  diferente_de: v => v[0] != v[4] ? 1 : 0,
  maior_ou_igual_a: v => v[0] >= v[4] ? 1 : 0,
  menor_ou_igual_a: v => v[0] <= v[4] ? 1 : 0,
  número: número => parseFloat(número.map(n => n[0]).join("")),
  adição: adição => adição[0] + adição[4],
  subtração: subtração => subtração[0] - subtração[4],
  multiplicação: multiplicação => multiplicação[0] * multiplicação[4],
  divisão: divisão => divisão[0] / divisão[4],
  importação: importação => fetch(importação[1]).then(a => a.text()),
  valor_texto: v => {
    if (v[1] === "") return ""
    return v[1].join("")
  },
  modelo_texto: v => {
    if (v[1] === "") return ""
    return v[1].join("")
  },
  interpolação: v => v[1],
  lista: v => [...v[1][0].map(v => v[0]), v[1][1]],
  parte: (v, escopo) => {
    if (v[3] !== "") return escopo[v[0]].slice(v[2], v[3][1])
    return escopo[v[0]][v[2]]
  },
  variável: (variável, escopo) => escopo[variável],
  chamada: async (chamada, escopo) => {
    if (escopo[chamada[0]]) chamada[0] = escopo[chamada[0]]
    return (await avaliar(sintaxe, semântica, chamada[0])).escopo["#"]()
  },
  substituição: (v, escopo) => {
    if (v[2] === "") if (Array.isArray(escopo[v[0]])) {
      escopo[v[0]].push(v[7])
      return
    }
    if (Array.isArray(escopo[v[0]])) {
      if (v[7] === null) {
        escopo[v[0]].splice(v[2], 1)
        return
      }
      escopo[v[0]][v[2]] = v[7]
      return
    }
    escopo[v[0]] = `${escopo[v[0]].slice(0, v[2])}${v[7]}${escopo[v[0]].slice(v[2] + 1)}`
  },
  nulo: v => null,
}

export default async expressão => await avaliar(sintaxe, semântica, expressão)