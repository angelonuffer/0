import { analisador_léxico, analisador_sintático } from "../0.js";

export const teste = ({
  entrada,
  símbolos = [],
  árvore = {},
  saída = "",
  erro = "",
}) => [{
  função: analisador_léxico,
  argumento: entrada,
  retorno_esperado: símbolos,
}, {
  função: entrada => analisador_sintático(
    analisador_léxico(entrada)
  ),
  argumento: entrada,
  retorno_esperado: árvore,
}, /* {
  função: interpretar,
  argumento: { entrada, arquivo: "testar.js" },
  retorno_esperado: {
    saída,
    erro,
  },
} */ ]
