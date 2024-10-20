import js from "./js.js"

export default async expressão => {
  const depuração = await js(expressão)
  depuração.escopo = eval(depuração.valor)()
  return depuração
}