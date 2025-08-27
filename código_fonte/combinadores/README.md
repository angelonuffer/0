# Combinadores de Parser

Este módulo contém parser combinators genéricos que podem ser reutilizados por outros projetos. São funções de parsing que não dependem de detalhes específicos da linguagem 0.

## Combinadores Básicos

- `símbolo(texto)` - Corresponde a um literal específico
- `alternativa(...analisadores)` - Tenta diferentes analisadores até um ter sucesso
- `sequência(...analisadores)` - Aplica analisadores em sequência
- `opcional(analisador, padrão)` - Analisador opcional com valor padrão
- `vários(analisador)` - Aplica analisador zero ou mais vezes
- `transformar(analisador, transformador)` - Transforma o resultado de um analisador
- `inversão(analisador)` - Consome um caractere se o analisador falhar
- `faixa(inicial, final)` - Corresponde a um caractere dentro de uma faixa
- `operador(literal, função)` - Cria um operador com função associada

## Combinadores Avançados

- `createOperação(espaço)` - Cria um parser para operações com precedência (em `avançados.js`)

## Uso

```javascript
import { símbolo, alternativa, sequência } from './combinadores/index.js';

const parser = sequência(
  símbolo("Hello"),
  símbolo(" "),
  símbolo("World")
);
```

Estes combinadores seguem o padrão funcional e podem ser compostos para criar parsers complexos.