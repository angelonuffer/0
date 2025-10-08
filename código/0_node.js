import { processar } from './autômato/index.js';

let contexto = ["Node.js"]
while (true) {
  contexto = processar(contexto)
  contexto[0] = await eval(contexto[0])
}