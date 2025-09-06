// Effects definitions - side effects that can be executed by the automaton
const efeitos = {
  "saia": (código) => `process.exit(${código})`,
  "escreva": (mensagem) => `console.log(${JSON.stringify(mensagem)})`,
  "obtenha_argumentos": () => `process.argv.slice(2)`,
  "carregue_localmente": (endereço) => `fs.readFileSync(${JSON.stringify(endereço)}, "utf-8")`,
  "carregue_remotamente": (endereço) => `(await (await fetch(${JSON.stringify(endereço)})).text())`,
  "verifique_existência": (endereço) => `fs.existsSync(${JSON.stringify(endereço)})`,
  "salve_localmente": (endereço, conteúdo) => `fs.writeFileSync(${JSON.stringify(endereço)}, ${JSON.stringify(conteúdo)})`,
}

export { efeitos };