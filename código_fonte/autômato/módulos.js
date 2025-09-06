// Module evaluation and execution step handlers
import { _0 } from '../analisador_sintático/index.js';
import { efeitos } from './efeitos.js';

const etapasMódulos = {
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
  executar_módulo_principal: (retorno, estado) => {
    // For backward compatibility, if the module is an old-style function that returns effects array,
    // we need to convert it to the new interface
    const módulo_principal_fn = estado.valores_módulos[estado.módulo_principal];
    
    // Check if this is the first call by looking for efeitos_módulo_pendentes
    if (!estado.efeitos_módulo_pendentes) {
      // First call - get the initial effects from the main module
      const resultado = módulo_principal_fn(estado.módulo_principal_estado);
      
      // Handle both old format (just effects array) and new format ([effects, state])
      let efeitos_módulo, novo_estado_principal;
      if (Array.isArray(resultado) && resultado.length === 2 && 
          Array.isArray(resultado[0])) {
        // New format: [effects, state]
        [efeitos_módulo, novo_estado_principal] = resultado;
      } else {
        // Old format: just effects array (backward compatibility)
        efeitos_módulo = resultado;
        novo_estado_principal = estado.módulo_principal_estado;
      }
      
      if (!efeitos_módulo || efeitos_módulo.length === 0) {
        return [null, { 
          ...estado, 
          módulo_principal_estado: novo_estado_principal,
          etapa: "finalizado" 
        }];
      }
      return [
        null,
        {
          ...estado,
          módulo_principal_estado: novo_estado_principal,
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
    // Debug logging
    if (retorno !== null && retorno !== undefined) {
      console.log("processar_efeito_principal: received return value:", retorno);
      const módulo_principal_fn = estado.valores_módulos[estado.módulo_principal];
      console.log("Main function length:", módulo_principal_fn.length);
    }
    
    // If we have a return value from a previous effect, call the main module function
    // to get new effects and state (only if it supports the new interface)
    if (retorno !== null && retorno !== undefined) {
      const módulo_principal_fn = estado.valores_módulos[estado.módulo_principal];
      
      // Check if the main module function accepts a second parameter (new interface)
      // by checking its length property
      if (módulo_principal_fn.length >= 2) {
        // New interface: function(state, return_value) => [effects, new_state]
        const resultado = módulo_principal_fn(estado.módulo_principal_estado, retorno);
        
        // Handle both old format (just effects array) and new format ([effects, state])
        let novos_efeitos, novo_estado_principal;
        if (Array.isArray(resultado) && resultado.length === 2 && 
            Array.isArray(resultado[0])) {
          // New format: [effects, state]
          [novos_efeitos, novo_estado_principal] = resultado;
        } else {
          // Old format: just effects array (backward compatibility)
          novos_efeitos = resultado;
          novo_estado_principal = estado.módulo_principal_estado;
        }
        
        // If no new effects, we're done
        if (!novos_efeitos || novos_efeitos.length === 0) {
          return [null, { 
            ...estado, 
            módulo_principal_estado: novo_estado_principal,
            etapa: "finalizado" 
          }];
        }
        
        // Set new effects and updated main module state
        return [
          null,
          {
            ...estado,
            módulo_principal_estado: novo_estado_principal,
            efeitos_módulo_pendentes: novos_efeitos,
            etapa: "processar_efeito_principal"
          }
        ];
      }
      // If function doesn't support new interface, continue with old behavior
    }
    
    // No return value or old interface - process the next pending effect
    if (!estado.efeitos_módulo_pendentes || estado.efeitos_módulo_pendentes.length === 0) {
      return [null, { ...estado, etapa: "finalizado" }];
    }
    
    const [efeito_original, ...resto_efeitos] = estado.efeitos_módulo_pendentes;
    
    // Convert array effects to string effects for standardization
    let efeito;
    if (typeof efeito_original === 'string') {
      efeito = efeito_original;
    } else if (Array.isArray(efeito_original)) {
      const [index, ...args] = efeito_original;
      switch (index) {
        case 0: // saia
          efeito = `process.exit(${args[0]})`;
          break;
        case 1: // escreva  
          efeito = `console.log(${JSON.stringify(args[0])})`;
          break;
        case 2: // obtenha_argumentos
          efeito = `process.argv.slice(2)`;
          break;
        case 3: // carregue_localmente
          efeito = `fs.readFileSync(${JSON.stringify(args[0])}, "utf-8")`;
          break;
        case 4: // carregue_remotamente
          efeito = `(await (await fetch(${JSON.stringify(args[0])})).text())`;
          break;
        case 5: // verifique_existência
          efeito = `fs.existsSync(${JSON.stringify(args[0])})`;
          break;
        case 6: // salve_localmente
          efeito = `fs.writeFileSync(${JSON.stringify(args[0])}, ${JSON.stringify(args[1])})`;
          break;
        default:
          throw new Error(`Unknown effect index: ${index}`);
      }
    } else {
      efeito = efeito_original;
    }
    
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
};

export { etapasMódulos };