# Exemplos da Linguagem 0

Este arquivo contém exemplos de código na Linguagem 0. Todos os blocos de código aqui são testados automaticamente pelo script `testes/documentação.js`.

## Operações Básicas

A linguagem suporta operações aritméticas e de comparação.

```0
iguais([ 1 + 1  2 ])
```

```0
iguais([ 10 * 10  100 ])
```

## Funções e Lambdas

As funções são definidas usando a sintaxe `parâmetro => corpo`.

```0
dobro = x => x * 2
iguais([ dobro(5)  10 ])
```

## Guardas (Guards)

As funções podem usar guardas para tratar diferentes casos.

```0
fatorial = n =>
  | n <= 1 = 1
  | n * fatorial(n - 1)

iguais([ fatorial(5)  120 ])
```