const testes = [
  {
    "entrada": "42 + 5",
    "saída": "47"
  }, {
    "entrada": "-5",
    "saída": "-5"
  }, {
    "entrada": "-3 + 8",
    "saída": "5"
  }, {
    "entrada": "10 + -2",
    "saída": "8"
  }, {
    "entrada": "-0",
    "saída": "-0"
  }, {
    "entrada": "-1 * -1",
    "saída": "1"
  }, {
    "entrada": "-10 >= -5",
    "saída": "0"
  }, {
    "entrada": "-5 == -5",
    "saída": "1"
  }, {
    "entrada": "8 - 4",
    "saída": "4"
  }, {
    "entrada": "3 * 4",
    "saída": "12"
  }, {
    "entrada": "8 / 2",
    "saída": "4"
  }, {
    "entrada": "2 + 3 * 4",
    "saída": "14"
  }, {
    "entrada": "10 - 6 / 2",
    "saída": "7"
  }, {
    "entrada": "8 / 2 + 3 * 2",
    "saída": "10"
  }, {
    "entrada": "(2 + 3) * 4",
    "saída": "20"
  }, {
    "entrada": "10 - (6 / 2)",
    "saída": "7"
  }, {
    "entrada": "@ \"./fontes/pergunta.txt\"",
    "saída": "O que você obtém se multiplicar seis por nove?"
  }, {
    "entrada": `(
  caminho = "./fontes/pergunta.txt"
  @ caminho
)`,
    "saída": "O que você obtém se multiplicar seis por nove?"
  }, {
    "entrada": "(@ \"./fontes/pergunta.txt\")[.]",
    "saída": "46"
  }, {
    "entrada": "2 > 8",
    "saída": "0"
  }, {
    "entrada": "8 > 2",
    "saída": "1"
  }, {
    "entrada": "8 > 8",
    "saída": "0"
  }, {
    "entrada": "2 < 8",
    "saída": "1"
  }, {
    "entrada": "8 < 2",
    "saída": "0"
  }, {
    "entrada": "8 < 8",
    "saída": "0"
  }, {
    "entrada": "2 == 8",
    "saída": "0"
  }, {
    "entrada": "8 == 2",
    "saída": "0"
  }, {
    "entrada": "8 == 8",
    "saída": "1"
  }, {
    "entrada": "2 != 8",
    "saída": "1"
  }, {
    "entrada": "8 != 2",
    "saída": "1"
  }, {
    "entrada": "8 != 8",
    "saída": "0"
  }, {
    "entrada": "2 >= 8",
    "saída": "0"
  }, {
    "entrada": "8 >= 2",
    "saída": "1"
  }, {
    "entrada": "8 >= 8",
    "saída": "1"
  }, {
    "entrada": "2 <= 8",
    "saída": "1"
  }, {
    "entrada": "8 <= 2",
    "saída": "0"
  }, {
    "entrada": "8 <= 8",
    "saída": "1"
  }, {
    "entrada": "% 5",
    "saída": "5"
  }, {
    "entrada": "% 2 + 3",
    "saída": "5"
  }, {
    "entrada": `(
  a = 10
  % a * 2
)`,
    "saída": "20"
  }, {
    "entrada": `(
  lista = [1, 2, 3]
  % lista[1]
)`,
    "saída": "2"
  }, {
    "entrada": `(
  x = 5
  y = 3
  % x + % y
)`,
    "saída": "8"
  }, {
    "entrada": "% \"teste\"",
    "saída": "teste"
  }, {
    "entrada": "(% [1, 2, 3])[1]",
    "saída": "2"
  }, {
    "entrada": `(
  obj = {nome: "João", idade: 30}
  (% obj).nome
)`,
    "saída": "João"
  }, {
    "entrada": "0 & 0",
    "saída": "0"
  }, {
    "entrada": "0 & 1",
    "saída": "0"
  }, {
    "entrada": "1 & 0",
    "saída": "0"
  }, {
    "entrada": "1 & 2",
    "saída": "2"
  }, {
    "entrada": "0 | 0",
    "saída": "0"
  }, {
    "entrada": "0 | 1",
    "saída": "1"
  }, {
    "entrada": "1 | 0",
    "saída": "1"
  }, {
    "entrada": "1 | 2",
    "saída": "1"
  }, {
    "entrada": "! 0",
    "saída": "1"
  }, {
    "entrada": "! 1",
    "saída": "0"
  }, {
    "entrada": `(
      a = 5
      b = 8
      a + b
    )`,
    "saída": "13"
  }, {
    "entrada": `(
      função1 = y => y == 42
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
    )`,
    "saída": "1"
  }, {
    "entrada": `(
      a = 2
      b = 3
      a + b
    )`,
    "saída": "5"
  }, {
    "entrada": `(
      x = 4
      y = 5
      x * y
    )`,
    "saída": "20"
  }, {
    "entrada": `(
      valor = 10
      valor + 5
    )`,
    "saída": "15"
  }, {
    "entrada": `(
      a = 2
      b = 3
      c = 4
      a + b * c
    )`,
    "saída": "14"
  }, {
    "entrada": `(
      a = 5
      b = a * 2
      b + 3
    )`,
    "saída": "13"
  }, {
    "entrada": `(
      a = 2
      b = (
        x = 3
        y = 4
        x + y
      )
      a * b
    )`,
    "saída": "14"
  }, {
    "entrada": `(
      a = 5
      b = 10
      a < b
    )`,
    "saída": "1"
  }, {
    "entrada": `(
      nome = "João"
      sobrenome = "Silva"
      [ nome, " ", sobrenome ] * ""
    )`,
    "saída": "João Silva"
  }, {
    "entrada": "(2 + 3)",
    "saída": "5"
  }, {
    "entrada": "((2 + 3) * 4)",
    "saída": "20"
  }, {
    "entrada": `(
      a = 2
      (a + 3) * 4
    )`,
    "saída": "20"
  }, {
    "entrada": `(
      x = 4
      y = 5
      z = 10
      x * y + z
    )`,
    "saída": "30"
  }, {
    "entrada": `(
      x = 10
      resultado = (
        x = 6
        x * 2
      )
      x
    )`,
    "saída": "10"
  }, {
    "entrada": `(
      nome_teste = "João"
      sobrenome_teste = "Silva"
      nome_teste + " " + sobrenome_teste
    )`,
    "saída": "João Silva"
  }, {
    "entrada": "(./fontes/resposta.0)",
    "saída": "42",
  }, {
    "entrada": `(
      valor = ./fontes/resposta.0
      valor
    )`,
    "saída": "42",
  }, {
    "entrada": "[1, 2, 3]",
    "saída": "[ 1, 2, 3 ]"
  }, {
    "entrada": "[]",
    "saída": "[]"
  }, {
    "entrada": "[\"a\", \"b\", \"c\"]",
    "saída": "[ 'a', 'b', 'c' ]"
  }, {
    "entrada": "[\"1\", \"2\", \"3\"]",
    "saída": "[ '1', '2', '3' ]"
  }, {
    "entrada": "[65, 66, 67]",
    "saída": "[ 65, 66, 67 ]"
  }, {
    "entrada": "[\"Alice\", \"Bob\", \"Charlie\"]",
    "saída": "[ 'Alice', 'Bob', 'Charlie' ]"
  }, {
    "entrada": "[\"Alice\", \"Bob\", \"Charlie\"][1]",
    "saída": "Bob"
  }, {
    "entrada": "[1, 2, 3][.]",
    "saída": "3"
  }, {
    "entrada": `(
      a = 2 /* comentário em bloco */
      b = 3 /* outro comentário */
      a + b
    )`,
    "saída": "5"
  }, {
    "entrada": `(
      /* Comentário no início */
      x = 10
      y = 20
      /* Comentário no meio */
      x + y
    )`,
    "saída": "30"
  }, {
    "entrada": `(
      /* Comentário
         em múltiplas
         linhas */
      m = 100
      m * 2
    )`,
    "saída": "200"
  }, {
    "entrada": "\"apple,banana,cherry\"",
    "saída": "apple,banana,cherry"
  }, {
    "entrada": `(
        frase = "João Silva Santos"
        nomes = (frase = "João Silva Santos" frase / " ")
        nomes[0] // Primeiro nome
      )`,
    "saída": "João"
  }, {
    "entrada": "\"abc\"",
    "saída": "abc"
  }, {
    "entrada": "\"apple,banana,cherry\"",
    "saída": "apple,banana,cherry"
  }, {
    "entrada": "\"a,,b\"",
    "saída": "a,,b"
  }, {
    "entrada": "\"hello\"",
    "saída": "hello"
  }, {
    "entrada": "\"\"",
    "saída": ""
  }, {
    "entrada": "8",
    "saída": "8"
  }, {
    "entrada": "15",
    "saída": "15"
  }, {
    "entrada": `(
        objeto_com_chaves = {
          nome: "João",
          idade: 30,
          profissao: "Desenvolvedor",
        }
        objeto_com_chaves.nome
      )`,
    "saída": "João"
  }, {
    "entrada": `(
        objeto_com_chaves = {
          nome: "João",
          idade: 30,
          profissao: "Desenvolvedor",
        }
        objeto_com_chaves.idade
      )`,
    "saída": "30"
  }, {
    "entrada": `(
        objeto_com_chaves = {
          nome: "João",
          idade: 30,
          profissao: "Desenvolvedor",
        }
        objeto_com_chaves.profissao
      )`,
    "saída": "Desenvolvedor"
  }, {
    "entrada": `(
        obj = { "someKey": "test" }
        obj.someKey
      )`,
    "saída": "test"
  }, {
    "entrada": `(
      a = 5
      b = a + 2
      b
    )`,
    "saída": "7"
  }, {
    "entrada": `(
      x = 10
      y = x * 2
      y
    )`,
    "saída": "20"
  }, {
    "entrada": `(
      nome = "João"
      sobrenome = "Silva"
      nome + " " + sobrenome
    )`,
    "saída": "João Silva"
  }, {
    "entrada": `(
      a = 2
      b = (
        x = 3
        y = 4
        x + y
      )
      a * b
    )`,
    "saída": "14"
  }, {
    "entrada": `(
      x = 5
      y = (
        a = 2
        b = 3
        a + b
      )
      x + y
    )`,
    "saída": "10"
  }, {
    "entrada": `(
      x = 2
      y = 3
      x + y
    )`,
    "saída": "5"
  }, {
    "entrada": `(
      nome = "Alice"
      sobrenome = "Silva"
      nome + " " + sobrenome
    )`,
    "saída": "Alice Silva"
  }, {
    "entrada": `(
      a = 0
      b = 1
      a | b
    )`,
    "saída": "1"
  }, {
    "entrada": "[ 2, 3 ][0]",
    "saída": "2"
  }, {
    "entrada": "[ 2, 3 ][1]",
    "saída": "3"
  }, {
    "entrada": `(
      a = 4
      a + 5
    )`,
    "saída": "9"
  }, {
    "entrada": "[[1, 2], [3, 4]][0][1]",
    "saída": "2"
  }, {
    "entrada": "[ 1, 2, 3 ][.]",
    "saída": "3"
  }, {
    "entrada": "[ 1, 2, 3, 4, 5 ][1:3]",
    "saída": "[ 2, 3 ]"
  }, {
    "entrada": "[ 10, 20, 30 ][1 + 1]",
    "saída": "30"
  }, {
    "entrada": `(
      x = 7
      x * 2
    )`,
    "saída": "14"
  }, {
    "entrada": `(
      lista = [1, 2, 3]
      lista * ","
    )`,
    "saída": "1,2,3"
  }, {
    "entrada": `(
      lista = ["a", "b", "c"]
      lista * "-"
    )`,
    "saída": "a-b-c"
  }, {
    "entrada": `(
        nome = "Maria"
        pessoa = { nome }
        pessoa.nome
      )`,
    "saída": "Maria"
  }, {
    "entrada": `(
      quadrado = x => x * x
      quadrado(5)
    )`,
    "saída": "25"
  }, {
    "entrada": `(
      iniciais = [
        _ => "Bulbasaur",
        _ => "Charmander",
        _ => "Squirtle"
      ]
      iniciais[1](0)
    )`,
    "saída": "Charmander"
  }, {
    "entrada": `(
      soma = { a b } => a + b
      soma({
        a: 2
        b: 3
      })
    )`,
    "saída": "5"
  }, {
    "entrada": `(
      calc = { x y z } => x + y * z
      calc({
        x: 2
        y: 3
        z: 4
      })
    )`,
    "saída": "14"
  }, {
    "entrada": `(
      subtrair = { a b } => a - b
      subtrair({
        b: 5
        a: 10
      })
    )`,
    "saída": "5"
  }, {
    "entrada": `(
      juntar = { primeiro segundo } => [primeiro, " ", segundo] * ""
      juntar({
        primeiro: "Hello"
        segundo: "World"
      })
    )`,
    "saída": "Hello World"
  }, {
    "entrada": `(
      multiplicar_e_somar = { x y base } => x * y + base
      multiplicar_e_somar({
        x: 5
        y: 3
        base: 10
      })
    )`,
    "saída": "25"
  }, {
    "entrada": `(
      obter_valor = { valor } => valor
      obter_valor({
        valor: 42
      })
    )`,
    "saída": "42"
  }, {
    "entrada": `(
      abs = x =>
        | x < 0 = 0 - x
        | x
      abs(-5)
    )`,
    "saída": "5"
  }, {
    "entrada": `(
      sign = x =>
        | x > 0 = 1
        | x < 0 = 0 - 1
        | 0
      sign(5)
    )`,
    "saída": "1"
  }, {
    "entrada": `(
      sign = x =>
        | x > 0 = 1
        | x < 0 = 0 - 1
        | 0
      sign(-3)
    )`,
    "saída": "-1"
  }, {
    "entrada": `(
      sign = x =>
        | x > 0 = 1
        | x < 0 = 0 - 1
        | 0
      sign(0)
    )`,
    "saída": "0"
  }, {
    "entrada": `(
      classify = x =>
        | x > 10 = "grande"
        | x > 5 = "médio"
        | "pequeno"
      classify(15)
    )`,
    "saída": "grande"
  }, {
    "entrada": `(
      classify = x =>
        | x > 10 = "grande"
        | x > 5 = "médio"
        | "pequeno"
      classify(7)
    )`,
    "saída": "médio"
  }, {
    "entrada": `(
      classify = x =>
        | x > 10 = "grande"
        | x > 5 = "médio"
        | "pequeno"
      classify(3)
    )`,
    "saída": "pequeno"
  }, {
    "entrada": `(
      abs = x => | x < 0 = 0 - x | x
      abs(-5)
    )`,
    "saída": "5"
  }, {
    "entrada": `(
      max = { a b } => | a > b = a | b
      max({ a: 10 b: 5 })
    )`,
    "saída": "10"
  }, {
    "entrada": `(
      max = { a b } => | a > b = a | b
      max({ a: 3 b: 8 })
    )`,
    "saída": "8"
  }, {
    "entrada": `(
      a = x => x * 2
      a(5)
    )`,
    "saída": "10"
  }, {
    "entrada": `(
      funcs = [
        _ => x => x + 1
        _ => x => x * 2
      ]
      funcs[0]()(3)  // Should work: funcs[0] returns function, then () calls it, then (3) calls result
    )`,
    "saída": "4"
  }, {
    "entrada": `(
      soma = n1 => n2 => n1 + n2
      soma(2)(3)
    )`,
    "saída": "5"
  }, {
    "entrada": `(
      soma3 = a => b => c => a + b + c
      soma3(1)(2)(3)
    )`,
    "saída": "6"
  }, {
    "entrada": `(
      soma4 = a => b => c => d => a + b + c + d
      soma4(1)(2)(3)(4)
    )`,
    "saída": "10"
  }, {
    "entrada": `(
      multiplica = x => y => x * y
      dobro = multiplica(2)
      dobro(5)
    )`,
    "saída": "10"
  }, {
    "entrada": `(
      soma = n1 => n2 => n1 + n2
      funcs = [soma]
      funcs[0](10)(20)
    )`,
    "saída": "30"
  }, {
    "entrada": `(
      cria_objeto = x => y => { a: x, b: y }
      obj = cria_objeto(5)(10)
      obj.a + obj.b
    )`,
    "saída": "15"
  }, {
    "entrada": `(
      a = 2 // comentário
      b = 3 // outro comentário
      a + b
    )`,
    "saída": "5"
  }, {
    "entrada": "fontes.resposta == 42",
    "saída": "1",
  }, {
    "entrada": "= 5",
    "arquivo": "operador_inválido.0",
    "erro": `operador_inválido.0
1:1
= 5
^`
  }, {
    "entrada": `// Teste de erro de referência: função não definida
funcaoNaoDefinida(42)`,
    "arquivo": "função_indefinida.0",
    "erro": `função_indefinida.0
2:1
funcaoNaoDefinida(42)
^^^^^^^^^^^^^^^^^`
  }, {
    "entrada": `// Teste: pilha de chamadas com aplicações
a = b => c + 1

d = e => a(e)

d(2)`,
    "arquivo": "pilha_aplicacoes.0",
    "erro": `pilha_aplicacoes.0
6:1
d(2)
^
4:10
d = e => a(e)
         ^
2:10
a = b => c + 1
         ^`
  }, {
    "entrada": `// Teste de erro de referência: acesso a campo em objeto não definido
objetoNaoDefinido["campo"]`,
    "arquivo": "propriedade_indefinida.0",
    "erro": `propriedade_indefinida.0
2:1
objetoNaoDefinido["campo"]
^^^^^^^^^^^^^^^^^`
  }, {
    "entrada": `// Teste de erro de referência: uso de variável antes da definição
// Na expressão principal (última linha), a variável não está definida
x + 10`,
    "arquivo": "uso_antes_definição.0",
    "erro": `uso_antes_definição.0
3:1
x + 10
^`
  }, {
    "entrada": `// Teste de erro de referência: variável não definida
variavelNaoDefinida`,
    "arquivo": "variável_indefinida.0",
    "erro": `variável_indefinida.0
2:1
variavelNaoDefinida
^^^^^^^^^^^^^^^^^^^`
  }, {
    "entrada": `// Teste de erro de sintaxe: chave não fechada dentro de outro objeto
obj = {
  a: 1
  b: {
    x: 1
    y: 2
  c: 3
}`,
    "arquivo": "aninhado_chave.0",
    "erro": `aninhado_chave.0
8:1
}
^`
  }, {
    "entrada": `// Teste de erro de sintaxe: colchete não fechado dentro de objeto
obj = {
  a: 1
  b: [
    1
    2
}`,
    "arquivo": "aninhado_colchete.0",
    "erro": `aninhado_colchete.0
7:1
}
^`
  }, {
    "entrada": `// Teste de erro de sintaxe: chave não fechada
obj = { a: 1 b: 2`,
    "arquivo": "chave.0",
    "erro": `chave.0
2:18
obj = { a: 1 b: 2
                 ^`
  }, {
    "entrada": `// Teste de erro de sintaxe: caractere inesperado dentro de chaves
obj = {
  a: 1
  b: 2
  $
}`,
    "arquivo": "chave_caractere_inesperado.0",
    "erro": `chave_caractere_inesperado.0
5:3
  $
  ^`
  }, {
    "entrada": `// Teste de erro de sintaxe: dois pontos inesperados dentro de chaves
obj = {
  a: 1
  : 2
}`,
    "arquivo": "chave_dois_pontos.0",
    "erro": `chave_dois_pontos.0
4:3
  : 2
  ^`
  }, {
    "entrada": `// Teste de erro de sintaxe: chave não fechada em múltiplas linhas
obj = {
  a: 1
  b: 2`,
    "arquivo": "chave_multilinha.0",
    "erro": `chave_multilinha.0
4:7
  b: 2
      ^`
  }, {
    "entrada": `// Teste de erro de sintaxe: colchete não fechado
  x = [1, 2, 3`,
    "arquivo": "colchete.0",
    "erro": `colchete.0
2:15
  x = [1, 2, 3
              ^`
  }, {
    "entrada": `// Teste de erro de sintaxe: colchete de fechamento sem abertura
x = ]`,
    "arquivo": "colchete_fechamento.0",
    "erro": `colchete_fechamento.0
2:5
x = ]
    ^`
  }, {
    "entrada": `// Teste de erro de sintaxe: colchete não fechado em múltiplas linhas
lista = [
  1
  2
  3`,
    "arquivo": "colchete_multilinha.0",
    "erro": `colchete_multilinha.0
5:4
  3
   ^`
  }, {
    "entrada": `// Teste de erro de sintaxe: parêntese não fechado
f = x => (x + 1`,
    "arquivo": "parêntese.0",
    "erro": `parêntese.0
2:16
f = x => (x + 1
               ^`
  }, {
    "entrada": `// Teste de erro de sintaxe: parêntese de fechamento inesperado
lista = [
  1
  2
)
`,
    "arquivo": "parêntese_inesperado.0",
    "erro": `parêntese_inesperado.0
5:1
)
^`
  }, {
    "entrada": `// Teste de erro de sintaxe: parêntese não fechado em múltiplas linhas
result = (
  1 + 2 +
  3 + 4`,
    "arquivo": "parêntese_multilinha.0",
    "erro": `parêntese_multilinha.0
4:8
  3 + 4
       ^`
  }, {
    "entrada": `// Teste de erro de sintaxe: string não fechada
texto = "Olá mundo`,
    "arquivo": "string_não_fechada.0",
    "erro": `string_não_fechada.0
2:19
texto = "Olá mundo
                  ^`
  }, {
    "entrada": "% 0",
    "saída": "0"
  }, {
    "entrada": "[1, 2][5]",
    "saída": ""
  }, {
    "entrada": "[][-1]",
    "saída": ""
  }, {
    "entrada": "[1:100]",
    "erro": `0.teste.js
1:3
[1:100]
  ^`
  }, {
    "entrada": "2147483647 + 1",
    "saída": "2147483648"
  }, {
    "entrada": "- -5",
    "erro": `0.teste.js
1:3
- -5
  ^`
  }, {
    "entrada": "1 + 2 * 3 - 4 / 2",
    "saída": "5"
  }, {
    "entrada": "! ! 0",
    "saída": "0"
  }, {
    "entrada": "0 & (1 / 0)",
    "saída": "0"
  }
];

