# Linguagem 0

Uma linguagem de programação funcional projetada para ser universal. A 0 está sendo criada com dois valores fundamentais em mente:

- **Sintaxe Matemática**: A 0 utiliza uma sintaxe que se assemelha à notação matemática, eliminando a necessidade de comandos em linguagem natural. Isso facilita a compreensão e a escrita de código, independente da língua nativa do desenvolvedor.

- **Integração Universal**: A 0 será projetada para se integrar facilmente com outras linguagens de programação e plataformas. Isso permitirá que desenvolvedores utilizem a 0 em uma ampla variedade de ambientes, aproveitando suas capacidades funcionais sem sacrificar a compatibilidade.

O nome 0 foi escolhido por sua simplicidade e universalidade. O zero é um conceito fundamental na matemática e é representado da mesma forma em diversos idiomas, refletindo a natureza inclusiva e acessível da linguagem.

Esperamos que a 0 se torne uma ferramenta valiosa para desenvolvedores ao redor do mundo, promovendo a eficiência e a clareza no desenvolvimento de software.

**Pré-requisitos**: Node.js versão 22 ou superior.

## ⚡ Novidades: Carregamento Preguiçoso Assíncrono

A linguagem 0 agora utiliza **carregamento preguiçoso (lazy loading)** assíncrono de módulos. Principais benefícios:

- ✨ **Início mais rápido:** Execução começa imediatamente, sem pré-carregar todos os módulos
- 🌐 **Suporte a URLs remotas:** Importe módulos diretamente via HTTP/HTTPS
- 💾 **Cache inteligente:** Módulos remotos são armazenados em cache local
- 🔄 **Carregamento sob demanda:** Apenas módulos necessários são carregados

**Nota:** Esta é uma mudança na API interna. Código escrito em 0 continua funcionando sem modificações.

Para mais detalhes, consulte [docs/LAZY_LOADING.md](docs/LAZY_LOADING.md).

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

- Exemplos e casos de uso estão disponíveis no diretório "testes" do repositório.

Conjunto de caracteres e codificação

- A linguagem usa codificação UTF-8.
- Espaços em branco válidos: caractere espaço (U+0020), tabulação horizontal (U+0009), quebra de linha (LF U+000A) e retorno de carro (CR U+000D). Todos são considerados separadores de tokens, exceto dentro de literais de texto.
- Comentários de linha iniciam com os dois caracteres `//` e vão até o fim da linha; o conteúdo do comentário é ignorado pelo analisador léxico.

Tokens léxicos

1. Identificadores
- Sintaxe: um identificador inicia com um caractere Unicode de letra (A–Z, a–z, ou outras letras Unicode), ou o caractere underscore `_`, seguido por zero ou mais letras, dígitos (0–9) ou underscores. Regex aproximado: `^[_\p{L}][_\p{L}\p{N}]*` (onde `\p{L}` e `\p{N}` representam classes Unicode de letras e números respectivamente).
- Identificadores são sensíveis a maiúsculas e minúsculas.

2. Números
- A linguagem suporta números inteiros com sinal opcional. Formato: um sinal negativo opcional `-` seguido por uma sequência de um ou mais dígitos ASCII (`0`–`9`). Não há suporte a ponto decimal ou notação exponencial nesta especificação; somente inteiros.
- Exemplos sintáticos no parser: um token numérico corresponde à regex `^-?[0-9]+`.

3. Literais de texto (strings)
- Delimitador: aspas duplas `"` (U+0022). Uma string inicia com `"` e termina no próximo `"` não escapado.
- Caracteres de escape suportados: `\"` para aspas duplas, `\\` para barra invertida, `\n` para nova linha, `\r` para retorno de carro, `\t` para tabulação, e `\uXXXX` (onde `XXXX` são quatro hexadecimais) para escapes Unicode. Qualquer outro caractere precedido por `\` é inválido.
- Strings podem incluir qualquer caractere Unicode exceto quebras de linha não escapadas.

4. Pontuação e operadores (tokens únicos)
- Parênteses: `(` e `)`
- Colchetes: `[` e `]`
- Chaves: `{` e `}`
- Dois-pontos: `:` (usado em pares chave-valor e em slices)
- Setas: `=>` (usada para definir funções)
- Operadores aritméticos e lógicos: `+`, `-`, `*`, `/`, `&`, `|`, `!`, `%`
- Comparadores: `>`, `<`, `>=`, `<=`, `==`, `!=`
- Operador de importação formada por `#` (veja a seção de importação)
- Operador de espalhamento: `...` (três pontos consecutivos)
- Separador implícito: elementos em listas e objetos são separados por espaço em branco; vírgulas não são parte da sintaxe.

Notas lexicais

- O analisador diferencia `-` como operador de subtração e como sinal de número automaticamente com base no contexto léxico/ sintático: se o `-` aparece imediatamente antes de um dígito e não separado por espaço quando um literal numérico é esperado, ele será interpretado como parte do literal numérico; caso contrário, é o operador binário/ unário de subtração.
- Sequências de três pontos `...` têm prioridade léxica sobre duas ou uma ocorrências de ponto; o lexer deve agrupar o maior token válido.

Gramática sintática (construções principais)

1. Módulo e exportação
- Um arquivo fonte (módulo) consiste em zero ou mais declarações de nível de módulo seguidas por uma expressão principal final.
- O valor exportado pelo módulo é o valor resultante da avaliação da expressão principal final do arquivo. Não existe uma palavra-chave `export`; a exportação é implícita pela expressão final do módulo.

