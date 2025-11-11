# Linguagem 0

Uma linguagem de programação funcional projetada para ser universal. A 0 está sendo criada com dois valores fundamentais em mente:

- **Sintaxe Matemática**: A 0 utiliza uma sintaxe que se assemelha à notação matemática, eliminando a necessidade de comandos em linguagem natural. Isso facilita a compreensão e a escrita de código, independente da língua nativa do desenvolvedor.

- **Integração Universal**: A 0 será projetada para se integrar facilmente com outras linguagens de programação e plataformas. Isso permitirá que desenvolvedores utilizem a 0 em uma ampla variedade de ambientes, aproveitando suas capacidades funcionais sem sacrificar a compatibilidade.

O nome 0 foi escolhido por sua simplicidade e universalidade. O zero é um conceito fundamental na matemática e é representado da mesma forma em diversos idiomas, refletindo a natureza inclusiva e acessível da linguagem.

Esperamos que a 0 se torne uma ferramenta valiosa para desenvolvedores ao redor do mundo, promovendo a eficiência e a clareza no desenvolvimento de software.

## Execução

### Executar um módulo

```bash
node código/0_node.js <módulo.0>
```

O módulo principal deve exportar um valor do tipo texto, que será enviado para o stdout do processo.

### Executar os testes

```bash
node código/0_node.js testes/0 | node
```

## Módulo

Um módulo na linguagem 0 é um arquivo com extensão `.0` que contém zero ou mais declarações de nível superior seguidas por uma expressão final. As declarações são escritas na forma `identificador = expressão` e são avaliadas sequencialmente. A expressão final do módulo determina o valor exportado, sem necessidade de palavra-chave explícita de exportação. Importações são realizadas através de atribuições de caminhos de arquivo (relativos como `./arquivo.0` ou `../pasta/arquivo.0`) ou URLs HTTPS a identificadores, permitindo que módulos externos sejam referenciados e utilizados no código.

## Identificador

Um identificador na linguagem 0 é um nome usado para referenciar valores, funções, parâmetros e módulos importados. Ele deve iniciar com uma letra Unicode (maiúscula ou minúscula) ou um underscore `_`, seguido por zero ou mais letras, dígitos ou underscores. Identificadores são sensíveis a maiúsculas e minúsculas, o que significa que `variavel`, `Variavel` e `VARIAVEL` são três identificadores distintos. Não existem palavras reservadas na linguagem, portanto qualquer sequência que siga essas regras pode ser usada como identificador. Exemplos válidos incluem: `x`, `soma`, `_temp`, `valor1`, `calcularMédia`, `π` (letra grega pi).

## Expressão

Uma expressão é a unidade fundamental de computação que produz um valor. Pode ser um literal, identificador, operação, chamada de função, acesso a coleção ou definição de função.

### Literais

- **Números**: `42`, `-7`
- **Textos**: `"olá"`
- **Listas**: `[1 2 3]`
- **Objetos**: `{x: 10 y: 20}`

### Identificadores

Referências a valores previamente definidos: `variavel`, `resultado`

### Operações

- **Aritméticas**: `a + b * 2`
- **Lógicas**: `x > 0 & y < 100`

### Chamadas de Função

Aplicação de funções a argumentos: `soma(5 3)`, `filtrar(lista condicao)`

### Indexação e Fatiamento

Acesso a elementos de coleções: `lista[0]`, `texto[1:5]`, `objeto[chave]`

### Funções Inline

Definições de função usando sintaxe de seta: `x => x * 2`

### Agrupamento

Parênteses alteram a precedência: `(a + b) * 2`

## Erros de Sintaxe

Erros de sintaxe ocorrem quando o código não segue as regras da linguagem. Exemplos comuns incluem:

- **Falta de parênteses**: `soma(5 3` deve ser `soma(5 3)`.
- **Identificadores inválidos**: `1variavel` não é um identificador válido.

Quando um erro de sintaxe é encontrado, a execução do módulo falhará e uma mensagem de erro será exibida no terminal, indicando a linha e a natureza do erro. A mensagem geralmente segue o formato:

```
Erro de sintaxe.
<endereço do arquivo>
<número da linha>:<número da coluna>: <linha com erro>
```

Isso ajuda o desenvolvedor a identificar rapidamente onde o problema ocorreu e como corrigí-lo.

## Erros de Referência

Erros de referência ocorrem quando o código tenta acessar um identificador que não foi definido. Exemplos incluem:

- **Uso de identificadores não declarados**: `resultado` se não houver uma declaração anterior como `resultado = 10`.
- **Importações falhas**: Tentar importar um módulo que não existe resultará em um erro.

Esses erros também gerarão mensagens informativas, como:

Erro: Nome não encontrado: <nome da variável ou função>
<endereço do arquivo>
<número da linha>:<número da coluna>: <linha com erro>

Essas mensagens ajudam o desenvolvedor a identificar e corrigir rapidamente o problema.