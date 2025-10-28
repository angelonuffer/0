# Linguagem 0

Uma linguagem de programação funcional projetada para ser universal. A 0 está sendo criada com dois valores fundamentais em mente:

- **Sintaxe Matemática**: A 0 utiliza uma sintaxe que se assemelha à notação matemática, eliminando a necessidade de comandos em linguagem natural. Isso facilita a compreensão e a escrita de código, independente da língua nativa do desenvolvedor.

- **Integração Universal**: A 0 será projetada para se integrar facilmente com outras linguagens de programação e plataformas. Isso permitirá que desenvolvedores utilizem a 0 em uma ampla variedade de ambientes, aproveitando suas capacidades funcionais sem sacrificar a compatibilidade.

O nome 0 foi escolhido por sua simplicidade e universalidade. O zero é um conceito fundamental na matemática e é representado da mesma forma em diversos idiomas, refletindo a natureza inclusiva e acessível da linguagem.

Esperamos que a 0 se torne uma ferramenta valiosa para desenvolvedores ao redor do mundo, promovendo a eficiência e a clareza no desenvolvimento de software.

**Pré-requisitos**: Node.js versão 22 ou superior.

## Execução

### Executar um módulo que exporta uma função

```bash
node código/0_node.js <módulo.0> <argumento>
```

A função deve retornar um valor do tipo texto, que será enviado para o stdout do processo.

### Executar os testes

```bash
node código/0_node.js testes/0 node | node
```

## Sintaxe

A sintaxe é definida diretamente no interpretador e pode ser compreendida através dos exemplos abaixo.

### Exportação

A exportação define o valor que um módulo fornecerá ao ser importado.

```
42
---
42
```

### Importação

A importação permite usar código de outros módulos de duas formas:

#### Importação com `#`

```
retorna_5 # ./retorna_5.0

retorna_5()
---
5
```

#### Importação como valor

```
// soma.0
{ a b } => a + b

// local.0
soma = soma.0
soma({ a: 2 b: 3 })
---
5
```

Importações como valor funcionam com arquivos locais (`soma.0`), caminhos relativos (`./soma.0`, `../dir/soma.0`) e URLs remotas (`https://example.com/soma.0`).

### Declarações no nível do módulo

Você pode declarar constantes no nível do módulo antes da expressão principal:

```
base = 10
altura = 5

base * altura
---
50
```

As constantes podem referenciar outras constantes declaradas anteriormente e ficam disponíveis para toda a expressão principal.

### Tipo lógico

Representa verdadeiro ou falso. `0` é falso, qualquer outro valor é verdadeiro.

- **Operador e (`&`)**: Retorna `0` se um dos operandos for falso. Se ambos verdadeiros, retorna o segundo valor.
- **Operador ou (`|`)**: Retorna `0` se ambos forem falsos. Senão, retorna o primeiro valor verdadeiro.
- **Operador não (`!`)**: Inverte o valor lógico.
- **Operador de depuração (`%`)**: Exibe o valor no stderr e retorna o valor normalmente.

### Tipo número

#### Operadores aritméticos

- **Adição (`+`)**: `42 + 5` → `47`
- **Subtração (`-`)**: `4 - 8` → `-4`
- **Multiplicação (`*`)**: `3 * 4` → `12`
- **Divisão (`/`)**: `8 / 2` → `4`

**Números negativos**: Escritos com `-` antes do número: `-42`

**Precedência**: `*` e `/` têm precedência sobre `+` e `-`. Use parênteses para alterar a ordem.

```
2 + 3 * 4  // → 14
(2 + 3) * 4  // → 20
```

#### Declarações em parênteses

```
( a = 2 b = 3 a + b )
---
5
```

#### Comparadores

- `>`, `<`, `>=`, `<=`, `==`, `!=`

Retornam `1` (verdadeiro) ou `0` (falso).

### Tipo texto

Sequências de caracteres entre aspas.

```
"Que a força esteja com você."
```

#### Fatiamento

```
"Que a força esteja com você."[0:11]  // → "Que a força"
```

#### Operações

- **Dividir**: `"a b c" / " "` → `["a" "b" "c"]`
- **Juntar**: `["a" "b" "c"] * " "` → `"a b c"`
- **Tamanho**: `"texto"[.]` → `5`

### Conversão entre caractere e número

- **Caractere para número**: `"A"[0]` → `65`
- **Número para caractere**: `{65} * ""` → `"A"`

### Tipo objeto

Armazena coleções ordenadas de valores.

#### Sintaxe de listas

```
["Zelda" "Mario" "Minecraft"]
```

#### Fatiamento

```
jogos[0]     // Primeiro elemento
jogos[0:2]   // Do primeiro ao segundo elemento
```

#### Operações

- **Tamanho**: `lista[.]` → número de itens
- **Chaves**: `objeto[*]` → lista de chaves
- **Espalhamento**: `[...lista "novo"]`

#### Separação entre Objetos e Listas

- **Listas**: Contêm apenas valores sem chaves. Usam sintaxe `[1 2 3]`
- **Objetos**: Contêm apenas pares chave-valor. Usam sintaxe `{nome: "João" idade: 30}`

#### Acesso com notação de ponto

```
dados.nome  // Equivalente a dados["nome"]
```

#### Propriedade calculada

```
chave = "nome"
{
  objeto: { [chave]: "João" }
}
```

### Funções

Funções encapsulam lógica reutilizável.

```
quadrado = x => x * x
quadrado(5)
---
25
```

#### Destructuring de parâmetros

```
soma = { a b } => a + b
soma({ a: 2 b: 3 })
---
5
```

#### Guards em funções

```
abs = x =>
  | x < 0 = 0 - x
  | x
abs(-5)
---
5
```

Guards são avaliados em ordem, de cima para baixo. O primeiro guard cuja condição for verdadeira será executado.

### Comentários

```
// Este é um comentário
```

## Licença

[![CC0](https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Cc-zero.svg/26px-Cc-zero.svg.png) CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/deed.pt-br)