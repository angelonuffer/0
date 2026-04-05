const testes_txt = `

🔍 42 + 5

🎯 47

🔍 -5

🎯 -5

🔍 -3 + 8

🎯 5

🔍 10 + -2

🎯 8

🔍 -0

🎯 -0

🔍 -1 * -1

🎯 1

🔍 -10 >= -5

🎯 0

🔍 -5 == -5

🎯 1

🔍 8 - 4

🎯 4

🔍 3 * 4

🎯 12

🔍 8 / 2

🎯 4

🔍 2 + 3 * 4

🎯 14

🔍 10 - 6 / 2

🎯 7

🔍 8 / 2 + 3 * 2

🎯 10

🔍 (2 + 3) * 4

🎯 20

🔍 10 - (6 / 2)

🎯 7

🔍 @ "./testar/pergunta.txt"

🎯 O que você obtém se multiplicar seis por nove?

🔍 caminho = "./testar/pergunta.txt"
   @ caminho

🎯 O que você obtém se multiplicar seis por nove?

🔍 (@ "./testar/pergunta.txt")[.]

🎯 46

🔍 2 > 8

🎯 0

🔍 8 > 2

🎯 1

🔍 8 > 8

🎯 0

🔍 2 < 8

🎯 1

🔍 8 < 2

🎯 0

🔍 8 < 8

🎯 0

🔍 2 == 8

🎯 0

🔍 8 == 2

🎯 0

🔍 8 == 8

🎯 1

🔍 2 != 8

🎯 1

🔍 8 != 2

🎯 1

🔍 8 != 8

🎯 0

🔍 2 >= 8

🎯 0

🔍 8 >= 2

🎯 1

🔍 8 >= 8

🎯 1

🔍 2 <= 8

🎯 1

🔍 8 <= 2

🎯 0

🔍 8 <= 8

🎯 1

🔍 0 & 0

🎯 0

🔍 0 & 1

🎯 0

🔍 1 & 0

🎯 0

🔍 1 & 2

🎯 2

🔍 0 | 0

🎯 0

🔍 0 | 1

🎯 1

🔍 1 | 0

🎯 1

🔍 1 | 2

🎯 1

🔍 ! 0

🎯 1

🔍 ! 1

🎯 0

🔍 a = 5
   b = 8
   a + b

🎯 13

🔍 função1 = y => y == 42
   função2 = _ => (
      x = 42
      função1 = y => y == 42
      x = 42
      função1(x)
   )
   função2 = _ => (
      x = 42
      função1 = y => y == 42
      x = 42
      função1(x)
   )
   função2(0)

🎯 1

🔍 a = 2
   b = 3
   a + b

🎯 5

🔍 x = 4
   y = 5
   x * y

🎯 20

🔍 valor = 10
   valor + 5

🎯 15

🔍 a = 2
   b = 3
   c = 4
   a + b * c

🎯 14

🔍 a = 5
   b = a * 2
   b + 3

🎯 13

🔍 a = 2
   b = (
      x = 3
      y = 4
      x + y
   )
   a * b

🎯 14

🔍 x = 5
   y = (
      a = 2
      b = 3
      a + b
   )
   x + y

🎯 10

🔍 x = 2
   y = 3
   x + y

🎯 5

🔍 nome = "Alice"
   sobrenome = "Silva"
   nome + " " + sobrenome

🎯 Alice Silva

🔍 a = 0
   b = 1
   a | b

🎯 1

🔍 [ 2, 3 ][0]

🎯 2

🔍 [ 2, 3 ][1]

🎯 3

🔍 a = 4
   a + 5

🎯 9

🔍 [[1, 2], [3, 4]][0][1]

🎯 2

🔍 [ 1, 2, 3 ][.]

🎯 3

🔍 [ 1, 2, 3, 4, 5 ][1:3]

🎯 [ 2, 3 ]

🔍 [ 10, 20, 30 ][1 + 1]

🎯 30

🔍 x = 7
   x * 2

🎯 14

🔍 lista = [1, 2, 3]
   lista * ","

🎯 1,2,3

🔍 lista = ["a", "b", "c"]
   lista * "-"

🎯 a-b-c

🔍 nome = "Maria"
   pessoa = { nome }
   pessoa.nome

🎯 Maria

🔍 quadrado = x => x * x
   quadrado(5)

🎯 25

🔍 iniciais = [
      _ => "Bulbasaur",
      _ => "Charmander",
      _ => "Squirtle"
   ]
   iniciais[1](0)

🎯 Charmander

🔍 soma = { a, b } => a + b
   soma({
      a: 2,
      b: 3,
   })

🎯 5

🔍 calc = { x, y, z } => x + y * z
   calc({
      x: 2,
      y: 3,
      z: 4,
   })

🎯 14

🔍 subtrair = { a, b } => a - b
   subtrair({
      b: 5,
      a: 10,
   })

🎯 5

🔍 juntar = { primeiro, segundo } => [primeiro, " ", segundo] * ""
   juntar({
      primeiro: "Hello",
      segundo: "World",
   })

🎯 Hello World

🔍 multiplicar_e_somar = { x, y, base } => x * y + base
   multiplicar_e_somar({
      x: 5,
      y: 3,
      base: 10,
   })

🎯 25

🔍 obter_valor = { valor } => valor
   obter_valor({
      valor: 42,
   })

🎯 42

🔍 abs = x =>
      | x < 0 = 0 - x
      | x
   abs(-5)

🎯 5

🔍 sign = x =>
      | x > 0 = 1
      | x < 0 = 0 - 1
      | 0
   sign(5)

🎯 1

🔍 sign = x =>
      | x > 0 = 1
      | x < 0 = 0 - 1
      | 0
   sign(-3)

🎯 -1

🔍 sign = x =>
      | x > 0 = 1
      | x < 0 = 0 - 1
      | 0
   sign(0)

🎯 0

🔍 classify = x =>
      | x > 10 = "grande"
      | x > 5 = "médio"
      | "pequeno"
   classify(15)

🎯 grande

🔍 classify = x =>
      | x > 10 = "grande"
      | x > 5 = "médio"
      | "pequeno"
   classify(7)

🎯 médio

🔍 classify = x =>
      | x > 10 = "grande"
      | x > 5 = "médio"
      | "pequeno"
   classify(3)

🎯 pequeno

🔍 abs = x => | x < 0 = 0 - x | x
   abs(-5)

🎯 5

🔍 max = { a, b } => | a > b = a | b
   max({ a: 10, b: 5 })

🎯 10

🔍 max = { a, b } => | a > b = a | b
   max({ a: 3, b: 8 })

🎯 8

🔍 a = x => x * 2
   a(5)

🎯 10

🔍 funcs = [
      _ => x => x + 1
      _ => x => x * 2
   ]
   funcs[0]()(3)  // Should work: funcs[0] returns function, then () calls it, then (3) calls result

🎯 4

🔍 soma = n1 => n2 => n1 + n2
   soma(2)(3)

🎯 5

🔍 soma3 = a => b => c => a + b + c
   soma3(1)(2)(3)

🎯 6

🔍 soma4 = a => b => c => d => a + b + c + d
   soma4(1)(2)(3)(4)

🎯 10

🔍 multiplica = x => y => x * y
   dobro = multiplica(2)
   dobro(5)

🎯 10

🔍 soma = n1 => n2 => n1 + n2
   funcs = [soma]
   funcs[0](10)(20)

🎯 30

🔍 cria_objeto = x => y => { a: x, b: y }
   obj = cria_objeto(5)(10)
   obj.a + obj.b

🎯 15

🔍 a = 2 // comentário
   b = 3 // outro comentário
   a + b

🎯 5

🔍 testar.resposta == 42

🎯 1

🔍 = 5

⚠️ testar.js
   1:1
   = 5
   ^

🔍 // Teste de erro de referência: função não definida
   funcaoNaoDefinida(42)

⚠️ testar.js
   2:1
   funcaoNaoDefinida(42)
   ^^^^^^^^^^^^^^^^^

🔍 // Teste: pilha de chamadas com aplicações
   a = b => c + 1
   d = e => a(e)
   d(2)

⚠️ testar.js
   4:1
   d(2)
   ^
   3:10
   d = e => a(e)
            ^
   2:10
   a = b => c + 1
            ^

🔍 // Teste de erro de referência: acesso a campo em objeto não definido
   objetoNaoDefinido["campo"]

⚠️ testar.js
   2:1
   objetoNaoDefinido["campo"]
   ^^^^^^^^^^^^^^^^^

🔍 // Teste de erro de referência: uso de variável antes da definição
   // Na expressão principal (última linha), a variável não está definida
   x + 10

⚠️ testar.js
   3:1
   x + 10
   ^

🔍 // Teste de erro de referência: variável não definida
   variavelNaoDefinida

⚠️ testar.js
   2:1
   variavelNaoDefinida
   ^^^^^^^^^^^^^^^^^^^

🔍 // Teste de erro de sintaxe: chave não fechada dentro de outro objeto
   obj = {
      a: 1,
      b: {
         x: 1,
         y: 2,
      c: 3,
   }

⚠️ testar.js
   8:2
   }
    ^

🔍 // Teste de erro de sintaxe: colchete não fechado dentro de objeto
   obj = {
      a: 1,
      b: [
         1,
         2,
   }

⚠️ testar.js
   7:1
   }
   ^

🔍 // Teste de erro de sintaxe: chave não fechada
   obj = { a: 1 b: 2

⚠️ testar.js
   2:18
   obj = { a: 1 b: 2
                    ^

🔍 // Teste de erro de sintaxe: caractere inesperado dentro de chaves
   obj = {
      a: 1,
      b: 2,
      $
   }

⚠️ testar.js
   5:4
      $
      ^

🔍 // Teste de erro de sintaxe: dois pontos inesperados dentro de chaves
   obj = {
      a: 1,
      : 2
   }

⚠️ testar.js
   4:4
      : 2
      ^

🔍 // Teste de erro de sintaxe: chave não fechada em múltiplas linhas
   obj = {
      a: 1,
      b: 2,

⚠️ testar.js
   4:9
      b: 2,
           ^

🔍 // Teste de erro de sintaxe: colchete não fechado
   x = [1, 2, 3

⚠️ testar.js
   2:15
   x = [1, 2, 3
               ^

🔍 // Teste de erro de sintaxe: colchete de fechamento sem abertura
   x = ]

⚠️ testar.js
   2:5
   x = ]
       ^

🔍 // Teste de erro de sintaxe: colchete não fechado em múltiplas linhas
   lista = [
      1,
      2,
      3

⚠️ testar.js
   5:5
      3
       ^

🔍 // Teste de erro de sintaxe: parêntese não fechado
   f = x => (x + 1

⚠️ testar.js
   2:16
   f = x => (x + 1
                  ^

🔍 // Teste de erro de sintaxe: parêntese de fechamento inesperado
   lista = [
      1
      2
   )

⚠️ testar.js
   5:1
   )
   ^

🔍 // Teste de erro de sintaxe: parêntese não fechado em múltiplas linhas
   result = (
      1 + 2 +
      3 + 4

⚠️ testar.js
   4:9
      3 + 4
           ^

🔍 // Teste de erro de sintaxe: string não fechada
   texto = "Olá mundo

⚠️ testar.js
   2:19
   texto = "Olá mundo
                     ^

🔍 [1:100]

⚠️ testar.js
   1:3
   [1:100]
     ^

🔍 2147483647 + 1

🎯 2147483648

🔍 - -5

⚠️ testar.js
   1:3
   - -5
     ^

🔍 1 + 2 * 3 - 4 / 2

🎯 5

🔍 ! ! 0

🎯 0

🔍 0 & (1 / 0)

🎯 0

`;

