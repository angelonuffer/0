---
layout: default
title: Caracteres Especiais - Linguagem 0
---

# Caracteres Especiais na Linguagem 0

Este documento explica todos os caracteres especiais utilizados na Linguagem 0 e suas funções.

## Operadores Aritméticos

### `+` (Adição)
Soma dois números.

**Exemplo:**
```
42 + 5
---
47
```

### `-` (Subtração)
Subtrai o segundo número do primeiro. Também é usado para representar números negativos.

**Exemplo de subtração:**
```
8 - 4
---
4
```

**Exemplo de número negativo:**
```
-5 + 3
---
-2
```

### `*` (Multiplicação)
Multiplica dois números.

**Exemplo com números:**
```
3 * 4
---
12
```

Quando aplicado a um objeto e um texto, junta os elementos do objeto usando o texto como separador:
```
{"a" "b" "c"} * " "
---
"a b c"
```

### `/` (Divisão)
Divide o primeiro número pelo segundo.

**Exemplo com números:**
```
8 / 2
---
4
```

Quando aplicado a textos, divide o texto usando o segundo operando como separador:
```
"a b c" / " "
---
{"a" "b" "c"}
```

## Operadores Lógicos

### `&` (E lógico)
Retorna `0` (falso) se um dos operandos for falso. Se ambos verdadeiros, retorna o segundo valor.

**Exemplos:**
```
0 & 1
---
0
```

```
1 & 2
---
2
```

### `|` (Ou lógico)
Retorna `0` (falso) se ambos os operandos forem falsos. Senão, retorna o primeiro valor verdadeiro.

**Exemplos:**
```
0 | 1
---
1
```

```
1 | 0
---
1
```

### `!` (Não lógico)
Inverte o valor lógico: `0` (falso) vira `1` (verdadeiro), e vice-versa.

**Exemplo:**
```
!0
---
1
```

## Operadores de Comparação

### `>` (Maior que)
Retorna `1` (verdadeiro) se o primeiro valor for maior que o segundo, senão `0` (falso).

**Exemplo:**
```
8 > 2
---
1
```

### `<` (Menor que)
Retorna `1` se o primeiro valor for menor que o segundo, senão `0`.

**Exemplo:**
```
2 < 8
---
1
```

### `==` (Igual a)
Retorna `1` se os valores forem iguais, senão `0`.

**Exemplo:**
```
8 == 8
---
1
```

### `!=` (Diferente de)
Retorna `1` se os valores forem diferentes, senão `0`.

**Exemplo:**
```
8 != 2
---
1
```

### `>=` (Maior ou igual a)
Retorna `1` se o primeiro valor for maior ou igual ao segundo, senão `0`.

**Exemplo:**
```
8 >= 8
---
1
```

### `<=` (Menor ou igual a)
Retorna `1` se o primeiro valor for menor ou igual ao segundo, senão `0`.

**Exemplo:**
```
2 <= 8
---
1
```

## Objetos e Coleções

### `{}` (Chaves - Definição de Objeto)
Delimita um objeto ou coleção de valores. Objetos podem conter valores indexados e/ou valores com chaves nomeadas.

**Exemplo de objeto simples:**
```
{"Zelda" "Mario" "Minecraft"}
```

**Exemplo de objeto com chaves:**
```
{
  nome: "João"
  idade: 30
}
```

### `[]` (Colchetes - Definição de Lista ou Acesso a Elementos)
Os colchetes têm dois usos na linguagem 0:

1. **Definição de lista**: Cria uma lista simples (array) sem chaves nomeadas. É equivalente a usar `{}` para listas simples.

**Exemplo de lista:**
```
[1 2 3 4 5]
```

**Equivalente com chaves:**
```
{1 2 3 4 5}
```

2. **Acesso a elementos**: Acessa elementos de um objeto ou texto por índice ou chave.

