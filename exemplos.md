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

Neste caso, o valor `42` é exportado como o valor padrão do módulo.

## Importação

A importação permite reutilizar código de outros módulos. O comando `#` é usado para importar um módulo pelo caminho especificado.

Exemplo:

```
retorna_5 # ./retorna_5.0

retorna_5()
---
5
```

Aqui, o arquivo `retorna_5.0` é importado, e a função `retorna_5` é chamada, retornando o valor `5`.

## Carregando conteúdo de um arquivo

O comando `@` é usado para carregar o conteúdo de um arquivo diretamente no código.

Exemplo:

```
frase @ ./frase.txt

frase
---
"É perigoso ir sozinho! Pegue isto."
```

Neste exemplo, o conteúdo do arquivo `mensagem.txt` é carregado e atribuído à variável `conteudo`. Ao acessar `conteudo`, o texto do arquivo é exibido.

## Tipo lógico

Valores lógicos são usados para representar verdadeiro ou falso. Na linguagem 0, o valor `0` é considerado falso, e qualquer outro valor é considerado verdadeiro.

### Operador e (&)

O operador lógico `&` retorna falso (`0`) se qualquer um dos operandos for falso. Caso ambos sejam verdadeiros, retorna o segundo valor.

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

O operador lógico `|` retorna falso (`0`) se ambos os operandos forem falsos. Caso contrário, retorna o primeiro valor verdadeiro.

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

O operador lógico `!` inverte o valor lógico. Se o valor for verdadeiro, retorna falso, e vice-versa.

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

### Precedência de operadores aritméticos

Na linguagem 0, os operadores de multiplicação (`*`) e divisão (`/`) têm precedência maior do que os operadores de adição (`+`) e subtração (`-`). Isso significa que, em expressões sem parênteses, as operações de multiplicação e divisão são realizadas antes das de adição e subtração.

#### Exemplos:

```
2 + 3 * 4
---
14
```

Explicação: Primeiro, calcula-se `3 * 4`, que resulta em `12`. Em seguida, soma-se `2`, resultando em `14`.

```
10 - 6 / 2
---
7
```

Explicação: Primeiro, calcula-se `6 / 2`, que resulta em `3`. Em seguida, subtrai-se de `10`, resultando em `7`.

#### Combinação de operadores:

```
8 / 2 + 3 * 2
---
10
```

Explicação: Primeiro, calcula-se `8 / 2`, que resulta em `4`, e `3 * 2`, que resulta em `6`. Depois, soma-se `4 + 6`, resultando em `10`.

#### Uso de parênteses para alterar a ordem:

Se você deseja alterar a ordem de execução, pode usar parênteses para forçar a avaliação de certas partes da expressão primeiro.

```
(2 + 3) * 4
---
20
```

Explicação: Primeiro, calcula-se `2 + 3`, que resulta em `5`. Em seguida, multiplica-se por `4`, resultando em `20`.

```
10 - (6 / 2)
---
7
```

Explicação: Primeiro, calcula-se `6 / 2`, que resulta em `3`. Em seguida, subtrai-se de `10`, resultando em `7`.

Esses exemplos showram como a precedência dos operadores afeta o resultado das expressões e como os parênteses podem ser usados para controlar a ordem de execução.

### Comparadores

Comparadores são usados para comparar dois valores.

#### Maior que (>)

Retorna `1` (verdadeiro) se o primeiro valor for maior que o segundo, caso contrário retorna `0` (falso).

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

Retorna `1` (verdadeiro) se o primeiro valor for menor que o segundo, caso contrário retorna `0` (falso).

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

Retorna `1` (verdadeiro) se os dois valores forem iguais, caso contrário retorna `0` (falso).

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

Retorna `1` (verdadeiro) se os dois valores forem diferentes, caso contrário retorna `0` (falso).

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

## Constantes

Constantes armazenam valores que não podem ser alterados posteriormente. O operador `=` é usado para atribuir valores.

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
"Que a força esteja com você."
---
"Que a força esteja com você."
```

### Fatiando o texto

É possível acessar partes específicas de um texto usando índices.

```
frase = "Que a força esteja com você."

frase[0:1]
---
"Q"
```

```
frase = "Que a força esteja com você."

frase[0:11]
---
"Que a força"
```

```
frase = "O destino de Hyrule está em suas mãos."

frase[13:]
---
"Hyrule está em suas mãos."
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

O operador `[.]` retorna o tamanho do texto.

```
frase = "O céu é o limite."

frase[.]
---
17
```

## Conversão entre caractere e número
Na linguagem 0, é possível converter um caractere para seu valor numérico (código Unicode) e vice-versa de forma simples.

### Converter caractere em número

