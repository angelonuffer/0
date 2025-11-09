// Import parser - extracts imports from module content
// Note: This module no longer parses # imports as they have been removed.
// Imports are now done only with URL literals as values.
import { sequência, opcional, transformar } from '../combinadores/index.js';
import { espaço } from '../analisador_léxico/index.js';

// Parser for extracting imports from module content
// Returns empty list since # imports are no longer supported
const importações = transformar(
  sequência(
    opcional(espaço),
  ),
  valorSeq => {
    return [];
  }
);

export { importações };
