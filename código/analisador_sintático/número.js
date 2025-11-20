import dialeto from "./dialeto.js"
import assert from "assert"

const número = {
  tipo: "sequência",
  partes: [
    {
      nome: "tipo",
      gramática: {
        tipo: "constante",
        valor: "número",
      },
    },
    {
      nome: "valor",
      gramática: {
        tipo: "repetição",
        gramática: {
          tipo: "faixa",
          de: "0",
          até: "9",
        },
      },
    },
  ],
}

{
  const análise = dialeto.analisar({
    entrada: "123",
    gramática: número,
  })
  assert.strictEqual(análise.valor.tipo, "número")
  assert.strictEqual(análise.valor.valor, "123")
  assert.strictEqual(análise.i, 3)
}

{
  const análise = dialeto.analisar({
    entrada: "0",
    gramática: número,
  })
  assert.strictEqual(análise.valor.valor, "0")
  assert.strictEqual(análise.i, 1)
}

{
  const análise = dialeto.analisar({
    entrada: "007",
    gramática: número,
  })
  assert.strictEqual(análise.valor.valor, "007")
  assert.strictEqual(análise.i, 3)
}

{
  const análise = dialeto.analisar({
    entrada: "",
    gramática: número,
  })
  assert.strictEqual(análise.valor.valor, "")
  assert.strictEqual(análise.i, 0)
}

{
  const análise = dialeto.analisar({
    entrada: "123abc",
    gramática: número,
  })
  assert.strictEqual(análise.valor.valor, "123")
  assert.strictEqual(análise.i, 3)
}

{
  const análise = dialeto.analisar({
    entrada: "abc",
    gramática: número,
  })
  assert.strictEqual(análise.valor.valor, "")
  assert.strictEqual(análise.i, 0)
}

export default número;