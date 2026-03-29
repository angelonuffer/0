import segmentar from "./segmentar.js";
import testar from "./testar.js";

export default testar(segmentar, [
  {
    entrada: "./fontes/resposta.0",
    esperado: [ { endereço: "./fontes/resposta.0" }, ],
  },
  {
    entrada: "@",
    esperado: [ { carregamento: "@" } ],
  },
  {
    entrada: "+",
    esperado: [ { soma: "+" } ],
  },
  {
    entrada: "(",
    esperado: [ { abre_parênteses: "(" } ],
  },
  {
    entrada: ")",
    esperado: [ { fecha_parênteses: ")" } ],
  },
  {
    entrada: '"olá"',
    esperado: [ { texto: "olá" } ],
  },
  {
    entrada: "42",
    esperado: [ { número: "42" } ],
  },
  {
    entrada: "foo",
    esperado: [ { identificador: "foo" } ],
  },
  {
    entrada: "a[.]",
    esperado: [ { identificador: "a" }, { tamanho: "[.]" } ],
  },
  {
    entrada: '"não fechado',
    esperado: [ { erro: {} } ],
  },
]);
