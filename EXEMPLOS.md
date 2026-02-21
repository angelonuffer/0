# Exemplos da Linguagem 0

Este arquivo serve como guia de sintaxe e repositório de exemplos para a **0**. Todos os blocos de código marcados com `0` são testados automaticamente.

## Módulos e Declarações

Um módulo é composto por declarações opcionais seguidas por uma expressão final.

```0
// Declarações: nome = expressão
a = 10
b = 20

// Verificação (a expressão final é o resultado do módulo)
iguais([ a + b, 30 ])
```

## Léxico

### Comentários
```0
// Comentário de linha
/* Comentário
   de bloco */
1
```

## Funções e Lambdas

### Definição e Aplicação
```0
soma = a => b => a + b
iguais([ soma(1)(2), 3 ])
```

### Desestruturação (Destructuring)
```0
área = { largura altura } => largura * altura
iguais([ área({ largura: 10,  altura: 5 }), 50 ])
```

### Guardas (Guards)
As guardas permitem condicionais concisas. O primeiro `=` marca o resultado para a condição. Um `|` sem `=` é o caso padrão.
```0
fatorial = n =>
  | n <= 1 = 1
  | n * fatorial(n - 1)

iguais([ fatorial(5), 120 ])
```

## Escopo Local

Você pode criar escopos temporários usando parênteses.
```0
resultado = (
  x = 5
  y = x * 2
  y + 1
)
iguais([ resultado, 11 ])
```

## Coleções

### Listas
```0
lista = [ 1, 2, 3 ]
iguais([ [ 0, ...lista, 4 ],  [ 0, 1, 2, 3, 4 ] ])
```

### Objetos
```0
nome = "João"
obj = {
  nome
  idade: 25
}
iguais([ { ...obj, idade: 26 }.idade, 26 ])
```

### Vírgulas Opcionais
As vírgulas são opcionais entre os itens de listas e objetos.
```0
iguais([ [ 1, 2, 3 ], [ 1 2 3 ] ])
```
```0
iguais([ { a: 1, b: 2 }, { a: 1 b: 2 } ])
```

## Acesso e Operações

```0
v = [10 20 30]
s = "abc"

iguais([ v[0]     10            ]) &
iguais([ s[0]     97            ]) &
iguais([ v[1:3]   [20 30]       ]) &
iguais([ v[.]     3             ]) &
iguais([ v[*]     ["0" "1" "2"] ]) &
iguais([ {a:1}.a  1             ])
```

## Operadores

### Aritmética e Comparação
```0
iguais([ 1 + 2 * 3   7  ]) &
iguais([ 10 / 2      5  ]) &
iguais([ 5 == 5      1  ]) &
iguais([ 5 != 4      1  ]) &
iguais([ 10 >= 5     1  ])
```

## Operadores Lógicos e Ternário
```0
iguais([ 1 & 0          0   ]) &
iguais([ 0 | 1          1   ]) &
iguais([ !1             0   ]) &
iguais([ 1 ? "a" : "b"  "a" ])
```

### Especiais (Join e Split)
O operador `*` entre lista e texto une a lista. O operador `/` entre textos divide o texto.
```0
iguais([ ["a" "b"] * "-"  "a-b"     ]) &
iguais([ "a-b" / "-"      ["a" "b"] ])
```

## Módulos e Endereços

O carregamento de módulos usa endereços literais ou o operador `@`.
*Nota: Estes exemplos são apenas para demonstração de sintaxe e não são executados aqui.*

```syntax
// Endereço literal (relativo ou URL)
util = ./util.0
math = https://exemplo.com/math.0

// Operador @ para endereços dinâmicos
carregar = caminho => @caminho
```

## Depuração

O operador `%` imprime o valor em `stderr` (JSON) e o retorna.
```0
iguais([ % 42  42 ])
```
