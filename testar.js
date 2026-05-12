import { teste, testar } from "./uniteste.js"
import { interpretar } from "./0.js";
import { bloco } from "./texto.js"

const resultado = testar(interpretar, "testar.js", [
  teste({
    entrada: bloco(`
      . 1
    `),
    saída_esperada: bloco(`
      . 1
    `),
  }),
  teste({
    entrada: bloco(`
      .  1
    `),
    saída_esperada: bloco(`
      . 1
    `),
  }),
  teste({
    entrada: bloco(`
      . 1 // comentário
    `),
    saída_esperada: bloco(`
      . 1
    `),
  }),
  teste({
    entrada: bloco(`
      . +
    `),
    erro_esperado: bloco(`
      . ⛔ "_" | "!" | "(" | "[" | "\\"" | "#" | "\`" | /[0-9]/ | /[a-z]/ | /[A-Z]/
      . 📄 testar.js
      . 👉 1: +
      .       ^ 1
    `),
  }),
  teste({
    entrada: bloco(`
      . 42 + 5
    `),
    saída_esperada: bloco(`
      . 47
    `),
  }),
  teste({
    entrada: bloco(`
      . 8 - 4
    `),
    saída_esperada: bloco(`
      . 4
    `),
  }),
  teste({
    entrada: bloco(`
      . 3 * 4
    `),
    saída_esperada: bloco(`
      . 12
    `),
  }),
  teste({
    entrada: bloco(`
      . 8 / 2
    `),
    saída_esperada: bloco(`
      . 4
    `),
  }),
  teste({
    entrada: bloco(`
      . 2147483647 + 1
    `),
    saída_esperada: bloco(`
      . 2147483648
    `),
  }),
  teste({
    entrada: bloco(`
      . 4 - 2 - 1
    `),
    saída_esperada: bloco(`
      . 1
    `),
  }),
  teste({
    entrada: bloco(`
      . 2 + 3 * 4
    `),
    saída_esperada: bloco(`
      . 14
    `),
  }),
  teste({
    entrada: bloco(`
      . 10 - 6 / 2
    `),
    saída_esperada: bloco(`
      . 7
    `),
  }),
  teste({
    entrada: bloco(`
      . 8 / 2 + 3 * 2
    `),
    saída_esperada: bloco(`
      . 10
    `),
  }),
  teste({
    entrada: bloco(`
      . (2 + 3) * 4
    `),
    saída_esperada: bloco(`
      . 20
    `),
  }),
  teste({
    entrada: bloco(`
      . 10 - (6 / 2)
    `),
    saída_esperada: bloco(`
      . 7
    `),
  }),
  teste({
    entrada: bloco(`
      . 1 + 2 * 3 - 4 / 2
    `),
    saída_esperada: bloco(`
      . 5
    `),
  }),
  teste({
    entrada: bloco(`
      . 2 > 8
    `),
    saída_esperada: bloco(`
      . 0
    `),
  }),
  teste({
    entrada: bloco(`
      . 8 > 2
    `),
    saída_esperada: bloco(`
      . 1
    `),
  }),
  teste({
    entrada: bloco(`
      . 8 > 8
    `),
    saída_esperada: bloco(`
      . 0
    `),
  }),
  teste({
    entrada: bloco(`
      . 2 < 8
    `),
    saída_esperada: bloco(`
      . 1
    `),
  }),
  teste({
    entrada: bloco(`
      . 8 < 2
    `),
    saída_esperada: bloco(`
      . 0
    `),
  }),
  teste({
    entrada: bloco(`
      . 8 < 8
    `),
    saída_esperada: bloco(`
      . 0
    `),
  }),
  teste({
    entrada: bloco(`
      . 2 == 8
    `),
    saída_esperada: bloco(`
      . 0
    `),
  }),
  teste({
    entrada: bloco(`
      . 8 == 2
    `),
    saída_esperada: bloco(`
      . 0
    `),
  }),
  teste({
    entrada: bloco(`
      . 8 == 8
    `),
    saída_esperada: bloco(`
      . 1
    `),
  }),
  teste({
    entrada: bloco(`
      . 2 != 8
    `),
    saída_esperada: bloco(`
      . 1
    `),
  }),
  teste({
    entrada: bloco(`
      . 8 != 2
    `),
    saída_esperada: bloco(`
      . 1
    `),
  }),
  teste({
    entrada: bloco(`
      . 8 != 8
    `),
    saída_esperada: bloco(`
      . 0
    `),
  }),
  teste({
    entrada: bloco(`
      . 2 >= 8
    `),
    saída_esperada: bloco(`
      . 0
    `),
  }),
  teste({
    entrada: bloco(`
      . 8 >= 2
    `),
    saída_esperada: bloco(`
      . 1
    `),
  }),
  teste({
    entrada: bloco(`
      . 8 >= 8
    `),
    saída_esperada: bloco(`
      . 1
    `),
  }),
  teste({
    entrada: bloco(`
      . 2 <= 8
    `),
    saída_esperada: bloco(`
      . 1
    `),
  }),
  teste({
    entrada: bloco(`
      . 8 <= 2
    `),
    saída_esperada: bloco(`
      . 0
    `),
  }),
  teste({
    entrada: bloco(`
      . 8 <= 8
    `),
    saída_esperada: bloco(`
      . 1
    `),
  }),
  teste({
    entrada: bloco(`
      . 0 && 0
    `),
    saída_esperada: bloco(`
      . 0
    `),
  }),
  teste({
    entrada: bloco(`
      . 0 && 1
    `),
    saída_esperada: bloco(`
      . 0
    `),
  }),
  teste({
    entrada: bloco(`
      . 1 && 0
    `),
    saída_esperada: bloco(`
      . 0
    `),
  }),
  teste({
    entrada: bloco(`
      . 1 && 2
    `),
    saída_esperada: bloco(`
      . 2
    `),
  }),
  teste({
    entrada: bloco(`
      . 0 || 0
    `),
    saída_esperada: bloco(`
      . 0
    `),
  }),
  teste({
    entrada: bloco(`
      . 0 || 1
    `),
    saída_esperada: bloco(`
      . 1
    `),
  }),
  teste({
    entrada: bloco(`
      . 1 || 0
    `),
    saída_esperada: bloco(`
      . 1
    `),
  }),
  teste({
    entrada: bloco(`
      . 1 || 2
    `),
    saída_esperada: bloco(`
      . 1
    `),
  }),
  teste({
    entrada: bloco(`
      . ! 0
    `),
    saída_esperada: bloco(`
      . 1
    `),
  }),
  teste({
    entrada: bloco(`
      . ! 1
    `),
    saída_esperada: bloco(`
      . 0
    `),
  }),
  teste({
    entrada: bloco(`
      . ! ! 0
    `),
    saída_esperada: bloco(`
      . 0
    `),
  }),
  teste({
    entrada: bloco(`
      . 0 && (1 / 0)
    `),
    saída_esperada: bloco(`
      . 0
    `),
  }),
  teste({
    entrada: bloco(`
      . a = 11
      . 12 + a
    `),
    saída_esperada: bloco(`
      . 23
    `),
  }),
  teste({
    entrada: bloco(`
      . a = 5
      . b = 8
      . 2 + a + b
    `),
    saída_esperada: bloco(`
      . 15
    `),
  }),
  teste({
    entrada: bloco(`
      . a = 5
      . b = 8
      . 3 + c
    `),
    erro_esperado: bloco(`
      . ⛔ a | b
      . 📄 testar.js
      . 👉 3: 3 + c
      .           ^ 5
    `),
  }),
  teste({
    entrada: bloco(`
      . a = 5
      . b = 8
      . a + b
    `),
    saída_esperada: bloco(`
      . 13
    `),
  }),
  teste({
    entrada: bloco(`
      . a = 2
      . b = 3
      . a + b
    `),
    saída_esperada: bloco(`
      . 5
    `),
  }),
  teste({
    entrada: bloco(`
      . x = 4
      . y = 5
      . x * y
    `),
    saída_esperada: bloco(`
      . 20
    `),
  }),
  teste({
    entrada: bloco(`
      . valor = 10
      . valor + 5
    `),
    saída_esperada: bloco(`
      . 15
    `),
  }),
  teste({
    entrada: bloco(`
      . a = 2
      . b = 3
      . c = 4
      . a + b * c
    `),
    saída_esperada: bloco(`
      . 14
    `),
  }),
  teste({
    entrada: bloco(`
      . a = 5
      . b = a * 2
      . b + 3
    `),
    saída_esperada: bloco(`
      . 13
    `),
  }),
  teste({
    entrada: bloco(`
      . a = 2
      . b = (
      .   x = 3
      .   y = 4
      .   x + y
      . )
      . a * b
    `),
    saída_esperada: bloco(`
      . 14
    `),
  }),
  teste({
    entrada: bloco(`
      . x = 5
      . y = (
      .   a = 2
      .   b = 3
      .   a + b
      . )
      . x + y
    `),
    saída_esperada: bloco(`
      . 10
    `),
  }),
  teste({
    entrada: bloco(`
      . x = 2
      . y = 3
      . x + y
    `),
    saída_esperada: bloco(`
      . 5
    `),
  }),
  teste({
    entrada: bloco(`
      . a = 4
      . a + 5
    `),
    saída_esperada: bloco(`
      . 9
    `),
  }),
  teste({
    entrada: bloco(`
      . x = 7
      . x * 2
    `),
    saída_esperada: bloco(`
      . 14
    `),
  }),
  teste({
    entrada: bloco(`
      . str = "abcdef"
      . str
    `),
    saída_esperada: bloco(`
      . abcdef
    `),
  }),
  teste({
    entrada: bloco(`
      . a = "abcd"
      . #a
    `),
    saída_esperada: bloco(`
      . 4
    `),
  }),
  teste({
    entrada: bloco(`
      . nome = "Alice"
      . sobrenome = "Silva"
      . \`\${nome} \${sobrenome}\`
    `),
    saída_esperada: bloco(`
      . Alice Silva
    `),
  }),
  teste({
    entrada: bloco(`
      . str = "abcdef"
      . str 5
    `),
    saída_esperada: bloco(`
      . f
    `),
  }),
  teste({
    entrada: bloco(`
      . lista = [ 2 ; 3 ]
      . lista 0
    `),
    saída_esperada: bloco(`
      . 2
    `),
  }),
  teste({
    entrada: bloco(`
      . lista = [ 2 ; 3 ]
      . lista 1
    `),
    saída_esperada: bloco(`
      . 3
    `),
  }),
  teste({
    entrada: bloco(`
      . lista = [ 2 ; 3 ]
      . #lista
    `),
    saída_esperada: bloco(`
      . 2
    `),
  }),
  teste({
    entrada: bloco(`
      . lista = [[ 1 ; 2 ] ; [ 3 ; 4 ]]
      . lista 0 1
    `),
    saída_esperada: bloco(`
      . 2
    `),
  }),
  teste({
    entrada: bloco(`
      . lista = [ 1 ; 2 ; 3 ]
      . lista 2
    `),
    saída_esperada: bloco(`
      . 3
    `),
  }),
  teste({
    entrada: bloco(`
      . lista = [ 10 ; 20 ; 30 ]
      . lista 1 + 1
    `),
    saída_esperada: bloco(`
      . 21
    `),
  }),
  teste({
    entrada: bloco(`
      . lista_1 = [ 10 ; 20 ; 30 ]
      . lista_2 = [ lista_1 2 ; 40 ]
      . lista_2 0
    `),
    saída_esperada: bloco(`
      . 30
    `),
  }),
  teste({
    entrada: bloco(`
      . lista_1 = [ 10 ; 20 ; 30 ]
      . lista_2 = [ ...lista_1 ; 40 ]
      . #lista_2
    `),
    saída_esperada: bloco(`
      . 4
    `),
  }),
  teste({
    entrada: bloco(`
      . lista_1 = [ 10 ; 20 ; 30 ]
      . lista_2 = [ ...lista_1 ; 40 ]
      . \`\${lista_2 0} \${lista_2 1} \${lista_2 2} \${lista_2 3}\`
    `),
    saída_esperada: bloco(`
      . 10 20 30 40
    `),
  }),
  teste({
    entrada: bloco(`
      . lista_1 = [ 10 ; 20 ]
      . lista_2 = [ 30 ; 40 ]
      . lista_3 = [ ...lista_1 ; ...lista_2 ]
      . \`\${lista_3 0} \${lista_3 1} \${lista_3 2} \${lista_3 3}\`
    `),
    saída_esperada: bloco(`
      . 10 20 30 40
    `),
  }),
  teste({
    entrada: bloco(`
      . lista_1 = [ 10 ; 20 ]
      . lista_2 = [ ...lista_1 ; 30 ]
      . lista_3 = [ ...lista_2 ; 40 ]
      . \`\${lista_3 0} \${lista_3 1} \${lista_3 2} \${lista_3 3}\`
    `),
    saída_esperada: bloco(`
      . 10 20 30 40
    `),
  }),
  teste({
    entrada: bloco(`
      . lista_1 = [ 20 ; 30 ]
      . lista_2 = [ 50 ; 60 ]
      . lista_3 = [ 10 ; ...lista_1 ; 40 ; ...lista_2 ; 70 ]
      . \`\${lista_3 0} \${lista_3 1} \${lista_3 2} \${lista_3 3} \${lista_3 4} \${lista_3 5} \${lista_3 6}\`
    `),
    saída_esperada: bloco(`
      . 10 20 30 40 50 60 70
    `),
  }),
  teste({
    entrada: bloco(`
      . obj = { a: 1 }
      . obj.a
    `),
    saída_esperada: bloco(`
      . 1
    `),
  }),
  teste({
    entrada: bloco(`
      . obj = { a: 1, b: 2 }
      . obj.a + obj.b
    `),
    saída_esperada: bloco(`
      . 3
    `),
  }),
  teste({
    entrada: bloco(`
      . obj = { nested: { x: 10 } }
      . obj.nested.x
    `),
    saída_esperada: bloco(`
      . 10
    `),
  }),
  teste({
    entrada: bloco(`
      . obj = { "chave-com-hifen": 5 }
      . obj "chave-com-hifen"
    `),
    saída_esperada: bloco(`
      . 5
    `),
  }),
  teste({
    entrada: bloco(`
      . pessoa = { nome: "João", sobrenome: "Pereira" }
      . pessoa.nome + " " + pessoa.sobrenome
    `),
    saída_esperada: bloco(`
      . João Pereira
    `),
  }),
  teste({
    entrada: bloco(`
      . nome = "Maria"
      . pessoa = { nome }
      . pessoa.nome
    `),
    saída_esperada: bloco(`
      . Maria
    `),
  }),
  teste({
    entrada: bloco(`
      . juntar = { primeiro, segundo } => [primeiro, " ", segundo] * ""
      . juntar({
      .   primeiro: "Hello",
      .   segundo: "World",
      . })
    `),
    saída_esperada: bloco(`
      . Hello World
    `),
  }),
  teste({
    entrada: bloco(`
      . quadrado = x => x * x
      . quadrado(5)
    `),
    saída_esperada: bloco(`
      . 25
    `),
  }),
  teste({
    entrada: bloco(`
      . iniciais = [
      .   _ => "Bulbasaur",
      .   _ => "Charmander",
      .   _ => "Squirtle"
      . ]
      . iniciais[1](0)
    `),
    saída_esperada: bloco(`
      . Charmander
    `),
  }),
  teste({
    entrada: bloco(`
      . soma = { a, b } => a + b
      . soma({
      .   a: 2,
      .   b: 3,
      . })
    `),
    saída_esperada: bloco(`
      . 5
    `),
  }),
  teste({
    entrada: bloco(`
      . calc = { x, y, z } => x + y * z
      . calc({
      .   x: 2,
      .   y: 3,
      .   z: 4,
      . })
    `),
    saída_esperada: bloco(`
      . 14
    `),
  }),
  teste({
    entrada: bloco(`
      . subtrair = { a, b } => a - b
      . subtrair({
      .   b: 5,
      .   a: 10,
      . })
    `),
    saída_esperada: bloco(`
      . 5
    `),
  }),
  teste({
    entrada: bloco(`
      . multiplicar_e_somar = { x, y, base } => x * y + base
      . multiplicar_e_somar({
      .   x: 5,
      .   y: 3,
      .   base: 10,
      . })
    `),
    saída_esperada: bloco(`
      . 25
    `),
  }),
  teste({
    entrada: bloco(`
      . obter_valor = { valor } => valor
      . obter_valor({
      .   valor: 42,
      . })
    `),
    saída_esperada: bloco(`
      . 42
    `),
  }),
  teste({
    entrada: bloco(`
      . abs = x =>
      .   | x < 0 = 0 - x
      .   | x
      . abs(-5)
    `),
    saída_esperada: bloco(`
      . 5
    `),
  }),
  teste({
    entrada: bloco(`
      . sign = x =>
      .   | x > 0 = 1
      .   | x < 0 = 0 - 1
      .   | 0
      . sign(5)
    `),
    saída_esperada: bloco(`
      . 1
    `),
  }),
  teste({
    entrada: bloco(`
      . sign = x =>
      .   | x > 0 = 1
      .   | x < 0 = 0 - 1
      .   | 0
      . sign(-3)
    `),
    saída_esperada: bloco(`
      . -1
    `),
  }),
  teste({
    entrada: bloco(`
      . sign = x =>
      .   | x > 0 = 1
      .   | x < 0 = 0 - 1
      .   | 0
      . sign(0)
    `),
    saída_esperada: bloco(`
      . 0
    `),
  }),
  teste({
    entrada: bloco(`
      . classify = x =>
      .   | x > 10 = "grande"
      .   | x > 5 = "médio"
      .   | "pequeno"
      . classify(15)
    `),
    saída_esperada: bloco(`
      . grande
    `),
  }),
  teste({
    entrada: bloco(`
      . classify = x =>
      .   | x > 10 = "grande"
      .   | x > 5 = "médio"
      .   | "pequeno"
      . classify(7)
    `),
    saída_esperada: bloco(`
      . médio
    `),
  }),
  teste({
    entrada: bloco(`
      . classify = x =>
      .   | x > 10 = "grande"
      .   | x > 5 = "médio"
      .   | "pequeno"
      . classify(3)
    `),
    saída_esperada: bloco(`
      . pequeno
    `),
  }),
  teste({
    entrada: bloco(`
      . abs = x => | x < 0 = 0 - x | x
      . abs(-5)
    `),
    saída_esperada: bloco(`
      . 5
    `),
  }),
  teste({
    entrada: bloco(`
      . max = { a, b } => | a > b = a | b
      . max({ a: 10, b: 5 })
    `),
    saída_esperada: bloco(`
      . 10
    `),
  }),
  teste({
    entrada: bloco(`
      . max = { a, b } => | a > b = a | b
      . max({ a: 3, b: 8 })
    `),
    saída_esperada: bloco(`
      . 8
    `),
  }),
  teste({
    entrada: bloco(`
      . a = x => x * 2
      . a(5)
    `),
    saída_esperada: bloco(`
      . 10
    `),
  }),
  teste({
    entrada: bloco(`
      . funcs = [
      .   _ => x => x + 1,
      .   _ => x => x * 2
      . ]
      . funcs[0]()(3)  // Should work: funcs[0] returns function, then () calls it, then (3) calls result
    `),
    saída_esperada: bloco(`
      . 4
    `),
  }),
  teste({
    entrada: bloco(`
      . soma = n1 => n2 => n1 + n2
      . soma(2)(3)
    `),
    saída_esperada: bloco(`
      . 5
    `),
  }),
  teste({
    entrada: bloco(`
      . soma3 = a => b => c => a + b + c
      . soma3(1)(2)(3)
    `),
    saída_esperada: bloco(`
      . 6
    `),
  }),
  teste({
    entrada: bloco(`
      . soma4 = a => b => c => d => a + b + c + d
      . soma4(1)(2)(3)(4)
    `),
    saída_esperada: bloco(`
      . 10
    `),
  }),
  teste({
    entrada: bloco(`
      . multiplica = x => y => x * y
      . dobro = multiplica(2)
      . dobro(5)
    `),
    saída_esperada: bloco(`
      . 10
    `),
  }),
  teste({
    entrada: bloco(`
      . soma = n1 => n2 => n1 + n2
      . funcs = [soma]
      . funcs[0](10)(20)
    `),
    saída_esperada: bloco(`
      . 30
    `),
  }),
  teste({
    entrada: bloco(`
      . cria_objeto = x => y => { a: x, b: y }
      . obj = cria_objeto(5)(10)
      . obj.a + obj.b
    `),
    saída_esperada: bloco(`
      . 15
    `),
  }),
  teste({
    entrada: bloco(`
      . a = 2 // comentário
      . b = 3 // outro comentário
      . a + b
    `),
    saída_esperada: bloco(`
      . 5
    `),
  }),
  teste({
    entrada: bloco(`
      . @ "./testar/pergunta.txt"
    `),
    saída_esperada: bloco(`
      . O que você obtém se multiplicar seis por nove?
    `),
  }),
  teste({
    entrada: bloco(`
      . caminho = "./testar/pergunta.txt"
      . @ caminho
    `),
    saída_esperada: bloco(`
      . O que você obtém se multiplicar seis por nove?
    `),
  }),
  teste({
    entrada: bloco(`
      . (@ "./testar/pergunta.txt")[.]
    `),
    saída_esperada: bloco(`
      . 46
    `),
  }),
  teste({
    entrada: bloco(`
      . testar.resposta == 42
    `),
    saída_esperada: bloco(`
      . 1
    `),
  }),
  teste({
    entrada: bloco(`
      . = 5
    `),
    erro_esperado: bloco(`
      . testar.js
      . 1:1
      . = 5
      . ^
    `),
  }),
  teste({
    entrada: bloco(`
      . // Teste de erro de referência: função não definida
      . funcaoNaoDefinida(42)
    `),
    erro_esperado: bloco(`
      . testar.js
      . 2:1
      . funcaoNaoDefinida(42)
      . ^^^^^^^^^^^^^^^^^
    `),
  }),
  teste({
    entrada: bloco(`
      . // Teste: pilha de chamadas com aplicações
      . a = b => c + 1
      . d = e => a(e)
      . d(2)
    `),
    erro_esperado: bloco(`
      . testar.js
      . 4:1
      . d(2)
      . ^
      . 3:10
      . d = e => a(e)
      .         ^
      . 2:10
      . a = b => c + 1
      .         ^
    `),
  }),
  teste({
    entrada: bloco(`
      . // Teste de erro de referência: acesso a campo em objeto não definido
      . objetoNaoDefinido["campo"]
    `),
    erro_esperado: bloco(`
      . testar.js
      . 2:1
      . objetoNaoDefinido["campo"]
      . ^^^^^^^^^^^^^^^^^
    `),
  }),
  teste({
    entrada: bloco(`
      . // Teste de erro de referência: uso de variável antes da definição
      . // Na expressão principal (última linha), a variável não está definida
      . x + 10
    `),
    erro_esperado: bloco(`
      . testar.js
      . 3:1
      . x + 10
      . ^
    `),
  }),
  teste({
    entrada: bloco(`
      . // Teste de erro de referência: variável não definida
      . variavelNaoDefinida
    `),
    erro_esperado: bloco(`
      . testar.js
      . 2:1
      . variavelNaoDefinida
      . ^^^^^^^^^^^^^^^^^^^
    `),
  }),
  teste({
    entrada: bloco(`
      . // Teste de erro de sintaxe: chave não fechada dentro de outro objeto
      . obj = {
      .   a: 1,
      .   b: {
      .     x: 1,
      .     y: 2,
      .     c: 3,
      .   }
    `),
    erro_esperado: bloco(`
      . testar.js
      . 8:2
      . }
      . ^
    `),
  }),
  teste({
    entrada: bloco(`
      . // Teste de erro de sintaxe: colchete não fechado dentro de objeto
      . obj = {
      .   a: 1,
      .   b: [
      .     1,
      .     2,
      .   ]
      . }
    `),
    erro_esperado: bloco(`
      . testar.js
      . 7:1
      . }
      . ^
    `),
  }),
  teste({
    entrada: bloco(`
      . // Teste de erro de sintaxe: chave não fechada
      . obj = { a: 1 b: 2
    `),
    erro_esperado: bloco(`
      . 2:18
      . obj = { a: 1 b: 2
      .                  ^
    `),
  }),
  teste({
    entrada: bloco(`
      . // Teste de erro de sintaxe: caractere inesperado dentro de chaves
      . obj = {
      .   a: 1,
      .   b: 2,
      .   $
    `),
    erro_esperado: bloco(`
      . testar.js
      . 5:4
      . $
      . ^
    `),
  }),
  teste({
    entrada: bloco(`
      . // Teste de erro de sintaxe: dois pontos inesperados dentro de chaves
      . obj = {
      .   a: 1,
      .   : 2
      . }
    `),
    erro_esperado: bloco(`
      . testar.js
      . 4:4
      . : 2
      . ^
    `),
  }),
  teste({
    entrada: bloco(`
      . // Teste de erro de sintaxe: dois pontos inesperados dentro de chaves
      . obj = {
      .   a: 1,
      .   : 2
      . }
    `),
    erro_esperado: bloco(`
      . testar.js
      . 4:4
      . : 2
      . ^
    `),
  }),
  teste({
    entrada: bloco(`
      . // Teste de erro de sintaxe: chave não fechada em múltiplas linhas
      . obj = {
      .   a: 1,
      .   b: 2,
    `),
    erro_esperado: bloco(`
      . testar.js
      . 4:9
      . b: 2,
      .      ^
    `),
  }),
  teste({
    entrada: bloco(`
      . // Teste de erro de sintaxe: colchete não fechado
      . x = [1, 2, 3
    `),
    erro_esperado: bloco(`
      . testar.js
      . 2:15
      . x = [1, 2, 3
      .               ^
    `),
  }),
  teste({
    entrada: bloco(`
      . // Teste de erro de sintaxe: colchete de fechamento sem abertura
      . x = ]
    `),
    erro_esperado: bloco(`
      . testar.js
      . 2:5
      . x = ]
      .     ^
    `),
  }),
  teste({
    entrada: bloco(`
      . // Teste de erro de sintaxe: colchete não fechado em múltiplas linhas
      . lista = [
      .   1,
      .   2,
      .   3
    `),
    erro_esperado: bloco(`
      . testar.js
      . 5:5
      . 3
      .  ^
    `),
  }),
  teste({
    entrada: bloco(`
      . // Teste de erro de sintaxe: parêntese não fechado
      . f = x => (x + 1
    `),
    erro_esperado: bloco(`
      . testar.js
      . 2:16
      . f = x => (x + 1
      .                ^
    `),
  }),
  teste({
    entrada: bloco(`
      . // Teste de erro de sintaxe: parêntese de fechamento inesperado
      . lista = [
      .   1
      .   2
      . )
    `),
    erro_esperado: bloco(`
      . testar.js
      . 5:1
      . )
      . ^
    `),
  }),
  teste({
    entrada: bloco(`
      . // Teste de erro de sintaxe: parêntese não fechado em múltiplas linhas
      . result = (
      .   1 + 2 +
      .   3 + 4
    `),
    erro_esperado: bloco(`
      . testar.js
      . 4:9
      . 3 + 4
      .         ^
    `),
  }),
  teste({
    entrada: bloco(`
      . // Teste de erro de sintaxe: string não fechada
      . texto = "Olá mundo
    `),
    erro_esperado: bloco(`
      . testar.js
      . 2:19
      . texto = "Olá mundo
      .                   ^
    `),
  }),
  teste({
    entrada: bloco(`
      . // Teste de erro de sintaxe: array não fechado
      . [1:100]
    `),
    erro_esperado: bloco(`
      . testar.js
      . 1:3
      . [1:100]
      .   ^
    `),
  }),
  teste({
    entrada: bloco(`
      . // Teste de erro de sintaxe: número negativo
      . - -5
    `),
    erro_esperado: bloco(`
      . testar.js
      . 1:3
      . - -5
      .   ^
    `),
  }),
])

process.stdout.write(resultado.saída + "\n")
process.exit(resultado.código)