2. Declarações no nível do módulo
- Estrutura: uma declaração de nível de módulo é uma atribuição de forma `identificador = expressão` ou `identificador = referência` (referência pode ser um caminho de módulo). Declarações são avaliadas em ordem de aparição e ficam visíveis para as expressões subsequentes e para a expressão principal.
- Não há terminador obrigatório de declaração; quebras de linha e espaços em branco separam declarações.

3. Importação
- A importação de módulo pode ocorrer de duas formas sintáticas:
  a) Importação de módulo para avaliação imediata usando o operador `#`: a sintaxe é `expressao # caminho`, onde `caminho` é uma string literal ou um identificador que represente um caminho; o resultado desta expressão é o valor exportado do módulo referenciado.
  b) Importação do módulo como valor: atribuir um caminho de módulo a um identificador no nível do módulo faz com que o identificador represente o módulo (ou seu valor) e possa ser chamado/avaliado posteriormente.
- Caminhos aceitos: nomes de arquivo simples (ex.: `soma.0`), caminhos relativos começando com `./` ou `../`, ou URLs que iniciam com `http://` ou `https://`.

4. Expressões e precedência
- Expressões são compostas por literais, identificadores, chamadas de função, operadores binários/ unários, agrupamentos e construções de coleção.
- Precedência dos operadores (do mais alto para o mais baixo):
  1) Unary: `!` (negação), unário `-` (negação aritmética)
  2) Multiplicativo: `*` `/`
  3) Aditivo: `+` `-`
  4) Comparadores: `>` `<` `>=` `<=` `==` `!=`
  5) Lógicos: `&` (AND), `|` (OR)
- Operadores são, por padrão, associativos à esquerda, exceto quando especificado de outra forma.
- Parênteses `(` `)` alteram a ordem de avaliação e são usados para agrupar expressões.

5. Funções
- Sintaxe de definição: `identificador = parametros => corpo` onde `parametros` é uma lista de parâmetros separados por espaço e `corpo` é uma expressão que representa o valor retornado pela função.
- Parâmetros simples são identificadores. Parâmetros por destructuring usam a sintaxe de objeto com chaves: `{ chave1 chave2 }` correspondendo aos campos do argumento de objeto.
- Guards (condições alternativas) em definições de função são representados por linhas adicionais iniciadas por `|` seguidas de uma condição, `=` e a expressão resultante; as alternativas são avaliadas de cima para baixo.
- Chamadas de função: uma expressão seguida por parênteses contendo argumentos separados por espaço é tratada como chamada, por exemplo `f(arg1 arg2)`; parênteses vazios `()` representam chamada sem argumentos.

6. Coleções: listas e objetos
- Listas: delimitadas por colchetes `[` `]`. Contêm apenas valores e os elementos são separados por espaço em branco; não se utilizam vírgulas. Ordem preservada.
- Objetos: delimitados por chaves `{` `}`. Contêm apenas pares chave-valor com a sintaxe `identificador : expressão` para cada par; pares são separados por espaço em branco.
- Chaves (keys) de objetos são identificadores ou literais de texto. Chaves calculadas podem ser escritas com a sintaxe `[ expressao ]` dentro do lugar da chave, por exemplo, um par ` [expressao] : expressao` onde a primeira `expressao` produz uma string usada como chave.
- Operador de espalhamento: dentro de colchetes ou chaves, o token `...` seguido por uma expressão injeta os elementos/chaves do valor avaliado nessa posição.

7. Indexação e fatiamento
- A indexação usa colchetes: `expressao[indice]` onde `indice` é um inteiro (0-based). Se `indice` for negativo, a semântica é definida pelo runtime (geralmente contando de trás para frente) — implemente conforme convenção do interpretador.
- Fatiamento: `expressao[inicio:fim]` onde `inicio` e `fim` são inteiros ou podem ser omitidos para indicar início ou fim da coleção. O operador `:` é exigido para slices; espaços em torno de `:` são permitidos.
- Acesso especial de tamanho: `expressao[.]` retorna o número de elementos/itens da coleção.

8. Operações específicas de texto e coleções
- Textos suportam operações de fatiamento, obtenção de tamanho, divisão (split) por um separador e junção (join) a partir de uma lista de textos; a semântica exata das operações depende do runtime, mas a sintaxe para invocá-las utiliza operadores e indexação conforme descrito neste documento.
- Conversões entre caractere e código numérico: indexação de texto por inteiro retorna o código Unicode do caractere; operações de multiplicação de uma lista contendo um número por uma string podem produzir um texto conforme semântica do runtime.

9. Comentários e espaços
- Comentários de linha: iniciam com `//` e vão até o fim da linha.
- Não existem comentários de bloco na sintaxe atual.
- Espaco em branco e quebras de linha servem para separar tokens; a maioria dos delimitadores e operadores não exige um separador explícito além do espaço quando ambiguidade pode ocorrer.

Semântica de avaliação (resumo)

- Avaliação é estritamente por ordem de execução definida pelo interpretador: declarações de nível de módulo são avaliadas sequencialmente; a expressão principal final do módulo é avaliada e seu resultado é o valor exportado.
- Funções são valores de primeira classe; chamadas são avaliadas aplicando os argumentos ao corpo da função no contexto de seus parâmetros.
- Operadores lógicos `&` e `|` podem empregar avaliação curta (short-circuit) dependendo da implementação: `&` deve retornar `0` se um operando for logicamente falso; `|` deve retornar `0` somente se ambos operandos forem falsos. O operador `%` envia o valor para stderr e retorna o valor sem alteração.

Regras de parse e erros

- O analisador deve produzir um erro sintático descritivo quando encontrar sequência de tokens que não correspondam à gramática.
- Erros semânticos (tipos incompatíveis, índice fora de intervalo, chave inexistente) devem produzir mensagens de erro claras com indicação do local quando possível.