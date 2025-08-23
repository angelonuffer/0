import _0 from "./0.js"
import fs from "fs"

const processe = async (i, ...argumentos) => await [
  // deprecated_0 (old atribua_retorno_ao_estado) - should not be called
  () => { throw new Error("State manipulation effect atribua_retorno_ao_estado is no longer supported"); },
  // deprecated_1 (old atribua_valor_ao_estado) - should not be called  
  () => { throw new Error("State manipulation effect atribua_valor_ao_estado is no longer supported"); },
  // deprecated_2 (old delete_do_estado) - should not be called
  () => { throw new Error("State manipulation effect delete_do_estado is no longer supported"); },
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
    const retorno = await processe(...efeito);
    contexto[0] = retorno;
  } else {
    // Continue with null return to allow state processing
    contexto[0] = null;
    // Add check for explicit termination
    if (novo_estado.etapa === "finalizado") break;
  }
}