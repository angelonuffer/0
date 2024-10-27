# Exemplos de códigos na linguagem 0

## Exportação

A expressão retorna a função declarada com o nome "#".

```
#() = 42
---
42
```

## Importação

O comando "#" importa um arquivo a partir do caminho.

```
retorna_5 # ./retorna_5.0
#() = retorna_5()
---
5
```

## Tipo lógico

O valor 0 é considerado falso. Qualquer outro valor é considerado verdadeiro.

### Operador e (&)

Se qualquer valor for falso, retorna falso.

```
#() = 0 & 0
---
0
```

```
#() = 0 & 1
---
0
```

```
#() = 1 & 0
---
0
```

Se os dois valores forem verdadeiros, retorna o segundo.

```
#() = 1 & 2
---
2
```

### Operador ou (|)

Se os dois valores forem falsos, retorna falso.

```
#() = 0 | 0
---
0
```

Se qualquer valor for verdadeiro, retorna o primeiro verdadeiro.

```
#() = 0 | 1
---
1
```

```
#() = 1 | 0
---
1
```

```
#() = 1 | 2
---
1
```

### Operador não (!)

```
#() = ! 0
---
1
```

```
#() = ! 1
---
0
```

## Tipo número

### Operadores aritméticos

#### Adição (+)

```
#() = 42 + 5
---
47
```

#### Subtração (-)

```
#() = 4 - 8
---
-4
```

#### Multiplicação (*)

```
#() = 3 * 4
---
12
```

#### Divisão (/)

```
#() = 8 / 2
---
4
```

### Comparadores

#### Maior que (>)

```
#() = 2 > 8
---
0
```

```
#() = 8 > 2
---
1
```

```
#() = 8 > 8
---
0
```

#### Menor que (<)

```
#() = 8 < 2
---
0
```

```
#() = 2 < 8
---
1
```

```
#() = 8 < 8
---
0
```

#### Igual a (==)

```
#() = 8 == 2
---
0
```

```
#() = 2 == 8
---
0
```

```
#() = 8 == 8
---
1
```

#### Diferente de (!=)

```
#() = 8 != 2
---
1
```

```
#() = 2 != 8
---
1
```

```
#() = 8 != 8
---
0
```

#### Maior ou igual a (>=)

```
#() = 8 >= 2
---
1
```

```
#() = 2 >= 8
---
0
```

```
#() = 8 >= 8
---
1
```

#### Menor ou igual a (<=)

```
#() = 8 <= 2
---
0
```

```
#() = 2 <= 8
---
1
```

```
#() = 8 <= 8
---
1
```

## Variáveis

O operador = atribui valores a variáveis.

```
a = 5
b = 8
#() = a + b
---
13
```

## Tipo texto

```
#() = "Viva o momento."
---
Viva o momento.
```

Fatiando o texto.

```
frase = "Viva o momento."
#() = frase[0]
---
V
```

```
frase = "Viva o momento."
#() = frase[0:4]
---
Viva
```

Gerando novos textos a partir do modelo.

```
frase = "O céu é azul."
#() = `${frase[0:7]} o limite.`
---
O céu é o limite.
```

Obtendo o tamanho do texto.

```
frase = "O céu é o limite."
#() = frase[.]
---
17
```

## Tipo lista

Fatiando a lista.

```
frutas = ["abacaxi", "banana", "caju"]
#() = frutas[0]
---
abacaxi
```

```
frutas = ["abacaxi", "banana", "caju"]
#() = frutas[0:2]
---
["abacaxi", "banana"]
```

Espalhando os itens de uma lista existente numa nova.

```
frutas = ["abacaxi", "banana", "caju"]
#() = [...frutas[0:2], "carambola"]
---
["abacaxi", "banana", "carambola"]
```

Obtendo o tamanho da lista.

```
frutas = ["abacaxi", "banana", "caju"]
#() = frutas[.]
---
3
```

## Tipo objeto

Acessando um atributo.

```
filosofia = {
  nome: "Existencialismo",
  conceito: "A existência precede a essência",
}
#() = filosofia["nome"]
---
Existencialismo
```

```
filosofia = {
  nome: "Existencialismo",
  conceito: "A existência precede a essência",
}
#() = filosofia.conceito
---
A existência precede a essência
```

Espalhando os atributos de um objeto existente num novo.

```
filosofia = {
  nome: "Existencialismo",
  conceito: "A existência precede a essência",
}
#() = {
  ...filosofia,
  perspectiva: "Foco na liberdade individual e responsabilidade pessoal",
}
---
{
  "nome": "Existencialismo",
  "conceito": "A existência precede a essência",
  "perspectiva": "Foco na liberdade individual e responsabilidade pessoal"
}
```

## Função

```
quadrado(x) = x * x
#() = quadrado(5)
---
25
```

## Comparador de tipos

```
#() = 1 : 2
---
1
```

```
#() = 1 : ""
---
0
```