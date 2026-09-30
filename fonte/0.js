#! /usr/bin/env node

import { readFileSync, realpathSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { analisador_léxico } from "./analisador-léxico.js"
import { analisador_sintático } from "./analisador-sintático.js"
import { analisador_semântico } from "./analisador-semântico.js"

const executar = arquivo => {
	const código = readFileSync(arquivo, "utf8")
	const tokens = analisador_léxico(código)
	const sintaxe = analisador_sintático({ entrada: tokens, posição: 0 })

	if (sintaxe.erro) {
		throw new Error(`Erro sintático na posição ${sintaxe.posição}: esperado ${sintaxe.erro}`)
	}

	return analisador_semântico(sintaxe)
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