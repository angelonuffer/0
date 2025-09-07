// Cache management step handlers
import { efeitos } from './efeitos.js';

const etapasCacheManagement = {
  verificar_cache: (retorno, estado) => {
    if (retorno) {
      return [
        efeitos.carregue_localmente("0_cache.json"),
        { ...estado, cache_existe: retorno, etapa: "carregar_cache" }
      ];
    }
    return [
      null,
      { ...estado, cache_existe: retorno, conteúdo_cache: "{}", etapa: "avaliar_cache" }
    ];
  },
  carregar_cache: (retorno, estado) => [
    null,
    { ...estado, conteúdo_cache: retorno, etapa: "avaliar_cache" }
  ],
  avaliar_cache: (retorno, estado) => {
    const [endereço] = estado.argumentos;
    return [
      null,
      {
        ...estado,
        módulo_principal: endereço,
        conteúdos: {
          "0_cache.json": JSON.parse(estado.conteúdo_cache),
          [endereço]: null,
        },
        módulos: {
          [endereço]: null,
        },
        valores_módulos: {},
        módulo_principal_estado: [],
        etapa: "carregar_conteúdos"
      }
    ];
  },
  salvar_cache_completo: (retorno, estado) => [
    null,
    { ...estado, etapa: "executar_módulo_principal" }
  ],
  error_salvar_cache: (retorno, estado) => [
    efeitos.salve_localmente("0_cache.json", JSON.stringify(estado.conteúdos["0_cache.json"], null, 2)),
    { ...estado, etapa: "error_saia" }
  ],
};

export { etapasCacheManagement };