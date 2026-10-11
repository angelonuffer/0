import { dirname } from "node:path"
import { fileURLToPath } from "node:url"
import vitePlugin0 from "../vite.js"

const diretório = dirname(fileURLToPath(import.meta.url))
const transformar = (código, id = "/projeto/módulo.0") =>
  vitePlugin0().transform(código, id)

export default [
  {
    função: transformar,
    argumento: "2 + 3",
    retorno_esperado: "export default 5",
  },
  {
    função: transformar,
    argumento: "x => x + 1",
    retorno_esperado: "export default (x)=>x+1",
  },
  {
    função: código => transformar(código, `${diretório}/módulo.0`),
    argumento: "biblioteca",
    retorno_esperado: 'import biblioteca from "./biblioteca.0"\nexport default biblioteca',
  },
  {
    função: código => transformar(código, `${diretório}/módulo.0`),
    argumento: "biblioteca => biblioteca",
    retorno_esperado: "export default (biblioteca)=>biblioteca",
  },
  {
    função: código => transformar(código, "/projeto/módulo.js"),
    argumento: "2 + 3",
    retorno_esperado: null,
  },
  {
    função: código => transformar(código, "/projeto/módulo.0?import"),
    argumento: "2 + 3",
    retorno_esperado: "export default 5",
  },
]
