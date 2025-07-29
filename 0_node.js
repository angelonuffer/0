import _0 from "./0.js"
import fs from "fs"

const estado = {}

const processe = async (i, ...argumentos) => await [
  // atribua_retorno_ao_estado
  async (nome, efeito) => estado[nome] = await processe(...efeito),
  // atribua_valor_ao_estado
  (nome, valor) => estado[nome] = valor,
  // delete_do_estado
  nome => delete estado[nome],
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
][i](...argumentos)

const timeout = 5000;
const start = Date.now();
while (true) for (const efeito of _0(estado)) {
  if (Date.now() - start > timeout) process.exit(1)
  await processe(...efeito)
}