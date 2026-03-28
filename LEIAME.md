# Linguagem 0

A **0** é uma linguagem funcional com sintaxe inspirada na notação matemática, sem palavras reservadas em linguagem natural; essa simplicidade sintática reduz ambiguidades, facilita a aprendizagem e favorece composição e raciocínio formal.

Consulte [EXEMPLOS.md](EXEMPLOS.md) para uma explicação detalhada da sintaxe e exemplos de uso.

## Executar um módulo

Para executar um arquivo `.0`:

```bash
npx angelonuffer/0 <módulo.0>
```

Avalia a expressão final do módulo e imprime o resultado.

## Executar os testes do núcleo

```bash
node 0.teste.js
```

Opções úteis para execução dos testes:

- `--exiba-todos`: exibe todas as falhas (modo não fail‑fast).
- `--verifique-restantes`: após exibir a primeira falha, continua executando os testes restantes silenciosamente apenas para ajustar a contagem final de testes aprovados.

Exemplos:

```bash
# modo padrão: para na primeira falha
node 0.teste.js

# ver todas as falhas
node 0.teste.js --exiba-todos

# exibe só a primeira falha, mas verifica silenciosamente o restante para contagem precisa
node 0.teste.js --verifique-restantes
```

## Teste de integração com outro repositório

Para verificar a compatibilidade com módulos em outros repositórios:

```bash
node arquivos_teste/integração.js <repositório> <caminho>
```

Exemplo: `node arquivos_teste/integração.js angelonuffer/antlr.0 tests/0`
