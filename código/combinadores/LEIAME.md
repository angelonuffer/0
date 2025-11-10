# Parser Combinators com Autômato Finito de Pilha

Este documento descreve a estratégia de parsing usada no analisador sintático da linguagem 0.

## Arquitetura

O parser implementa um **autômato finito de pilha (pushdown automaton)** usando combinadores de parser. Isso proporciona:

1. **Parsing determinístico**: Sem backtracking desnecessário - alternativas retornam imediatamente no primeiro sucesso
2. **Rastreamento de estados**: Acompanhamento explícito da posição mais distante alcançada (`menor_resto`)
3. **Relatório de erros preciso**: Mantém o erro no ponto mais profundo da análise para diagnósticos precisos
4. **Pilha de estados implícita**: A pilha de chamadas serve como pilha de estados do autômato

## Conceitos do Autômato de Pilha

### Estados
Cada função analisadora (parser) representa um estado no autômato. Por exemplo:
- `símbolo("]")` - estado que espera o símbolo "]"
- `alternativa(a, b, c)` - estado que pode transitar para a, b ou c
- `sequência(a, b, c)` - estado que transita por a, depois b, depois c

### Pilha
A pilha de estados é implementada de duas formas:
1. **Implícita**: A pilha de chamadas JavaScript serve como pilha do autômato
2. **Explícita** (para delimitadores): Rastreamento de delimitadores aninhados para validação

### Transições
As transições entre estados ocorrem através de:
- Chamadas de função (transições implícitas)
- Consumo de caracteres do input (avanço da posição)
- Retorno de sucesso/falha

### Evitando Backtracking

O parser evita backtracking desnecessário através de:

1. **Retorno imediato em `alternativa`**: Quando uma alternativa tem sucesso, retorna imediatamente sem tentar outras
2. **Rastreamento de progresso**: Mantém `menor_resto` para saber a posição mais profunda alcançada
3. **Propagação de erros**: Erros são propagados do ponto mais profundo, não do ponto de falha superficial

```javascript
const alternativa = (...analisadores) => código => {
  for (const analisador of analisadores) {
    const resultado = analisador(código)
    // Retorno imediato - SEM BACKTRACKING
    if (resultado.sucesso) return resultado
    // ... rastreia erro mais profundo ...
  }
  // Retorna erro do ponto mais profundo
}
```

## Identificação de Erros de Sintaxe

O sistema identifica o caractere exato que causou o erro através de:

1. **menor_resto**: Sempre mantém a posição mais distante alcançada durante o parsing
2. **Análise de delimitadores**: Detecta delimitadores não fechados ou descasados
3. **Ajuste de posição**: Para delimitadores não fechados, aponta para onde o delimitador deveria estar

### Exemplo

Para o código:
```
x = [1 2 3
```

O parser:
1. Identifica que `[` foi aberto
2. Tenta encontrar `]`
3. Chega ao fim do input sem encontrar
4. Reporta erro na posição final (onde `]` deveria estar)

## Estrutura de Resultado

Cada parser retorna:
```javascript
{
  sucesso: boolean,      // Parsing teve sucesso?
  valor: any,            // AST resultante (se sucesso)
  resto: string,         // Código não consumido
  menor_resto: string,   // Posição mais profunda alcançada
  erro: {                // Informação de erro (se falha)
    mensagem: string,
    posição: string      // Resto do código na posição do erro
  }
}
```

## Performance

O autômato de pilha oferece melhor performance que parser combinators tradicionais porque:

1. **Sem backtracking**: Não recalcula parses que já falharam
2. **Transições determinísticas**: Para a maioria dos casos, escolhe a alternativa correta na primeira tentativa
3. **Overhead mínimo**: A pilha implícita (call stack) não adiciona overhead significativo

## Módulos de Suporte

- `código/combinadores/index.js`: Combinadores básicos com lógica de autômato
- `código/combinadores/pilha_estados.js`: Suporte explícito para pilha de estados
- `código/combinadores/automaton.js`: Implementação conceitual de PDA
- `código/combinadores/avançados.js`: Combinadores de alto nível

## Uso

Os combinadores são usados para construir parsers compostos:

```javascript
// Parser para lista: [expr1 expr2 ...]
const lista = transformar(
  sequência(
    símbolo("["),           // Estado: espera "["
    opcional(espaço),       // Estado: espaço opcional
    vários(expressão),      // Estado: múltiplas expressões
    símbolo("]"),           // Estado: espera "]"
  ),
  construirASTLista         // Transforma em AST
)
```

Cada `símbolo`, `sequência`, etc. representa um estado no autômato, e a composição cria o autômato completo.
