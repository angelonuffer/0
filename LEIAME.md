# Linguagem 0

A **0** é uma linguagem funcional com sintaxe inspirada na notação matemática, sem palavras reservadas em linguagem natural; essa simplicidade sintática reduz ambiguidades, facilita a aprendizagem e favorece composição e raciocínio formal.

Veja a seção **Exemplos** mais abaixo para uma explicação detalhada da sintaxe e exemplos de uso.

## Executar um módulo

Para executar um arquivo `.0`:

```bash
npx angelonuffer/0 <módulo.0>
```

Avalia a expressão final do módulo e imprime o resultado.

## Executar os testes do núcleo

```bash
node testar.js
```

Opções úteis para execução dos testes:

- `--exiba-todos`: exibe todas as falhas (modo não fail‑fast).
- `--verifique-restantes`: após exibir a primeira falha, continua executando os testes restantes silenciosamente apenas para ajustar a contagem final de testes aprovados.

Exemplos:

```bash
# modo padrão: para na primeira falha
node testar.js

# ver todas as falhas
node testar.js --exiba-todos

# exibe só a primeira falha, mas verifica silenciosamente o restante para contagem precisa
node testar.js --verifique-restantes
```

## Teste de integração com outro repositório

Para verificar a compatibilidade com módulos em outros repositórios:

```bash
node arquivos_teste/integração.js <repositório> <caminho>
```

Exemplo: `node arquivos_teste/integração.js angelonuffer/antlr.0 tests/0`

## Exemplos

Este arquivo serve como guia de sintaxe e repositório de exemplos para a **0**. Todos os blocos de código marcados com `0` são testados automaticamente.

### Módulos e Declarações

Um módulo é composto por declarações opcionais seguidas por uma expressão final.

```0
🔍 // Declarações: nome = expressão
   a = 10
   b = 20

   // Verificação (a expressão final é o resultado do módulo)
   a + b

🎯 30
```

### Léxico

#### Comentários

```0
🔍 // Comentário de linha
   /* Comentário
      de bloco */
   1

🎯 1
```

#### Números negativos

```0
🔍 -5 + 2

🎯 -3
```

### Funções e Lambdas

#### Definição e Aplicação

```0
🔍 soma = a => b => a + b
   soma(1)(2)

🎯 3
```

#### Desestruturação (Destructuring)

```0
🔍 área = { largura, altura } => largura * altura
   área({ largura: 10,  altura: 5 })

🎯 50
```

#### Guardas (Guards)

As guardas permitem condicionais concisas. O primeiro `=` marca o resultado para a condição. Um `|` sem `=` é o caso padrão.

```0
🔍 fatorial = n =>
      | n <= 1 = 1
      | n * fatorial(n - 1)
   fatorial(5)

🎯 120
```

### Escopo Local

Você pode criar escopos temporários usando parênteses.

```0
🔍 resultado = (
      x = 5
      y = x * 2
      y + 1
   )
   resultado

🎯 11
```

### Coleções

#### Listas

```0
🔍 lista = [ 1, 2, 3 ]
   [ 0, ...lista, 4 ]

🎯 [ 0, 1, 2, 3, 4 ]
```

#### Objetos

```0
🔍 nome = "João"
   obj = {
      nome,
      idade: 25
   }
   { ...obj, idade: 26 }.idade

🎯 26
```

### Acesso e Operações

```0
🔍 v = [ 10, 20, 30 ]
   s = "abc"
   v[0]

🎯 10

🔍 v = [ 10, 20, 30 ]
   s = "abc"
   s[0]

🎯 97

🔍 v = [ 10, 20, 30 ]
   s = "abc"
   v[1:3]

🎯 [ 20, 30 ]

🔍 v = [ 10, 20, 30 ]
   s = "abc"
   v[.]

🎯 3

🔍 v = [ 10, 20, 30 ]
   s = "abc"
   v[*]

🎯 [ "0", "1", "2" ]

🔍 v = [ 10, 20, 30 ]
   s = "abc"
   {a:1}.a

🎯 1

🔍 // Chaves de objeto/array e tamanho em string
   { a: 1, b: 2 }[*]

🎯 [ "a", "b" ]

🔍 // Chaves de objeto/array e tamanho em string
   "abc"[.]

🎯 3
```

### Operadores

#### Aritmética e Comparação

```0
🔍 1 + 2 * 3

🎯 7

🔍 10 / 2

🎯 5

🔍 5 == 5

🎯 1

🔍 5 != 4

🎯 1

🔍 10 >= 5

🎯 1
```

### Operadores Lógicos e Ternário

```0
🔍 1 & 0

🎯 0

🔍 0 | 1

🎯 1

🔍 !1

🎯 0

🔍 1 ? "a" : "b"

🎯 a
```

#### Especiais (Join e Split)

O operador `*` entre lista e texto une a lista. O operador `/` entre textos divide o texto.

```0
🔍 [ "a", "b" ] * "-"

🎯 a-b

🔍 "a-b" / "-"

🎯 [ "a", "b" ]
```

### Módulos e Endereços

O carregamento de módulos usa endereços literais ou o operador `@`.

```0
🔍 @ "./testar/pergunta.txt"

🎯 O que você obtém se multiplicar seis por nove?

🔍 ./testar/resposta.0

🎯 42
```

### Depuração

O operador `%` imprime o valor em `stderr` (JSON) e o retorna.

```0
🔍 % 42

🎯 42
```