import { fileURLToPath } from "node:url"
import { bloco, teste } from "./comum.js"

const arquivo = fileURLToPath(import.meta.url)

export default [
  ...teste({
    entrada: bloco(`
      biblioteca 4
    `),
    valor: 5,
    arquivo,
  }),
  ...teste({
    entrada: bloco(`
      $ incremento = biblioteca
      incremento 6
    `),
    valor: 7,
    arquivo,
  }),
  ...teste({
    entrada: bloco(`
      $ incremento = biblioteca
      42
    `),
    valor: 42,
    arquivo,
  }),
]
