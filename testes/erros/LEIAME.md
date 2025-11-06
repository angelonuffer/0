# Testes de Erros

Esta pasta contém testes de erros de sintaxe e referência da linguagem 0.

## Erros de Sintaxe

Testes que demonstram erros de sintaxe na linguagem:

- `sintaxe_colchete.0` - Colchete não fechado
- `sintaxe_parêntese.0` - Parêntese não fechado
- `sintaxe_chave.0` - Chave não fechada
- `sintaxe_operador_inválido.0` - Operador inválido no início de expressão
- `sintaxe_colchete_fechamento.0` - Colchete de fechamento sem abertura
- `sintaxe_string_não_fechada.0` - String literal não fechada

## Erros de Referência

Testes que demonstram erros de referência na linguagem:

- `referência_variável_indefinida.0` - Uso de variável não definida
- `referência_função_indefinida.0` - Chamada de função não definida
- `referência_uso_antes_definição.0` - Uso de variável não definida na expressão principal
- `referência_módulo_inexistente.0` - Importação de módulo inexistente
- `referência_propriedade_indefinida.0` - Acesso a campo em objeto não definido

## Estrutura dos Arquivos

Para cada teste de erro, existem dois arquivos:

- `<nome>.0` - O arquivo de teste com código que gera erro
- `<nome>.esperado.txt` - A saída esperada do erro

## Como Executar

### Executar um teste individual

Para verificar manualmente se um erro é gerado corretamente:

```bash
node código/0_node.js testes/erros/<arquivo>.0 node
```

O interpretador deve retornar um código de saída diferente de zero e exibir uma mensagem de erro apropriada.

### Executar todos os testes automaticamente

Use o runner para executar todos os testes e comparar as saídas:

```bash
node testes/erros/runner.js
```

O runner irá:
- Executar cada teste de erro
- Comparar a saída obtida com a saída esperada
- Reportar quais testes passaram ou falharam
- Retornar código de saída 0 se todos passarem, 1 caso contrário
