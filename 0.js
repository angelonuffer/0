#! /usr/bin/env node

import {
  sequência,
  inverso,
  símbolo,
  alternativa,
  faixa,
  transformação,
  localizar,
  repetição,
  lista,
  direita,
  esquerda,
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

export const analisador_léxico = entrada => {
  const símbolos = direita(
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
  símbolos.origem = entrada
  return símbolos
}

const número_sintático = transformação(
  ({ entrada, posição }) => {
    const atual = entrada[posição]
    const valor = typeof atual === "string" ? atual : atual?.valor
    if (typeof valor === "string" && /^[0-9]+$/.test(valor)) return {
      valor,
      posição: posição + 1,
    }
    return { erro: "/[0-9]+/", posição }
  },
  valor => ({
    "Número": Number(valor),
  }),
)

export const analisador_sintático = entrada => {
  const resultado = número_sintático({ entrada, posição: 0 })
  const primeiro_valor = typeof entrada[0] === "string" ? entrada[0] : entrada[0]?.valor
  if (! resultado.erro && resultado.posição === entrada.length && entrada.origem === primeiro_valor) {
    return resultado.valor
  }
  return {}
}