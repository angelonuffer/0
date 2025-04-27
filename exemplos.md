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

## Variáveis

Variáveis armazenam valores que podem ser usados posteriormente. O operador '=' é usado para atribuir valores.

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