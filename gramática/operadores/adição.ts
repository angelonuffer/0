#!/usr/bin/env -S deno run --allow-read

import analisar from "../../analisador/analisar.ts";
import iguais from "../../analisador/iguais.ts";
import { número } from "../tipos_literais/número.ts";
import { dígito } from "../tipos_literais/dígito.ts";
import { espaço } from "../espaço.ts";
import TestRunner from "../../analisador/runner.ts";

export const adição = {
  sequência: [
    {
      chave: "parcela_1",
      gramática: número,
    },
    espaço,
    "+",
    espaço,
    {
      chave: "parcela_2",
      gramática: número,
    },
  ],
};
export function runTests(): { passed: number; failed: number } {
  const tr = new TestRunner();

  tr.run("adição.ts - caso '5+3'", () => {
    iguais(
      analisar("5+3", adição),
      {
        resultado: {
          parcela_1: { número: "5" },
          parcela_2: { número: "3" },
        },
        resto: "",
      }
    );
  });

  tr.run("adição.ts - caso inválido '+3' (falta parcela_1)", () => {
    iguais(
      analisar("+3", adição),
      {
        esperava: [
          dígito,
        ],
        resto: "+3",
      }
    );
  });

  tr.run("adição.ts - caso inválido '5+' (falta parcela_2)", () => {
    iguais(
      analisar("5+", adição),
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
