#!/usr/bin/env -S deno run --allow-read

export const dígito = {
  faixa: {
    de: "0",
    até: "9",
  }
};

if (import.meta.main) {
  console.log("dígito: OK");
}
