import { testar } from "./testes/uniteste.js"
import aritmética from "./testes/aritmética.js"
import comparação from "./testes/comparação.js"
import lógica from "./testes/lógica.js"
import nome from "./testes/nome.js"
import texto from "./testes/texto.js"
import lista from "./testes/lista.js"
import região from "./testes/região.js"
import objeto from "./testes/objeto.js"
import função from "./testes/função.js"
import importação from "./testes/importação.js"
import vite from "./testes/vite.js"

const resultado = testar([
  ...aritmética,
  ...comparação,
  ...lógica,
  ...nome,
  ...texto,
  ...lista,
  ...região,
  ...objeto,
  ...função,
  ...importação,
  ...vite,
])

process.stdout.write(resultado.saída + "\n")
process.exit(resultado.código)
