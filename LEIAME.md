# Linguagem 0

Uma linguagem de programação funcional projetada para ser universal. A 0 está sendo criada com dois valores fundamentais em mente:

- Sintaxe Matemática: A 0 utiliza uma sintaxe que se assemelha à notação matemática, eliminando a necessidade de comandos em linguagem natural. Isso facilita a compreensão e a escrita de código, independente da língua nativa do desenvolvedor.

- Integração Universal: A 0 será projetada para se integrar facilmente com outras linguagens de programação e plataformas. Isso permitirá que desenvolvedores utilizem a 0 em uma ampla variedade de ambientes, aproveitando suas capacidades funcionais sem sacrificar a compatibilidade.

O nome 0 foi escolhido por sua simplicidade e universalidade. O zero é um conceito fundamental na matemática e é representado da mesma forma em diversos idiomas, refletindo a natureza inclusiva e acessível da linguagem.

Esperamos que a 0 se torne uma ferramenta valiosa para desenvolvedores ao redor do mundo, promovendo a eficiência e a clareza no desenvolvimento de software.

## Instalação

Para instalar a Linguagem 0, você pode usar o seguinte comando, que baixa e executa o script de instalação:

```bash
curl -sSL https://cdn.jsdelivr.net/gh/Nuffem/0@main/install.sh | bash
```

O script instala o interpretador e o adiciona ao seu PATH. Se o diretório `~/.local/bin` não estiver no seu PATH, o script fornecerá instruções sobre como adicioná-lo.

## Sintaxe
A sintaxe é definida diretamente no interpretador e pode ser compreendida mais facilmente com o auxílio dos [exemplos](https://github.com/Nuffem/0/blob/main/exemplos.md).

### Principais recursos
- **Importação de módulos (`#`)**: Importa e executa módulos da linguagem 0
- **Carregamento de recursos (`@`)**: Carrega conteúdo de arquivos ou URLs como texto
- **Operações matemáticas**: Suporte completo para aritmética e comparações
- **Funções**: Funções lambda com suporte a guards (condicionais)
- **Objetos e listas**: Estruturas de dados flexíveis com sintaxe intuitiva
- **Manipulação de texto**: Divisão, fatiamento e concatenação de strings

## Testes
Para rodar os testes, execute o seguinte comando:
```bash
node 0_node.js testes/0
```

## Licença

[![CC0](https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Cc-zero.svg/26px-Cc-zero.svg.png) CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/deed.pt-br)