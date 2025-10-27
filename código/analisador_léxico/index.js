// Lexical analyzer - Tokenization and basic lexical elements
import { alternativa, sequência, opcional, vários, transformar, inversão, faixa, símbolo } from '../combinadores/index.js';

const espaço_em_branco = alternativa(
  símbolo(" "),
  símbolo("\n"),
)

const espaço = vários(
  alternativa(
    espaço_em_branco,
    sequência(
      símbolo("//"),
      vários(
        inversão(
          símbolo("\n")
        ),
      ),
      símbolo("\n"),
    ),
  ),
)

const número = transformar(
  sequência(
    faixa("0", "9"),
    vários(
      faixa("0", "9"),
    ),
  ),
  v => ({
    tipo: 'número',
    valor: parseInt(v.flat(Infinity).join(""))
  })
)

const número_negativo = transformar(
  sequência(
    símbolo("-"),
    faixa("0", "9"),
    vários(
      faixa("0", "9"),
    ),
  ),
  v => ({
    tipo: 'número',
    valor: -parseInt(v.slice(1).flat(Infinity).join(""))
  })
)

const letra = inversão(
  alternativa(
    espaço_em_branco,
    faixa("!", "?"),
    faixa("[", "^"),
    faixa("{", "~"),
  ),
)

const nome = transformar(
  sequência(
    letra,
    vários(
      alternativa(
        letra,
        faixa("0", "9"),
      ),
    ),
  ),
  v => v.flat(Infinity).join(""),
)

const endereço = transformar(
  vários(
    inversão(
      espaço_em_branco,
    ),
  ),
  v => v.join(""),
)

const texto = transformar(
  sequência(
    símbolo('"'),
    vários(
      inversão(
        símbolo('"'),
      ),
    ),
    símbolo('"'),
  ),
  v => ({
    tipo: 'texto',
    valor: v.flat(Infinity).join("").slice(1, -1)
  })
)

// Parser for address literals (file paths and URLs) as expression values
// Recognizes patterns like: soma.0, ./soma.0, ../dir/soma.0, https://example.com/soma.0
const endereço_literal = transformar(
  alternativa(
    // URL pattern: https://...
    sequência(
      símbolo("h"),
      símbolo("t"),
      símbolo("t"),
      símbolo("p"),
      símbolo("s"),
      símbolo(":"),
      símbolo("/"),
      símbolo("/"),
      vários(
        inversão(
          alternativa(
            espaço_em_branco,
            símbolo(")"),
            símbolo("]"),
            símbolo("}"),
          )
        )
      )
    ),
    // Relative path pattern: ./... or ../... (must have at least one character after the dot)
    sequência(
      símbolo("."),
      opcional(símbolo(".")),
      símbolo("/"),
      vários(
        inversão(
          alternativa(
            espaço_em_branco,
            símbolo(")"),
            símbolo("]"),
            símbolo("}"),
          )
        )
      )
    ),
    // Simple file pattern: something.0
    sequência(
      letra,
      vários(
        alternativa(
          letra,
          faixa("0", "9"),
        )
      ),
      símbolo("."),
      símbolo("0"),
    ),
  ),
  v => ({
    tipo: 'endereço_literal',
    valor: v.flat(Infinity).join("")
  })
)

export {
  espaço_em_branco,
  espaço,
  número,
  número_negativo,
  letra,
  nome,
  endereço,
  endereço_literal,
  texto
};