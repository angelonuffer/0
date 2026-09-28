import { analisador_sintático } from "../fonte/analisador-sintático.js";
import { analisador_léxico } from "../fonte/analisador-léxico.js";

export const teste = ({
  entrada,
  símbolos,
  árvore = undefined,
}) => [
  {
    função: analisador_léxico,
    argumento: entrada,
    retorno_esperado: símbolos,
  },
  ...(árvore !== undefined ? [{
    função: entrada => analisador_sintático({
      entrada: analisador_léxico(entrada),
      posição: 0,
    }),
    argumento: entrada,
    retorno_esperado: árvore,
  }] : []),
  /* {
    função: interpretar,
    argumento: { entrada, arquivo: "testar.js" },
    retorno_esperado: {
      saída: opções.saída,
      erro: opções.erro,
    },
  } */
]
