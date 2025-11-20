import dialeto from "./dialeto.js"
import assert from "assert";

const número = {
  tipo: "repetição",
  gramática: {
    tipo: "faixa",
    de: "0",
    até: "9",
  },
}

{
  const res = dialeto.analisar({ entrada: "123", gramática: número });
  assert.strictEqual(res.sucesso, true);
  assert.strictEqual(res.valor, '123');
  assert.strictEqual(res.resto, '');
}

{
  const res = dialeto.analisar({ entrada: '123abc', gramática: número });
  // reconhecimento parcial: aceita '123' e deixa 'abc' como resto
  assert.strictEqual(res.sucesso, false);
  assert.strictEqual(res.valor, '123');
  assert.strictEqual(res.resto, 'abc');
}

{
  const res = dialeto.analisar({ entrada: '0', gramática: número });
  assert.strictEqual(res.sucesso, true);
  assert.strictEqual(res.valor, '0');
  assert.strictEqual(res.resto, '');
}

{
  const res = dialeto.analisar({ entrada: '007', gramática: número });
  assert.strictEqual(res.sucesso, true);
  assert.strictEqual(res.valor, '007');
  assert.strictEqual(res.resto, '');
}

{
  const res = dialeto.analisar({ entrada: 'abc', gramática: número });
  assert.strictEqual(res.sucesso, false);
  assert.strictEqual(res.valor, '');
  assert.strictEqual(res.resto, 'abc');
}

{
  const res = dialeto.analisar({ entrada: '', gramática: número });
  assert.strictEqual(res.sucesso, false);
  assert.strictEqual(res.valor, '');
  assert.strictEqual(res.resto, '');
}

export default número;