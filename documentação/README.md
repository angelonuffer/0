# Documentação - Github Pages

Este diretório contém a documentação da Linguagem 0 preparada para publicação via Github Pages.

## Estrutura

- `index.md` - Página principal da documentação
- `exemplos.md` - Exemplos de código e conceitos da linguagem
- `caracteres-especiais.md` - Referência completa de operadores e caracteres especiais
- `_config.yml` - Configuração do Jekyll para Github Pages

## Configuração do Github Pages

Para publicar esta documentação no Github Pages:

1. Vá nas configurações do repositório (Settings)
2. Na seção "Pages" no menu lateral
3. Em "Source", selecione a branch (geralmente `main`)
4. Em "Folder", selecione `/documentação`
5. Clique em "Save"

O site será publicado em: `https://angelonuffer.github.io/0/`

## Tema

O tema utilizado é o `jekyll-theme-minimal`, que é um dos temas oficiais do Github Pages e não requer instalação adicional.

## Desenvolvimento Local

Para testar localmente (opcional):

```bash
cd documentação
jekyll serve
```

Acesse em: `http://localhost:4000`
