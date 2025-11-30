#!/usr/bin/env -S deno run --allow-read

import analisar from "../../analisador/analisar.ts";
import iguais from "../../analisador/iguais.ts";
import { número } from "../tipos_literais/número.ts";
import { dígito } from "../tipos_literais/dígito.ts";
import { espaço } from "../espaço.ts";
import TestRunner from "../../analisador/runner.ts";

// termo: handles multiplication and division (higher precedence operations)
// A termo is either a number or a multiplicative expression (number * termo or number / termo)

export const termo: Record<string, unknown> = {};

// operadorMultiplicativo: either * or /
const operadorMultiplicativo = {
  alternativa: ["*", "/"],
};

// multiplicaçãoOuDivisão: left-associative multiplicative expressions
const multiplicaçãoOuDivisão: Record<string, unknown> = {};

Object.assign(multiplicaçãoOuDivisão, {
  esquerda: {
    primeiro: número,
    espaço: espaço,
    operador: operadorMultiplicativo,
    segundo: número,
    keys: { left: "fator_1", op: "operador", right: "fator_2" },
  },
});

// termo: use left-associative multiplicative grammar (it also accepts single número)
Object.assign(termo, multiplicaçãoOuDivisão);

export function runTests(): { passed: number; failed: number } {
  const tr = new TestRunner();

  tr.run("termo.ts - caso '5' (número simples)", () => {
    iguais(
      analisar("5", termo),
      { resultado: { número: "5" }, resto: "" }
    );
  });

  tr.run("termo.ts - caso '5*3' (multiplicação)", () => {
    iguais(
      analisar("5*3", termo),
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

  tr.run("termo.ts - caso '6/3' (divisão)", () => {
    iguais(
      analisar("6/3", termo),
      {
        resultado: {
          fator_1: { número: "6" },
          operador: "/",
          fator_2: { número: "3" },
        },
        resto: "",
      }
    );
  });

  tr.run("termo.ts - caso '2*3*4' (múltiplas multiplicações)", () => {
    iguais(
      analisar("2*3*4", termo),
      {
        resultado: {
          fator_1: {
            fator_1: { número: "2" },
            operador: "*",
            fator_2: { número: "3" },
          },
          operador: "*",
          fator_2: { número: "4" },
        },
        resto: "",
      }
    );
  });

  tr.run("termo.ts - caso '24/4/2' (múltiplas divisões)", () => {
    iguais(
      analisar("24/4/2", termo),
      {
        resultado: {
          fator_1: {
            fator_1: { número: "24" },
            operador: "/",
            fator_2: { número: "4" },
          },
          operador: "/",
          fator_2: { número: "2" },
        },
        resto: "",
      }
    );
  });

  tr.run("termo.ts - caso '2*3/4' (multiplicação e divisão misturadas)", () => {
    iguais(
      analisar("2*3/4", termo),
      {
        resultado: {
          fator_1: {
            fator_1: { número: "2" },
            operador: "*",
            fator_2: { número: "3" },
          },
          operador: "/",
          fator_2: { número: "4" },
        },
        resto: "",
      }
    );
  });

  tr.run("termo.ts - caso '10 / 2 * 5' (divisão e multiplicação com espaços)", () => {
    iguais(
      analisar("10 / 2 * 5", termo),
      {
        resultado: {
          fator_1: {
            fator_1: { número: "10" },
            operador: "/",
            fator_2: { número: "2" },
          },
          operador: "*",
          fator_2: { número: "5" },
        },
        resto: "",
      }
    );
  });

  tr.run("termo.ts - caso inválido '*3' (falta fator_1)", () => {
    iguais(
      analisar("*3", termo),
      {
        esperava: [
          dígito,
        ],
        resto: "*3",
      }
    );
  });

  tr.run("termo.ts - caso '5*' (parsed as número with resto)", () => {
    // When multiplicative expression fails (missing fator_2), it falls back to número
    iguais(
      analisar("5*", termo),
      {
        resultado: { número: "5" },
        resto: "*",
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
