# Analisador Sintático

Este módulo contém o analisador sintático (parser) da Linguagem 0, responsável por construir expressões executáveis a partir de tokens léxicos.

## Estrutura Modular

O analisador sintático foi organizado em módulos temáticos para facilitar a manutenção e compreensão:

### `básico.js` (77 linhas)
Operações básicas e fundamentais:
- `não` - Negação lógica (`!`)
- `valor_constante` - Leitura de variáveis do escopo
- `chamada_função_imediata` - Chamadas de função com sintaxe `nome(arg)`

### `lista.js` (264 linhas)
Operações relacionadas a listas e objetos:
- `fatia` - Indexação e fatiamento (`[i]`, `[i:j]`)
- `tamanho` - Obter tamanho (`[.]`)
- `chaves` - Obter chaves de objeto (`[*]`)
- `lista` - Parser de literais de lista/objeto (`{...}`)
- `atributo` - Acesso a propriedades (`.prop`)

### `função.js` (92 linhas)
Operações relacionadas a funções:
- `lambda` - Definição de funções lambda (`x => x + 1`)
- `chamada_função` - Aplicação de função (`(arg)`)
- `parênteses` - Agrupamento de expressões (`(expr)`)

### `termos.js` (209 linhas)
Hierarquia de termos com precedência de operadores:
- `getTermo1` - Termos primários e operações de acesso
- `getTermo2` - Alternativas de termos (lambda, valores, negação)
- `getTermo3` - Operadores multiplicativos (`*`, `/`)
- `getTermo4` - Operadores aditivos (`+`, `-`)
- `getTermo5` - Operadores de comparação (`<`, `>`, `==`, etc.)
- `getTermo6` - Operador ternário (`? :`)

### `expressão.js` (68 linhas)
Parser principal e construção de módulos:
- `buildExpressão` - Constrói o parser de expressões completas
- `_0` - Parser de módulos completos com importações

### `index.js` (58 linhas)
Módulo principal que integra todos os sub-módulos:
- Importa todos os parsers dos sub-módulos
- Configura dependências circulares entre módulos
- Exporta `expressão` e `_0` para uso externo

## Dependências Circulares

O analisador sintático possui dependências circulares naturais devido à natureza recursiva da gramática. Por exemplo:
- `expressão` precisa de `termo6`
- `termo6` precisa de `termo5`
- Todos os termos eventualmente precisam de `expressão` para expressões aninhadas

Essas dependências são resolvidas através de:
1. **Declarações forward**: Variáveis `let` declaradas antes de serem definidas
2. **Funções setter**: Funções `setExpressão()` e `setDependências()` que configuram as referências
3. **Funções getter**: Funções `getTermo*()` que constroem os parsers dinamicamente

## Uso

```javascript
import { expressão, _0 } from './analisador_sintático/index.js';

// Parser de expressões individuais
const resultado = expressão("2 + 3 * 4");

// Parser de módulos completos (com importações)
const módulo = _0("módulo # ./outro.0\n\n2 + módulo");
```

## Precedência de Operadores

1. Termos primários: literais, variáveis, parênteses, listas
2. Operações de acesso: `.`, `[]`, `[:]`, `[.]`, `[*]`, `()`
3. Multiplicação/Divisão: `*`, `/`
4. Adição/Subtração: `+`, `-`
5. Comparação: `<`, `>`, `<=`, `>=`, `==`, `!=`
6. Ternário: `? :`
7. Lógico AND: `&`
8. Lógico OR: `|`

## Observações

- Todos os parsers retornam funções que, quando executadas com um escopo, retornam o valor da expressão
- A precedência de operadores é implementada através da hierarquia de termos
- O módulo suporta recursão através de referências forward e setters
