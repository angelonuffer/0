#!/usr/bin/env -S deno run --allow-read

import analisar from "../../analisador/analisar.ts";
import iguais from "../../analisador/iguais.ts";
import { número } from "../tipos_literais/número.ts";
import { dígito } from "../tipos_literais/dígito.ts";
import { espaço } from "../espaço.ts";
import TestRunner from "../../analisador/runner.ts";

export const multiplicação = {
  sequência: [
    {
      chave: "fator_1",
      gramática: número,
    },
    espaço,
    {
      chave: "operador",
      gramática: "*",
    },
    espaço,
    {
      chave: "fator_2",
      gramática: número,
    },
  ],
};
export function runTests(): { passed: number; failed: number } {
  const tr = new TestRunner();

  tr.run("multiplicação.ts - caso '5*3'", () => {
    iguais(
      analisar("5*3", multiplicação),
      {
        resultado: {
          fator_1: { número: "5" },
          operador: "*",
          fator_2: { número: "3" },
        },
        resto: "",
      }
    );
  });

  tr.run("multiplicação.ts - caso inválido '*3' (falta fator_1)", () => {
    iguais(
      analisar("*3", multiplicação),
      {
        esperava: [
          dígito,
        ],
        resto: "*3",
      }
    );
  });

  tr.run("multiplicação.ts - caso inválido '5*' (falta fator_2)", () => {
    iguais(
      analisar("5*", multiplicação),
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
