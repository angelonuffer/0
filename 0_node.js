import _0 from "./0.js"

let contexto = ["Node.js"]
while (true) {
  contexto = _0(contexto)
  contexto[0] = await eval(contexto[0])
}