#! /usr/bin/env node

import { readFileSync, realpathSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { código_para_símbolos } from "./código-para-símbolos.js"
import { símbolos_para_árvore } from "./símbolos-para-árvore.js"
import { árvore_para_valor } from "./árvore-para-valor.js"
import { formatar_erro } from "./erro.js"

const executar = arquivo => {
	const código = readFileSync(arquivo, "utf8")
	const tokens = código_para_símbolos(código)
	const sintaxe = símbolos_para_árvore({ entrada: tokens, posição: 0 })

	if (sintaxe.erro) {
		throw new Error(formatar_erro({ ...sintaxe, entrada: código, tokens, arquivo }))
	}

	return árvore_para_valor(sintaxe.valor)
}

if (process.argv[1] && fileURLToPath(import.meta.url) === realpathSync(process.argv[1])) {
	const arquivo = process.argv[2]

	if (!arquivo) {
		process.stderr.write("Uso: 0 <arquivo.0>\n")
		process.exitCode = 1
	} else {
		try {
			process.stdout.write(`${executar(arquivo)}\n`)
		} catch (erro) {
			process.stderr.write(`${erro.message}\n`)
			process.exitCode = 1
		}
	}
}