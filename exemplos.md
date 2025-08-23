# Exemplos de códigos na linguagem 0

Este documento apresenta exemplos de uso da linguagem 0, explicando conceitos básicos e avançados com exemplos práticos.

## Exportação

A exportação define o valor que um módulo fornecerá ao ser importado.

Exemplo:

```
42
---
42
```

Neste exemplo, `42` é o valor exportado pelo módulo.

## Importação

A importação permite usar código de outros módulos. Use `#` seguido do caminho do arquivo para importar.

Exemplo:

```
retorna_5 # ./retorna_5.0

retorna_5()
---
5
```

Neste exemplo, o módulo `retorna_5.0` é importado, e sua função `retorna_5` é utilizada.


## Tipo lógico

Representa verdadeiro ou falso. `0` é falso, qualquer outro valor é verdadeiro.

### Operador e (&)

Retorna `0` (falso) se um dos operandos for falso. Se ambos verdadeiros, retorna o segundo valor.

Exemplos:

```
0 & 1
---
0
```

```
1 & 2
---
2
```

### Operador ou (|)

Retorna `0` (falso) se ambos os operandos forem falsos. Senão, retorna o primeiro valor verdadeiro.

Exemplos:

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

### Operador não (!)

Inverte o valor lógico: `0` (falso) vira `1` (verdadeiro), e vice-versa.

Exemplo:

```
!0
---
1
```

## Tipo número

Utilizado para operações matemáticas e comparações.

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

### Números negativos
Números negativos são escritos com o sinal `-` diretamente antes do número.

```
-42
---
-42
```

Números negativos podem ser usados em operações aritméticas:
```
-5 + 3
---
-2
```

```
10 + -7
---
3
```

```
-3 * 4
---
-12
```

Quando usar números negativos em sequência, use parênteses para evitar ambiguidade com o operador de subtração:
```
(-5) + (-3)
---
-8
```

### Precedência de operadores aritméticos
Multiplicação (`*`) e divisão (`/`) têm precedência sobre adição (`+`) e subtração (`-`). Use parênteses `()` para alterar a ordem da avaliação.

Exemplos:
```
2 + 3 * 4 // Equivalente a 2 + (3 * 4)
---
14
```

```
(2 + 3) * 4 // Parênteses alteram a ordem
---
20
```

### Comparadores
Comparam dois valores.

#### Maior que (>)
Retorna `1` (verdadeiro) se o primeiro valor for maior que o segundo, senão `0` (falso).
```
8 > 2
---
1
```

#### Menor que (<)
Retorna `1` se o primeiro valor for menor que o segundo, senão `0`.
```
2 < 8
---
1
```

#### Igual a (==)
Retorna `1` se os valores forem iguais, senão `0`.
```
8 == 8
---
1
```

#### Diferente de (!=)
Retorna `1` se os valores forem diferentes, senão `0`.
```
8 != 2
---
1
```

#### Maior ou igual a (>=)
Retorna `1` se o primeiro valor for maior ou igual ao segundo, senão `0`.
```
8 >= 8
---
1
```

#### Menor ou igual a (<=)
Retorna `1` se o primeiro valor for menor ou igual ao segundo, senão `0`.
```
2 <= 8
---
1
```

## Constantes

Constantes armazenam valores fixos usando `=`.

Exemplo:

```
a = 5
b = 8

a + b
---
13
```

## Tipo texto

Sequências de caracteres entre aspas.

Exemplo:
```
"Que a força esteja com você."
---
"Que a força esteja com você."
```

### Fatiando o texto
Acesse partes de um texto com índices `[inicio:fim]`.

Exemplos:
```
frase = "Que a força esteja com você."

frase[0:11] // Do início até o índice 10
---
"Que a força"
```

```
frase = "O destino de Hyrule está em suas mãos."

frase[13:] // Do índice 13 até o fim
---
"Hyrule está em suas mãos."
```

### Gerando novos textos
Combine textos e expressões com `${}`.

Exemplo:
```
frase = "O céu é azul."

`${frase[0:7]} o limite.`
---
"O céu é o limite."
```

### Obtendo o tamanho do texto
Use `[.]` para obter o número de caracteres.

Exemplo:
```
frase = "O céu é o limite."

frase[.]
---
17
```

## Conversão entre caractere e número

Converta entre caracteres e seus códigos numéricos (Unicode).

### Caractere para Número
Acesse o índice `[0]` de um texto de um único caractere.
```
"A"[0]
---
65
```

### Número para Caractere
Use a interpolação de texto `${}`.
```
codigo = 65
`${codigo}`
---
"A"
```

## Tipo lista

Armazena coleções ordenadas de valores.

### Fatiando a lista
Acesse elementos por índice ou um intervalo de índices.

Exemplos:
```
jogos = {"Zelda" "Mario" "Minecraft"}

jogos[0] // Primeiro elemento
---
"Zelda"
```

```
series = {"Stranger Things" "Breaking Bad" "GoT"}

series[0:2] // Do primeiro ao segundo elemento
---
{"Stranger Things","Breaking Bad"}
```

### Espalhando itens
Use `...` para incluir itens de uma lista em outra.

Exemplo:
```
filmes = {"Star Wars" "O Senhor dos Anéis" "Matrix"}

{...filmes[0:2] "Jurassic Park"}
---
{"Star Wars","O Senhor dos Anéis","Jurassic Park"}
```

### Obtendo o tamanho da lista
Use `[.]` para obter o número de itens.

Exemplo:
```
bandas = {"The Beatles" "Queen" "Pink Floyd"}

bandas[.]
---
3
```

