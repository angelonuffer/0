#!/usr/bin/env -S deno run --allow-read

import analisar from "../analisador/analisar.ts";
import iguais from "../analisador/iguais.ts";
import { número } from "./tipos_literais/número.ts";
import { dígito } from "./tipos_literais/dígito.ts";
import { adição } from "./operadores/adição.ts";
import { subtração } from "./operadores/subtração.ts";
import { multiplicação } from "./operadores/multiplicação.ts";
import { divisão } from "./operadores/divisão.ts";
import TestRunner from "../analisador/runner.ts";

export const expressão = {
  alternativa: [adição, subtração, multiplicação, divisão, número],
};
export function runTests(): { passed: number; failed: number } {
  const tr = new TestRunner();

  tr.run("expressão.ts - caso '5+3'", () => {
    iguais(
      analisar("5+3", expressão),
      {
        resultado: {
          parcela_1: { número: "5" },
          parcela_2: { número: "3" },
        },
        resto: "",
      }
    );
  });

  tr.run("expressão.ts - caso '5'", () => {
    iguais(
      analisar("5", expressão),
      { resultado: { número: "5" }, resto: "" }
    );
  });

  tr.run("expressão.ts - caso inválido '+'", () => {
    iguais(
      analisar("+", expressão),
      {
        esperava: [
          dígito,
        ],
        resto: "+",
      }
    );
  });

  tr.run("expressão.ts - caso inválido '' (string vazia)", () => {
    iguais(
      analisar("", expressão),
      {
        esperava: [
          dígito,
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
