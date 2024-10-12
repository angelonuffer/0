# Exemplos de códigos na linguagem 0

## Exportação

A expressão retorna a função declarada com o nome "#".

```
#() = 42
---
42
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

## Importação

A função "#" importa um arquivo a partir do caminho.

```
retorna_5 = #("./retorna_5.0")
#() = retorna_5()
---
5
```

É possível chamar a função na mesma linha que importa.

```
#() = #("./retorna_5.0")()
---
5
```