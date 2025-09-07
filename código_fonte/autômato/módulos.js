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
      // Use menor_resto if available (complete parsing failure), otherwise use resto position
      const unparsed_text = módulo_bruto.menor_resto || módulo_bruto.resto;
      const posição_base = estado.conteúdos[endereço].length - unparsed_text.length;
      
      // If no unparsed text available, the error is at the end of input
      if (!unparsed_text || unparsed_text.length === 0) {
        const posição_erro = estado.conteúdos[endereço].length;
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
      
      // The error position is exactly where the parser stopped
      // posição_base already points to the first character that couldn't be parsed
      const posição_erro = posição_base;
      
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
    // New interface: main module receives and returns context arrays like 0_node.js
    const módulo_principal_fn = estado.valores_módulos[estado.módulo_principal];
    
    // Create context array: [retorno, ...rest_of_state]
    const contexto = [retorno, ...estado.módulo_principal_estado];
    
    // Call main module with context - it should return [efeito, ...novo_estado]
    const resultado = módulo_principal_fn(contexto);
    
    if (!resultado || !Array.isArray(resultado)) {
      return [null, { ...estado, etapa: "finalizado" }];
    }
    
    const [efeito, ...novo_estado] = resultado;
    
    // If no effect, we're done
    if (!efeito) {
      return [null, { ...estado, etapa: "finalizado" }];
    }
    
    // Convert array effects to string effects for execution
    let efeito_string;
    if (typeof efeito === 'string') {
      efeito_string = efeito;
    } else if (Array.isArray(efeito)) {
      const [index, ...args] = efeito;
      switch (index) {
        case 0: // saia
          efeito_string = `process.exit(${args[0]})`;
          break;
        case 1: // escreva  
          efeito_string = `console.log(${JSON.stringify(args[0])})`;
          break;
        case 2: // obtenha_argumentos
          efeito_string = `process.argv.slice(2)`;
          break;
        case 3: // carregue_localmente
          efeito_string = `import('fs').then(fs => fs.readFileSync(${JSON.stringify(args[0])}, 'utf-8'))`;
          break;
        case 4: // carregue_remotamente
          efeito_string = `(await (await fetch(${JSON.stringify(args[0])})).text())`;
          break;
        case 5: // verifique_existência
          efeito_string = `import('fs').then(fs => fs.existsSync(${JSON.stringify(args[0])}))`;
          break;
        case 6: // salve_localmente
          efeito_string = `import('fs').then(fs => fs.writeFileSync(${JSON.stringify(args[0])}, ${JSON.stringify(args[1])}))`;
          break;
        default:
          efeito_string = efeito.toString();
      }
    } else {
      efeito_string = efeito.toString();
    }
    
    // Execute the effect and prepare for next iteration
    return [
      efeito_string,
      {
        ...estado,
        módulo_principal_estado: novo_estado,
        etapa: "executar_módulo_principal"
      }
    ];
  },

};

export { etapasMódulos };