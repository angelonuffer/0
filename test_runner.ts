// Test runner script
import analisar from './analisador/analisar.ts';
import iguais from './analisador/iguais.ts';
import TestRunner from './analisador/runner.ts';

// Define grammars inline matching the actual grammar
const número = {
  faixa: {
    de: "0",
    até: "9",
  }
};

const adição = {
  sequência: [
    {
      chave: "parcela_1",
      gramática: número,
    },
    "+",
    {
      chave: "parcela_2",
      gramática: número,
    },
  ],
};

const expressão = {
  alternativa: [adição, número],
};

// Run número tests
const tr1 = new TestRunner();
tr1.run("número - caso '5'", () => {
  iguais(analisar("5", número), { resultado: "5", resto: "" });
});
tr1.run("número - caso inválido 'a'", () => {
  iguais(analisar("a", número), { esperava: [número], resto: "a" });
});
tr1.run("número - caso inválido '' (string vazia)", () => {
  iguais(analisar("", número), { esperava: [número], resto: "" });
});
console.log(`número tests: ${tr1.getPassed()} passed, ${tr1.getFailed()} failed`);
tr1.throwIfFailed();

// Run adição tests
const tr2 = new TestRunner();
tr2.run("adição - caso '5+3'", () => {
  iguais(analisar("5+3", adição), { resultado: { parcela_1: "5", parcela_2: "3" }, resto: "" });
});
tr2.run("adição - caso inválido '+3' (falta parcela_1)", () => {
  iguais(analisar("+3", adição), { esperava: [número], resto: "+3" });
});
tr2.run("adição - caso inválido '5+' (falta parcela_2)", () => {
  iguais(analisar("5+", adição), { esperava: [número], resto: "" });
});
console.log(`adição tests: ${tr2.getPassed()} passed, ${tr2.getFailed()} failed`);
tr2.throwIfFailed();

// Run expressão tests
const tr3 = new TestRunner();
tr3.run("expressão - caso '5+3'", () => {
  iguais(analisar("5+3", expressão), { resultado: { parcela_1: "5", parcela_2: "3" }, resto: "" });
});
tr3.run("expressão - caso '5'", () => {
  iguais(analisar("5", expressão), { resultado: "5", resto: "" });
});
tr3.run("expressão - caso inválido '+'", () => {
  iguais(analisar("+", expressão), { esperava: [número], resto: "+" });
});
tr3.run("expressão - caso inválido '' (string vazia)", () => {
  iguais(analisar("", expressão), { esperava: [número], resto: "" });
});
console.log(`expressão tests: ${tr3.getPassed()} passed, ${tr3.getFailed()} failed`);
tr3.throwIfFailed();

console.log("Todos os testes executados com sucesso!");
