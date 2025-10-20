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

## Declarações no nível do módulo

Você pode declarar constantes no nível do módulo, antes da expressão principal. Isso funciona de maneira similar às declarações dentro de parênteses, mas no escopo global do módulo.

Sintaxe: `nome1 = valor1` seguido de espaço ou nova linha, depois `nome2 = valor2`, e assim por diante, até a expressão principal.

Exemplo básico:

```
pi = 3.14159
raio = 5

_ => pi * raio * raio
---
78.53975
```

As constantes podem referenciar outras constantes declaradas anteriormente:

```
base = 10
altura = 5
area = base * altura

_ => area
---
50
```

Exemplo com múltiplas declarações:

```
nome = "João"
sobrenome = "Silva"
ano_nascimento = 1990
ano_atual = 2024
idade = ano_atual - ano_nascimento

_ => {nome " " sobrenome " tem " {idade} * "" " anos"} * ""
---
"João Silva tem 34 anos"
```

As constantes declaradas no módulo ficam disponíveis para toda a expressão principal:

```
taxa = 0.1
valor_base = 100

_ => {
  valor_com_taxa: valor_base * (1 + taxa)
  desconto: valor_base * 0.05
  valor_final: valor_com_taxa - desconto
}.valor_final
---
105
```

Diferentemente de declarações em parênteses, as declarações no nível do módulo afetam todo o módulo e estão disponíveis em qualquer parte da expressão principal.


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

Quando aplicado a um objeto e um texto, junta os elementos do objeto usando o texto como separador:
```
{"a" "b" "c"} * " "
---
"a b c"
```

#### Divisão (/)
Divide o primeiro número pelo segundo.
```
8 / 2
---
4
```

Quando aplicado a textos, divide o texto usando o segundo operando como separador:
```
"a b c" / " "
---
{"a" "b" "c"}
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

### Declarações de constantes em parênteses
Você pode declarar constantes dentro dos parênteses antes da avaliação da expressão principal. Isso permite criar variáveis locais temporárias que existem apenas dentro do contexto dos parênteses.

Sintaxe: `( nome1 = valor1 nome2 = valor2 expressão )`

Exemplo básico:
```
( a = 2 b = 3 a + b )
---
5
```

As constantes podem referenciar outras constantes declaradas anteriormente:
```
( a = 5 b = a * 2 b + 3 )
---
13
```

Múltiplas declarações com operações complexas:
```
( x = 4 y = 5 z = 10 x * y + z )
---
30
```

Parênteses com declarações podem ser aninhados:
```
( a = 2 b = ( x = 3 y = 4 x + y ) a * b )
---
14
```

As constantes declaradas em parênteses não afetam o escopo externo:
```
{
  x: 10
  resultado: ( x = 5 x * 2 )
  final_x: x
}.final_x
---
10
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
{
  frase: "Que a força esteja com você."
  frase[0:11] // Do início até o índice 10
}[0]
---
"Que a força"
```

```
{
  frase: "O destino de Hyrule está em suas mãos."
  frase[13:] // Do índice 13 até o fim
}[0]
---
"Hyrule está em suas mãos."
```

### Gerando novos textos
Combine textos e expressões usando multiplicação de objetos.

Exemplo:
```
{
  frase: "O céu é azul."
  {frase[0:7] " o limite."} * ""
}[0]
---
"O céu é o limite."
```

### Obtendo o tamanho do texto
Use `[.]` para obter o número de caracteres.

Exemplo:
```
{
  frase: "O céu é o limite."
  frase[.]
}[0]
---
17
```

### Dividindo o texto
Use o operador `/` para dividir um texto em partes usando um separador.

Exemplos:
```
"a b c" / " "
---
{"a" "b" "c"}
```

```
"apple,banana,cherry" / ","
---
{"apple" "banana" "cherry"}
```

```
{
  frase: "João Silva Santos"
  nomes: frase / " "
  nomes[0] // Primeiro nome
}[0]
---
"João"
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
Use multiplicação de objeto com string vazia.
```
{
  codigo: 65
  {codigo} * ""
}[0]
---
"A"
```

## Tipo objeto

Armazena coleções ordenadas de valores.

### Sintaxe de listas com colchetes

Listas simples podem ser criadas usando colchetes `[]`, que é uma sintaxe alternativa às chaves `{}` para objetos sem chaves nomeadas.

Exemplo com colchetes:
```
["Zelda" "Mario" "Minecraft"]
---
["Zelda","Mario","Minecraft"]
```

Exemplo equivalente com chaves:
```
{"Zelda" "Mario" "Minecraft"}
---
["Zelda","Mario","Minecraft"]
```

Ambas as sintaxes produzem o mesmo resultado. Use `[]` quando quiser enfatizar que está criando uma lista simples, e `{}` quando quiser criar um objeto que pode ter chaves nomeadas.

### Fatiando o objeto
Acesse elementos por índice ou um intervalo de índices.

