#! /usr/bin/env node

import { realpathSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { executar_arquivo } from "./módulo.js"

if (process.argv[1] && fileURLToPath(import.meta.url) === realpathSync(process.argv[1])) {
	const arquivo = process.argv[2]

	if (!arquivo) {
		process.stderr.write("Uso: 0 <arquivo.0>\n")
		process.exitCode = 1
	} else {
		try {
			process.stdout.write(`${executar_arquivo(arquivo)}\n`)
		} catch (erro) {
			process.stderr.write(`${erro.message}\n`)
			process.exitCode = 1
		}
	}
}