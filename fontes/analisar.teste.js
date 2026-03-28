import analisar from "./analisar.js";
import testar from "./testar.js";

export default testar(analisar, [
  {
    entrada: "",
    esperado: { vazio: 1 },
  },
  {
    entrada: "-0",
    esperado: { número: "-0" },
  },
  {
    entrada: "@ \"./fontes/pergunta.txt\"",
    esperado: { inclusão: { texto: "./fontes/pergunta.txt" } },
  },
  {
    entrada: "./fontes/resposta.0",
    esperado: { arquivo: "./fontes/resposta.0" },
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
    esperado: { tamanho: { inclusão: { texto: "./fontes/pergunta.txt" } } },
  },
]);