#!/usr/bin/env -S deno run --allow-read

import analisar from "../../analisador/analisar.ts";
import iguais from "../../analisador/iguais.ts";
import TestRunner from "../../analisador/runner.ts";

export const texto = {
  sequência: [
    '"',
    {
      chave: "texto",
      gramática: {
        repetição: {
          negação: '"',
        },
      },
    },
    '"',
  ],
};
export function runTests(): number {
  const tr = new TestRunner();

  tr.run("texto.ts - caso '\"olá\"'", () => {
    iguais(
      analisar('"olá"', texto),
      {
        resultado: { texto: "olá" },
        resto: "",
      }
    );
  });

  tr.run("texto.ts - caso '\"\"' (string vazia)", () => {
    iguais(
      analisar('""', texto),
      {
        resultado: { texto: "" },
        resto: "",
      }
    );
  });

  tr.run("texto.ts - caso inválido 'olá' (sem aspas)", () => {
    iguais(
      analisar("olá", texto),
      {
        esperava: [
          '"',
        ],
        resto: "olá",
      }
    );
  });

  tr.run("texto.ts - caso inválido '' (string vazia)", () => {
    iguais(
      analisar("", texto),
      {
        esperava: [
          '"',
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
