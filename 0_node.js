import _0 from "./0.js"

let contexto = [`${process.title}/${process.version}`]
while (true) {
  contexto = _0(contexto)
  contexto[0] = await eval(contexto[0])
}