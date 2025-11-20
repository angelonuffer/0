import dialeto from "./dialeto.js"
import { TIPO_AST } from '../constantes.js';

export default gramática => entrada => {
  const análise = dialeto.analisar({ entrada, gramática })
  if (análise.i === 0) return {
    sucesso: false,
    valor: undefined,
    resto: entrada,
    menor_resto: entrada,
  }
  const resto = entrada.slice(análise.i)
  return {
    sucesso: true,
    valor: {
      tipo: TIPO_AST.NÚMERO,
      valor: parseInt(análise.valor, 10),
    },
    resto: resto,
    menor_resto: resto,
  }
}