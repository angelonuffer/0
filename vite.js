import { readdirSync } from "node:fs"
import { basename, dirname, extname } from "node:path"
import { código_para_símbolos } from "./fonte/código-para-símbolos.js"
import { símbolos_para_árvore } from "./fonte/símbolos-para-árvore.js"
import { árvore_para_valor } from "./fonte/árvore-para-valor.js"
import { valor_para_js } from "./fonte/valor-para-js.js"
import { formatar_erro } from "./fonte/erro.js"

const identificadores_livres = árvore => {
  const identificadores = new Set()

  const visitar = (nó, escopo) => {
    if (Array.isArray(nó)) {
      nó.forEach(item => visitar(item, escopo))
      return
    }
    if (nó === null || typeof nó !== "object") return

    if (nó.identificador !== undefined) {
      if (!escopo.has(nó.identificador)) identificadores.add(nó.identificador)
      return
    }

    if (nó.função !== undefined) {
      const escopo_da_função = new Set(escopo)
      escopo_da_função.add(nó.função.parâmetro)
      visitar(nó.função.corpo, escopo_da_função)
      return
    }

    if (nó.bloco !== undefined) {
      const escopo_do_bloco = new Set(escopo)
      for (const instrução of nó.bloco) {
        if (instrução.associação) {
          escopo_do_bloco.add(instrução.associação.identificador)
        }
      }
      nó.bloco.forEach(instrução => visitar(instrução, escopo_do_bloco))
      return
    }

    Object.values(nó).forEach(valor => visitar(valor, escopo))
  }

  visitar(árvore, new Set())
  return identificadores
}

export default function vitePlugin0() {
  return {
    name: "vite-plugin-0",
    enforce: "pre",
    transform(código, id) {
      const arquivo = id.split("?")[0]
      if (extname(arquivo) !== ".0") return null

      const tokens = código_para_símbolos(código)
      const sintaxe = símbolos_para_árvore({ entrada: tokens, posição: 0 })
      if (sintaxe.erro) {
        throw new Error(formatar_erro({
          ...sintaxe,
          entrada: código,
          tokens,
          arquivo,
        }))
      }

      const javascript = valor_para_js(árvore_para_valor(sintaxe.valor))
      if (javascript === undefined) {
        throw new Error(`Não foi possível compilar o módulo 0: ${arquivo}`)
      }

      const nome_do_módulo = basename(arquivo, ".0")
      const dependências = [...identificadores_livres(sintaxe.valor)]
        .filter(nome => nome !== nome_do_módulo)
      const irmãos = dependências.length === 0
        ? new Set()
        : new Set(readdirSync(dirname(arquivo), { withFileTypes: true })
          .filter(entrada => entrada.isFile() && extname(entrada.name) === ".0")
          .map(entrada => basename(entrada.name, ".0")))
      const imports = dependências
        .filter(nome => irmãos.has(nome))
        .map(nome => `import ${nome} from ${JSON.stringify(`./${nome}.0`)}`)

      return `${imports.length > 0 ? `${imports.join("\n")}\n` : ""}export default ${javascript}`
    },
  }
}
