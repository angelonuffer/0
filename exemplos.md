# Exemplos de códigos na linguagem 0

## Exportando Funções

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

## Aritmética

Os operadores "+" e "-" são usados para adição e subtração.

```
#() = 42 + 5
---
47
```

```
#() = 4 - 8
---
-4
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

#0 é uma função que importa uma função a partir do caminho do arquivo.

```
retorna_5 = #0("./retorna_5.0")
#() = retorna_5()
---
5
```

É possível chamar a função na mesma linha que importa.

```
#() = #0("./retorna_5.0")()
---
5
```