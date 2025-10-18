# Estrutura de Testes

Os testes da Linguagem 0 estão organizados em subdiretórios especializados por categoria funcional.

## Estrutura de Diretórios

### 📁 operadores/
Testes de operadores da linguagem (aritméticos, lógicos e comparadores).

### 📁 objetos/
Testes relacionados a objetos, incluindo fatiamento, chaves, referências e operadores específicos.

### 📁 texto/
Testes de strings e operações de texto, incluindo fatiamento, conversão e divisão de strings.

### 📁 funções/
Testes de definição, chamada e parsing de funções.

### 📁 sintaxe/
Testes de elementos sintáticos como comentários e constantes.

### 📁 integração/
Framework de testes (uniteste) e testes de integração.

## Como Executar os Testes

Para executar todos os testes:
```bash
node código/0_node.js testes/0
```

Para executar um arquivo de teste específico:
```bash
node código/0_node.js testes/operadores/aritmética.0
```

## Estrutura de um Arquivo de Teste

Cada arquivo de teste segue esta estrutura:

```
uniteste # ../integração/uniteste.0

uniteste.descrever({"Nome do Grupo" {
  uniteste.iguais({
    expressão_testada
    valor_esperado
  })
}})
```

## Estatísticas

- Total de arquivos de teste: 24
- Total de testes: 143
- Tempo de execução: ~0.2 segundos
