#! /usr/bin/env node

import {
  tipo,
} from "./dialeto.js"
import {
  analisador_léxico,
} from "./analisador-léxico.js"

export const analisador_sintático = entrada => {
  const símbolos = typeof entrada === "string" ? analisador_léxico(entrada) : entrada
  const resultado = tipo("número")({ entrada: símbolos, posição: 0 })
  if (resultado.erro || resultado.posição !== símbolos.length) return {}
  return resultado.valor
}