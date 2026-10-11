# Linguagem 0

A **0** é uma linguagem funcional com sintaxe inspirada na notação matemática, sem palavras reservadas em linguagem natural; essa simplicidade sintática reduz ambiguidades, facilita a aprendizagem e favorece composição e raciocínio formal.

## Executar um módulo

Para executar um arquivo `.0`:

```bash
npx angelonuffer/0 <módulo.0>
```

Avalia a expressão final do módulo e imprime o resultado.
Arquivos `.0` na mesma pasta ficam disponíveis como identificadores com o nome
do arquivo sem a extensão. Eles só são lidos e avaliados quando o identificador
é utilizado.

## Usar com Vite

Instale o plugin a partir do GitHub, fixando a dependência em um commit:

```bash
npm install --save-dev github:angelonuffer/0#COMMIT_SHA
```

Substitua `COMMIT_SHA` pelo SHA completo do commit desejado.

Adicione-o à configuração do Vite:

```js
import { defineConfig } from "vite"
import plugin0 from "0"

export default defineConfig({
  plugins: [plugin0()],
})
```

Depois, importe arquivos `.0` como módulos. O valor da expressão final do
módulo fica disponível como `default`. Referências a módulos `.0` da mesma
pasta são resolvidas pelo nome do arquivo, como no interpretador:

```js
import incrementar from "./incrementar.0"
```

Para incluir todos os arquivos `.0` de uma pasta no bundle, use a descoberta
de módulos do Vite:

```js
const módulos = import.meta.glob("./**/*.0", {
  eager: true,
  import: "default",
})
```

O plugin transforma os arquivos `.0` encontrados pelo Vite; ele não inclui
arquivos que não sejam importados nem encontrados por `import.meta.glob`.

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