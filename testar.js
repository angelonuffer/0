const testes_txt = `

entrada:
  1
saída esperada:
  1

entrada:
   1
saída esperada:
  1

entrada:
  1 // comentário
saída esperada:
  1

entrada:
  +
erro esperado:
  ⛔ "_" | "!" | "(" | /[0-9]/ | /[a-z]/ | /[A-Z]/
  📄 testar.js
  👉 1: +
        ^ 1

entrada:
  42 + 5
saída esperada:
  47

entrada:
  -5
saída esperada:
  -5

entrada:
  -3 + 8
saída esperada:
  5

entrada:
  10 + -2
saída esperada:
  8

entrada:
  -0
saída esperada:
  0

entrada:
  -1 * -1
saída esperada:
  1

entrada:
  8 - 4
saída esperada:
  4

entrada:
  3 * 4
saída esperada:
  12

entrada:
  8 / 2
saída esperada:
  4

entrada:
  2147483647 + 1
saída esperada:
  2147483648

entrada:
  2 + 3 * 4
saída esperada:
  14

entrada:
  10 - 6 / 2
saída esperada:
  7

entrada:
  8 / 2 + 3 * 2
saída esperada:
  10

entrada:
  (2 + 3) * 4
saída esperada:
  20

entrada:
  10 - (6 / 2)
saída esperada:
  7

entrada:
  1 + 2 * 3 - 4 / 2
saída esperada:
  5

entrada:
  2 > 8
saída esperada:
  0

entrada:
  8 > 2
saída esperada:
  1

entrada:
  8 > 8
saída esperada:
  0

entrada:
  2 < 8
saída esperada:
  1

entrada:
  8 < 2
saída esperada:
  0

entrada:
  8 < 8
saída esperada:
  0

entrada:
  2 == 8
saída esperada:
  0

entrada:
  8 == 2
saída esperada:
  0

entrada:
  8 == 8
saída esperada:
  1

entrada:
  -5 == -5
saída esperada:
  1

entrada:
  2 != 8
saída esperada:
  1

entrada:
  8 != 2
saída esperada:
  1

entrada:
  8 != 8
saída esperada:
  0

entrada:
  -10 >= -5
saída esperada:
  0

entrada:
  2 >= 8
saída esperada:
  0

entrada:
  8 >= 2
saída esperada:
  1

entrada:
  8 >= 8
saída esperada:
  1

entrada:
  2 <= 8
saída esperada:
  1

entrada:
  8 <= 2
saída esperada:
  0

entrada:
  8 <= 8
saída esperada:
  1

entrada:
  0 && 0
saída esperada:
  0

entrada:
  0 && 1
saída esperada:
  0

entrada:
  1 && 0
saída esperada:
  0

entrada:
  1 && 2
saída esperada:
  2

entrada:
  0 || 0
saída esperada:
  0

entrada:
  0 || 1
saída esperada:
  1

entrada:
  1 || 0
saída esperada:
  1

entrada:
  1 || 2
saída esperada:
  1

entrada:
  ! 0
saída esperada:
  1

entrada:
  ! 1
saída esperada:
  0

entrada:
  ! ! 0
saída esperada:
  0

entrada:
  0 && (1 / 0)
saída esperada:
  0

entrada:
  a = 5
  b = 8
  2 + a + b
saída esperada:
  15

entrada:
  a = 5
  b = 8
  a + b
saída esperada:
  13

entrada:
  a = 2
  b = 3
  a + b
saída esperada:
  5

entrada:
  x = 4
  y = 5
  x * y
saída esperada:
  20

entrada:
  valor = 10
  valor + 5
saída esperada:
  15

entrada:
  a = 2
  b = 3
  c = 4
  a + b * c
saída esperada:
  14

entrada:
  a = 5
  b = a * 2
  b + 3
saída esperada:
  13

entrada:
  a = 2
  b = (
    x = 3
    y = 4
    x + y
  )
  a * b
saída esperada:
  14

entrada:
  x = 5
  y = (
    a = 2
    b = 3
    a + b
  )
  x + y
saída esperada:
  10

entrada:
  x = 2
  y = 3
  x + y
saída esperada:
  5

entrada:
  a = 4
  a + 5
saída esperada:
  9

entrada:
  x = 7
  x * 2
saída esperada:
  14

entrada:
  lista = [1, 2, 3]
  lista * ","
saída esperada:
  1,2,3

entrada:
  lista = ["a", "b", "c"]
  lista * "-"
saída esperada:
  a-b-c

entrada:
  [ 2, 3 ] 0
saída esperada:
  2

entrada:
  [ 2, 3 ] 1
saída esperada:
  3

entrada:
  [[1, 2], [3, 4]] 0 1
saída esperada:
  2

entrada:
  |[ 1, 2, 3 ]|
saída esperada:
  3

entrada:
  |"abcdef"|
saída esperada:
  6

entrada:
  a = "abcd"
  |a|
saída esperada:
  4

entrada:
  [ 10, 20, 30 ] 1 + 1
saída esperada:
  30

entrada:
  nome = "Alice"
  sobrenome = "Silva"
  nome + " " + sobrenome
saída esperada:
  Alice Silva

entrada:
  obj = { a: 1 }
  obj.a
saída esperada:
  1

entrada:
  obj = { a: 1, b: 2 }
  obj.a + obj.b
saída esperada:
  3

entrada:
  obj = { nested: { x: 10 } }
  obj.nested.x
saída esperada:
  10

entrada:
  obj = { "chave-com-hifen": 5 }
  obj "chave-com-hifen"
saída esperada:
  5

entrada:
  pessoa = { nome: "João", sobrenome: "Pereira" }
  pessoa.nome + " " + pessoa.sobrenome
saída esperada:
  João Pereira

entrada:
  nome = "Maria"
  pessoa = { nome }
  pessoa.nome
saída esperada:
  Maria

entrada:
  juntar = { primeiro, segundo } => [primeiro, " ", segundo] * ""
  juntar({
    primeiro: "Hello",
    segundo: "World",
  })
saída esperada:
  Hello World

entrada:
  quadrado = x => x * x
  quadrado(5)
saída esperada:
  25

entrada:
  iniciais = [
    _ => "Bulbasaur",
    _ => "Charmander",
    _ => "Squirtle"
  ]
  iniciais[1](0)
saída esperada:
  Charmander

entrada:
  soma = { a, b } => a + b
  soma({
    a: 2,
    b: 3,
  })
saída esperada:
  5

entrada:
  calc = { x, y, z } => x + y * z
  calc({
    x: 2,
    y: 3,
    z: 4,
  })
saída esperada:
  14

entrada:
  subtrair = { a, b } => a - b
  subtrair({
    b: 5,
    a: 10,
  })
saída esperada:
  5

entrada:
  multiplicar_e_somar = { x, y, base } => x * y + base
  multiplicar_e_somar({
    x: 5,
    y: 3,
    base: 10,
  })
saída esperada:
  25

entrada:
  obter_valor = { valor } => valor
  obter_valor({
    valor: 42,
  })
saída esperada:
  42

entrada:
  abs = x =>
    | x < 0 = 0 - x
    | x
  abs(-5)
saída esperada:
  5

entrada:
  sign = x =>
    | x > 0 = 1
    | x < 0 = 0 - 1
    | 0
  sign(5)
saída esperada:
  1

entrada:
  sign = x =>
    | x > 0 = 1
    | x < 0 = 0 - 1
    | 0
  sign(-3)
saída esperada:
  -1

entrada:
  sign = x =>
    | x > 0 = 1
    | x < 0 = 0 - 1
    | 0
  sign(0)
saída esperada:
  0

entrada:
  classify = x =>
    | x > 10 = "grande"
    | x > 5 = "médio"
    | "pequeno"
  classify(15)
saída esperada:
  grande

entrada:
  classify = x =>
    | x > 10 = "grande"
    | x > 5 = "médio"
    | "pequeno"
  classify(7)
saída esperada:
  médio

entrada:
  classify = x =>
    | x > 10 = "grande"
    | x > 5 = "médio"
    | "pequeno"
  classify(3)
saída esperada:
  pequeno

entrada:
  abs = x => | x < 0 = 0 - x | x
  abs(-5)
saída esperada:
  5

entrada:
  max = { a, b } => | a > b = a | b
  max({ a: 10, b: 5 })
saída esperada:
  10

entrada:
  max = { a, b } => | a > b = a | b
  max({ a: 3, b: 8 })
saída esperada:
  8

entrada:
  a = x => x * 2
  a(5)
saída esperada:
  10

entrada:
  funcs = [
    _ => x => x + 1
    _ => x => x * 2
  ]
  funcs[0]()(3)  // Should work: funcs[0] returns function, then () calls it, then (3) calls result
saída esperada:
  4

entrada:
  soma = n1 => n2 => n1 + n2
  soma(2)(3)
saída esperada:
  5

entrada:
  soma3 = a => b => c => a + b + c
  soma3(1)(2)(3)
saída esperada:
  6

entrada:
  soma4 = a => b => c => d => a + b + c + d
  soma4(1)(2)(3)(4)
saída esperada:
  10

entrada:
  multiplica = x => y => x * y
  dobro = multiplica(2)
  dobro(5)
saída esperada:
  10

entrada:
  soma = n1 => n2 => n1 + n2
  funcs = [soma]
  funcs[0](10)(20)
saída esperada:
  30

entrada:
  cria_objeto = x => y => { a: x, b: y }
  obj = cria_objeto(5)(10)
  obj.a + obj.b
saída esperada:
  15

entrada:
  a = 2 // comentário
  b = 3 // outro comentário
  a + b
saída esperada:
  5

entrada:
  @ "./testar/pergunta.txt"
saída esperada:
  O que você obtém se multiplicar seis por nove?

entrada:
  caminho = "./testar/pergunta.txt"
  @ caminho
saída esperada:
  O que você obtém se multiplicar seis por nove?

entrada:
  (@ "./testar/pergunta.txt")[.]
saída esperada:
  46

entrada:
  testar.resposta == 42
saída esperada:
  1

entrada:
  = 5
erro esperado:
  testar.js
  1:1
  = 5
  ^

entrada:
  // Teste de erro de referência: função não definida
  funcaoNaoDefinida(42)
erro esperado:
  testar.js
  2:1
  funcaoNaoDefinida(42)
  ^^^^^^^^^^^^^^^^^

entrada:
  // Teste: pilha de chamadas com aplicações
  a = b => c + 1
  d = e => a(e)
  d(2)
erro esperado:
  testar.js
  4:1
  d(2)
  ^
  3:10
  d = e => a(e)
           ^
  2:10
  a = b => c + 1
           ^

entrada:
  // Teste de erro de referência: acesso a campo em objeto não definido
  objetoNaoDefinido["campo"]
erro esperado:
  testar.js
  2:1
  objetoNaoDefinido["campo"]
  ^^^^^^^^^^^^^^^^^

entrada:
  // Teste de erro de referência: uso de variável antes da definição
  // Na expressão principal (última linha), a variável não está definida
  x + 10
erro esperado:
  testar.js
  3:1
  x + 10
  ^

entrada:
  // Teste de erro de referência: variável não definida
  variavelNaoDefinida
erro esperado:
  testar.js
  2:1
  variavelNaoDefinida
  ^^^^^^^^^^^^^^^^^^^^

entrada:
  // Teste de erro de sintaxe: chave não fechada dentro de outro objeto
  obj = {
    a: 1,
    b: {
      x: 1,
      y: 2,
    c: 3,
  }
erro esperado:
  testar.js
  8:2
  }
  ^

entrada:
  // Teste de erro de sintaxe: colchete não fechado dentro de objeto
  obj = {
    a: 1,
    b: [
      1,
      2,
  }
erro esperado:
  testar.js
  7:1
  }
  ^

entrada:
  // Teste de erro de sintaxe: chave não fechada
  obj = { a: 1 b: 2
erro esperado:
  testar.js
  2:18
  obj = { a: 1 b: 2
                    ^

entrada:
  // Teste de erro de sintaxe: caractere inesperado dentro de chaves
  obj = {
    a: 1,
    b: 2,
    $
  }
erro esperado:
  testar.js
  5:4
    $
    ^

entrada:
  // Teste de erro de sintaxe: dois pontos inesperados dentro de chaves
  obj = {
    a: 1,
    : 2
  }
erro esperado:
  testar.js
  4:4
    : 2
    ^

entrada:
  // Teste de erro de sintaxe: chave não fechada em múltiplas linhas
  obj = {
    a: 1,
    b: 2,
erro esperado:
  testar.js
  4:9
    b: 2,
         ^

entrada:
  // Teste de erro de sintaxe: colchete não fechado
  x = [1, 2, 3
erro esperado:
  testar.js
  2:15
  x = [1, 2, 3
              ^

entrada:
  // Teste de erro de sintaxe: colchete de fechamento sem abertura
  x = ]
erro esperado:
  testar.js
  2:5
  x = ]
      ^

entrada:
  // Teste de erro de sintaxe: colchete não fechado em múltiplas linhas
  lista = [
    1,
    2,
    3
erro esperado:
  testar.js
  5:5
    3
     ^

entrada:
  // Teste de erro de sintaxe: parêntese não fechado
  f = x => (x + 1
erro esperado:
  testar.js
  2:16
  f = x => (x + 1
                 ^

entrada:
  // Teste de erro de sintaxe: parêntese de fechamento inesperado
  lista = [
    1
    2
  )
erro esperado:
  testar.js
  5:1
  )
  ^

entrada:
  // Teste de erro de sintaxe: parêntese não fechado em múltiplas linhas
  result = (
    1 + 2 +
    3 + 4
erro esperado:
  testar.js
  4:9
    3 + 4
         ^

entrada:
  // Teste de erro de sintaxe: string não fechada
  texto = "Olá mundo
erro esperado:
  testar.js
  2:19
  texto = "Olá mundo
                    ^

entrada:
  [1:100]
erro esperado:
  testar.js
  1:3
  [1:100]
    ^

entrada:
  - -5
erro esperado:
  testar.js
  1:3
  - -5
    ^

`;

