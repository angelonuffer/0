import { analisador_sintático } from "../fonte/0.js";
import { analisador_léxico } from "../fonte/analisador-léxico.js";

export const teste = ({
  entrada,
  símbolos = [],
  ...opções
}) => [
  {
    função: analisador_léxico,
    argumento: entrada,
    retorno_esperado: símbolos,
  },
  ...("árvore" in opções ? [{
    função: analisador_sintático,
    argumento: entrada,
    retorno_esperado: opções.árvore,
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
