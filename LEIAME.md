# Linguagem 0

A **0** é uma linguagem funcional com sintaxe inspirada na notação matemática, projetada para proporcionar uma integração fluida entre módulos locais e remotos através de uma semântica simples e poderosa.

Consulte o arquivo [EXEMPLOS.md](EXEMPLOS.md) para uma explicação detalhada da sintaxe e exemplos de uso.

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

## Módulos e Carregamento

- **Operador `@`**: Avalia uma expressão como endereço e carrega o módulo correspondente.
- **Resolução**: O runtime gerencia o cache de módulos e hooks para resolução de caminhos e I/O.

## Diagnóstico e Erros

- **Depuração**: O operador `% expressão` imprime o valor em stderr (JSON) e o retorna, facilitando a inspeção.
- **Erros de Sintaxe**: Exibem arquivo, linha e coluna com o trecho de código afetado.
- **Erros Semânticos**: Fornecem um **rastro de pilha semântica (frames)** e informações sobre nomes disponíveis no escopo no momento do erro.
