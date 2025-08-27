// Higher-level combinators that depend on lexical elements
import { createOperação } from '../combinadores/index.js';
import { espaço } from '../analisador_léxico/index.js';

const operação = createOperação(espaço);

export { operação };