#!/usr/bin/env -S deno run --allow-read

import analisar from "../../analisador/analisar.ts";
import iguais from "../../analisador/iguais.ts";
import { número } from "../tipos_literais/número.ts";
import TestRunner from "../../analisador/runner.ts";

export const adição = {
  sequência: [
    {
      chave: "parcela_1",
      gramática: número,
    },
    "+",
    {
      chave: "parcela_2",
      gramática: número,
    },
  ],
};
export function runTests(): number {
  const tr = new TestRunner();

  tr.run("adição.ts - caso '5+3'", () => {
    iguais(
      analisar("5+3", adição),
      {
        resultado: {
          parcela_1: "5",
          parcela_2: "3",
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
          número,
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
