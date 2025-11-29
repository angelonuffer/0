#!/usr/bin/env -S deno run --allow-read

import analisar from "../analisador/analisar.ts";
import iguais from "../analisador/iguais.ts";
import TestRunner from "../analisador/runner.ts";

// Grammar for zero-or-more whitespace characters (space, tab, newline, carriage return)
const whitespaceChar = {
  alternativa: [" ", "\t", "\n", "\r"],
};

// Helpers: negation-based helpers for single-char exclusions
const notNewline = { negação: "\n" };
const notAsterisk = { negação: "*" };
const notSlash = { negação: "/" };

// Line comment: '//' followed by zero-or-more non-newline chars, then either '\n' or EOF
const lineComment = {
  alternativa: [
    { sequência: ["//", { repetição: notNewline }, "\n"] },
    { sequência: ["//", { repetição: notNewline }, ""] },
  ],
};

// Block comment content unit: any char except '*' OR '*' not followed by '/'
const blockContentUnit = {
  alternativa: [
    notAsterisk,
    { sequência: ["*", notSlash] },
  ],
};

// Block comment: only closed form '/*' (content)* '*/'
const blockComment = {
  alternativa: [
    { sequência: ["/*", { repetição: blockContentUnit }, "*/"] },
  ],
};

// whitespace element may be a space char, a line comment, or a block comment
const whitespaceElement = {
  alternativa: [whitespaceChar, lineComment, blockComment],
};

// Use the new `repetição` grammar type (zero-or-more of whitespace elements)
export const espaço = {
  repetição: whitespaceElement,
};

export function runTests(): { passed: number; failed: number } {
  const tr = new TestRunner();

  tr.run("espaço - caso ' ' (um espaço)", () => {
    iguais(
      analisar(" 5", espaço),
      { resultado: " ", resto: "5" },
    );
  });

  tr.run("espaço - caso múltiplos espaços", () => {
    iguais(
      analisar("   5", espaço),
      { resultado: "   ", resto: "5" },
    );
  });

  tr.run("espaço - caso tab e espaços", () => {
    iguais(
      analisar(" \t\n\r5", espaço),
      { resultado: " \t\n\r", resto: "5" },
    );
  });

  tr.run("espaço - caso vazio", () => {
    iguais(
      analisar("5", espaço),
      { resultado: "", resto: "5" },
    );
  });

  tr.run("espaço - comentário de linha antes de número", () => {
    iguais(
      analisar("// comentário\n5", espaço),
      { resultado: "// comentário\n", resto: "5" },
    );
  });

  tr.run("espaço - comentário de linha sem quebra no final", () => {
    iguais(
      analisar("// comentário", espaço),
      { resultado: "// comentário", resto: "" },
    );
  });

  tr.run("espaço - comentário de bloco antes de número", () => {
    iguais(
      analisar("/* comentário */5", espaço),
      { resultado: "/* comentário */", resto: "5" },
    );
  });

  tr.run("espaço - comentário de bloco multilinhas antes de número", () => {
    iguais(
      analisar("/* comentário\nmultilinhas */5", espaço),
      { resultado: "/* comentário\nmultilinhas */", resto: "5" },
    );
  });

  tr.run("espaço - múltiplos comentários de linha", () => {
    iguais(
      analisar("// linha 1\n// linha 2\n5", espaço),
      { resultado: "// linha 1\n// linha 2\n", resto: "5" },
    );
  });

  tr.run("espaço - comentário de bloco com espaços em volta", () => {
    iguais(
      analisar("  /* comentário */  5", espaço),
      { resultado: "  /* comentário */  ", resto: "5" },
    );
  });

  tr.run("espaço - comentário de bloco não fechado", () => {
    iguais(
      analisar("/* comentário não fechado", espaço),
      { esperava: ["*/"], resto: "" },
    );
  });

  const report = tr.report();
  if (report.failed > 0) {
    for (const e of report.errors) console.error(e.message);
  }

  console.log(`Testes: total ${report.passed + report.failed}, sucessos ${report.passed}, falhas ${report.failed}`);
  return { passed: report.passed, failed: report.failed };
}

if (import.meta.main) runTests();
