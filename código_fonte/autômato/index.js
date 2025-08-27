// Automaton - State machine and execution logic
import { _0 } from '../analisador_sintático/index.js';

const efeitos = Object.fromEntries([
  "saia",
  "escreva",
  "obtenha_argumentos",
  "carregue_localmente",
  "carregue_remotamente",
  "verifique_existência",
  "salve_localmente",
].map((nome, i) => [nome, (...argumentos) => [i, ...argumentos]]))

const etapas = {
  iniciar: (retorno, estado) => [
    efeitos.obtenha_argumentos(),
    { ...estado, etapa: "obter_argumentos" }
  ],
  obter_argumentos: (retorno, estado) => [
    efeitos.verifique_existência("0_cache.json"),
    { ...estado, argumentos: retorno, etapa: "verificar_cache" }
  ],
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
        módulo_principal_estado: {},
        etapa: "carregar_conteúdos"
      }
    ];
  },
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
  avaliar_módulos: (retorno, estado) => {
    const [endereço] = Object.entries(estado.módulos).find(([endereço, módulo]) => módulo === null) || []
    if (endereço === undefined) {
      return [null, { ...estado, etapa: "executar_módulos" }];
    }
    const módulo_bruto = _0.analisar(estado.conteúdos[endereço])
    if (módulo_bruto.erro || módulo_bruto.resto.length > 0) {
      if (módulo_bruto.erro) {
        return [
          efeitos.escreva(`Erro: ${módulo_bruto.erro.message}\n${módulo_bruto.erro.stack}`),
          { ...estado, etapa: "error_saia" }
        ];
      }
      // Find the position of the syntax error
      // The menor_resto contains the part that couldn't be parsed
      const posição_base = estado.conteúdos[endereço].length - (módulo_bruto.menor_resto?.length ?? 0)
      
      // If menor_resto is undefined, the parser completely failed
      // In this case, use the end of input minus 1 to point to the last character
      if (!módulo_bruto.menor_resto) {
        const posição_erro = Math.max(0, estado.conteúdos[endereço].length - 1);
        const linhas = estado.conteúdos[endereço].split('\n')
        const linhas_antes = estado.conteúdos[endereço].substring(0, posição_erro).split('\n');
        const número_linha = linhas_antes.length
        const número_coluna = linhas_antes.at(-1).length + 1
        const linha = linhas[número_linha - 1]
        
        const linha_com_erro = (linha?.substring(0, número_coluna - 1) ?? "") +
          `\x1b[41m${linha?.[número_coluna - 1] ?? ""}\x1b[0m` +
          (linha?.substring(número_coluna) ?? "")
        return [
          efeitos.escreva(`Erro de sintaxe.\n${endereço}\n${número_linha}:${número_coluna}: ${linha_com_erro}`),
          { ...estado, etapa: "error_salvar_cache" }
        ];
      }
      
      // Look for the first character in menor_resto that's not whitespace or a valid operator continuation
      let offset_no_menor_resto = 0;
      const menor_resto = módulo_bruto.menor_resto || "";
      
      // Skip operators and whitespace to find the actual problematic character
      while (offset_no_menor_resto < menor_resto.length) {
        const char = menor_resto[offset_no_menor_resto];
        // Skip whitespace, +, -, *, /, =, etc. to find the real unexpected character
        if (char.match(/[\s+\-*/=<>!&|]/)) {
          offset_no_menor_resto++;
        } else {
          break;
        }
      }
      
      const posição_erro = posição_base + offset_no_menor_resto;
      
      const linhas = estado.conteúdos[endereço].split('\n')
      const linhas_antes = estado.conteúdos[endereço].substring(0, posição_erro).split('\n');
      const número_linha = linhas_antes.length
      const número_coluna = linhas_antes.at(-1).length + 1
      const linha = linhas[número_linha - 1]
      
      const linha_com_erro = (linha?.substring(0, número_coluna - 1) ?? "") +
        `\x1b[41m${linha?.[número_coluna - 1] ?? ""}\x1b[0m` +
        (linha?.substring(número_coluna) ?? "")
      return [
        efeitos.escreva(`Erro de sintaxe.\n${endereço}\n${número_linha}:${número_coluna}: ${linha_com_erro}`),
        { ...estado, etapa: "error_salvar_cache" }
      ];
    }

    const resolve_endereço = (base_module_path, rel_path) => {
      if (rel_path.startsWith('https://')) {
        return rel_path;
      }
      const base_dir = base_module_path.includes('/') ? base_module_path.substring(0, base_module_path.lastIndexOf('/') + 1) : '';
      const base_url = 'file:///' + base_dir;
      const resolved_url = new URL(rel_path, base_url);
      return decodeURIComponent(resolved_url.pathname.substring(1));
    }

    const [importações, , corpo] = módulo_bruto.valor;
    const resolved_importações = importações.map(([nome, end_rel]) => [nome, resolve_endereço(endereço, end_rel)]);

    const novas_dependências_conteúdos = Object.fromEntries(
      resolved_importações
        .filter(([, end]) => !estado.conteúdos.hasOwnProperty(end))
        .map(([, end]) => [end, null])
    );

    const novas_dependências_módulos = Object.fromEntries(
      resolved_importações
        .filter(([, end]) => !estado.módulos.hasOwnProperty(end))
        .map(([, end]) => [end, null])
    );

    return [
      null,
      {
        ...estado,
        conteúdos: {
          ...estado.conteúdos,
          ...novas_dependências_conteúdos,
        },
        módulos: {
          ...estado.módulos,
          ...novas_dependências_módulos,
          [endereço]: [resolved_importações, [], corpo],
        },
        etapa: "carregar_conteúdos"
      }
    ];
  },
  error_salvar_cache: (retorno, estado) => [
    efeitos.salve_localmente("0_cache.json", JSON.stringify(estado.conteúdos["0_cache.json"], null, 2)),
    { ...estado, etapa: "error_saia" }
  ],
  error_saia: (retorno, estado) => [
    efeitos.saia(1),
    estado
  ],
  executar_módulos: (retorno, estado) => {
    const [endereço, módulo] = Object.entries(estado.módulos).find(
      ([e, m]) =>
        m !== null &&
        !estado.valores_módulos.hasOwnProperty(e) &&
        m[0].every(([, dep_end]) => estado.valores_módulos.hasOwnProperty(dep_end))
    ) || [];

    if (endereço === undefined) {
      const todos_avaliados = Object.keys(estado.módulos).every(e => estado.valores_módulos.hasOwnProperty(e));
      if (todos_avaliados) {
        return [
          efeitos.salve_localmente("0_cache.json", JSON.stringify(estado.conteúdos["0_cache.json"], null, 2)),
          { ...estado, etapa: "salvar_cache_completo" }
        ];
      } else {
        return [
          efeitos.escreva("Erro: Dependência circular detectada."),
          { ...estado, etapa: "error_saia" }
        ];
      }
    }

    const [importações, , corpo] = módulo;

    const escopo_importações = Object.fromEntries(
      importações.map(([nome, dep_end]) => [nome, estado.valores_módulos[dep_end]])
    );

    const escopo = { ...escopo_importações };

    const valor = corpo(escopo);

    return [
      null,
      {
        ...estado,
        valores_módulos: {
          ...estado.valores_módulos,
          [endereço]: valor
        },
        etapa: "executar_módulos"
      }
    ];
  },
  salvar_cache_completo: (retorno, estado) => [
    null,
    { ...estado, etapa: "executar_módulo_principal" }
  ],
  executar_módulo_principal: (retorno, estado) => {
    // For backward compatibility, if the module is an old-style function that returns effects array,
    // we need to convert it to the new interface
    const módulo_principal_fn = estado.valores_módulos[estado.módulo_principal];
    
    // Check if this is the first call by looking for efeitos_módulo_pendentes
    if (!estado.efeitos_módulo_pendentes) {
      // First call - get the initial effects from the main module
      const efeitos_módulo = módulo_principal_fn(estado.módulo_principal_estado);
      if (!efeitos_módulo || efeitos_módulo.length === 0) {
        return [null, { ...estado, etapa: "finalizado" }];
      }
      return [
        null,
        {
          ...estado,
          efeitos_módulo_pendentes: efeitos_módulo,
          etapa: "processar_efeito_principal"
        }
      ];
    }
    
    // Continue processing if we have pending effects
    return [
      null,
      { ...estado, etapa: "processar_efeito_principal" }
    ];
  },
  processar_efeito_principal: (retorno, estado) => {
    if (!estado.efeitos_módulo_pendentes || estado.efeitos_módulo_pendentes.length === 0) {
      return [null, { ...estado, etapa: "finalizado" }];
    }
    
    const [efeito, ...resto_efeitos] = estado.efeitos_módulo_pendentes;
    const [tipo] = efeito;
    
    // Execute the effect and update state
    return [
      efeito,
      {
        ...estado,
        efeitos_módulo_pendentes: resto_efeitos,
        etapa: "processar_efeito_principal"
      }
    ];
  },
  finalizado: (retorno, estado) => [
    null,
    estado
  ],
}

const processar = ([retorno, estado]) => {
  const etapa_atual = estado.etapa ?? "iniciar";
  return etapas[etapa_atual](retorno, estado);
}

export { efeitos, etapas, processar };