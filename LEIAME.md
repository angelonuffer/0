# Linguagem 0

A 0 é uma linguagem funcional com sintaxe inspirada na notação matemática e projetada para integração simples entre módulos locais e remotos.

## Exemplo

```0
// calcula factorial usando guards
fatorial = n =>
  | n <= 1 = 1
  | n * fatorial(n - 1)

// função simples para demonstrar aplicação
incrementar = x => x + 1

[
  fatorial(5)
  incrementar(5)
]

// [ 120, 6 ]
```

## Execução

### Executar um módulo

```bash
node código/0_node.js <módulo.0>
```

O módulo imprime/expõe seu valor final conforme o resultado do interpretador (ver `código/0_node.js`).

### Executar os testes

```bash
node testes/0.js
```

## Módulos e endereços

- Arquivos de módulo têm extensão `.0`.
- Um módulo contém declarações de topo no formato `identificador = expressão` seguidas por uma expressão final; essa expressão final é o valor exportado do módulo.
- Endereços literais (ex.: `./mod.0`, `../dir/mod.0`, `https://.../mod.0`, ou `nome.0`) podem aparecer como literais no código e são resolvidos pelo contexto de execução do interpretador.

## Léxico e comentários

- Espaços em branco e quebras de linha são ignorados quando apropriado.
- Comentários de linha: `// comentario` até o fim da linha.
- Comentários em bloco: `/* comentario */` para comentários que podem span múltiplas linhas.
- Números: sequência de dígitos, suportando negativos (`42`, `-7`).
- Textos: aspas duplas `"..."`.
- Identificadores: iniciam com letra Unicode ou `_`, seguidos por letras, dígitos ou `_`. Não existem palavras reservadas.

## Construções principais

- Literais: números, textos, listas (`[ ... ]`) e objetos (`{ ... }`).
- Identificadores: nomes que referenciam valores no escopo.
- Aplicação de função: `f(arg)`; chamadas imediatas sem espaço permitem currying e encadeamento: `f(1)(2)`.
- Lambda: `param => expressão` ou destructuring `{a b} => ...`.
- Guards (em corpo de função): após `=>` é possível usar `|` para definir regras condicionais, por exemplo `x => | x > 0 = 1 | x <= 0 = 0`.
- Parênteses com declarações: `(a = 1 b = 2 a + b)` cria um escopo local para `a` e `b`.

## Coleções e acesso

- Listas: `[` itens separados por espaço `]`, ex.: `[1 2 3]`. Suporta espalhamento `...expr` dentro de `[]`.
- Objetos: `{ chave: valor }`, suporte a shorthand `{ name }` (equivalente a `{ name: name }`) e espalhamento `...expr`.
- A gramática diferencia `[]` (listas/valores) e `{}` (objetos com chaves). Itens sem chave devem usar `[]`.

Operações de acesso:

- Indexação/fatia: `v[i]` ou `v[i:j]`. Para strings `v[i]` retorna o código do caractere (charCode), `v[i:j]` retorna substring.
- Tamanho: `v[.]` retorna o `length` quando aplicável.
- Chaves: `v[*]` retorna as chaves/nomes do objeto/coleção.
- Atributo: `obj.prop` acessa propriedade `prop`.

## Operadores e semântica especial

- Aritmética e comparação: `* / + - >= <= > < == !=`.
- Multiplicação `*`: além de produto numérico, quando um operando é lista e o outro é string faz join. Ex.: `['a' 'b'] * ','` → `'a,b'`. O join com `""` converte números em caracteres por código.
- Divisão `/`: quando ambos operandos são strings, realiza `split`; caso contrário, é divisão numérica.
- Soma `+` e subtração `-` seguem semântica usual (strings podem ser concatenadas via `+`).
- Comparadores retornam `1` (verdadeiro) ou `0` (falso).
- Lógicos: `&` e `|` com curto-circuito. `&` avalia o segundo operando somente se o primeiro for diferente de `0`. `|` retorna o primeiro não-zero ou avalia o segundo.
- Ternário `condição ? então : senão` implementado como expressão.
- Negação `!expr` retorna `1` para falso (quando `expr === 0`) e `0` caso contrário.

## Funções e aplicação

- Funções são valores de primeira classe e representam closured scopes.
- Parâmetros podem usar destructuring de objeto: `{a b} => ...` atribui `a` e `b` a partir do objeto-argumento.
- Guards permitem múltiplos ramos com condições e um ramo default.
- Chamadas imediatas (`nome(...)`) buscam `nome` no escopo atual; chamar algo que não é função gera erro semântico.

## Módulos e carregamento dinâmico

- O operador `@ expr` avalia `expr` como endereço e carrega o conteúdo do módulo resultante usando o contexto interno do interpretador.
- Literais de endereço no código (`endereço_literal`) são resolvidos em tempo de avaliação e podem disparar avaliação lazy de módulos (o runner pode fornecer um avaliador lazy para módulos não carregados).
- O runtime mantém um mapa de `valores_módulos` e hooks para `resolve_endereço` e `carregar_conteúdo` — responsáveis por resolver caminhos relativos e efetuar I/O.

## Escopo, avaliação e lazy

- O sistema de escopo é baseado em objetos com ponteiros internos.
- Valores podem ser definidos como thunks preguiçosos (lazy thunks); a primeira vez que são lidos, o thunk é avaliado e cacheado.

## Depuração e mensagens

- Depuração: escrever `% expr` imprime o valor de `expr` em stderr (JSON) e retorna o valor.
- Mensagens de erro semântico incluem um rastro de pilha semântica (frames) e informações auxiliares como nomes disponíveis no escopo, endereço do módulo e termo de busca, para ajudar o desenvolvedor a localizar a origem do erro.

## Erros sintáticos e semânticos

- Erros de sintaxe exibem o arquivo, linha e coluna aproximada com a linha em questão.
- Erros semânticos (ex.: nome não encontrado, aplicação de índice em tipo inválido, tentativa de chamar não-função) incluem possíveis valores no escopo.