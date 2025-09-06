import _0 from "./0.js"
import fs from "fs"

const timeout = 5000;
const start = Date.now();
let contexto = [null, {}];
while (true) {
  if (Date.now() - start > timeout) process.exit(1)
  const [efeito, novo_estado] = _0(contexto);
  contexto[1] = novo_estado;
  
  if (efeito) {
    // All effects are now strings - execute with eval
    const retorno = await eval(`(async function(fs) { return ${efeito}; })`)(fs);
    contexto[0] = retorno;
  }
}