// Automaton - State machine and execution logic
// Imports from specialized modules
import { efeitos } from './efeitos.js';
import { etapasCacheManagement } from './cache.js';
import { etapasConteúdo } from './conteúdo.js';
import { etapasMódulos } from './módulos.js';
import { etapasControle } from './controle.js';

// Combine all step handlers from specialized modules
const etapas = {
  ...etapasControle,
  ...etapasCacheManagement,
  ...etapasConteúdo,
  ...etapasMódulos,
}

const processar = ([retorno, estado]) => {
  const etapa_atual = estado.etapa ?? "iniciar";
  return etapas[etapa_atual](retorno, estado);
}

export { efeitos, etapas, processar };