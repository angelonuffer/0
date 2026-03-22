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
    "entrada": "@ \"./arquivos_teste/saudacao.txt\"",
    "saída": "Olá mundo"
  }, {
    "entrada": "@ \"./arquivos_teste/numero.txt\"",
    "saída": "123"
  }, {
    "entrada": "@ \"./arquivos_teste/utf8.txt\"",
    "saída": "conteúdo UTF-8: café ☕"
  }, {
    "entrada": `(
  caminho = "./arquivos_teste/saudacao.txt"
  @ caminho
)`,
    "saída": "Olá mundo"
  }, {
    "entrada": "(@ \"./arquivos_teste/numero.txt\")[.]",
    "saída": "3"
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
  lista = [1 2 3]
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
    "entrada": "(% [1 2 3])[1]",
    "saída": "2"
  }, {
    "entrada": `(
  obj = {nome: "João" idade: 30}
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
      [ nome " " sobrenome ] * ""
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
    "entrada": "(importação_módulo_valor_helper.0)",
    "saída": "5",
    "arquivo": "testes/sintaxe/importação_módulo_valor.0"
  }, {
    "entrada": `(
      valor = importação_módulo_valor_helper.0
      valor
    )`,
    "saída": "5",
    "arquivo": "testes/sintaxe/importação_módulo_valor.0"
  }, {
    "entrada": `(
      função = importação_módulo_valor_função.0
      função({ a: 10 b: 20 })
    )`,
    "saída": "30",
    "arquivo": "testes/sintaxe/importação_módulo_valor.0"
  }, {
    "entrada": "(importação_módulo_valor_função.0)({ a: 7 b: 3 })",
    "saída": "10",
    "arquivo": "testes/sintaxe/importação_módulo_valor.0"
  }, {
    "entrada": "[1 2 3]",
    "saída": "[ 1, 2, 3 ]"
  }, {
    "entrada": "[]",
    "saída": "[]"
  }, {
    "entrada": "[\"a\" \"b\" \"c\"]",
    "saída": "[ 'a', 'b', 'c' ]"
  }, {
    "entrada": "[\"a\" \"b\" \"c\"]",
    "saída": "[ 'a', 'b', 'c' ]"
  }, {
    "entrada": "[\"1\" \"2\" \"3\"]",
    "saída": "[ '1', '2', '3' ]"
  }, {
    "entrada": "[65 66 67]",
    "saída": "[ 65, 66, 67 ]"
  }, {
    "entrada": "[\"Alice\" \"Bob\" \"Charlie\"]",
    "saída": "[ 'Alice', 'Bob', 'Charlie' ]"
  }, {
    "entrada": "[\"Alice\" \"Bob\" \"Charlie\"][1]",
    "saída": "Bob"
  }, {
    "entrada": "[1 2 3][.]",
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
          nome: "João"
          idade: 30
          profissao: "Desenvolvedor"
        }
        objeto_com_chaves.nome
      )`,
    "saída": "João"
  }, {
    "entrada": `(
        objeto_com_chaves = {
          nome: "João"
          idade: 30
          profissao: "Desenvolvedor"
        }
        objeto_com_chaves.idade
      )`,
    "saída": "30"
  }, {
    "entrada": `(
        objeto_com_chaves = {
          nome: "João"
          idade: 30
          profissao: "Desenvolvedor"
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
    "entrada": "[ 2 3 ][0]",
    "saída": "2"
  }, {
    "entrada": "[ 2 3 ][1]",
    "saída": "3"
  }, {
    "entrada": `(
      a = 4
      a + 5
    )`,
    "saída": "9"
  }, {
    "entrada": `(
      a = 4
      a + 5
    )`,
    "saída": "9"
  }, {
    "entrada": "[[1 2] [3 4]][0][1]",
    "saída": "2"
  }, {
    "entrada": "[ 1 2 3 ][.]",
    "saída": "3"
  }, {
    "entrada": "[ 1 2 3 4 5 ][1:3]",
    "saída": "[ 2, 3 ]"
  }, {
    "entrada": "[ 10 20 30 ][1 + 1]",
    "saída": "30"
  }, {
    "entrada": `(
      x = 7
      x * 2
    )`,
    "saída": "14"
  }, {
    "entrada": `(
      lista = [1 2 3]
      lista * ","
    )`,
    "saída": "1,2,3"
  }, {
    "entrada": `(
      lista = ["a" "b" "c"]
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
        _ => "Bulbasaur"
        _ => "Charmander"
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
      juntar = { primeiro segundo } => [primeiro " " segundo] * ""
      juntar({
        primeiro: "Hello"
        segundo: "World"
      })
    )`,
    "saída": "Hello World"
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
      cria_objeto = x => y => { a: x b: y }
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
    "entrada": "a.b.c == 42",
    "saída": "1",
    "arquivo": "testes/teste_aninhado.0"
  }, {
    "entrada": "(util_teste.soma(1)(2) == 3) & (aritmética_teste.soma(1)(2) == 3) & (util_teste = { soma: a => b => a + 100 } util_teste.soma(1)(2) == 101)",
    "saída": "1",
    "arquivo": "testes/módulos_locais.0"
  }, {
    "entrada": "= 5",
    "arquivo": "operador_inválido.0",
    "erro": `operador_inválido.0
1:1
= 5
^
Opções: {, h, ., (, [, 0-9, ", -, !, %, @`
  },
];

import { interpretar } from "./0.js";

let passaram = 0;
let total = 0;

for (const teste of testes) {
  total++;
  const { saída, erro } = await interpretar(teste.entrada, teste.arquivo || "0.teste.js");
  if (teste.erro !== undefined) {
    if (erro.trim() === teste.erro.trim()) {
      passaram++;
    } else {
      process.stderr.write(`🔍 ${teste.entrada.trim().replaceAll('\n', '\n   ')}

⚠️ ${teste.erro.trim().replaceAll('\n', '\n   ')}

🚨 ${erro.trim().replaceAll('\n', '\n   ')}

    `);
    }
  } else {
    if (saída.trim() === teste.saída.trim()) {
      passaram++;
    } else {
      process.stderr.write(`🔍 ${teste.entrada.trim().replaceAll('\n', '\n   ')}

🎯 ${teste.saída.trim().replaceAll('\n', '\n   ')}

🚨 ${saída.trim().replaceAll('\n', '\n   ')}

`);
    }
  }
}

process.stdout.write(`✓ ${passaram}/${total}\n`);

if (passaram !== total) process.exit(1);

await import("./testes/0.js");