# Exemplos de códigos na linguagem 0

Este documento apresenta exemplos de uso da linguagem 0, explicando conceitos básicos e avançados com exemplos práticos.

## Exportação

A exportação permite que uma função ou valor seja declarado e utilizado em outros módulos.

Exemplo:

```
42
---
42
```

Neste caso, o valor '42' é exportado como o valor padrão do módulo.

## Importação

A importação permite reutilizar código de outros módulos. O comando '#' é usado para importar um módulo pelo caminho especificado.

Exemplo:

```
retorna_5 # ./retorna_5.0

retorna_5()
---
5
```

Aqui, o arquivo 'retorna_5.0' é importado, e a função 'retorna_5' é chamada, retornando o valor '5'.

## Tipo lógico

Valores lógicos são usados para representar verdadeiro ou falso. Na linguagem 0, o valor '0' é considerado falso, e qualquer outro valor é considerado verdadeiro.

### Operador e (&)

O operador lógico '&' retorna falso ('0') se qualquer um dos operandos for falso. Caso ambos sejam verdadeiros, retorna o segundo valor.

Exemplos:

```
0 & 0
---
0
```

```
0 & 1
---
0
```

```
1 & 0
---
0
```

```
1 & 2
---
2
```

### Operador ou (|)

O operador lógico '|' retorna falso ('0') se ambos os operandos forem falsos. Caso contrário, retorna o primeiro valor verdadeiro.

Exemplos:

```
0 | 0
---
0
```

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

```
1 | 2
---
1
```

### Operador não (!)

O operador lógico '!' inverte o valor lógico. Se o valor for verdadeiro, retorna falso, e vice-versa.

Exemplos:

```
! 0
---
1
```

```
! 1
---
0
```

## Tipo número

Números são usados para realizar operações matemáticas e comparações.

### Operadores aritméticos

#### Adição (+)

Soma dois números.

```
42 + 5
---
47
```

#### Subtração (-)

Subtrai o segundo número do primeiro.

```
4 - 8
---
-4
```

#### Multiplicação (*)

Multiplica dois números.

```
3 * 4
---
12
```

#### Divisão (/)

Divide o primeiro número pelo segundo.

```
8 / 2
---
4
```

### Precedência de operadores aritméticos

Na linguagem 0, os operadores de multiplicação (`*`) e divisão (`/`) têm precedência maior do que os operadores de adição (`+`) e subtração (`-`). Isso significa que, em expressões sem parênteses, as operações de multiplicação e divisão são realizadas antes das de adição e subtração.

#### Exemplos:

```
2 + 3 * 4
---
14
```

Explicação: Primeiro, calcula-se `3 * 4`, que resulta em `12`. Em seguida, soma-se `2`, resultando em `14`.

```
10 - 6 / 2
---
7
```

Explicação: Primeiro, calcula-se `6 / 2`, que resulta em `3`. Em seguida, subtrai-se de `10`, resultando em `7`.

#### Combinação de operadores:

```
8 / 2 + 3 * 2
---
10
```

Explicação: Primeiro, calcula-se `8 / 2`, que resulta em `4`, e `3 * 2`, que resulta em `6`. Depois, soma-se `4 + 6`, resultando em `10`.

#### Uso de parênteses para alterar a ordem:

Se você deseja alterar a ordem de execução, pode usar parênteses para forçar a avaliação de certas partes da expressão primeiro.

```
(2 + 3) * 4
---
20
```

Explicação: Primeiro, calcula-se `2 + 3`, que resulta em `5`. Em seguida, multiplica-se por `4`, resultando em `20`.

```
10 - (6 / 2)
---
7
```

Explicação: Primeiro, calcula-se `6 / 2`, que resulta em `3`. Em seguida, subtrai-se de `10`, resultando em `7`.

Esses exemplos mostram como a precedência dos operadores afeta o resultado das expressões e como os parênteses podem ser usados para controlar a ordem de execução.

### Comparadores

Comparadores são usados para comparar dois valores.

#### Maior que (>)

Retorna '1' (verdadeiro) se o primeiro valor for maior que o segundo, caso contrário retorna '0' (falso).

```
2 > 8
---
0
```

```
8 > 2
---
1
```

```
8 > 8
---
0
```

#### Menor que (<)

Retorna '1' (verdadeiro) se o primeiro valor for menor que o segundo, caso contrário retorna '0' (falso).

```
8 < 2
---
0
```

```
2 < 8
---
1
```

```
8 < 8
---
0
```

#### Igual a (==)

Retorna '1' (verdadeiro) se os dois valores forem iguais, caso contrário retorna '0' (falso).

```
8 == 2
---
0
```

