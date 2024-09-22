import avaliar from "./sintaxe/avaliar.js"
import jsyaml from "https://cdn.jsdelivr.net/npm/js-yaml@4.1.0/dist/js-yaml.mjs"

const sintaxe = jsyaml.load(await fetch("./0.yaml").then(a => a.text()))
const semântica = {
  atribuição: (atribuição, escopo) => {
    escopo[atribuição[0]] = atribuição[4]
    return atribuição[4]
  },
  nome: nome => nome.join(""),
  número: número => parseFloat(número.map(n => n[0]).join("")),
  soma: (soma, escopo) => {
    if (escopo[soma[0]]) soma[0] = escopo[soma[0]]
    if (escopo[soma[4]]) soma[4] = escopo[soma[4]]
    return soma[0] + soma[4]
  },
  subtração: subtração => subtração[0] - subtração[4],
  importação: importação => fetch(importação[1]).then(a => a.text()),
  valor_texto: valor_texto => valor_texto[1].join(""),
  chamada: async (chamada, escopo) => {
    if (escopo[chamada[0]]) chamada[0] = escopo[chamada[0]]
    return (await avaliar(sintaxe, semântica, chamada[0]))["#1"]
  },
}

export default async expressão => {
  const escopo = await avaliar(sintaxe, semântica, expressão)
  return escopo["#1"]
}