### Obtendo as chaves da lista
Use `[*]` para obter todas as chaves da lista.

Para listas simples, retorna os índices como strings:
```
lista = {"item1" "item2" "item3"}

lista[*]
---
{"0","1","2"}
```

Para listas com chaves nomeadas, retorna apenas as chaves explícitas:
```
dados = {
  nome: "João"
  "valor_sem_chave"
  idade: 30
  "outro_valor_sem_chave"
}

dados[*]
---
{"nome","idade"}
```

### Chaves opcionais em listas
Listas podem conter itens com chaves explícitas além de valores com índices automáticos.

Exemplo:
```
dados = {
  nome: "João"
  "valor_sem_chave"
  idade: 30
  "outro_valor_sem_chave"
}

dados["nome"]
---
"João"
```

```
dados = {
  nome: "João"
  "valor_sem_chave"
  idade: 30
  "outro_valor_sem_chave"
}

dados[0]
---
"valor_sem_chave"
```

```
dados = {
  nome: "João"
  "valor_sem_chave"
  idade: 30
  "outro_valor_sem_chave"
}

dados["idade"]
---
30
```

```
dados = {
  nome: "João"
  "primeiro_valor"
  idade: 30
  "segundo_valor"
}

dados[0:2]
---
{"primeiro_valor","segundo_valor"}
```

### Acessando chaves com notação de ponto
Além da notação de colchetes, você pode acessar itens com chaves usando a notação de ponto.

Exemplo:
```
dados = {
  nome: "João"
  "valor_sem_chave"
  idade: 30
  "outro_valor_sem_chave"
}

dados.nome
---
"João"
```

```
dados = {
  nome: "João"
  "valor_sem_chave"
  idade: 30
  "outro_valor_sem_chave"
}

dados.idade
---
30
```

### Propriedade calculada em lista

Propriedades calculadas permitem definir chaves dinamicamente em uma lista, com base em expressões.

```
chave = "nome"

lista = {
  [chave]: "João"
  "valor_sem_chave"
}

lista["nome"]
---
"João"
```

### Referenciando propriedades da própria lista

Propriedades podem referenciar outras propriedades definidas na mesma lista.

```
pessoa = {
  nome: "João"
  sobrenome: "Silva"
  nomeCompleto: nome + " " + sobrenome
}

pessoa.nomeCompleto
---
"João Silva"
```

```
calculos = {
  base: 10
  dobro: base * 2
  triplo: base * 3
  somaDobroTriplo: dobro + triplo
}

calculos.somaDobroTriplo
---
50
```

## Função

Funções encapsulam lógica reutilizável.

```
quadrado = x => x * x

quadrado 5
---
25
```

Funções que precisam de múltiplos valores recebem uma lista como parâmetro para realizar operações mais complexas.

### Soma de dois números

Esta função recebe uma lista com dois números como parâmetro e retorna a soma deles.

```
soma = args => args[0] + args[1]

soma({3, 7})
---
10
```

### Verificar se um número está dentro de um intervalo

Esta função verifica se um número está dentro de um intervalo definido por dois valores (mínimo e máximo). Ela recebe uma lista com três valores: o número a verificar, o valor mínimo e o valor máximo.

```
dentro_intervalo = args => args[0] >= args[1] & args[0] <= args[2]

dentro_intervalo({5, 1, 10})
---
1
```

```
dentro_intervalo = args => args[0] >= args[1] & args[0] <= args[2]

dentro_intervalo({15, 1, 10})
---
0
```

### Concatenar dois textos

Esta função recebe uma lista com dois textos e os combina em uma única string.

```
nome_completo = args => `${args[0]} de ${args[1]}`

nome_completo({"Geralt", "The Witcher"})
---
"Geralt de The Witcher"
```

### Calcular a área de um retângulo

Esta função calcula a área de um retângulo, recebendo uma lista com largura e altura.

```
área_retangulo = args => args[0] * args[1]

área_retangulo({5, 10})
---
50
```

### Calcular a área de um triângulo

Esta função calcula a área de um triângulo com base na base e na altura fornecidas em uma lista.

```
área_triangulo = args => (
  divisor = 2
  área = (args[0] * args[1]) / divisor
  área
)

área_triangulo({10, 8})
---
40
```

### Encontrar o maior de dois números

Esta função retorna o maior valor entre dois números fornecidos em uma lista.

```
maior = args => args[0] > args[1] ? args[0] : args[1]

maior({8, 3})
---
8
```

```
maior = args => args[0] > args[1] ? args[0] : args[1]

maior({2, 9})
---
9
```

Esses exemplos mostram como funções com múltiplos parâmetros recebem uma lista com os argumentos e podem ser usadas para resolver problemas variados de forma simples e eficiente.

## Funções dentro de listas

Na linguagem 0, é possível armazenar funções dentro de listas e chamá-las diretamente pelo índice. Isso permite criar coleções de comportamentos ou ações.

```
iniciais = {
  () => "Bulbasaur"
  () => "Charmander"
  () => "Squirtle"
}

iniciais[1]()
---
"Charmander"
```

Neste exemplo, a lista `iniciais` contém três funções, cada uma retornando o nome de um Pokémon inicial da primeira geração. Ao acessar `iniciais[1]`, obtemos a função que retorna "Charmander". Ao adicionar `()`, executamos essa função e obtemos o resultado.

## Comentários

Na linguagem 0, comentários podem ser adicionados ao código usando `//`. Eles são ignorados durante a execução e servem para documentar ou explicar partes do código.

Exemplo:

```
// Este é um comentário explicando o código abaixo
soma = args => args[0] + args[1]

soma({3, 7})
---
10
```