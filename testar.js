import { testar } from "./uniteste.js"
import aritmética from "./testes/aritmética.js"
import comparação from "./testes/comparação.js"
import lógica from "./testes/lógica.js"
import variáveis from "./testes/variáveis.js"
import texto from "./testes/texto.js"
import listas from "./testes/listas.js"

const resultado = testar([
  ...aritmética,
  ...comparação,
  ...lógica,
  ...variáveis,
  ...texto,
  ...listas,
])

process.stdout.write(resultado.saída + "\n")
process.exit(resultado.código)
