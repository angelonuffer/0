#!/usr/bin/env -S deno run --allow-read

import analisar from "../../analisador/analisar.ts";
import iguais from "../../analisador/iguais.ts";
import TestRunner from "../../analisador/runner.ts";

export const texto = {
  sequência: [
    '"',
    {
      chave: "texto",
      gramática: {
        repetição: {
          negação: '"',
        },
      },
    },
    '"',
  ],
};
export function runTests(): { passed: number; failed: number } {
  const tr = new TestRunner();

  tr.run("texto.ts - caso '\"olá\"'", () => {
    iguais(
      analisar('"olá"', texto),
      {
        resultado: { texto: "olá" },
        resto: "",
      }
    );
  });

  tr.run("texto.ts - caso '\"\"' (string vazia)", () => {
    iguais(
      analisar('""', texto),
      {
        resultado: { texto: "" },
        resto: "",
      }
    );
  });

  tr.run("texto.ts - caso inválido 'olá' (sem aspas)", () => {
    iguais(
      analisar("olá", texto),
      {
        esperava: [
          '"',
        ],
        resto: "olá",
      }
    );
  });

  tr.run("texto.ts - caso inválido '' (string vazia)", () => {
    iguais(
      analisar("", texto),
      {
        esperava: [
          '"',
        ],
        resto: "",
      }
    );
  });

  const report = tr.report();
  if (report.failed > 0) {
    for (const e of report.errors) console.error(e.message);
  }

  console.log(`Testes: total ${report.passed + report.failed}, sucessos ${report.passed}, falhas ${report.failed}`);
  return { passed: report.passed, failed: report.failed };
}

if (import.meta.main) {
  runTests();
}
