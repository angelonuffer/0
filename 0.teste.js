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
  {
    "entrada": "@ \"./arquivos_teste/saudacao.txt\"",
    "saída": "Olá mundo"
  },
  {
    "entrada": "@ \"./arquivos_teste/numero.txt\"",
    "saída": "123"
  },
  {
    "entrada": "@ \"./arquivos_teste/utf8.txt\"",
    "saída": "conteúdo UTF-8: café ☕"
  },
  {
    "entrada": "(\n  caminho = \"./arquivos_teste/saudacao.txt\"\n  @ caminho\n)",
    "saída": "Olá mundo"
  },
  {
    "entrada": "(@ \"./arquivos_teste/numero.txt\")[.]",
    "saída": "3"
  },
  {
    "entrada": "2 > 8",
    "saída": "0"
  },
  {
    "entrada": "8 > 2",
    "saída": "1"
  },
  {
    "entrada": "8 > 8",
    "saída": "0"
  },
  {
    "entrada": "2 < 8",
    "saída": "1"
  },
  {
    "entrada": "8 < 2",
    "saída": "0"
  },
  {
    "entrada": "8 < 8",
    "saída": "0"
  },
  {
    "entrada": "2 == 8",
    "saída": "0"
  },
  {
    "entrada": "8 == 2",
    "saída": "0"
  },
  {
    "entrada": "8 == 8",
    "saída": "1"
  },
  {
    "entrada": "2 != 8",
    "saída": "1"
  },
  {
    "entrada": "8 != 2",
    "saída": "1"
  },
  {
    "entrada": "8 != 8",
    "saída": "0"
  },
  {
    "entrada": "2 >= 8",
    "saída": "0"
  },
  {
    "entrada": "8 >= 2",
    "saída": "1"
  },
  {
    "entrada": "8 >= 8",
    "saída": "1"
  },
  {
    "entrada": "2 <= 8",
    "saída": "1"
  },
  {
    "entrada": "8 <= 2",
    "saída": "0"
  },
  {
    "entrada": "8 <= 8",
    "saída": "1"
  },
  {
    "entrada": "% 5",
    "saída": "5"
  },
  {
    "entrada": "% 2 + 3",
    "saída": "5"
  },
  {
    "entrada": "(\n  a = 10\n  % a * 2\n)",
    "saída": "20"
  },
  {
    "entrada": "(\n  lista = [1 2 3]\n  % lista[1]\n)",
    "saída": "2"
  },
  {
    "entrada": "(\n  x = 5\n  y = 3\n  % x + % y\n)",
    "saída": "8"
  },
  {
    "entrada": "% \"teste\"",
    "saída": "teste"
  },
  {
    "entrada": "(% [1 2 3])[1]",
    "saída": "2"
  },
  {
    "entrada": "(\n  obj = {nome: \"João\" idade: 30}\n  (% obj).nome\n)",
    "saída": "João"
  },
  {
    "entrada": "0 & 0",
    "saída": "0"
  },
  {
    "entrada": "0 & 1",
    "saída": "0"
  },
  {
    "entrada": "1 & 0",
    "saída": "0"
  },
  {
    "entrada": "1 & 2",
    "saída": "2"
  },
  {
    "entrada": "0 | 0",
    "saída": "0"
  },
  {
    "entrada": "0 | 1",
    "saída": "1"
  },
  {
    "entrada": "1 | 0",
    "saída": "1"
  },
  {
    "entrada": "1 | 2",
    "saída": "1"
  },
  {
    "entrada": "! 0",
    "saída": "1"
  },
  {
    "entrada": "! 1",
    "saída": "0"
  }
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