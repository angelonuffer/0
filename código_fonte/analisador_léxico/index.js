// Lexical analyzer - Tokenization and basic lexical elements
import { alternativa, sequência, opcional, vários, inversão, faixa, símbolo } from '../combinadores/index.js';
import { criarNúmero, criarNúmeroNegativo, criarNome, criarEndereço, criarTexto } from '../analisador_semântico/index.js';

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

// Raw parsers for structure only
const número_raw = sequência(
  faixa("0", "9"),
  vários(
    faixa("0", "9"),
  ),
)

// Semantic version with transformation
const número = criarNúmero(número_raw);

// Raw parsers for structure only  
const número_negativo_raw = sequência(
  símbolo("-"),
  faixa("0", "9"),
  vários(
    faixa("0", "9"),
  ),
)

// Semantic version with transformation
const número_negativo = criarNúmeroNegativo(número_negativo_raw);

const letra = inversão(
  alternativa(
    espaço_em_branco,
    faixa("!", "?"),
    faixa("[", "^"),
    faixa("{", "~"),
  ),
)

// Raw parsers for structure only
const nome_raw = sequência(
  letra,
  vários(
    alternativa(
      letra,
      faixa("0", "9"),
    ),
  ),
)

// Semantic version with transformation 
const nome = criarNome(nome_raw);

// Raw parsers for structure only
const endereço_raw = vários(
  inversão(
    espaço_em_branco,
  ),
)

// Semantic version with transformation
const endereço = criarEndereço(endereço_raw);

// Raw parsers for structure only
const texto_raw = sequência(
  símbolo('"'),
  vários(
    inversão(
      símbolo('"'),
    ),
  ),
  símbolo('"'),
)

// Semantic version with transformation
const texto = criarTexto(texto_raw);

export {
  espaço_em_branco,
  espaço,
  número,
  número_negativo,
  letra,
  nome,
  endereço,
  texto
};