**Exemplo de acesso por índice:**
```
{
  jogos: {"Zelda" "Mario" "Minecraft"}
  jogos[0]
}[0]
---
"Zelda"
```

**Exemplo de acesso por chave:**
```
{
  dados: {nome: "João" idade: 30}
  dados["nome"]
}[0]
---
"João"
```

### `[inicio:fim]` (Fatiamento)
Extrai uma fatia (slice) de um objeto ou texto, do índice `inicio` até `fim-1`.

**Exemplo com texto:**
```
{
  frase: "Que a força esteja com você."
  frase[0:11]
}[0]
---
"Que a força"
```

**Exemplo com objeto:**
```
{
  series: {"Stranger Things" "Breaking Bad" "GoT"}
  series[0:2]
}[0]
---
{"Stranger Things","Breaking Bad"}
```

Quando `fim` é omitido, vai até o final:
```
{
  frase: "O destino de Hyrule está em suas mãos."
  frase[13:]
}[0]
---
"Hyrule está em suas mãos."
```

### `[.]` (Tamanho)
Retorna o número de elementos em um objeto ou o número de caracteres em um texto.

**Exemplo com texto:**
```
{
  frase: "O céu é o limite."
  frase[.]
}[0]
---
17
```

**Exemplo com objeto:**
```
{
  bandas: {"The Beatles" "Queen" "Pink Floyd"}
  bandas[.]
}[0]
---
3
```

### `[*]` (Chaves do Objeto)
Retorna todas as chaves de um objeto.

**Para objetos simples (sem chaves nomeadas):**
```
{
  objeto: {"item1" "item2" "item3"}
  objeto[*]
}[0]
---
{"0","1","2"}
```

**Para objetos com chaves nomeadas:**
```
{
  dados: {
    nome: "João"
    "valor_sem_chave"
    idade: 30
  }
  dados[*]
}[0]
---
{"nome","idade"}
```

### `...` (Operador de Espalhamento)
Expande os elementos de um objeto dentro de outro objeto. Similar ao spread operator de JavaScript.

**Exemplo:**
```
{
  filmes: {"Star Wars" "O Senhor dos Anéis" "Matrix"}
  {...filmes[0:2] "Jurassic Park"}
}[0]
---
{"Star Wars","O Senhor dos Anéis","Jurassic Park"}
```

## Funções

### `=>` (Seta - Definição de Função)
Define uma função. O lado esquerdo é o parâmetro e o lado direito é o corpo da função.

**Exemplo:**
```
{
  quadrado: x => x * x
  quadrado(5)
}[0]
---
25
```

**Função com múltiplos argumentos (recebe um objeto):**
```
{
  soma: args => args[0] + args[1]
  soma({3, 7})
}[0]
---
10
```

### `()` (Parênteses - Chamada de Função)
Chama uma função passando argumentos entre os parênteses.

**Exemplo:**
```
{
  quadrado: x => x * x
  quadrado(5)
}[0]
---
25
```

### `()` (Parênteses - Agrupamento)
Agrupa expressões para controlar a ordem de avaliação, alterando a precedência dos operadores.

**Exemplo:**
```
(2 + 3) * 4
---
20
```

Sem parênteses (precedência natural):
```
2 + 3 * 4
---
14
```

## Strings (Textos)

### `"` (Aspas - Delimitador de Texto)
Define uma string (texto). Todo texto deve estar entre aspas duplas.

**Exemplo:**
```
"Que a força esteja com você."
---
"Que a força esteja com você."
```

## Objetos com Chaves

### `:` (Dois-pontos - Atribuição de Chave)
Atribui um nome (chave) a um valor dentro de um objeto.

**Exemplo:**
```
{
  nome: "João"
  idade: 30
}
```

### `[chave]` (Propriedade Calculada)
Permite usar uma expressão como chave de propriedade em um objeto.

**Exemplo:**
```
{
  chave: "nome"
  objeto: {
    [chave]: "João"
  }
  objeto["nome"]
}[0]
---
"João"
```

