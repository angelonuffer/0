# Linguagem 0

A **0** é uma linguagem funcional com sintaxe inspirada na notação matemática, projetada para proporcionar uma integração fluida entre módulos locais e remotos através de uma semântica simples e poderosa.

Consulte o arquivo [EXEMPLOS.md](EXEMPLOS.md) para uma explicação detalhada da sintaxe e exemplos de uso.

## Execução

### Executar um módulo

Para executar um arquivo `.0`:

```bash
npx angelonuffer/0 <módulo.0>
```

O módulo avalia sua expressão final e imprime o resultado.

### Executar os testes do núcleo

```bash
node 0.teste.js
```

### Teste de integração com outro repositório

Para verificar a compatibilidade com módulos em outros repositórios:

```bash
node arquivos_teste/integração.js <repositório> <caminho>
```

Exemplo: `node arquivos_teste/integração.js angelonuffer/antlr.0 tests/0`
