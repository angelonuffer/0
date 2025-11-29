#!/usr/bin/env -S deno run --allow-read

import analisar from "../analisador/analisar.ts";
import iguais from "../analisador/iguais.ts";
import { número } from "./tipos_literais/número.ts";
import { adição } from "./operadores/adição.ts";
import { subtração } from "./operadores/subtração.ts";
import { multiplicação } from "./operadores/multiplicação.ts";
import { divisão } from "./operadores/divisão.ts";
import TestRunner from "../analisador/runner.ts";

export const expressão = {
  alternativa: [adição, subtração, multiplicação, divisão, número],
};
export function runTests(): number {
  const tr = new TestRunner();

  tr.run("expressão.ts - caso '5+3'", () => {
    iguais(
      analisar("5+3", expressão),
      {
        resultado: {
          parcela_1: "5",
          parcela_2: "3",
        },
        resto: "",
      }
    );
  });

  tr.run("expressão.ts - caso '5'", () => {
    iguais(
      analisar("5", expressão),
      { resultado: "5", resto: "" }
    );
  });

  tr.run("expressão.ts - caso inválido '+'", () => {
    iguais(
      analisar("+", expressão),
      {
        esperava: [
          número,
        ],
        resto: "+",
      }
    );
  });

  tr.run("expressão.ts - caso inválido '' (string vazia)", () => {
    iguais(
      analisar("", expressão),
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
