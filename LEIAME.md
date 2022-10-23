# 0

0 (zero) é uma linguagem de programação fortemente tipada com sintaxe simples.
Seus comandos embutidos são escritos com números, podendo ser traduzidos para
qualquer linguagem natural.

Atualmente é possível transpilar apenas para javascript e executar com nodejs.

## Exemplo de código

    #0 "pt.0" *

    nome = "Zero"
    escreva "Olá, " nome "!"

O exemplo pode ser transpilado e executado:

    $ node 0.mjs exemplo.0 | node
    Olá, Zero!

Veja mais exemplos em "teste.0".

## Testando

O comando "js-beautify" é opcional e recomendado quando estiver desenvolvendo
o transpilador.

    $ node 0.mjs teste.0 | js-beautify | node