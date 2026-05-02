# Linguagem 0

A **0** é uma linguagem funcional com sintaxe inspirada na notação matemática, sem palavras reservadas em linguagem natural; essa simplicidade sintática reduz ambiguidades, facilita a aprendizagem e favorece composição e raciocínio formal.

Veja a seção **Exemplos** mais abaixo para uma explicação detalhada da sintaxe e exemplos de uso.

## Executar um módulo

Para executar um arquivo `.0`:

```bash
npx angelonuffer/0 <módulo.0>
```

Avalia a expressão final do módulo e imprime o resultado.

## Executar os testes

```bash
node testar.js
```

## Teste de integração com outro repositório

Para verificar a compatibilidade com módulos em outros repositórios:

```bash
node arquivos_teste/integração.js <repositório> <caminho>
```

Exemplo: `node arquivos_teste/integração.js angelonuffer/antlr.0 tests/0`