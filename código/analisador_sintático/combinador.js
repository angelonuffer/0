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
  if (análise.valor.tipo === "número") análise.valor.valor = parseInt(análise.valor.valor, 10);
  return {
    sucesso: true,
    valor: análise.valor.valor,
    resto: resto,
    menor_resto: resto,
  }
}