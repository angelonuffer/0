# Exemplos da Linguagem 0

Este arquivo contém exemplos de código na Linguagem 0. Todos os blocos de código aqui são testados automaticamente pelo script `testes/documentação.js`.

## Operações Básicas

A linguagem suporta operações aritméticas e de comparação.

```0
1 + 1 == 2
```

```0
10 * 10 == 100
```

## Funções e Lambdas

As funções são definidas usando a sintaxe `parâmetro => corpo`.

```0
dobro = x => x * 2
dobro(5) == 10
```

## Guardas (Guards)

As funções podem usar guardas para tratar diferentes casos.

```0
fatorial = n =>
  | n <= 1 = 1
  | n * fatorial(n - 1)

fatorial(5) == 120
```

## Comparação Profunda

A função auxiliar `iguais` está disponível no ambiente de teste para comparar listas e objetos.

```0
iguais([[1 2 3] [1 2 3]])
```

```0
iguais([{a: 1 b: 2} {b: 2 a: 1}])
```

## Exemplo de Falha (Texto)

Se um bloco retornar um texto, ele será exibido e o teste falhará.
(Este bloco está comentado nos testes ou serve apenas como demonstração se mudarmos o comportamento)
No entanto, conforme os requisitos, se retornar texto, é falha.

```0
// Este bloco passaria se retornasse um número != 0
1
```
