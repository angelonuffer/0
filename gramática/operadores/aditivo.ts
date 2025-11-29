#!/usr/bin/env -S deno run --allow-read

import analisar from "../../analisador/analisar.ts";
import iguais from "../../analisador/iguais.ts";
import { número } from "../tipos_literais/número.ts";
import { dígito } from "../tipos_literais/dígito.ts";
import { espaço } from "../espaço.ts";
import { termo } from "./termo.ts";
import TestRunner from "../../analisador/runner.ts";

// aditivo: handles addition and subtraction (lower precedence operations)
// Uses termo as operands (which itself handles * and /)

export const aditivo: Record<string, unknown> = {};

// operadorAditivo: either + or -
const operadorAditivo = {
  alternativa: ["+", "-"],
};

// adiçãoOuSubtração: term with + or - operator
const adiçãoOuSubtração: Record<string, unknown> = {};

Object.assign(adiçãoOuSubtração, {
  sequência: [
    {
      chave: "parcela_1",
      gramática: termo,
    },
    espaço,
    {
      chave: "operador",
      gramática: operadorAditivo,
    },
    espaço,
    {
      chave: "parcela_2",
      gramática: aditivo,
    },
  ],
});

// aditivo: try additive expression first (longest match), then fall back to termo
Object.assign(aditivo, {
  alternativa: [
    adiçãoOuSubtração,
    termo,
  ],
});

export function runTests(): { passed: number; failed: number } {
  const tr = new TestRunner();

  tr.run("aditivo.ts - caso '5' (número simples)", () => {
    iguais(
      analisar("5", aditivo),
      { resultado: { número: "5" }, resto: "" }
    );
  });

  tr.run("aditivo.ts - caso '5+3' (adição simples)", () => {
    iguais(
      analisar("5+3", aditivo),
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

  tr.run("aditivo.ts - caso '5-3' (subtração simples)", () => {
    iguais(
      analisar("5-3", aditivo),
      {
        resultado: {
          parcela_1: { número: "5" },
          operador: "-",
          parcela_2: { número: "3" },
        },
        resto: "",
      }
    );
  });

  tr.run("aditivo.ts - caso '3+4-5' (adição e subtração misturadas)", () => {
    iguais(
      analisar("3+4-5", aditivo),
      {
        resultado: {
          parcela_1: { número: "3" },
          operador: "+",
          parcela_2: {
            parcela_1: { número: "4" },
            operador: "-",
            parcela_2: { número: "5" },
          },
        },
        resto: "",
      }
    );
  });

  tr.run("aditivo.ts - caso '3 - 4 + 5' (subtração e adição com espaços)", () => {
    iguais(
      analisar("3 - 4 + 5", aditivo),
      {
        resultado: {
          parcela_1: { número: "3" },
          operador: "-",
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

  // Tests for operator precedence
  tr.run("aditivo.ts - caso '2 + 3 * 4' (precedência: multiplicação primeiro)", () => {
    // Should parse as 2 + (3 * 4) because * has higher precedence
    iguais(
      analisar("2 + 3 * 4", aditivo),
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

  tr.run("aditivo.ts - caso '2 * 3 + 4' (precedência: multiplicação primeiro)", () => {
    // Should parse as (2 * 3) + 4 because * has higher precedence
    iguais(
      analisar("2 * 3 + 4", aditivo),
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

  tr.run("aditivo.ts - caso '10 / 2 - 3' (precedência: divisão primeiro)", () => {
    // Should parse as (10 / 2) - 3 because / has higher precedence
    iguais(
      analisar("10 / 2 - 3", aditivo),
      {
        resultado: {
          parcela_1: {
            fator_1: { número: "10" },
            operador: "/",
            fator_2: { número: "2" },
          },
          operador: "-",
          parcela_2: { número: "3" },
        },
        resto: "",
      }
    );
  });

  tr.run("aditivo.ts - caso '2 + 3 * 4 - 5' (múltiplos operadores com precedência)", () => {
    // Should parse as 2 + (3 * 4) - 5
    iguais(
      analisar("2 + 3 * 4 - 5", aditivo),
      {
        resultado: {
          parcela_1: { número: "2" },
          operador: "+",
          parcela_2: {
            parcela_1: {
              fator_1: { número: "3" },
              operador: "*",
              fator_2: { número: "4" },
            },
            operador: "-",
            parcela_2: { número: "5" },
          },
        },
        resto: "",
      }
    );
  });

  tr.run("aditivo.ts - caso '2 * 3 + 4 * 5' (múltiplas multiplicações)", () => {
    // Should parse as (2 * 3) + (4 * 5)
    iguais(
      analisar("2 * 3 + 4 * 5", aditivo),
      {
        resultado: {
          parcela_1: {
            fator_1: { número: "2" },
            operador: "*",
            fator_2: { número: "3" },
          },
          operador: "+",
          parcela_2: {
            fator_1: { número: "4" },
            operador: "*",
            fator_2: { número: "5" },
          },
        },
        resto: "",
      }
    );
  });

  tr.run("aditivo.ts - caso inválido '+3' (falta parcela_1)", () => {
    iguais(
      analisar("+3", aditivo),
      {
        esperava: [
          dígito,
        ],
        resto: "+3",
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
