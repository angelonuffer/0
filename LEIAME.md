# Linguagem 0

A **0** é uma linguagem funcional com sintaxe inspirada na notação matemática, sem palavras reservadas em linguagem natural; essa simplicidade sintática reduz ambiguidades, facilita a aprendizagem e favorece composição e raciocínio formal.

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

## Usar como Dev Container Feature

Adicione a feature a `.devcontainer/devcontainer.json`:

```json
{
	"features": {
		"ghcr.io/angelonuffer/0/0:0.0.0": {}
	}
}
```

A opção `ref` aceita o nome de um branch, uma tag ou um SHA de commit. Também aceita `semver:<intervalo>`, como `semver:^0.2.0`, para selecionar uma tag compatível existente no repositório. Sem a opção, a feature instala o conteúdo atual da branch `main`. Por exemplo, para fixar uma referência:

```json
{
	"features": {
		"ghcr.io/angelonuffer/0/0:0.0.0": {
			"ref": "<branch-tag-SHA-ou-semver>"
		}
	}
}
```

Depois de alterar a configuração, reconstrua o Dev Container.