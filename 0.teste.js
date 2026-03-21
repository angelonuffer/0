const testes = [
  {
    "entrada": "1 + 1",
    "saída": "2"
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