```
2 == 8
---
0
```

```
8 == 8
---
1
```

#### Diferente de (!=)

Retorna '1' (verdadeiro) se os dois valores forem diferentes, caso contrário retorna '0' (falso).

```
8 != 2
---
1
```

```
2 != 8
---
1
```

```
8 != 8
---
0
```

#### Maior ou igual a (>=)

```
8 >= 2
---
1
```

```
2 >= 8
---
0
```

```
8 >= 8
---
1
```

#### Menor ou igual a (<=)

```
8 <= 2
---
0
```

```
2 <= 8
---
1
```

```
8 <= 8
---
1
```

## Constantes

Constantes armazenam valores que não podem ser alterados posteriormente. O operador '=' é usado para atribuir valores.

Exemplo:

```
a = 5
b = 8

a + b
---
13
```

## Tipo texto

Textos são sequências de caracteres delimitadas por aspas.

Exemplo:

```
"Viva o momento."
---
"Viva o momento."
```

### Fatiando o texto

É possível acessar partes específicas de um texto usando índices.

```
frase = "Viva o momento."

frase[0]
---
"V"
```

```
frase = "Viva o momento."

frase[0:4]
---
"Viva"
```

### Gerando novos textos

Textos podem ser combinados dinamicamente.

```
frase = "O céu é azul."

`${frase[0:7]} o limite.`
---
"O céu é o limite."
```

### Obtendo o tamanho do texto

O operador '[.]' retorna o tamanho do texto.

```
frase = "O céu é o limite."

frase[.]
---
17
```

## Tipo lista

Listas armazenam coleções de valores.

### Fatiando a lista

```
frutas = ["abacaxi", "banana", "caju"]

frutas[0]
---
"abacaxi"
```

```
frutas = ["abacaxi", "banana", "caju"]

frutas[0:2]
---
["abacaxi","banana"]
```

### Espalhando itens

Itens de uma lista podem ser espalhados em uma nova lista.

```
frutas = ["abacaxi", "banana", "caju"]

[...frutas[0:2], "carambola"]
---
["abacaxi","banana","carambola"]
```

### Obtendo o tamanho da lista

```
frutas = ["abacaxi", "banana", "caju"]

frutas[.]
---
3
```

## Tipo objeto

Objetos armazenam pares de chave-valor.

### Acessando atributos

```
filosofia = {
  nome: "Existencialismo",
  conceito: "A existência precede a essência",
}

filosofia["nome"]
---
"Existencialismo"
```

```
filosofia = {
  nome: "Existencialismo",
  conceito: "A existência precede a essência",
}

filosofia.conceito
---
"A existência precede a essência"
```

### Espalhando atributos

```
filosofia = {
  nome: "Existencialismo",
  conceito: "A existência precede a essência",
}

{
  ...filosofia,
  perspectiva: "Foco na liberdade individual e responsabilidade pessoal",
}
---
{"nome":"Existencialismo","conceito":"A existência precede a essência","perspectiva":"Foco na liberdade individual e responsabilidade pessoal"}
```

## Função

Funções encapsulam lógica reutilizável.

```
quadrado = (x) => x * x

quadrado(5)
---
25
```

Funções podem receber mais de um parâmetro para realizar operações mais complexas.

### Soma de dois números

Esta função recebe dois números como parâmetros e retorna a soma deles.

```
soma = (a, b) => a + b

soma(3, 7)
---
10
```

### Verificar se um número está dentro de um intervalo

Esta função verifica se um número está dentro de um intervalo definido por dois valores (mínimo e máximo).

```
dentro_intervalo = (n, mín, máx) => n >= mín & n <= máx

dentro_intervalo(5, 1, 10)
---
1
```

```
dentro_intervalo = (n, mín, máx) => n >= mín & n <= máx

dentro_intervalo(15, 1, 10)
---
0
```

### Concatenar dois textos

Esta função recebe dois textos e os combina em uma única string.

```
concatena = (texto1, texto2) => `${texto1} ${texto2}`

concatena("Olá", "mundo!")
---
"Olá mundo!"
```

### Calcular a área de um retângulo

Esta função calcula a área de um retângulo, dado sua largura e altura.

```
área_retangulo = (largura, altura) => largura * altura

área_retangulo(5, 10)
---
50
```

### Encontrar o maior de dois números

Esta função retorna o maior valor entre dois números fornecidos.

```
maior = (a, b) => a > b & a | b

maior(8, 3)
---
8
```

```
maior = (a, b) => a > b & a | b

maior(2, 9)
---
9
```

Esses exemplos mostram como funções com múltiplos parâmetros podem ser usadas para resolver problemas variados de forma simples e eficiente.