import dialeto from "./dialeto.js"
import { TIPO_AST } from '../constantes.js';

export default gramática => entrada => {
  const resultado = dialeto.analisar({ entrada, gramática })
  if (resultado.resto.length === entrada.length) return {
    sucesso: false,
    valor: undefined,
    resto: entrada,
    menor_resto: entrada,
  }
  return {
    sucesso: true,
    valor: {
      tipo: TIPO_AST.NÚMERO,
      valor: parseInt(resultado.valor, 10),
    },
    resto: resultado.resto,
    menor_resto: resultado.resto,
  }
}