import testar from './testar.js';
import avaliar from './avaliar.js';

export default testar(avaliar, [
  {
    entrada: '"olá"',
    esperado: { saída: "olá", }
  },
  {
    entrada: '@ "./fontes/pergunta.txt"',
    esperado: { saída: "O que você obtém se multiplicar seis por nove?", erro: {} }
  },
  {
    entrada: "./fontes/resposta.0",
    esperado: { saída: "42", }
  },
  {
    entrada: "42 + 5",
    esperado: { saída: "47", }
  },
  {
    entrada: "8",
    esperado: { saída: "8", }
  },
  {
    entrada: "x",
    escopo: { x: 10 },
    esperado: { saída: "10", }
  },
  {
    entrada: "foo",
    esperado: { erro: {
      linha: 1,
      coluna: 1,
      conteúdo: "foo",
    }, }
  },
  {
    entrada: {
      conteúdo: '@ "./fontes/no-such-file"',
      endereço: "entrada.0",
    },
    esperado: { saída: "", erro: {
      endereço: "entrada.0",
      linha: 1,
      coluna: 1,
      conteúdo: '@ "./fontes/no-such-file"',
    } },
  },
]);