const mensagens = {
  0: () => "Sucesso",
  1: símbolo => `Esperava símbolo: ${símbolo}`,
  2: regex => `Esperava regex: ${regex}`,
  3: opções => `Esperava uma das opções:\n  ${opções.map(([status, valor]) => mensagens[status](valor)).join("\n  ")}`,
  4: nome => `Constante não definida: ${nome}`,
}

export default mensagens