// Control flow step handlers - initialization, error handling, and lifecycle
import { efeitos } from './efeitos.js';

const etapasControle = {
  iniciar: (retorno, estado) => [
    efeitos.obtenha_argumentos(),
    { ...estado, etapa: "obter_argumentos" }
  ],
  obter_argumentos: (retorno, estado) => [
    efeitos.verifique_existência("0_cache.json"),
    { ...estado, argumentos: retorno, etapa: "verificar_cache" }
  ],
  error_saia: (retorno, estado) => [
    efeitos.saia(1),
    estado
  ],
  finalizado: (retorno, estado) => [
    null,
    estado
  ],
};

export { etapasControle };