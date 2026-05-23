import {
  símbolo,
  alternativa,
  opcional,
  transformação,
  sequência,
  vazio,
  zero_ou_mais,
  inverso,
} from "./dialeto.js"
import {
  espaço,
  dígitos,
  identificador_literal,
} from "./analisador_léxico.js"
import {
  avaliar_número,
  avaliar_negação,
  avaliar_parênteses,
  avaliar_constante,
  avaliar_texto_literal,
  avaliar_interpolação,
  avaliar_modelo_texto,
  avaliar_tamanho,
  avaliar_lista,
  avaliar_operação,
  avaliar_expressão_lógica,
  avaliar_aplicações,
  avaliar_expressão_iniciada_por_identificador,
  operadores_produto,
  operadores_soma,
  operadores_comparação,
  operadores_comparação_lógica,
} from "./analisador_semântico.js"

export const número = transformação(
  dígitos,
  avaliar_número,
)

export const negação = transformação(
  sequência(
    símbolo("!"),
    espaço,
    resultado => átomo(resultado),
  ),
  avaliar_negação,
)

export const parênteses = transformação(
  sequência(
    símbolo("("),
    espaço,
    resultado => expressão(resultado),
    espaço,
    símbolo(")")
  ),
  avaliar_parênteses,
)

export const constante = transformação(
  identificador_literal,
  avaliar_constante,
)

export const texto_literal = transformação(
  sequência(
    símbolo('"'),
    zero_ou_mais(
      inverso(
        símbolo('"'),
      ),
    ),
    símbolo('"'),
  ),
  avaliar_texto_literal,
)

export const interpolação = transformação(
  sequência(
    símbolo("${"),
    resultado => expressão(resultado),
    símbolo("}"),
  ),
  avaliar_interpolação,
)

export const modelo_texto = transformação(
  sequência(
    símbolo("`"),
    zero_ou_mais(
      alternativa(
        interpolação,
        inverso(símbolo("`")),
      ),
    ),
    símbolo("`"),
  ),
  avaliar_modelo_texto,
)

export const tamanho = transformação(
  sequência(
    símbolo("#"),
    resultado => átomo(resultado),
  ),
  avaliar_tamanho,
)

export const lista = transformação(
  sequência(
    símbolo("["),
    espaço,
    zero_ou_mais(
      sequência(
        opcional(
          símbolo("..."),
        ),
        resultado => expressão(resultado),
        espaço,
      ),
      sequência(
        símbolo(";"),
        espaço,
      ),
    ),
    espaço,
    opcional(
      símbolo(";"),
    ),
    espaço,
    símbolo("]"),
  ),
  avaliar_lista,
)

export const átomo = alternativa(
  número,
  negação,
  parênteses,
  constante,
  texto_literal,
  modelo_texto,
  tamanho,
  lista,
)

export const construir_operação = (operação_precedente, operadores) => transformação(
  sequência(
    opcional(
      operação_precedente,
      a => a,
    ),
    espaço,
    zero_ou_mais(
      sequência(
        alternativa(
          ...Object.keys(operadores).map(símbolo),
        ),
        espaço,
        átomo,
        espaço,
        opcional(
          operação_precedente,
          b => b,
        ),
        espaço,
      ),
    ),
  ),
  avaliar_operação(operadores)
)

export const produto = construir_operação(vazio, operadores_produto)

export const soma = construir_operação(produto, operadores_soma)

export const comparação = construir_operação(soma, operadores_comparação)

export const comparação_lógica = construir_operação(comparação, operadores_comparação_lógica)

export const expressão_lógica = transformação(
  sequência(
    átomo,
    espaço,
    comparação_lógica,
  ),
  avaliar_expressão_lógica,
)

export const aplicações = transformação(
 sequência(
   átomo,
   espaço,
   opcional(
     resultado => aplicações(resultado),
   ),
 ),
 avaliar_aplicações,
)

export const expressão_iniciada_por_identificador = transformação(
  sequência(
    identificador_literal,
    espaço,
    opcional(
      aplicações,
    ),
    espaço,
    alternativa(
      sequência(
        símbolo("="),
        espaço,
        expressão_lógica,
        espaço,
        alternativa(
          resultado => expressão_iniciada_por_identificador(resultado),
          expressão_lógica,
        ),
        espaço,
      ),
      comparação_lógica,
    ),
  ),
  avaliar_expressão_iniciada_por_identificador,
)

export const expressão = alternativa(
  expressão_iniciada_por_identificador,
  expressão_lógica,
)
