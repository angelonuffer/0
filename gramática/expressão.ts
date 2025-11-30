#!/usr/bin/env -S deno run --allow-read

import analisar from "../analisador/analisar.ts";
import iguais from "../analisador/iguais.ts";
import { dígito } from "./tipos_literais/dígito.ts";
import { aditivo } from "./operadores/aditivo.ts";
import TestRunner from "../analisador/runner.ts";

// expressão uses the aditivo grammar which handles precedence properly:
// - aditivo handles +/- (lower precedence)
// - termo (used by aditivo) handles */\/ (higher precedence)
export const expressão = aditivo;

export function runTests(): { passed: number; failed: number } {
  const tr = new TestRunner();

  tr.run("expressão.ts - caso '5+3'", () => {
    iguais(
      analisar("5+3", expressão),
      {
        resultado: {
          parcela_1: { número: "5" },
          operador: "+",
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

  tr.run("expressão.ts - caso '3 + 4 + 5' (múltiplos termos)", () => {
    iguais(
      analisar("3 + 4 + 5", expressão),
      {
        resultado: {
          parcela_1: {
            parcela_1: { número: "3" },
            operador: "+",
            parcela_2: { número: "4" },
          },
          operador: "+",
          parcela_2: { número: "5" },
        },
        resto: "",
      }
    );
  });

  // New tests for mixed operators with precedence
  tr.run("expressão.ts - caso '2 + 3 * 4' (precedência: multiplicação primeiro)", () => {
    // Should parse as 2 + (3 * 4) because * has higher precedence
    iguais(
      analisar("2 + 3 * 4", expressão),
      {
        resultado: {
          parcela_1: { número: "2" },
          operador: "+",
          parcela_2: {
            fator_1: { número: "3" },
            operador: "*",
            fator_2: { número: "4" },
          },
        },
        resto: "",
      }
    );
  });

  tr.run("expressão.ts - caso '2 * 3 + 4' (precedência: multiplicação primeiro)", () => {
    // Should parse as (2 * 3) + 4 because * has higher precedence
    iguais(
      analisar("2 * 3 + 4", expressão),
      {
        resultado: {
          parcela_1: {
            fator_1: { número: "2" },
            operador: "*",
            fator_2: { número: "3" },
          },
          operador: "+",
          parcela_2: { número: "4" },
        },
        resto: "",
      }
    );
  });

  tr.run("expressão.ts - caso '3 + 4 - 5' (adição e subtração misturadas)", () => {
    iguais(
      analisar("3 + 4 - 5", expressão),
      {
        resultado: {
          parcela_1: {
            parcela_1: { número: "3" },
            operador: "+",
            parcela_2: { número: "4" },
          },
          operador: "-",
          parcela_2: { número: "5" },
        },
        resto: "",
      }
    );
  });

  tr.run("expressão.ts - caso '10 / 2 * 3' (divisão e multiplicação misturadas)", () => {
    iguais(
      analisar("10 / 2 * 3", expressão),
      {
        resultado: {
          fator_1: {
            fator_1: { número: "10" },
            operador: "/",
            fator_2: { número: "2" },
          },
          operador: "*",
          fator_2: { número: "3" },
        },
        resto: "",
      }
    );
  });

  tr.run("expressão.ts - caso '2 + 3 * 4 - 5 / 1' (expressão complexa)", () => {
    // Should parse as 2 + (3 * 4) - (5 / 1)
    iguais(
      analisar("2 + 3 * 4 - 5 / 1", expressão),
      {
        resultado: {
          parcela_1: {
            parcela_1: { número: "2" },
            operador: "+",
            parcela_2: {
              fator_1: { número: "3" },
              operador: "*",
              fator_2: { número: "4" },
            },
          },
          operador: "-",
          parcela_2: {
            fator_1: { número: "5" },
            operador: "/",
            fator_2: { número: "1" },
          },
        },
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