Exemplos com colchetes:
```
{
  jogos: ["Zelda" "Mario" "Minecraft"]
  jogos[0] // Primeiro elemento
}[0]
---
"Zelda"
```

```
{
  series: ["Stranger Things" "Breaking Bad" "GoT"]
  series[0:2] // Do primeiro ao segundo elemento
}[0]
---
["Stranger Things","Breaking Bad"]
```

Exemplos com chaves:
```
{
  jogos: {"Zelda" "Mario" "Minecraft"}
  jogos[0] // Primeiro elemento
}[0]
---
"Zelda"
```

```
{
  series: {"Stranger Things" "Breaking Bad" "GoT"}
  series[0:2] // Do primeiro ao segundo elemento
}[0]
---
{"Stranger Things","Breaking Bad"}
```

### Espalhando itens
Use `...` para incluir itens de um objeto em outro.

Exemplo com colchetes:
```
{
  filmes: ["Star Wars" "O Senhor dos Anéis" "Matrix"]
  resultado: [...filmes[0:2] "Jurassic Park"]
}.resultado
---
["Star Wars","O Senhor dos Anéis","Jurassic Park"]
```

Exemplo com chaves:
```
{
  filmes: {"Star Wars" "O Senhor dos Anéis" "Matrix"}
  resultado: {...filmes[0:2] "Jurassic Park"}
}.resultado
---
{"Star Wars","O Senhor dos Anéis","Jurassic Park"}
```

### Obtendo o tamanho do objeto
Use `[.]` para obter o número de itens.

Exemplo com colchetes:
```
{
  bandas: ["The Beatles" "Queen" "Pink Floyd"]
  bandas[.]
}[0]
---
3
```

Exemplo com chaves:
```
{
  bandas: {"The Beatles" "Queen" "Pink Floyd"}
  bandas[.]
}[0]
---
3
```

### Obtendo as chaves do objeto
Use `[*]` para obter todas as chaves do objeto.

Para objetos simples, retorna os índices como strings:
```
{
  objeto: {"item1" "item2" "item3"}
  objeto[*]
}[0]
---
{"0","1","2"}
```

Para objetos com chaves nomeadas, retorna apenas as chaves explícitas:
```
{
  dados: {
    nome: "João"
    "valor_sem_chave"
    idade: 30
    "outro_valor_sem_chave"
  }
  dados[*]
}[0]
---
{"nome","idade"}
```

### Chaves opcionais em objetos
Listas podem conter itens com chaves explícitas além de valores com índices automáticos.

Exemplo:
```
{
  dados: {
    nome: "João"
    "valor_sem_chave"
    idade: 30
    "outro_valor_sem_chave"
  }
  dados["nome"]
}[0]
---
"João"
```

```
{
  dados: {
    nome: "João"
    "valor_sem_chave"
    idade: 30
    "outro_valor_sem_chave"
  }
  dados[0]
}[0]
---
"valor_sem_chave"
```

```
{
  dados: {
    nome: "João"
    "valor_sem_chave"
    idade: 30
    "outro_valor_sem_chave"
  }
  dados["idade"]
}[0]
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
{
  dados: {
    nome: "João"
    "valor_sem_chave"
    idade: 30
    "outro_valor_sem_chave"
  }
  dados.nome
}[0]
---
"João"
```

```
{
  dados: {
    nome: "João"
    "valor_sem_chave"
    idade: 30
    "outro_valor_sem_chave"
  }
  dados.idade
}[0]
---
30
```

### Propriedade calculada em objeto

Propriedades calculadas permitem definir chaves dinamicamente em um objeto, com base em expressões.

```
{
  chave: "nome"
  objeto: {
    [chave]: "João"
    "valor_sem_chave"
  }
  objeto["nome"]
}[0]
---
"João"
```

### Referenciando propriedades do próprio objeto

Propriedades podem referenciar outras propriedades definidas no mesmo objeto.

```
{
  pessoa: {
    nome: "João"
    sobrenome: "Silva"
    nomeCompleto: nome + " " + sobrenome
  }
  pessoa.nomeCompleto
}[0]
---
"João Silva"
```

```
{
  calculos: {
    base: 10
    dobro: base * 2
    triplo: base * 3
    somaDobroTriplo: dobro + triplo
  }
  calculos.somaDobroTriplo
}[0]
---
50
```

### Referências aninhadas

Propriedades aninhadas também podem referenciar propriedades do nível superior do objeto.

```
{
  configuracao: {
    base: 10
    processamento: {
      etapa1: base * 2
      etapa2: {
        resultado: etapa1 + base
      }
    }
  }
  configuracao.processamento.etapa2.resultado
}[0]
---
30
```

```
{
  geometria: {
    x: 3
    y: 4
    calculos: {
      quadrado_x: x * x
      quadrado_y: y * y
      hipotenusa: {
        soma_quadrados: quadrado_x + quadrado_y
      }
    }
  }
  geometria.calculos.hipotenusa.soma_quadrados
}[0]
---
25
```

