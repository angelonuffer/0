import {
  sequência_literal,
  inverso,
  símbolo,
  alternativa,
  faixa,
  transformação,
  sequência,
  zero_ou_mais,
  um_ou_mais,
} from "./dialeto.js"

export const espaço_na_linha = zero_ou_mais(
  alternativa(
    símbolo(" "),
    sequência_literal(
      símbolo("//"),
      zero_ou_mais(
        inverso(
          símbolo("\n"),
        ),
      ),
    ),
  ),
)

export const espaço = zero_ou_mais(
  alternativa(
    símbolo("\n"),
    espaço_na_linha,
  ),
)

export const dígitos = um_ou_mais(
  faixa("0", "9"),
)

export const identificador_literal = transformação(
  sequência(
    alternativa(
      faixa("a", "z"),
      faixa("A", "Z"),
      símbolo("_"),
    ),
    zero_ou_mais(
      alternativa(
        faixa("a", "z"),
        faixa("A", "Z"),
        símbolo("_"),
        faixa("0", "9"),
      ),
    ),
  ),
  ([primeira_letra, resto]) => primeira_letra + resto.join(""),
)
