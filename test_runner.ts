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

// Run whitespace tests
const tr4 = new TestRunner();
tr4.run("espaços em branco - espaço antes de número", () => {
  iguais(analisar(" 5", número), { resultado: "5", resto: "" });
});
tr4.run("espaços em branco - múltiplos espaços antes de número", () => {
  iguais(analisar("   5", número), { resultado: "5", resto: "" });
});
tr4.run("espaços em branco - tab antes de número", () => {
  iguais(analisar("\t5", número), { resultado: "5", resto: "" });
});
tr4.run("espaços em branco - quebra de linha antes de número", () => {
  iguais(analisar("\n5", número), { resultado: "5", resto: "" });
});
tr4.run("espaços em branco - carriage return antes de número", () => {
  iguais(analisar("\r5", número), { resultado: "5", resto: "" });
});
tr4.run("espaços em branco - mistura de espaços em branco", () => {
  iguais(analisar("  \t\n\r 5", número), { resultado: "5", resto: "" });
});
tr4.run("espaços em branco - adição com espaços '5 + 3'", () => {
  iguais(analisar("5 + 3", adição), { resultado: { parcela_1: "5", parcela_2: "3" }, resto: "" });
});
tr4.run("espaços em branco - adição com tabs '5\t+\t3'", () => {
  iguais(analisar("5\t+\t3", adição), { resultado: { parcela_1: "5", parcela_2: "3" }, resto: "" });
});
tr4.run("espaços em branco - adição com quebras de linha", () => {
  iguais(analisar("5\n+\n3", adição), { resultado: { parcela_1: "5", parcela_2: "3" }, resto: "" });
});
console.log(`espaços em branco tests: ${tr4.getPassed()} passed, ${tr4.getFailed()} failed`);
tr4.throwIfFailed();

// Run comment tests
const tr5 = new TestRunner();
tr5.run("comentários - comentário de linha // antes de número", () => {
  iguais(analisar("// comentário\n5", número), { resultado: "5", resto: "" });
});
tr5.run("comentários - comentário de linha // sem quebra de linha no final", () => {
  iguais(analisar("// comentário", número), { esperava: [número], resto: "" });
});
tr5.run("comentários - comentário de bloco /* */ antes de número", () => {
  iguais(analisar("/* comentário */5", número), { resultado: "5", resto: "" });
});
tr5.run("comentários - comentário de bloco multilinhas", () => {
  iguais(analisar("/* comentário\nmultilinhas */5", número), { resultado: "5", resto: "" });
});
tr5.run("comentários - múltiplos comentários", () => {
  iguais(analisar("// linha 1\n// linha 2\n5", número), { resultado: "5", resto: "" });
});
tr5.run("comentários - comentário de bloco com espaços", () => {
  iguais(analisar("  /* comentário */  5", número), { resultado: "5", resto: "" });
});
tr5.run("comentários - adição com comentários '5 /* soma */ + /* parcela */ 3'", () => {
  iguais(analisar("5 /* soma */ + /* parcela */ 3", adição), { resultado: { parcela_1: "5", parcela_2: "3" }, resto: "" });
});
tr5.run("comentários - comentário de linha no meio da adição", () => {
  iguais(analisar("5 // parcela 1\n+ // operador\n3", adição), { resultado: { parcela_1: "5", parcela_2: "3" }, resto: "" });
});
tr5.run("comentários - comentário de bloco no final do input (resto contém comentário)", () => {
  iguais(analisar("5/* comentário */", número), { resultado: "5", resto: "/* comentário */" });
});
tr5.run("comentários - comentário de bloco não fechado tratado como resto", () => {
  // Comentário não fechado - o parser trata como conteúdo restante
  iguais(analisar("/* comentário não fechado", número), { esperava: [número], resto: "o" });
});
console.log(`comentários tests: ${tr5.getPassed()} passed, ${tr5.getFailed()} failed`);
tr5.throwIfFailed();

console.log("Todos os testes executados com sucesso!");
