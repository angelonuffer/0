#!/usr/bin/env -S deno run --allow-read

import analisar from "../../analisador/analisar.ts";
import iguais from "../../analisador/iguais.ts";
import TestRunner from "../../analisador/runner.ts";
import { dígito } from "./dígito.ts";

export const número = {
  sequência: [
    {
      chave: "número",
      gramática: {
        sequência: [
          dígito,
          { repetição: dígito },
        ],
      },
    }
  ]
};
export function runTests(): number {
  const tr = new TestRunner();

  tr.run("número.ts - caso '5'", () => {
    iguais(
      analisar("5", número),
      {
        resultado: { número: "5" },
        resto: "",
      }
    );
  });

  tr.run("número.ts - caso inválido 'a'", () => {
    iguais(
      analisar("a", número),
      {
        esperava: [
          dígito,
        ],
        resto: "a",
      }
    );
  });

  tr.run("número.ts - caso inválido '' (string vazia)", () => {
    iguais(
      analisar("", número),
      {
        esperava: [
          dígito,
        ],
        resto: "",
      }
    );
  });

  tr.run("número.ts - caso múltiplos dígitos '123'", () => {
    iguais(
      analisar("123", número),
      {
        resultado: { número: "123" },
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