function parseTestes(texto) {
   const resultados = [];
   const lines = texto.split(/\r?\n/);
   let i = 0;
   let tipo = "nenhum";
   let bloco_entrada = "";
   let bloco_saida = "";
   let bloco_erro = "";
   while (i < lines.length) {
      if (lines[i] === "") {
         i++;
         continue;
      }
      if (lines[i] === "entrada:") {
         if (bloco_entrada || bloco_saida || bloco_erro) {
            resultados.push({
               entrada: bloco_entrada,
               saída: bloco_saida,
               erro: bloco_erro,
            });
         }
         tipo = "entrada";
         bloco_entrada = "";
         bloco_saida = "";
         bloco_erro = "";
      }
      if (lines[i] === "saída esperada:") {
         tipo = "saída";
         bloco_saida = "";
      }
      if (lines[i] === "erro esperado:") {
         tipo = "erro";
         bloco_erro = "";
      }
      if (lines[i].startsWith("  ")) {
         if (tipo === "entrada") {
            if (bloco_entrada) bloco_entrada += "\n";
            bloco_entrada += lines[i].slice(2);
         }
         if (tipo === "saída") {
            if (bloco_saida) bloco_saida += "\n";
            bloco_saida += lines[i].slice(2);
         }
         if (tipo === "erro") {
            if (bloco_erro) bloco_erro += "\n";
            bloco_erro += lines[i].slice(2);
         }
      }
      i++;
   }
   // push last block if present
   if (bloco_entrada || bloco_saida || bloco_erro) {
      resultados.push({
         entrada: bloco_entrada,
         saída: bloco_saida || undefined,
         erro: bloco_erro || undefined,
      });
   }
   return resultados;
}