import fs from "fs";
import iguais from "./fontes/iguais.js";

const escopo = {
  iguais: ([ a, b ]) => iguais(a, b) ? 1 : 0,
}

const exemplos = fs.readFileSync("EXEMPLOS.md", "utf-8");
const regex = /```0([\s\S]*?)```/g;
let match;
while ((match = regex.exec(exemplos)) !== null) {
  const código = match[1].trim();
  testes.push({
    entrada: código,
    saída: "1",
    escopo,
    arquivo: "EXEMPLOS.md",
  });
}
// Run any `./fontes/*.teste.js` files first and aggregate results
const exiba_todos = process.argv.includes('--exiba-todos');
const verifique_restantes = process.argv.includes('--verifique-restantes');
let primeira_falha_exibida = false;

let adicionais_passaram = 0;
let adicionais_total = 0;
const fontesDir = "./fontes";
if (fs.existsSync(fontesDir)) {
  const arquivos = fs.readdirSync(fontesDir).filter(f => f.endsWith('.teste.js'));
  for (const f of arquivos) {
    try {
      const mod = await import(`./fontes/${f}`);
      const res = mod.default || mod;
      const { falhas = [], passaram: p = 0, total: t = 0 } = await res || {};
      if (falhas && falhas.length > 0) {
        const primeira = falhas[0];
        const teste = (primeira.teste || "").toString();
        const shouldPrint = exiba_todos || !primeira_falha_exibida;
        if (shouldPrint) {
          process.stderr.write(`📄 ./fontes/${f}\n\n🔍 ${teste.replaceAll('\n', '\n   ')}\n\n`)
          if (primeira.saída_esperada !== undefined) {
            process.stderr.write(`🎯 ${JSON.stringify(primeira.saída_esperada).replaceAll('\\n', '\\n   ')}\n\n🚨 ${JSON.stringify(primeira.saída_obtida)}\n\n`);
          } else if (primeira.erro_esperado !== undefined) {
            process.stderr.write(`💥 ${primeira.erro_esperado}\n\n🚨 ${primeira.erro_obtido}\n\n`);
          } else {
            process.stderr.write(`🚨 Falha: ${JSON.stringify(primeira)}\n\n`);
          }
          primeira_falha_exibida = true;
        }
      }
      adicionais_passaram += Number(p) || 0;
      adicionais_total += Number(t) || 0;
    } catch (e) {
      process.stderr.write(`Erro ao executar teste ${f}: ${String(e)}\n`);
    }
  }
}

