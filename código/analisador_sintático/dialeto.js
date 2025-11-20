const analisar = ({ entrada, gramática, i = 0 }) => {
  switch (gramática.tipo) {
    case "repetição": {
      const análise = analisar({
        entrada,
        gramática: gramática.gramática,
        i,
      })
      if (análise.i === i) return {
        valor: entrada.slice(0, i),
        i,
      }
      if (análise.i === entrada.length) return {
        valor: entrada,
        i: entrada.length,
      }
      return analisar({
        entrada,
        gramática,
        i: análise.i,
      })
    }
    case "faixa": {
      if (entrada[i] >= gramática.de && entrada[i] <= gramática.até) return {
        valor: entrada[i],
        i: i + 1,
      }
      return {
        valor: "",
        i,
      }
    }
    default:
      return {
        i,
      }
  }
}

export default { analisar }