// Resource loading parser - extracts @ directives from module content
import { sequência, opcional, vários, transformar, símbolo } from '../combinadores/index.js';
import { espaço, nome, endereço } from '../analisador_léxico/index.js';

// Parser for extracting resource loads from module content
// Returns a list of objects with { nome, endereço } structure
const carregamentos = transformar(
  sequência(
    opcional(espaço),
    opcional(vários(
      sequência(
        sequência(
          nome,
          opcional(espaço),
          símbolo("@"),
          opcional(espaço),
          endereço,
        ),
        espaço,
      ),
    ), []),
  ),
  valorSeq => {
    const [, carregamentosDetectados_val] = valorSeq;
    return carregamentosDetectados_val.map(([[nome_val, , , , endereço_val]]) => ({
      nome: nome_val,
      endereço: endereço_val
    }));
  }
);

export { carregamentos };