import { interpretar } from "./0.js";

let passaram = adicionais_passaram;
let total = adicionais_total + testes.length;

// If a failure was printed from fontes and we should NOT verify remaining tests, skip main tests
if (primeira_falha_exibida && !exiba_todos && !verifique_restantes) {
  process.stdout.write(`✅ ${passaram}/${total}\n`);
  if (passaram !== total) process.exit(1);
}

for (const teste of testes) {
  const { saída, erro } = await interpretar({
    entrada: teste.entrada,
    arquivo: teste.arquivo || "0.teste.js",
    escopo: teste.escopo || {},
  });
  if (teste.erro !== undefined) {
    if (erro.trim() === teste.erro.trim()) {
      passaram++;
    } else {
        const shouldPrint = exiba_todos || !primeira_falha_exibida;
        if (shouldPrint) {
          process.stderr.write(`🔍 ${teste.entrada.trim().replaceAll('\n', '\n   ')}

💥 ${teste.erro.trim().replaceAll('\n', '\n   ')}

🚨 ${erro.trim().replaceAll('\n', '\n   ')}

`);
          primeira_falha_exibida = true;
        }
        if (!exiba_todos) {
          if (!verifique_restantes) break;
        }
    }
  } else {
    if (saída.trim() === teste.saída.trim()) {
      passaram++;
    } else {
        const shouldPrint = exiba_todos || !primeira_falha_exibida;
        if (shouldPrint) {
          process.stderr.write(`🔍 ${teste.entrada.trim().replaceAll('\n', '\n   ')}

🎯 ${teste.saída.trim().replaceAll('\n', '\n   ')}

🚨 ${saída.trim().replaceAll('\n', '\n   ')}

`);
          primeira_falha_exibida = true;
        }
        if (!exiba_todos) {
          if (!verifique_restantes) break;
        }
    }
  }
}

process.stdout.write(`✅ ${passaram}/${total}\n`);

if (passaram !== total) process.exit(1);