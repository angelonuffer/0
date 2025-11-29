#!/usr/bin/env -S deno run --allow-read

import analisar from "../../analisador/analisar.ts";
import iguais from "../../analisador/iguais.ts";
import { número } from "../tipos_literais/número.ts";
import { espaço } from "../espaço.ts";
import TestRunner from "../../analisador/runner.ts";

export const divisão = {
  sequência: [
    {
      chave: "dividendo",
      gramática: número,
    },
    espaço,
    "/",
    espaço,
    {
      chave: "divisor",
      gramática: número,
    },
  ],
};
export function runTests(): number {
  const tr = new TestRunner();

  tr.run("divisão.ts - caso '6/3'", () => {
    iguais(
      analisar("6/3", divisão),
      {
        resultado: {
          dividendo: "6",
          divisor: "3",
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
          número,
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
          número,
        ],
        resto: "",
      }
    );
  });

  if (tr.getFailed() > 0) {
    tr.throwIfFailed();
  }

  console.log("Testes: OK");
  return tr.getPassed();
}

if (import.meta.main) {
  runTests();
}