Para obter o valor numérico de um caractere, basta acessar o índice `[0]` do texto:

```
caractere = "A"

caractere[0]
---
65
```

Neste exemplo, `"A"` é convertido para seu código numérico `65`.

### Converter número em caractere

Para obter o caractere correspondente a um valor numérico, basta incluir o número em um modelo de texto:

```
codigo = 65

`${codigo}`
---
"A"
```

Neste exemplo, `65` é convertido para o caractere `"A"`.

Essas técnicas permitem manipular facilmente caracteres e seus códigos numéricos na linguagem 0.

## Tipo lista

Listas armazenam coleções de valores.

### Fatiando a lista

```
jogos = ["The Legend of Zelda" "Super Mario Bros." "Minecraft"]

jogos[0]
---
"The Legend of Zelda"
```

```
series = ["Stranger Things" "Breaking Bad" "Game of Thrones"]

series[0:2]
---
["Stranger Things","Breaking Bad"]
```

```
jogos = ["The Legend of Zelda" "Super Mario Bros." "Minecraft" "The Witcher"]

jogos[2:]
---
["Minecraft","The Witcher"]
```

### Espalhando itens

Itens de uma lista podem ser espalhados em uma nova lista.

```
filmes = ["Star Wars" "O Senhor dos Anéis" "Matrix"]

[...filmes[0:2] "Jurassic Park"]
---
["Star Wars","O Senhor dos Anéis","Jurassic Park"]
```

### Obtendo o tamanho da lista

```
bandas = ["The Beatles" "Queen" "Pink Floyd"]

bandas[.]
---
3
```

## Tipo objeto

Objetos armazenam pares de chave-valor.

### Acessando atributos

```
jogo = {
  título: "The Legend of Zelda"
  gênero: "Aventura"
}

jogo["título"]
---
"The Legend of Zelda"
```

```
jogo = {
  nome: "The Legend of Zelda"
  gênero: "Aventura"
}

jogo.gênero
---
"Aventura"
```

### Espalhando atributos

```
jogo = {
  nome: "The Legend of Zelda"
  gênero: "Aventura"
}

{
  ...jogo
  plataforma: "Nintendo"
}
---
{"nome":"The Legend of Zelda","gênero":"Aventura","plataforma":"Nintendo"}
```

### Propriedade calculada em objeto

Propriedades calculadas permitem definir chaves dinamicamente em um objeto, com base em expressões.

```
chave = "personagem"

objeto = {
  [chave]: "Mario"
}

objeto["personagem"]
---
"Mario"
```

## Função

Funções encapsulam lógica reutilizável.

```
quadrado = x => x * x

quadrado(5)
---
25
```

Funções podem receber mais de um parâmetro para realizar operações mais complexas.

### Soma de dois números

Esta função recebe dois números como parâmetros e retorna a soma deles.

```
soma = a b => a + b

soma(3 7)
---
10
```

### Verificar se um número está dentro de um intervalo

Esta função verifica se um número está dentro de um intervalo definido por dois valores (mínimo e máximo).

```
dentro_intervalo = n mín máx => n >= mín & n <= máx

dentro_intervalo(5 1 10)
---
1
```

```
dentro_intervalo = n mín máx => n >= mín & n <= máx

dentro_intervalo(15 1 10)
---
0
```

### Concatenar dois textos

Esta função recebe dois textos e os combina em uma única string.

```
nome_completo = personagem universo => `${personagem} de ${universo}`

nome_completo("Geralt" "The Witcher")
---
"Geralt de The Witcher"
```

### Calcular a área de um retângulo

Esta função calcula a área de um retângulo, dado sua largura e altura.

```
área_retangulo = largura altura => largura * altura

área_retangulo(5 10)
---
50
```

### Calcular a área de um triângulo

Esta função calcula a área de um triângulo com base na base e na altura fornecidas.

```
área_triangulo = base altura => (
  divisor = 2
  área = (base * altura) / divisor
  área
)

área_triangulo(10 8)
---
40
```

### Encontrar o maior de dois números

Esta função retorna o maior valor entre dois números fornecidos.

```
maior = a b => a > b ? a : b

maior(8 3)
---
8
```

```
maior = a b => a > b ? a : b

maior(2 9)
---
9
```

Esses exemplos mostram como funções com múltiplos parâmetros podem ser usadas para resolver problemas variados de forma simples e eficiente.

## Funções dentro de listas

Na linguagem 0, é possível armazenar funções dentro de listas e chamá-las diretamente pelo índice. Isso permite criar coleções de comportamentos ou ações.

```
iniciais = [
  () => "Bulbasaur"
  () => "Charmander"
  () => "Squirtle"
]

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
soma = a b => a + b

soma(3 7)
---
10
```