const testes = [];

function parseTestes(texto) {
   const resultados = [];
   const lines = texto.split(/\r?\n/);
   let i = 0;
   let tipo = "nenhum";
   let bloco_entrada = "";
   let bloco_saida = "";
   let bloco_erro = "";
   while (i < lines.length) {
      if (lines[i].trim() === "") {
         i++;
         continue;
      }
      if (lines[i].startsWith("🔍 ")) {
         if (bloco_entrada.trim() || bloco_saida.trim() || bloco_erro.trim()) {
            resultados.push({
               entrada: bloco_entrada.trim(),
               saída: bloco_saida.trim() || undefined,
               erro: bloco_erro.trim() || undefined,
            });
         }
         tipo = "entrada";
         bloco_entrada = lines[i].slice(3);
         bloco_saida = "";
         bloco_erro = "";
      }
      if (lines[i].startsWith("🎯 ")) {
         tipo = "saída";
         bloco_saida = lines[i].slice(3);
      }
      if (lines[i].startsWith("⚠️ ")) {
         tipo = "erro";
         bloco_erro = lines[i].slice(3);
      }
      if (lines[i].startsWith("   ")) {
         if (tipo === "entrada") {
            bloco_entrada += "\n" + lines[i].slice(3);
         }
         if (tipo === "saída") {
            bloco_saida += "\n" + lines[i].slice(3);
         }
         if (tipo === "erro") {
            bloco_erro += "\n" + lines[i].slice(3);
         }
      }
      i++;
   }
   // push last block if present
   if (bloco_entrada.trim() || bloco_saida.trim() || bloco_erro.trim()) {
      resultados.push({
         entrada: bloco_entrada.trim(),
         saída: bloco_saida.trim() || undefined,
         erro: bloco_erro.trim() || undefined,
      });
   }
   return resultados;
}

