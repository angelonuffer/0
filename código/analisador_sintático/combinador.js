import dialeto from "./dialeto.js"
import { TIPO_AST } from '../constantes.js';

export default gramática => entrada => {
  const análise = dialeto.analisar({ entrada, gramática })
  if (análise.resto.length === entrada.length) return {
    sucesso: false,
    valor: undefined,
    resto: entrada,
    menor_resto: entrada,
  }
  return {
    sucesso: true,
    valor: {
      tipo: TIPO_AST.NÚMERO,
      valor: parseInt(análise.valor, 10),
    },
    resto: análise.resto,
    menor_resto: análise.resto,
  }
}