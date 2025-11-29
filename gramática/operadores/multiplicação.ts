#!/usr/bin/env -S deno run --allow-read

import analisar from "../../analisador/analisar.ts";
import iguais from "../../analisador/iguais.ts";
import { número } from "../tipos_literais/número.ts";
import { espaço } from "../espaço.ts";
import TestRunner from "../../analisador/runner.ts";

export const multiplicação = {
  sequência: [
    {
      chave: "fator_1",
      gramática: número,
    },
    espaço,
    "*",
    espaço,
    {
      chave: "fator_2",
      gramática: número,
    },
  ],
};
export function runTests(): number {
  const tr = new TestRunner();

  tr.run("multiplicação.ts - caso '5*3'", () => {
    iguais(
      analisar("5*3", multiplicação),
      {
        resultado: {
          fator_1: "5",
          fator_2: "3",
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
          número,
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
