#! /usr/bin/env node

import {
  sequência,
  inverso,
  símbolo,
  alternativa,
  faixa,
  localizar,
  repetição,
  lista,
  direita,
  esquerda,
  tipo,
} from "./dialeto.js"
import { ordenar } from "./lista.js"

const espaço = repetição(
  alternativa(
    símbolo("\n"),
    símbolo(" "),
    sequência(
      símbolo("//"),
      repetição(
        inverso(
          símbolo("\n"),
        ),
      ),
    ),
  ),
)

const localizar_operador = símbolo_token => localizar(símbolo(símbolo_token), "operador")
const localizar_pontuação = símbolo_token => localizar(símbolo(símbolo_token), "pontuação")

export const analisador_léxico = entrada => direita(
  espaço,
  lista(
    esquerda(
      alternativa(
        localizar(
          repetição(
            faixa("0", "9"),
          ),
          "número",
        ),
        localizar(
          repetição(
            alternativa(
              faixa("a", "z"),
              faixa("A", "Z"),
              símbolo("_"),
              faixa("0", "9"),
            ),
          ),
          "identificador",
        ),
        localizar_operador("+"),
        localizar_operador("-"),
        localizar_operador("*"),
        localizar_operador("/"),
        localizar_operador(">="),
        localizar_operador("<="),
        localizar_operador("=="),
        localizar_operador("!="),
        localizar_operador(">"),
        localizar_operador("<"),
        localizar_operador("&&"),
        localizar_operador("||"),
        localizar_operador("!="),
        localizar_operador("!"),
        localizar_operador("="),
        localizar_pontuação("["),
        localizar_pontuação("]"),
        localizar_pontuação("("),
        localizar_pontuação(")"),
        localizar_pontuação(";"),
        localizar_pontuação("..."),
        localizar(
          sequência(
            símbolo('"'),
            repetição(
              inverso(
                símbolo('"'),
              ),
            ),
            símbolo('"'),
          ),
          "texto",
        ),
        localizar(
          sequência(
            símbolo("`"),
            repetição(
              inverso(
                alternativa(
                  símbolo("${"),
                  símbolo("`"),
                ),
              ),
            ),
            alternativa(
              símbolo("${"),
              símbolo("`"),
            ),
          ),
          "modelo_texto",
        ),
        localizar(
          sequência(
            símbolo("}"),
            repetição(
              inverso(
                alternativa(
                  símbolo("${"),
                  símbolo("`"),
                ),
              ),
            ),
            alternativa(
              símbolo("${"),
              símbolo("`"),
            ),
          ),
          "modelo_texto",
        ),
        localizar_pontuação("#"),
    ),
      espaço,
    ),
  ),
)({entrada, posição: 0}).valor

export const analisador_sintático = entrada => {
  const resultado = tipo("número")({ entrada, posição: 0 })
  if (resultado.erro || resultado.posição !== entrada.length) return {}
  return resultado.valor
}