#!/usr/bin/env -S deno run --allow-read

import analisar from "../../analisador/analisar.ts";
import iguais from "../../analisador/iguais.ts";
import { número } from "../tipos_literais/número.ts";
import { dígito } from "../tipos_literais/dígito.ts";
import { espaço } from "../espaço.ts";
import TestRunner from "../../analisador/runner.ts";

// Use a mutable object and lazy reference to allow recursive grammar
export const adição: Record<string, unknown> = {};

// parcela_2 can be either another addition or a plain number
const parcelaOuAdição = {
  alternativa: [
    adição,   // Try addition first (to match longest expression)
    número,   // Fall back to plain number
  ],
};

// Define the addition grammar with recursive second operand
Object.assign(adição, {
  sequência: [
    {
      chave: "parcela_1",
      gramática: número,
    },
    espaço,
    {
      chave: "operador",
      gramática: "+",
    },
    espaço,
    {
      chave: "parcela_2",
      gramática: parcelaOuAdição,
    },
  ],
});
export function runTests(): { passed: number; failed: number } {
  const tr = new TestRunner();

  tr.run("adição.ts - caso '5+3'", () => {
    iguais(
      analisar("5+3", adição),
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

  tr.run("adição.ts - caso '3+4+5' (múltiplos termos)", () => {
    iguais(
      analisar("3+4+5", adição),
      {
        resultado: {
          parcela_1: { número: "3" },
          operador: "+",
          parcela_2: {
            parcela_1: { número: "4" },
            operador: "+",
            parcela_2: { número: "5" },
          },
        },
        resto: "",
      }
    );
  });

  tr.run("adição.ts - caso '1 + 2 + 3 + 4' (múltiplos termos com espaços)", () => {
    iguais(
      analisar("1 + 2 + 3 + 4", adição),
      {
        resultado: {
          parcela_1: { número: "1" },
          operador: "+",
          parcela_2: {
            parcela_1: { número: "2" },
            operador: "+",
            parcela_2: {
              parcela_1: { número: "3" },
              operador: "+",
              parcela_2: { número: "4" },
            },
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
