export const número = ({
  valor,
  caractere,
}) => {
  if (caractere >= '0' && caractere <= '9') {
    return próximo_caractere => número({
      valor: valor + caractere,
      caractere: próximo_caractere,
    })
  }
  return valor === "" ? 0 : parseInt(valor)
}

export const testar = () => {
  return número({
    valor: "",
    caractere: "0",
  })(" ") === 0
}