## Função

Funções encapsulam lógica reutilizável.

```
{
  quadrado: x => x * x
  quadrado(5)
}[0]
---
25
```

Funções que precisam de múltiplos valores recebem um objeto como parâmetro para realizar operações mais complexas.

### Soma de dois números

Esta função recebe um objeto com dois números como parâmetro e retorna a soma deles.

```
{
  soma: args => args[0] + args[1]
  soma({3, 7})
}[0]
---
10
```

### Verificar se um número está dentro de um intervalo

Esta função verifica se um número está dentro de um intervalo definido por dois valores (mínimo e máximo). Ela recebe um objeto com três valores: o número a verificar, o valor mínimo e o valor máximo.

```
{
  dentro_intervalo: args => args[0] >= args[1] & args[0] <= args[2]
  dentro_intervalo({5, 1, 10})
}[0]
---
1
```

```
{
  dentro_intervalo: args => args[0] >= args[1] & args[0] <= args[2]
  dentro_intervalo({15, 1, 10})
}[0]
---
0
```

### Concatenar dois textos

Esta função recebe um objeto com dois textos e os combina em uma única string.

```
{
  nome_completo: args => {args[0] " de " args[1]} * ""
  nome_completo({"Geralt", "The Witcher"})
}[0]
---
"Geralt de The Witcher"
```

### Calcular a área de um retângulo

Esta função calcula a área de um retângulo, recebendo um objeto com largura e altura.

```
{
  área_retangulo: args => args[0] * args[1]
  área_retangulo({5, 10})
}[0]
---
50
```

### Calcular a área de um triângulo

Esta função calcula a área de um triângulo com base na base e na altura fornecidas em um objeto.

```
{
  área_triangulo: args => {
    divisor: 2
    área: (args[0] * args[1]) / divisor
    área
  }[0]
  área_triangulo({10, 8})
}[0]
---
40
```

### Encontrar o maior de dois números

Esta função retorna o maior valor entre dois números fornecidos em um objeto.

```
{
  maior: args => args[0] > args[1] ? args[0] : args[1]
  maior({8, 3})
}[0]
---
8
```

```
{
  maior: args => args[0] > args[1] ? args[0] : args[1]
  maior({2, 9})
}[0]
---
9
```

Esses exemplos mostram como funções com múltiplos parâmetros recebem um objeto com os argumentos e podem ser usadas para resolver problemas variados de forma simples e eficiente.

### Destructuring de objetos em parâmetros

A linguagem 0 também suporta destructuring de objetos diretamente na definição de parâmetros de funções. Isso permite extrair valores de objetos com chaves nomeadas de forma mais clara e concisa.

#### Sintaxe básica

Ao invés de usar `args => args[0] + args[1]`, você pode usar `{ a b } => a + b`:

```
{
  soma: { a b } => a + b
  soma({ a: 2 b: 3 })
}[0]
---
5
```

#### Vantagens do destructuring

1. **Clareza**: Os nomes dos parâmetros ficam explícitos na definição da função
2. **Ordem independente**: Os argumentos podem ser passados em qualquer ordem

```
{
  subtrair: { a b } => a - b
  subtrair({ b: 5 a: 10 })
}[0]
---
5
```

#### Exemplo com múltiplos parâmetros

```
{
  calc: { x y z } => x + y * z
  calc({ x: 2 y: 3 z: 4 })
}[0]
---
14
```

#### Exemplo com textos

```
{
  juntar: { primeiro segundo } => {primeiro " " segundo} * ""
  juntar({ primeiro: "Hello" segundo: "World" })
}[0]
---
"Hello World"
```

#### Exemplo do uso prático

```
{
  soma: { a b } => a + b
  resultado: soma({ a: 2 b: 3 })
}.resultado
---
5
```

Esses exemplos mostram como o destructuring torna o código mais legível ao deixar explícito quais propriedades do objeto são esperadas pela função.

## Funções dentro de objetos

Na linguagem 0, é possível armazenar funções dentro de objetos e chamá-las diretamente pelo índice. Isso permite criar coleções de comportamentos ou ações.

```
{
  iniciais: {
    _ => "Bulbasaur"
    _ => "Charmander"
    _ => "Squirtle"
  }
  iniciais[1](0)
}[0]
---
"Charmander"
```

Neste exemplo, o objeto `iniciais` contém três funções, cada uma retornando o nome de um Pokémon inicial da primeira geração. Ao acessar `iniciais[1]`, obtemos a função que retorna "Charmander". Ao adicionar `(0)`, executamos essa função com um parâmetro qualquer (que é ignorado) e obtemos o resultado.

## Comentários

Na linguagem 0, comentários podem ser adicionados ao código usando `//`. Eles são ignorados durante a execução e servem para documentar ou explicar partes do código.

Exemplo:

```
// Este é um comentário explicando o código abaixo
{
  soma: args => args[0] + args[1]
  soma({3, 7})
}[0]
---
10
```