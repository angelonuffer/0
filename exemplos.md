# Exemplos de códigos na linguagem 0

## Exportação

A expressão retorna a função declarada com o nome "#".

```
#() = 42
---
42
```

```
#() = 4
---
4
```

## Tipo número

Os seguintes operadores são usados para operações com valores do tipo número.

### Adição (+)

```
#() = 42 + 5
---
47
```

### Subtração (-)

```
#() = 4 - 8
---
-4
```

### Multiplicação (*)

```
#() = 3 * 4
---
12
```

### Divisão (/)

```
#() = 8 / 2
---
4
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