# Exemplo do Problema Original

O seguinte código **não é mais permitido** (constantes em parênteses):

```
(
  a = 2
  a + 3
)
```

Agora deve ser escrito como:

```
exemplo = {
  a: 2
  resultado: a + 3
}

exemplo.resultado
```

ou usando índices para valores sem chave:

```
exemplo = {
  a: 2
  a + 3  # valor sem chave em índice 0
}

exemplo[0]  # acessa o valor 'a + 3' 
```

## Parênteses continuam funcionando para precedência:

```
(2 + 3) * 4  # = 20
```