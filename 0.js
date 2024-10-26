import js from "./js.js"

export default async expressão => {
  const depuração = await js(expressão)
  const função = eval(depuração.valor)
  função.depuração = depuração
  return função
}