## Acesso a Propriedades

### `.` (Ponto - Notação de Ponto)
Acessa propriedades nomeadas de um objeto usando notação de ponto, alternativa aos colchetes.

**Exemplo:**
```
{
  dados: {nome: "João" idade: 30}
  dados.nome
}[0]
---
"João"
```

## Importações

### `#` (Hashtag - Importação de Módulo)
Importa código de outro arquivo/módulo. O símbolo `#` é seguido do caminho do arquivo.

**Exemplo:**
```
retorna_5 # ./retorna_5.0

retorna_5()
---
5
```

## Comentários

### `//` (Barra Dupla - Comentário)
Marca o início de um comentário de linha. Tudo após `//` até o fim da linha é ignorado.

**Exemplo:**
```
// Este é um comentário
{
  soma: args => args[0] + args[1]  // Função que soma dois números
  soma({3, 7})
}[0]
---
10
```

## Operador Ternário

### `?` e `:` (Operador Condicional)
Implementa uma expressão condicional: `condição ? valor_se_verdadeiro : valor_se_falso`.

**Exemplo:**
```
{
  maior: args => args[0] > args[1] ? args[0] : args[1]
  maior({8, 3})
}[0]
---
8
```

## Conversão entre Caractere e Número

### Caractere para Número
Acesse o índice `[0]` de um texto de um único caractere para obter seu código Unicode:
```
"A"[0]
---
65
```

### Número para Caractere
Use multiplicação de objeto contendo o código com string vazia:
```
{
  codigo: 65
  {codigo} * ""
}[0]
---
"A"
```

## Precedência de Operadores

A linguagem 0 segue a seguinte precedência de operadores (do mais alto para o mais baixo):

1. Acesso a propriedades: `.`, `[]`
2. Chamada de função: `()`
3. Operador unário: `!`, `-` (negativo)
4. Multiplicação e Divisão: `*`, `/`
5. Adição e Subtração: `+`, `-`
6. Comparação: `>`, `<`, `>=`, `<=`
7. Igualdade: `==`, `!=`
8. E lógico: `&`
9. Ou lógico: `|`
10. Operador ternário: `?` `:`
11. Seta de função: `=>`

Use parênteses `()` para alterar a ordem de avaliação quando necessário.

## Resumo Visual

| Caractere(s) | Nome | Função |
|--------------|------|--------|
| `+` | Adição | Soma números |
| `-` | Subtração/Negativo | Subtrai números ou indica número negativo |
| `*` | Multiplicação | Multiplica números ou junta elementos de objeto |
| `/` | Divisão | Divide números ou divide strings |
| `&` | E lógico | Operação lógica AND |
| `|` | Ou lógico | Operação lógica OR |
| `!` | Não lógico | Negação lógica |
| `>` | Maior que | Comparação |
| `<` | Menor que | Comparação |
| `==` | Igual a | Comparação de igualdade |
| `!=` | Diferente de | Comparação de diferença |
| `>=` | Maior ou igual | Comparação |
| `<=` | Menor ou igual | Comparação |
| `{}` | Chaves | Define objeto/coleção |
| `[]` | Colchetes | Define lista simples ou acessa elementos por índice/chave |
| `[inicio:fim]` | Fatiamento | Extrai fatia de objeto ou texto |
| `[.]` | Tamanho | Retorna quantidade de elementos |
| `[*]` | Chaves | Retorna todas as chaves |
| `...` | Espalhamento | Expande elementos de um objeto |
| `=>` | Seta | Define função |
| `()` | Parênteses | Chama função ou agrupa expressões |
| `"` | Aspas | Delimita texto |
| `:` | Dois-pontos | Atribui chave a valor em objeto |
| `.` | Ponto | Acessa propriedade nomeada |
| `#` | Hashtag | Importa módulo |
| `//` | Barra dupla | Inicia comentário |
| `?` `:` | Ternário | Expressão condicional |
