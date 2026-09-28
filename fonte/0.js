#! /usr/bin/env node

import {
  tipo,
} from "./dialeto.js"

export const analisador_sintático = entrada => {
  const resultado = tipo("número")({ entrada, posição: 0 })
  if (resultado.erro || resultado.posição !== entrada.length) return {}
  return resultado.valor
}