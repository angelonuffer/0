// Higher-level combinators that depend on lexical elements
import { transformar, sequência, opcional, vários, alternativa } from '../analisador_semântico/index.js';
import { espaço } from '../analisador_léxico/index.js';

const createOperação = (espaço) => (termo, operadores) => transformar(
  sequência(
    termo,
    vários(sequência(
      opcional(espaço),
      operadores,
      opcional(espaço),
      termo
    ))
  ),
  v => {
    const [primeiroTermo, operaçõesSequenciais] = v;
    if (operaçõesSequenciais.length === 0) return primeiroTermo;

    return escopo =>
      operaçõesSequenciais.reduce(
        (resultado, valSeq) => {
          const operador = valSeq[1];
          const próximoTermo = valSeq[3];
          return operador(resultado, próximoTermo(escopo));
        },
        primeiroTermo(escopo)
      );
  }
);

const operação = createOperação(espaço);

export { operação };