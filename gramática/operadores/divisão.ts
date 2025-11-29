#!/usr/bin/env -S deno run --allow-read

import analisar from "../../analisador/analisar.ts";
import iguais from "../../analisador/iguais.ts";
import { número } from "../tipos_literais/número.ts";
import { dígito } from "../tipos_literais/dígito.ts";
import { espaço } from "../espaço.ts";
import TestRunner from "../../analisador/runner.ts";

// Use a mutable object and lazy reference to allow recursive grammar
export const divisão: Record<string, unknown> = {};

// divisor can be either another division or a plain number
const divisorOuDivisão = {
  alternativa: [
    divisão,  // Try division first (to match longest expression)
    número,   // Fall back to plain number
  ],
};

// Define the division grammar with recursive second operand
Object.assign(divisão, {
  sequência: [
    {
      chave: "dividendo",
      gramática: número,
    },
    espaço,
    {
      chave: "operador",
      gramática: "/",
    },
    espaço,
    {
      chave: "divisor",
      gramática: divisorOuDivisão,
    },
  ],
});
export function runTests(): { passed: number; failed: number } {
  const tr = new TestRunner();

  tr.run("divisão.ts - caso '6/3'", () => {
    iguais(
      analisar("6/3", divisão),
      {
        resultado: {
          dividendo: { número: "6" },
          operador: "/",
          divisor: { número: "3" },
        },
        resto: "",
      }
    );
  });

  tr.run("divisão.ts - caso inválido '/3' (falta dividendo)", () => {
    iguais(
      analisar("/3", divisão),
      {
        esperava: [
          dígito,
        ],
        resto: "/3",
      }
    );
  });

  tr.run("divisão.ts - caso inválido '6/' (falta divisor)", () => {
    iguais(
      analisar("6/", divisão),
      {
        esperava: [
          dígito,
        ],
        resto: "",
      }
    );
  });

  tr.run("divisão.ts - caso '24/4/2' (múltiplos termos)", () => {
    iguais(
      analisar("24/4/2", divisão),
      {
        resultado: {
          dividendo: { número: "24" },
          operador: "/",
          divisor: {
            dividendo: { número: "4" },
            operador: "/",
            divisor: { número: "2" },
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
