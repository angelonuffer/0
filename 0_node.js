import _0 from "./0.js"
import fs from "fs"

const processe = async (i, ...argumentos) => await [
  // saia
  código => process.exit(código),
  // escreva
  mensagem => console.log(mensagem),
  // obtenha_argumentos
  () => process.argv.slice(2),
  // carregue_localmente
  endereço => fs.readFileSync(endereço, "utf-8"),
  // carregue_remotamente
  async endereço => (await (await fetch(endereço)).text()),
  // verifique_existência
  endereço => fs.existsSync(endereço),
  // salve_localmente
  (endereço, conteúdo) => fs.writeFileSync(endereço, conteúdo),
][i](...argumentos)

const timeout = 5000;
const start = Date.now();
let contexto = [null, {}];
while (true) {
  if (Date.now() - start > timeout) process.exit(1)
  const [efeito, novo_estado] = _0(contexto);
  contexto[1] = novo_estado;
  
  if (efeito) {
    let retorno;
    if (typeof efeito === 'string') {
      // Generic string effect - execute with eval
      retorno = await eval(efeito);
    } else {
      // Standard indexed effect
      retorno = await processe(...efeito);
    }
    contexto[0] = retorno;
  }
}