// Add tests parsed from the `testes_txt` variable
testes.push(...parseTestes(testes_txt));

import fs from "fs";

const exemplos = fs.readFileSync("LEIAME.md", "utf-8");
const regex = /```0([\s\S]*?)```/g;
let match;
while ((match = regex.exec(exemplos)) !== null) {
   const código = match[1].trim();
   testes.push(...parseTestes(código));
}

import { interpretar } from "./0.js";

let passaram = 0;
let total = testes.length;
const exiba_todos = process.argv.includes('--exiba-todos');
const verifique_restantes = process.argv.includes('--verifique-restantes');
let primeira_falha_exibida = false;

for (const teste of testes) {
   const { saída, erro } = await interpretar({
      entrada: teste.entrada,
      arquivo: teste.arquivo || "testar.js",
   });

   const saída_inesperada =
      teste.saída !== undefined &&
      (saída === undefined || saída.trim() !== teste.saída.trim());
   const erro_inesperado =
      teste.erro !== undefined &&
      (erro === undefined || erro.trim() !== teste.erro.trim());

   if (saída_inesperada || erro_inesperado) {
      const shouldPrint = exiba_todos || !primeira_falha_exibida;
      if (shouldPrint) {
         let output = `🔍 ${teste.entrada.trim().replaceAll('\n', '\n   ')}\n\n`;
         if (teste.saída !== undefined) {
            output += `🎯 ${teste.saída.trim().replaceAll('\n', '\n   ')}\n\n`;
         }
         if (teste.erro !== undefined) {
            output += `⚠️ ${teste.erro.trim().replaceAll('\n', '\n   ')}\n\n`;
         }
         if (saída !== "") {
            output += `🚨 ${saída.trim().replaceAll('\n', '\n   ')}\n\n`;
         }
         if (erro !== "") {
            output += `💥 ${erro.trim().replaceAll('\n', '\n   ')}\n\n`;
         }
         process.stderr.write(output);
         primeira_falha_exibida = true;
      }
      if (!exiba_todos) {
         if (!verifique_restantes) break;
      }
   } else {
      passaram++;
   }
}

process.stdout.write(`✅ ${passaram}/${total}\n`);

if (passaram !== total) process.exit(1);