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
  
  // Check if we've reached the finalizado state
  if (novo_estado.etapa === "finalizado") {
    process.exit(0);
  }
  
  if (efeito) {
    const retorno = await processe(...efeito);
    contexto[0] = retorno;
  }
}