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
  número: número => parseFloat(número.map(n => n[0]).join("")),
  adição: (adição, escopo) => {
    if (escopo[adição[0]]) adição[0] = escopo[adição[0]]
    if (escopo[adição[4]]) adição[4] = escopo[adição[4]]
    return adição[0] + adição[4]
  },
  subtração: subtração => subtração[0] - subtração[4],
  multiplicação: multiplicação => multiplicação[0] * multiplicação[4],
  divisão: divisão => divisão[0] / divisão[4],
  importação: importação => fetch(importação[1]).then(a => a.text()),
  valor_texto: valor_texto => valor_texto[1].join(""),
  chamada: async (chamada, escopo) => {
    if (escopo[chamada[0]]) chamada[0] = escopo[chamada[0]]
    return (await avaliar(sintaxe, semântica, chamada[0]))["#"]()
  },
}

export default async expressão => await avaliar(sintaxe, semântica, expressão)