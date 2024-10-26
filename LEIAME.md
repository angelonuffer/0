# Linguagem 0

Uma linguagem de programação funcional projetada para ser universal. A 0 está sendo criada com dois valores fundamentais em mente:

- Sintaxe Matemática: A 0 utiliza uma sintaxe que se assemelha à notação matemática, eliminando a necessidade de comandos em linguagem natural. Isso facilita a compreensão e a escrita de código, independente da língua nativa do desenvolvedor.

- Integração Universal: A 0 será projetada para se integrar facilmente com outras linguagens de programação e plataformas. Isso permitirá que desenvolvedores utilizem a 0 em uma ampla variedade de ambientes, aproveitando suas capacidades funcionais sem sacrificar a compatibilidade.

O nome 0 foi escolhido por sua simplicidade e universalidade. O zero é um conceito fundamental na matemática e é representado da mesma forma em diversos idiomas, refletindo a natureza inclusiva e acessível da linguagem.

Esperamos que a 0 se torne uma ferramenta valiosa para desenvolvedores ao redor do mundo, promovendo a eficiência e a clareza no desenvolvimento de software.

## Sintaxe

A sintaxe está definida no arquivo [0.yaml](https://0-d0e.pages.dev/0.yaml) e pode ser melhor entendida com a ajuda dos [diagramas](https://0-d0e.pages.dev/diagramas.html) e [exemplos](https://0-d0e.pages.dev/exemplos.html).

## Incluindo num módulo ES6

```html
<div>x = <input id="x" /></div>
<div>x² = <span id="quadrado" /></div>
<script type="module">
  import _0 from "https://0-d0e.pages.dev/0.js"
  
  const input_x = document.getElementById("x")
  const span_quadrado = document.getElementById("quadrado")
  const quadrado = await _0(`
    #(x) = x * x
  `)
  input_x.addEventListener("input", () => span_quadrado.textContent = quadrado(parseFloat(input_x.value)))
</script>
```

## Licença

[![CC0](https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Cc-zero.svg/26px-Cc-zero.svg.png) CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/deed.pt-br)