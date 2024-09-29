# Exemplos de códigos na linguagem 0

## Funções

As funções são interpretadas e retornam o valor de #1.

```
#1 = 42
---
42
```

```
#1 = 4
---
4
```

## Aritmética

O operador + soma dois números.

```
#1 = 42 + 5
---
47
```

```
#1 = 4 + 8
---
12
```

O operador - subtrai dois números.

```
#1 = 42 - 5
---
37
```

```
#1 = 4 - 8
---
-4
```

## Variáveis

O operador = atribui valores a variáveis.

```
a = 5
b = 8
#1 = a + b
---
13
```

## Importação

#0 é uma função que importa uma função a partir do caminho do arquivo.

```
retorna_5 = #0("./retorna_5.0")
#1 = retorna_5()
---
5
```

É possível chamar a função na mesma linha que importa.

```
#1 = #0("./retorna_5.0")()
---
5
```