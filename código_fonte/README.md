# Código Fonte

Esta pasta contém o código fonte da linguagem 0 organizado em subdiretórios especializados:

## Estrutura dos Diretórios

### `combinadores/`
Contém os parser combinators genéricos que não são específicos do projeto e podem ser reutilizados por outros projetos. Inclui funções básicas como `símbolo`, `alternativa`, `sequência`, `opcional`, `vários`, `transformar`, `inversão`, `faixa`, etc.

### `analisador_léxico/`
Contém o analisador léxico responsável pela tokenização do código fonte. Identifica elementos lexicais como números, textos, nomes, espaços em branco, etc.

### `analisador_sintático/`
Contém o analisador sintático responsável pela análise da estrutura sintática do código. Constrói a árvore de sintaxe abstrata e lida com expressões, termos, operações, etc.

### `analisador_semântico/`
Contém utilitários para análise semântica como gerenciamento de escopo e funções auxiliares de avaliação. Na linguagem 0, a maior parte da análise semântica está integrada ao analisador sintático.

### `autômato/`
Contém a lógica do autômato (máquina de estados) que gerencia a execução do programa, incluindo carregamento de módulos, resolução de dependências, cache, e processamento de efeitos.

## Organização Modular

A estrutura modular permite:
- Reutilização dos combinadores por outros projetos
- Separação clara de responsabilidades
- Facilidade de manutenção e extensão
- Melhor organização do código

Cada diretório possui um arquivo `index.js` que exporta as funções principais do módulo.