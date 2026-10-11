import { readdirSync, readFileSync } from "node:fs"
import { basename, dirname, extname, resolve } from "node:path"
import { código_para_símbolos } from "./código-para-símbolos.js"
import { símbolos_para_árvore } from "./símbolos-para-árvore.js"
import { árvore_para_valor } from "./árvore-para-valor.js"
import { formatar_erro } from "./erro.js"

const analisar = (código, arquivo) => {
  const tokens = código_para_símbolos(código)
  const sintaxe = símbolos_para_árvore({ entrada: tokens, posição: 0 })

  if (sintaxe.erro) {
    throw new Error(formatar_erro({ ...sintaxe, entrada: código, tokens, arquivo }))
  }

  return sintaxe.valor
}

const criar_ambiente = arquivo => {
  const caminho = resolve(arquivo)
  const diretório = dirname(caminho)
  const ambiente = new Map()

  for (const entrada of readdirSync(diretório, { withFileTypes: true })) {
    if (!entrada.isFile() || extname(entrada.name) !== ".0") continue
    const nome = basename(entrada.name, ".0")
    if (!/^[a-zA-Z_][a-zA-Z_0-9]*$/.test(nome)) continue

    const caminho_do_módulo = resolve(diretório, entrada.name)
    if (caminho_do_módulo === caminho) continue

    ambiente.set(nome, {
      avaliando: false,
      avaliada: false,
      avaliar: () => executar_arquivo(caminho_do_módulo),
    })
  }

  return ambiente
}

export const avaliar = (código, arquivo) => {
  const árvore = analisar(código, arquivo)
  const ambiente = arquivo === undefined ? new Map() : criar_ambiente(arquivo)
  return árvore_para_valor(árvore, ambiente)
}

export const executar_arquivo = arquivo => {
  const caminho = resolve(arquivo)
  return avaliar(readFileSync(caminho, "utf8"), caminho)
}
