import analisar from "./analisar.js";
import testar from "./testar.js";

export default testar(analisar, [
  {
    entrada: "",
    esperado: { erro: {} },
  },
  {
    entrada: "-0",
    esperado: { número: "-0" },
  },
  {
    entrada: "@ \"./fontes/pergunta.txt\"",
    esperado: { carregamento: { texto: "./fontes/pergunta.txt" } },
  },
  {
    entrada: "./fontes/resposta.0",
    esperado: { endereço: "./fontes/resposta.0" },
  },
  {
    entrada: '"hello"',
    esperado: { texto: "hello" },
  },
  {
    entrada: "42 + 5",
    esperado: { soma: [
      { número: "42" },
      { número: "5" },
    ] },
  },
  {
    entrada: "8",
    esperado: { número: "8" },
  },
  {
    entrada: "foo",
    esperado: { símbolo: "foo" },
  },
  {
    entrada: "a[.]",
    esperado: { tamanho: { símbolo: "a" } },
  },
  {
    entrada: '( @ "./fontes/pergunta.txt" )[.]',
    esperado: { tamanho: { carregamento: { texto: "./fontes/pergunta.txt" } } },
  },
]);