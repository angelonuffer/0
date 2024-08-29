import avaliar from "./avaliar.js"

const função = async código => {
  const escopo = {
    "#0": caminho => {
      return async () => {
        const resposta = await fetch(caminho)
        return função(await resposta.text())
      }
    },
    "#1": [],
  }
  let i = 0
  for (let j = 0; j <= código.length; j++) {
    if (código[j] === "\n" || j === código.length) {
      const comando = código.slice(i, j)
      const atribuição = comando.indexOf("=")
      if (atribuição > -1) escopo[comando.slice(0, atribuição).trim()] = await avaliar(escopo, comando.slice(atribuição + 1))
      i = j
    }
  }
  return escopo["#1"]
}

export default função