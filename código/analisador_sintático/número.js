import dialeto from "./dialeto.js"
import assert from "assert"

const número = {
  tipo: "repetição",
  gramática: {
    tipo: "faixa",
    de: "0",
    até: "9",
  },
}

{
  const análise = dialeto.analisar({
    entrada: "123",
    gramática: número,
  })
  assert.strictEqual(análise.valor, "123")
  assert.strictEqual(análise.resto, "")
}

{
  const análise = dialeto.analisar({
    entrada: "0",
    gramática: número,
  })
  assert.strictEqual(análise.valor, "0")
  assert.strictEqual(análise.resto, "")
}

{
  const análise = dialeto.analisar({
    entrada: "007",
    gramática: número,
  })
  assert.strictEqual(análise.valor, "007")
  assert.strictEqual(análise.resto, "")
}

{
  const análise = dialeto.analisar({
    entrada: "",
    gramática: número,
  })
  assert.strictEqual(análise.valor, "")
  assert.strictEqual(análise.resto, "")
}

{
  const análise = dialeto.analisar({
    entrada: "123abc",
    gramática: número,
  })
  assert.strictEqual(análise.valor, "123")
  assert.strictEqual(análise.resto, "abc")
}

{
  const análise = dialeto.analisar({
    entrada: "abc",
    gramática: número,
  })
  assert.strictEqual(análise.valor, "")
  assert.strictEqual(análise.resto, "abc")
}

export default número;