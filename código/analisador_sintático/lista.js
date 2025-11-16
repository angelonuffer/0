// List parser: handles square-bracket lists, slicing and related operations
import { sequência, opcional, vários, alternativa, transformar, símbolo } from '../combinadores/index.js';
import { espaço } from '../analisador_léxico/index.js';

// Forward declaration for recursive expressão reference
let expressão;

const fatia = transformar(
  sequência(
    símbolo("["),
    código => expressão(código),
    opcional(sequência(
      símbolo(":"),
      opcional(código => expressão(código)),
    )),
    símbolo("]"),
  ),
  valorSeq => {
    const [, índiceExpr, opcionalFaixa,] = valorSeq;
    const éFaixa = opcionalFaixa ? opcionalFaixa[0] !== undefined : false;
    const fimExpr = opcionalFaixa ? opcionalFaixa[1] : undefined;

    return {
      tipo: 'operação_fatia',
      índice: índiceExpr,
      fim: fimExpr,
      éFaixa: éFaixa
    };
  }
);

const tamanho = transformar(
  símbolo("[.]"),
  () => ({
    tipo: 'operação_tamanho'
  })
);

const chaves = transformar(
  símbolo("[*]"),
  () => ({
    tipo: 'operação_chaves'
  })
);

const lista = transformar(
  sequência(
    símbolo("["),
    opcional(espaço),
    vários(
      alternativa(
        sequência( // Spread syntax ...expression
          símbolo("..."),
          código => expressão(código),
          opcional(espaço),
        ),
        sequência( // Value-only (auto-indexed)
          código => expressão(código),
          opcional(espaço),
        ),
      ),
    ),
    símbolo("]")
  ),
  ([, , valores_vários,]) => {
    if (!valores_vários) {
      return {
        tipo: 'lista',
        items: [],
        usarObjeto: false
      };
    }
    
    // Check if any spread operations exist
    const hasSpreads = valores_vários.some(v_seq => v_seq[0] === "...");
    
    const usarObjeto = hasSpreads;
    
    const items = valores_vários.map(v_alt => {
      const firstEl = v_alt[0];
      if (firstEl === "...") {
        return {
          tipo: 'espalhamento',
          expressão: v_alt[1]
        };
      } else {
        return {
          valor: v_alt[0]
        };
      }
    });
    
    return {
      tipo: 'lista',
      items: items,
      usarObjeto: usarObjeto
    };
  }
);

// Function to set the expressão reference
const setExpressão = (expr) => {
  expressão = expr;
};

export { fatia, tamanho, chaves, lista, setExpressão };
