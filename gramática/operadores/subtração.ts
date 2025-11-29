#!/usr/bin/env -S deno run --allow-read

import analisar from "../../analisador/analisar.ts";
import iguais from "../../analisador/iguais.ts";
import { número } from "../tipos_literais/número.ts";
import { dígito } from "../tipos_literais/dígito.ts";
import { espaço } from "../espaço.ts";
import TestRunner from "../../analisador/runner.ts";

export const subtração = {
  sequência: [
    {
      chave: "minuendo",
      gramática: número,
    },
    espaço,
    {
      chave: "operador",
      gramática: "-",
    },
    espaço,
    {
      chave: "subtraendo",
      gramática: número,
    },
  ],
};
export function runTests(): { passed: number; failed: number } {
  const tr = new TestRunner();

  tr.run("subtração.ts - caso '5-3'", () => {
    iguais(
      analisar("5-3", subtração),
      {
        resultado: {
          minuendo: { número: "5" },
          operador: "-",
          subtraendo: { número: "3" },
        },
        resto: "",
      }
    );
  });

  tr.run("subtração.ts - caso inválido '-3' (falta minuendo)", () => {
    iguais(
      analisar("-3", subtração),
      {
        esperava: [
          dígito,
        ],
        resto: "-3",
      }
    );
  });

  tr.run("subtração.ts - caso inválido '5-' (falta subtraendo)", () => {
    iguais(
      analisar("5-", subtração),
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
