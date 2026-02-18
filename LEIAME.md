# Linguagem 0

A **0** é uma linguagem funcional com sintaxe inspirada na notação matemática, projetada para proporcionar uma integração fluida entre módulos locais e remotos através de uma semântica simples e poderosa.

## Exemplo

```0
// Calcula fatorial usando guards
fatorial = n =>
  | n <= 1 = 1
  | n * fatorial(n - 1)

// Função simples para demonstrar aplicação
incrementar = x => x + 1

[
  fatorial(5)
  incrementar(5)
]

// Resultado: [ 120, 6 ]
```

## Execução

### Executar um módulo

Para executar um arquivo `.0`:

```bash
npx angelonuffer/0 <módulo.0>
```

O módulo avalia sua expressão final e imprime o resultado.

### Executar os testes do núcleo

```bash
node testes/0.js
```

### Teste de integração com outro repositório

Para verificar a compatibilidade com módulos em outros repositórios:

```bash
node testes/integração.js <repositório> <caminho>
```

Exemplo: `node testes/integração.js angelonuffer/antlr.0 tests/0`

## Sintaxe e Estrutura

### Módulos e Endereços

- **Arquivos**: Possuem extensão `.0`.
- **Estrutura**: Um módulo contém declarações de topo (`identificador = expressão`) seguidas por uma expressão final, que é o valor exportado.
- **Endereços**: Caminhos locais (`./mod.0`) ou URLs (`https://...`) são tratados como literais e resolvidos dinamicamente pelo interpretador.

### Léxico

- **Comentários**: `// linha` ou `/* bloco */`.
- **Números**: Suporta inteiros e negativos (ex.: `42`, `-7`).
- **Textos**: Delimitados por aspas duplas (`"exemplo"`).
- **Identificadores**: Iniciam com letra Unicode ou `_`.

### Construções Principais

- **Literais**: Números, textos, listas (`[1 2 3]`) e objetos (`{ chave: valor }`).
- **Funções**:
  - **Lambda**: `param => expressão` ou destructuring `{a b} => ...`.
  - **Aplicação**: `f(arg)`. Suporta currying: `f(1)(2)`.
  - **Guards**: Condicionais internas: `x => | x > 0 = 1 | 0`.
- **Escopo Local**: `(a = 1 b = 2 a + b)` cria um contexto temporário.
- **Avaliação Lazy**: Valores podem ser definidos como **thunks preguiçosos (lazy thunks)**, que são avaliados apenas quando acessados e seus resultados são cacheados.

### Coleções e Acesso

- **Listas**: `[item1 item2]`. Suporta espalhamento: `[...lista]`.
- **Objetos**: `{ chave: valor }`. Suporta shorthand `{ nome }` e espalhamento `{...obj}`.
- **Operações**:
  - `v[i]`: Indexação (em strings, retorna o charCode).
  - `v[i:j]`: Fatiamento (slice).
  - `v[.]`: Tamanho (length).
  - `v[*]`: Chaves (objetos) ou índices (listas).
  - `obj.prop`: Acesso a atributo.

### Operadores

- **Aritmética e Comparação**: `+ - * / == != > < >= <=`.
- **Lógicos**: `&` (E) e `|` (OU) com curto-circuito; `!expr` (negação).
- **Ternário**: `condição ? então : senão`.
- **Especiais**:
  - **Join**: `lista * string` une elementos da lista.
  - **Split**: `string / string` divide a string.

## Módulos e Carregamento

- **Operador `@`**: Avalia uma expressão como endereço e carrega o módulo correspondente.
- **Resolução**: O runtime gerencia o cache de módulos e hooks para resolução de caminhos e I/O.

## Diagnóstico e Erros

- **Depuração**: O operador `% expressão` imprime o valor em stderr (JSON) e o retorna, facilitando a inspeção.
- **Erros de Sintaxe**: Exibem arquivo, linha e coluna com o trecho de código afetado.
- **Erros Semânticos**: Fornecem um **rastro de pilha semântica (frames)** e informações sobre nomes disponíveis no escopo no momento do erro.
