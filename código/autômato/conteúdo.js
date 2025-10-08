// Content loading step handlers
import { efeitos } from './efeitos.js';

const etapasConteúdo = {
  carregar_conteúdos: (retorno, estado) => {
    const [endereço] = Object.entries(estado.conteúdos).find(([endereço, conteúdo]) => conteúdo === null) || []
    if (endereço === undefined) {
      return [null, { ...estado, etapa: "avaliar_módulos" }];
    }
    if (estado.conteúdos["0_cache.json"][endereço]) {
      return [
        null,
        {
          ...estado,
          endereço: endereço,
          conteúdo: estado.conteúdos["0_cache.json"][endereço],
          etapa: "carregar_conteúdo"
        }
      ];
    }
    return [
      endereço.startsWith("https://") ?
        efeitos.carregue_remotamente(endereço) :
        efeitos.carregue_localmente(endereço),
      { ...estado, endereço: endereço, etapa: "carregar_conteúdo" }
    ];
  },
  carregar_conteúdo: (retorno, estado) => {
    const conteúdo = retorno || estado.conteúdo;
    const endereço = estado.endereço;
    const novo_cache = { ...estado.conteúdos["0_cache.json"] };
    if (endereço.startsWith("https://")) {
      novo_cache[endereço] = conteúdo;
    }

    return [
      null,
      {
        ...estado,
        conteúdos: {
          ...estado.conteúdos,
          [endereço]: conteúdo,
          "0_cache.json": novo_cache,
        },
        etapa: "carregar_conteúdos"
      }
    ];
  },
};

export { etapasConteúdo };