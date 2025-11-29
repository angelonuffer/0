#!/usr/bin/env -S deno run --allow-read

import analisar from "../../analisador/analisar.ts";
import iguais from "../../analisador/iguais.ts";
import { número } from "../tipos_literais/número.ts";
import { espaço } from "../espaço.ts";
import TestRunner from "../../analisador/runner.ts";

export const subtração = {
  sequência: [
    {
      chave: "minuendo",
      gramática: número,
    },
    espaço,
    "-",
    espaço,
    {
      chave: "subtraendo",
      gramática: número,
    },
  ],
};
export function runTests(): number {
  const tr = new TestRunner();

  tr.run("subtração.ts - caso '5-3'", () => {
    iguais(
      analisar("5-3", subtração),
      {
        resultado: {
          minuendo: "5",
          subtraendo: "3",
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
          número,
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
