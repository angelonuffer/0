// Effects definitions - side effects that can be executed by the automaton
const efeitos = {
  saia: código => [
    "process.exit(",
    código,
    ")",
  ].join(""),
  escreva: mensagem => [
    "console.log(",
    JSON.stringify(mensagem),
    ")",
  ].join(""),
  obtenha_argumentos: () => "process.argv.slice(2)",
  carregue_localmente: endereço => [
    "import('fs').then(fs => fs.readFileSync(",
    JSON.stringify(endereço),
    ", 'utf-8'))",
  ].join(""),
  carregue_remotamente: endereço => [
    "fetch(",
    JSON.stringify(endereço),
    ").then(resposta => resposta.text())",
  ].join(""),
  verifique_existência: endereço => [
    "import('fs').then(fs => fs.existsSync(",
    JSON.stringify(endereço),
    "))",
  ].join(""),
  salve_localmente: (endereço, conteúdo) => [
    "import('fs').then(fs => fs.writeFileSync(",
    JSON.stringify(endereço),
    ", ",
    JSON.stringify(conteúdo),
    "))",
  ].join(""),
}

export { efeitos };