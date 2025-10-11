# Analisador Semântico

Este módulo contém o analisador semântico (evaluator) da Linguagem 0, responsável por avaliar expressões AST em um contexto de escopo.

## Estrutura Modular

O analisador semântico foi organizado em módulos temáticos para facilitar a manutenção e compreensão:

### `escopo.js` (18 linhas)
Gerenciamento de escopo e variáveis:
- `criarEscopo` - Cria um novo escopo com referência ao escopo pai
- `buscarVariável` - Busca uma variável na cadeia de escopos
- `definirVariável` - Define uma variável no escopo atual

### `básico.js` (30 linhas)
Avaliação de casos básicos:
- `'número'` - Retorna valor numérico literal
- `'texto'` - Retorna valor de string literal
- `'variável'` - Busca valor de variável no escopo
- `'não'` - Negação lógica
- `'parênteses'` - Avaliação de expressão entre parênteses

### `operações.js` (36 linhas)
Operações binárias, lógicas e condicionais:
- `'operação_binária'` - Executa operador binário (como `+`, `-`, `*`, `/`)
- `'operação_lógica'` - Avalia operadores lógicos (`&`, `|`) com curto-circuito
- `'condicional'` - Avalia expressão ternária (`? :`)

### `objeto.js` (95 linhas)
Construção e avaliação de objetos:
- `'objeto'` - Cria arrays ou objetos
- Suporta sintaxe de espalhamento (`...`)
- Suporta pares chave-valor
- Converte automaticamente para array real quando apropriado

### `coleção.js` (75 linhas)
Operações em coleções (arrays, objetos, strings):
- `'fatia'` - Indexação e fatiamento (`[i]`, `[i:j]`)
- `'tamanho'` - Obtém tamanho/comprimento (`.length`)
- `'chaves'` - Obtém chaves de objeto
- `'atributo'` - Acesso a propriedades (`.prop`)

### `função.js` (56 linhas)
Operações relacionadas a funções:
- `'lambda'` - Cria função lambda com closure
- `'chamada_função'` - Chama função com argumento
- `'chamada_função_imediata'` - Chama função por nome diretamente

### `index.js` (45 linhas)
Módulo principal que integra todos os sub-módulos:
- Re-exporta funções de gerenciamento de escopo
- Importa todos os avaliadores dos sub-módulos
- Implementa função principal `avaliar` que delega para os módulos apropriados
- Configura dependências circulares entre módulos

## Dependências Circulares

O analisador semântico possui dependências circulares naturais devido à natureza recursiva da avaliação. Por exemplo:
- `avaliar` precisa chamar avaliadores específicos de cada módulo
- Cada avaliador específico precisa chamar `avaliar` para avaliar sub-expressões

Essas dependências são resolvidas através de:
1. **Declarações forward**: Variáveis `let` declaradas antes de serem definidas
2. **Funções setter**: Funções `setAvaliar()` que configuram as referências recursivas

## Uso

```javascript
import { avaliar, criarEscopo, definirVariável } from './analisador_semântico/index.js';

// Criar um escopo
const escopo = criarEscopo();
definirVariável(escopo, 'x', 10);

// Avaliar uma expressão AST
const ast = {
  tipo: 'operação_binária',
  esquerda: { tipo: 'variável', nome: 'x' },
  direita: { tipo: 'número', valor: 5 },
  operador: (a, b) => a + b
};

const resultado = avaliar(ast, escopo); // 15
```

## Tipos de AST Suportados

### Literais
- `'número'` - Valor numérico
- `'texto'` - String literal

### Variáveis e Escopo
- `'variável'` - Referência a variável

### Operações
- `'não'` - Negação lógica unária
- `'operação_binária'` - Operações binárias (aritméticas, comparação)
- `'operação_lógica'` - Operadores lógicos com curto-circuito
- `'condicional'` - Operador ternário

### Coleções
- `'objeto'` - Array ou objeto literal
- `'fatia'` - Indexação e fatiamento
- `'tamanho'` - Comprimento
- `'chaves'` - Chaves de objeto
- `'atributo'` - Acesso a propriedade

### Funções
- `'lambda'` - Definição de função
- `'chamada_função'` - Aplicação de função
- `'chamada_função_imediata'` - Chamada direta por nome

### Agrupamento
- `'parênteses'` - Expressão agrupada

## Observações

- O avaliador retorna valores JavaScript nativos (números, strings, arrays, objetos, funções)
- Escopos usam herança prototípica através do campo `__parent__`
- Funções criadas com `lambda` capturam o escopo onde foram definidas (closure)
- Operadores lógicos implementam avaliação em curto-circuito
