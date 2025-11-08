# Carregamento Preguiçoso de Módulos (Lazy Loading)

## Visão Geral

A linguagem 0 agora utiliza um modelo de carregamento preguiçoso (lazy loading) assíncrono para módulos. Este documento descreve as mudanças implementadas e suas implicações.

## Mudanças Principais

### 1. API Assíncrona

**Antes:** O analisador semântico era síncrono, com pré-carregamento de todos os módulos antes da execução.

**Agora:** O analisador semântico é totalmente assíncrono. Todas as funções de avaliação retornam `Promise` e devem ser aguardadas com `await`.

### 2. Carregamento Sob Demanda

**Antes:** O sistema pré-carregava todos os módulos recursivamente antes de iniciar a avaliação.

**Agora:** Os módulos são carregados sob demanda (lazy loading) apenas quando são realmente necessários durante a avaliação.

### 3. Funções e Promises

**Importante:** Lambdas definidas na linguagem 0 retornam funções regulares, mas essas funções retornam Promises quando chamadas (devido ao motor de avaliação assíncrono interno).

```javascript
// Exemplo de função na linguagem 0
soma = a => b => a + b

// Esta função é do tipo Function (não AsyncFunction)
// mas retorna uma Promise ao ser chamada
```

O motor de avaliação cuida automaticamente do `await` quando funções são chamadas dentro do código 0. Para código JavaScript externo, as funções devem ser aguardadas:

```javascript
const func = avaliarResultado; // É uma Function normal
const result = await func(escopo, arg); // Retorna Promise, precisa de await
```

## Suporte a URLs Remotas

### Importação via HTTP/HTTPS

Agora é possível importar módulos diretamente de URLs remotas:

```
// Exemplo de importação remota
uniteste # https://cdn.jsdelivr.net/gh/angelonuffer/uniteste@e24cfba7808bd35cbcd0501a9fc5a71fd23e5d54/código/0
```

### Segurança

⚠️ **AVISO DE SEGURANÇA:** Importar código de URLs remotas pode representar riscos de segurança. Recomendações:

1. **Verifique a origem:** Apenas importe de fontes confiáveis
2. **Use commits específicos:** Em vez de branches (que podem mudar), use URLs com hash de commit específico
3. **Considere whitelist:** Em ambientes de produção, considere implementar uma whitelist de domínios permitidos
4. **Cache local:** O sistema faz cache de módulos remotos em `código/0_cache.json` para evitar downloads repetidos

### Implementação

O carregamento de módulos remotos é feito através de:

1. **Fetch:** Busca o conteúdo do módulo via HTTPS
2. **Cache:** Armazena o conteúdo em cache para uso futuro
3. **Parsing e Avaliação:** Processa o módulo como qualquer outro módulo local

## Biblioteca de Carregamento de Módulos

Foi adicionada uma biblioteca utilitária em `lib/moduleLoader.mjs` que fornece:

### Funções Principais

#### `loadModule(specifier, {referrer})`

Carrega um módulo de forma assíncrona com suporte a:
- Caminhos locais/relativos/absolutos
- Especificadores de pacote (ex: 'lodash')
- URLs HTTP/HTTPS

```javascript
import { loadModule } from './lib/moduleLoader.mjs';

// Carregar módulo local
const localModule = await loadModule('./path/to/module.mjs');

// Carregar de URL
const remoteModule = await loadModule('https://example.com/module.mjs');
```

#### `clearCache()`

Limpa o cache de módulos:

```javascript
import { clearCache } from './lib/moduleLoader.mjs';

clearCache(); // Limpa todos os módulos em cache
```

#### `_cache`

Acesso ao cache para diagnóstico e testes:

```javascript
import { _cache } from './lib/moduleLoader.mjs';

console.log(_cache.size); // Número de módulos em cache
```

### Características

1. **Caching:** Módulos são armazenados em cache após o primeiro carregamento
2. **Coalescência de Requisições:** Múltiplas requisições simultâneas para o mesmo módulo são coalescidas em uma única requisição
3. **Data URLs:** Para módulos JavaScript remotos, tenta usar data URLs primeiro para melhor performance
4. **Fallback para Arquivos Temporários:** Se data URLs falharem, cria arquivos temporários para importação

## Impacto em Código Existente

### Breaking Changes

1. **API Interna:** Se você estava usando a API interna do analisador semântico, agora precisa usar `await`:

```javascript
// Antes
const resultado = avaliar(ast, escopo);

// Agora
const resultado = await avaliar(ast, escopo);
```

2. **Funções Lambdas:** Funções definidas em 0 são regulares (não AsyncFunction), mas retornam Promises:

```javascript
// Se você estava integrando com JavaScript
const func = await avaliar(funcAst, escopo); // func é uma Function normal
const resultado = await func(escopo, argumento); // mas retorna Promise
```

### Compatibilidade

O código na linguagem 0 **não precisa ser alterado**. O motor de avaliação cuida de toda a async/await internamente. Módulos escritos em 0 continuam funcionando sem modificações.

## Performance

### Vantagens

1. **Início Mais Rápido:** Sem pré-carregamento, a execução começa imediatamente
2. **Menos I/O:** Apenas módulos necessários são carregados
3. **Melhor para CLI:** Comandos simples não pagam o custo de carregar toda a árvore de dependências

### Considerações

1. **Primeira Execução:** Pode haver latência ao carregar módulos remotos pela primeira vez
2. **Cache Ajuda:** Após a primeira execução, o cache torna carregamentos subsequentes muito rápidos

## Testes

Os testes unitários para o moduleLoader estão em `lib/test-moduleLoader.mjs`:

```bash
node lib/test-moduleLoader.mjs
```

A suite de testes completa da linguagem 0 continua passando com 203/203 testes:

```bash
node código/0_node.js testes/0 node | node
```

## Desenvolvimentos Futuros

Possíveis melhorias em PRs futuros:

1. **Whitelist de Domínios:** Configuração para restringir importações remotas a domínios específicos
2. **Verificação de Integridade:** Suporte para subresource integrity (SRI) em importações remotas
3. **Timeout Configurável:** Opção para definir timeout em carregamentos remotos
4. **Política de Cache:** Opções para controlar quando e como o cache é usado

## Recursos Adicionais

- Código fonte: `lib/moduleLoader.mjs`
- Testes: `lib/test-moduleLoader.mjs`
- Exemplo de uso: Veja os testes em `testes/` que importam o módulo uniteste remoto
