import { testar } from "./testes/uniteste.js"
import aritmética from "./testes/aritmética.js"
import comparação from "./testes/comparação.js"
import lógica from "./testes/lógica.js"
import nome from "./testes/nome.js"
import texto from "./testes/texto.js"
import lista from "./testes/lista.js"
import região from "./testes/região.js"
import objeto from "./testes/objeto.js"

const resultado = testar([
  ...aritmética,
  ...comparação,
  ...lógica,
  ...nome,
  ...texto,
  ...lista,
  ...região,
  ...objeto,
])

process.stdout.write(resultado.saída + "\n")
process.exit(resultado.código)