// Add tests parsed from the `testes_txt` variable
const testes = [];
testes.push(...parseTestes(testes_txt));

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

   const saída_inesperada = saída !== teste.saída;
   const erro_inesperado = erro !== teste.erro;

   if (saída_inesperada || erro_inesperado) {
      const shouldPrint = exiba_todos || !primeira_falha_exibida;
      if (shouldPrint) {
         let output = `entrada:\n  ${teste.entrada.replaceAll('\n', '\n  ')}\n`;
         if (teste.saída !== "") {
            output += `saída esperada:\n  ${teste.saída.replaceAll('\n', '\n  ')}\n`;
         }
         if (teste.erro !== "") {
            output += `erro esperado:\n  ${teste.erro.replaceAll('\n', '\n  ')}\n`;
         }
         if (saída !== "") {
            output += `saída:\n  ${saída.replaceAll('\n', '\n  ')}\n`;
         }
         if (erro !== "") {
            output += `erro:\n  ${erro.replaceAll('\n', '\n  ')}\n`;
         }
         process.stderr.write(output + "\n");
         primeira_falha_exibida = true;
      }
      if (!exiba_todos) {
         if (!verifique_restantes) break;
      }
   } else {
      passaram++;
   }
}

process.stdout.write(`passaram: ${passaram}/${total}\n`);

if (passaram !== total) process.exit(1);