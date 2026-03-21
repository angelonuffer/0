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
  }, {
    "entrada": "(\n      a = 5\n      b = 8\n      a + b\n    )",
    "saída": "13"
  },
  {
    "entrada": "(\n      função1 = y => y == 42\n      função2 = _ => (\n        x = 42\n        função1 = y => y == 42\n        x = 42\n        função1(x)\n      )\n      função2 = _ => (\n        x = 42\n        função1 = y => y == 42\n        x = 42\n        função1(x)\n      )\n      função2(0)\n    )",
    "saída": "1"
  },
  {
    "entrada": "(\n      a = 2\n      b = 3\n      a + b\n    )",
    "saída": "5"
  },
  {
    "entrada": "(\n      x = 4\n      y = 5\n      x * y\n    )",
    "saída": "20"
  },
  {
    "entrada": "(\n      valor = 10\n      valor + 5\n    )",
    "saída": "15"
  },
  {
    "entrada": "(\n      a = 2\n      b = 3\n      c = 4\n      a + b * c\n    )",
    "saída": "14"
  },
  {
    "entrada": "(\n      a = 5\n      b = a * 2\n      b + 3\n    )",
    "saída": "13"
  },
  {
    "entrada": "(\n      a = 2\n      b = (\n        x = 3\n        y = 4\n        x + y\n      )\n      a * b\n    )",
    "saída": "14"
  },
  {
    "entrada": "(\n      a = 5\n      b = 10\n      a < b\n    )",
    "saída": "1"
  },
  {
    "entrada": "(\n      nome = \"João\"\n      sobrenome = \"Silva\"\n      [ nome \" \" sobrenome ] * \"\"\n    )",
    "saída": "João Silva"
  },
  {
    "entrada": "(2 + 3)",
    "saída": "5"
  },
  {
    "entrada": "((2 + 3) * 4)",
    "saída": "20"
  },
  {
    "entrada": "(\n      a = 2\n      (a + 3) * 4\n    )",
    "saída": "20"
  },
  {
    "entrada": "(\n      x = 4\n      y = 5\n      z = 10\n      x * y + z\n    )",
    "saída": "30"
  },
  {
    "entrada": "(\n      x = 10\n      resultado = (\n        x = 6\n        x * 2\n      )\n      x\n    )",
    "saída": "10"
  },
  {
    "entrada": "(\n      nome_teste = \"João\"\n      sobrenome_teste = \"Silva\"\n      nome_teste + \" \" + sobrenome_teste\n    )",
    "saída": "João Silva"
  },
  {
    "entrada": "(importação_módulo_valor_helper.0)",
    "saída": "5",
    "arquivo": "testes/sintaxe/importação_módulo_valor.0"
  },
  {
    "entrada": "(\n      valor = importação_módulo_valor_helper.0\n      valor\n    )",
    "saída": "5",
    "arquivo": "testes/sintaxe/importação_módulo_valor.0"
  },
  {
    "entrada": "(\n      função = importação_módulo_valor_função.0\n      função({ a: 10 b: 20 })\n    )",
    "saída": "30",
    "arquivo": "testes/sintaxe/importação_módulo_valor.0"
  },
  {
    "entrada": "(importação_módulo_valor_função.0)({ a: 7 b: 3 })",
    "saída": "10",
    "arquivo": "testes/sintaxe/importação_módulo_valor.0"
  },
  {
    "entrada": "[1 2 3]",
    "saída": "[ 1, 2, 3 ]"
  },
  {
    "entrada": "[]",
    "saída": "[]"
  },
  {
    "entrada": "[\"a\" \"b\" \"c\"]",
    "saída": "[ 'a', 'b', 'c' ]"
  },
  {
    "entrada": "[\"a\" \"b\" \"c\"]",
    "saída": "[ 'a', 'b', 'c' ]"
  },
  {
    "entrada": "[\"1\" \"2\" \"3\"]",
    "saída": "[ '1', '2', '3' ]"
  },
  {
    "entrada": "[65 66 67]",
    "saída": "[ 65, 66, 67 ]"
  },
  {
    "entrada": "[\"Alice\" \"Bob\" \"Charlie\"]",
    "saída": "[ 'Alice', 'Bob', 'Charlie' ]"
  },
  {
    "entrada": "[\"Alice\" \"Bob\" \"Charlie\"][1]",
    "saída": "Bob"
  },
  {
    "entrada": "[1 2 3][.]",
    "saída": "3"
  },
  {
    "entrada": "(\n      a = 2 /* comentário em bloco */\n      b = 3 /* outro comentário */\n      a + b\n    )",
    "saída": "5"
  },
  {
    "entrada": "(\n      /* Comentário no início */\n      x = 10\n      y = 20\n      /* Comentário no meio */\n      x + y\n    )",
    "saída": "30"
  },
  {
    "entrada": "(\n      /* Comentário\n         em múltiplas\n         linhas */\n      m = 100\n      m * 2\n    )",
    "saída": "200"
  },
  {
    "entrada": "\"apple,banana,cherry\"",
    "saída": "apple,banana,cherry"
  },
  {
    "entrada": "(\n        frase = \"João Silva Santos\"\n        nomes = (frase = \"João Silva Santos\" frase / \" \")\n        nomes[0] // Primeiro nome\n      )",
    "saída": "João"
  },
  {
    "entrada": "\"abc\"",
    "saída": "abc"
  },
  {
    "entrada": "\"apple,banana,cherry\"",
    "saída": "apple,banana,cherry"
  },
  {
    "entrada": "\"a,,b\"",
    "saída": "a,,b"
  },
  {
    "entrada": "\"hello\"",
    "saída": "hello"
  },
  {
    "entrada": "\"\"",
    "saída": ""
  },
  {
    "entrada": "8",
    "saída": "8"
  },
  {
    "entrada": "15",
    "saída": "15"
  },
  {
    "entrada": "(\n        objeto_com_chaves = {\n          nome: \"João\"\n          idade: 30\n          profissao: \"Desenvolvedor\"\n        }\n        objeto_com_chaves.nome\n      )",
    "saída": "João"
  },
  {
    "entrada": "(\n        objeto_com_chaves = {\n          nome: \"João\"\n          idade: 30\n          profissao: \"Desenvolvedor\"\n        }\n        objeto_com_chaves.idade\n      )",
    "saída": "30"
  },
  {
    "entrada": "(\n        objeto_com_chaves = {\n          nome: \"João\"\n          idade: 30\n          profissao: \"Desenvolvedor\"\n        }\n        objeto_com_chaves.profissao\n      )",
    "saída": "Desenvolvedor"
  },
  {
    "entrada": "(\n        obj = { \"someKey\": \"test\" }\n        obj.someKey\n      )",
    "saída": "test"
  },
  {
    "entrada": "(\n      a = 5\n      b = a + 2\n      b\n    )",
    "saída": "7"
  },
  {
    "entrada": "(\n      x = 10\n      y = x * 2\n      y\n    )",
    "saída": "20"
  },
  {
    "entrada": "(\n      nome = \"João\"\n      sobrenome = \"Silva\"\n      nome + \" \" + sobrenome\n    )",
    "saída": "João Silva"
  },
  {
    "entrada": "(\n      a = 2\n      b = (\n        x = 3\n        y = 4\n        x + y\n      )\n      a * b\n    )",
    "saída": "14"
  },
  {
    "entrada": "(\n      x = 5\n      y = (\n        a = 2\n        b = 3\n        a + b\n      )\n      x + y\n    )",
    "saída": "10"
  },
  {
    "entrada": "(\n      x = 2\n      y = 3\n      x + y\n    )",
    "saída": "5"
  },
  {
    "entrada": "(\n      nome = \"Alice\"\n      sobrenome = \"Silva\"\n      nome + \" \" + sobrenome\n    )",
    "saída": "Alice Silva"
  },
  {
    "entrada": "(\n      a = 0\n      b = 1\n      a | b\n    )",
    "saída": "1"
  },
  {
    "entrada": "[ 2 3 ][0]",
    "saída": "2"
  },
  {
    "entrada": "[ 2 3 ][1]",
    "saída": "3"
  },
  {
    "entrada": "(\n      a = 4\n      a + 5\n    )",
    "saída": "9"
  },
  {
    "entrada": "(\n      a = 4\n      a + 5\n    )",
    "saída": "9"
  },
  {
    "entrada": "[[1 2] [3 4]][0][1]",
    "saída": "2"
  },
  {
    "entrada": "[ 1 2 3 ][.]",
    "saída": "3"
  },
  {
    "entrada": "[ 1 2 3 4 5 ][1:3]",
    "saída": "[ 2, 3 ]"
  },
  {
    "entrada": "[ 10 20 30 ][1 + 1]",
    "saída": "30"
  },
  {
    "entrada": "(\n      x = 7\n      x * 2\n    )",
    "saída": "14"
  },
  {
    "entrada": "(\n      lista = [1 2 3]\n      lista * \",\"\n    )",
    "saída": "1,2,3"
  },
  {
    "entrada": "(\n      lista = [\"a\" \"b\" \"c\"]\n      lista * \"-\"\n    )",
    "saída": "a-b-c"
  },
  {
    "entrada": "(\n        nome = \"Maria\"\n        pessoa = { nome }\n        pessoa.nome\n      )",
    "saída": "Maria"
  },
  {
    "entrada": "(\n      quadrado = x => x * x\n      quadrado(5)\n    )",
    "saída": "25"
  },
  {
    "entrada": "(\n      iniciais = [\n        _ => \"Bulbasaur\"\n        _ => \"Charmander\"\n        _ => \"Squirtle\"\n      ]\n      iniciais[1](0)\n    )",
    "saída": "Charmander"
  },
  {
    "entrada": "(\n      soma = { a b } => a + b\n      soma({\n        a: 2\n        b: 3\n      })\n    )",
    "saída": "5"
  },
  {
    "entrada": "(\n      calc = { x y z } => x + y * z\n      calc({\n        x: 2\n        y: 3\n        z: 4\n      })\n    )",
    "saída": "14"
  },
  {
    "entrada": "(\n      subtrair = { a b } => a - b\n      subtrair({\n        b: 5\n        a: 10\n      })\n    )",
    "saída": "5"
  },
  {
    "entrada": "(\n      juntar = { primeiro segundo } => [primeiro \" \" segundo] * \"\"\n      juntar({\n        primeiro: \"Hello\"\n        segundo: \"World\"\n      })\n    )",
    "saída": "Hello World"
  },
  {
    "entrada": "(\n      soma = { a b } => a + b\n      soma({\n        a: 2\n        b: 3\n      })\n    )",
    "saída": "5"
  },
  {
    "entrada": "(\n      multiplicar_e_somar = { x y base } => x * y + base\n      multiplicar_e_somar({\n        x: 5\n        y: 3\n        base: 10\n      })\n    )",
    "saída": "25"
  },
  {
    "entrada": "(\n      obter_valor = { valor } => valor\n      obter_valor({\n        valor: 42\n      })\n    )",
    "saída": "42"
  },
  {
    "entrada": "(\n      abs = x =>\n        | x < 0 = 0 - x\n        | x\n      abs(-5)\n    )",
    "saída": "5"
  },
  {
    "entrada": "(\n      sign = x =>\n        | x > 0 = 1\n        | x < 0 = 0 - 1\n        | 0\n      sign(5)\n    )",
    "saída": "1"
  },
  {
    "entrada": "(\n      sign = x =>\n        | x > 0 = 1\n        | x < 0 = 0 - 1\n        | 0\n      sign(-3)\n    )",
    "saída": "-1"
  },
  {
    "entrada": "(\n      sign = x =>\n        | x > 0 = 1\n        | x < 0 = 0 - 1\n        | 0\n      sign(0)\n    )",
    "saída": "0"
  },
  {
    "entrada": "(\n      classify = x =>\n        | x > 10 = \"grande\"\n        | x > 5 = \"médio\"\n        | \"pequeno\"\n      classify(15)\n    )",
    "saída": "grande"
  },
  {
    "entrada": "(\n      classify = x =>\n        | x > 10 = \"grande\"\n        | x > 5 = \"médio\"\n        | \"pequeno\"\n      classify(7)\n    )",
    "saída": "médio"
  },
  {
    "entrada": "(\n      classify = x =>\n        | x > 10 = \"grande\"\n        | x > 5 = \"médio\"\n        | \"pequeno\"\n      classify(3)\n    )",
    "saída": "pequeno"
  },
  {
    "entrada": "(\n      abs = x => | x < 0 = 0 - x | x\n      abs(-5)\n    )",
    "saída": "5"
  },
  {
    "entrada": "(\n      max = { a b } => | a > b = a | b\n      max({ a: 10 b: 5 })\n    )",
    "saída": "10"
  },
  {
    "entrada": "(\n      max = { a b } => | a > b = a | b\n      max({ a: 3 b: 8 })\n    )",
    "saída": "8"
  },
  {
    "entrada": "(\n      a = x => x * 2\n      a(5)\n    )",
    "saída": "10"
  },
  {
    "entrada": "(\n      funcs = [\n        _ => x => x + 1\n        _ => x => x * 2\n      ]\n      funcs[0]()(3)  // Should work: funcs[0] returns function, then () calls it, then (3) calls result\n    )",
    "saída": "4"
  },
  {
    "entrada": "(\n      soma = n1 => n2 => n1 + n2\n      soma(2)(3)\n    )",
    "saída": "5"
  },
  {
    "entrada": "(\n      soma3 = a => b => c => a + b + c\n      soma3(1)(2)(3)\n    )",
    "saída": "6"
  },
  {
    "entrada": "(\n      soma4 = a => b => c => d => a + b + c + d\n      soma4(1)(2)(3)(4)\n    )",
    "saída": "10"
  },
  {
    "entrada": "(\n      multiplica = x => y => x * y\n      dobro = multiplica(2)\n      dobro(5)\n    )",
    "saída": "10"
  },
  {
    "entrada": "(\n      soma = n1 => n2 => n1 + n2\n      funcs = [soma]\n      funcs[0](10)(20)\n    )",
    "saída": "30"
  },
  {
    "entrada": "(\n      cria_objeto = x => y => { a: x b: y }\n      obj = cria_objeto(5)(10)\n      obj.a + obj.b\n    )",
    "saída": "15"
  },
  {
    "entrada": "(\n      a = 2 // comentário\n      b = 3 // outro comentário\n      a + b\n    )",
    "saída": "5"
  }
];

import { interpretar } from "./0.js";

let passaram = 0;
let total = 0;

for (const teste of testes) {
  total++;
  const { saída, } = await interpretar(teste.entrada, teste.arquivo || "0.teste.js");
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