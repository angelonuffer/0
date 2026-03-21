const testes = [
  {
    "entrada": "42 + 5",
    "saída": "47"
  },
  {
    "entrada": "-5",
    "saída": "-5"
  },
  {
    "entrada": "-3 + 8",
    "saída": "5"
  },
  {
    "entrada": "10 + -2",
    "saída": "8"
  },
  {
    "entrada": "-0",
    "saída": "-0"
  },
  {
    "entrada": "-1 * -1",
    "saída": "1"
  },
  {
    "entrada": "-10 >= -5",
    "saída": "0"
  },
  {
    "entrada": "-5 == -5",
    "saída": "1"
  },
  {
    "entrada": "8 - 4",
    "saída": "4"
  },
  {
    "entrada": "3 * 4",
    "saída": "12"
  },
  {
    "entrada": "8 / 2",
    "saída": "4"
  },
  {
    "entrada": "2 + 3 * 4",
    "saída": "14"
  },
  {
    "entrada": "10 - 6 / 2",
    "saída": "7"
  },
  {
    "entrada": "8 / 2 + 3 * 2",
    "saída": "10"
  },
  {
    "entrada": "(2 + 3) * 4",
    "saída": "20"
  },
  {
    "entrada": "10 - (6 / 2)",
    "saída": "7"
  },
];

import { interpretar } from "./0.js";

let passaram = 0;
let total = 0;

for (const teste of testes) {
  total++;
  const { saída, } = await interpretar(teste.entrada);
  if (saída.trim() === teste.saída.trim()) {
    passaram++;
  } else {
    process.stderr.write(`🔍 ${teste.entrada.trim().replaceAll('\n', '\n   ')}

📝 ${teste.saída.trim().replaceAll('\n', '\n   ')}

🚨 ${saída.trim().replaceAll('\n', '\n   ')}

`);
  }
}

process.stdout.write(`✓ ${passaram}/${total}\n`);

if (passaram !== total) process.exit(1);

await import("./testes/0.js");