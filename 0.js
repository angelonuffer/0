const sucesso = {
  tipo: "sucesso",
  analisar: código => ({ valor: null, resto: código, menor_resto: código }),
};

const símbolo = símbolo_esperado => ({
  tipo: "símbolo",
  símbolo: símbolo_esperado,
  analisar: código => {
    if (código.startsWith(símbolo_esperado)) return {
      valor: símbolo_esperado,
      resto: código.slice(símbolo_esperado.length),
    }
    return { resto: código, menor_resto: código }
  }
})

const alternativa = (...analisadores) => {
  const getParserId = (parser) => {
    if (!parser || typeof parser.tipo !== "string") return null;

    switch (parser.tipo) {
      case "símbolo": return `símbolo_${parser.símbolo}`;
      case "faixa": return `faixa_${parser.inicial}_${parser.final}`;
      default: return null;
    }
  };

  const fatorar_prefixos = (analisadores) => {
    let otimizou = true;
    while (otimizou) {
      otimizou = false;
      const groups = new Map();
      const others = [];
      const newAnalisadores = [];

      for (const p of analisadores) {
        let prefixId = null;
        if (p.tipo === "sequência" && p.analisadores.length > 0) {
          prefixId = getParserId(p.analisadores[0]);
        } else {
          prefixId = getParserId(p);
        }

        if (prefixId) {
          if (!groups.has(prefixId)) groups.set(prefixId, []);
          groups.get(prefixId).push(p);
        } else {
          others.push(p);
        }
      }

      for (const [prefixId, groupParsers] of groups.entries()) {
        if (groupParsers.length > 1) {
          otimizou = true;
          const prefix = groupParsers[0].tipo === "sequência" ? groupParsers[0].analisadores[0] : groupParsers[0];

          const suffixes = groupParsers.map(p => {
            if (p.tipo === "sequência") {
              const remaining = p.analisadores.slice(1);
              if (remaining.length === 0) return sucesso;
              if (remaining.length === 1) return remaining[0];
              return sequência(...remaining);
            }
            return sucesso; // For simple parsers that are prefixes
          });

          newAnalisadores.push(sequência(prefix, alternativa(...suffixes)));
        } else {
          newAnalisadores.push(...groupParsers);
        }
      }
      analisadores = [...newAnalisadores, ...others];
    }
    return analisadores;
  };

  const analisadoresFinais = fatorar_prefixos(analisadores);

  return {
    tipo: "alternativa",
    analisadores: analisadoresFinais,
    analisar: código => {
      let menor_resto = código
      for (const analisador of analisadoresFinais) {
        const resultado = analisador.analisar(código)
        if (resultado.resto !== código || resultado.hasOwnProperty("valor")) return resultado
        if (resultado.menor_resto && resultado.menor_resto.length < menor_resto.length) {
          menor_resto = resultado.menor_resto
        }
      }
      return { resto: código, menor_resto }
    }
  };
}

const sequência = (...analisadores) => ({
  tipo: "sequência",
  analisadores,
  analisar: código => {
    const valores = []
    let resto = código

    for (const analisador of analisadores) {
      const resultado = analisador.analisar(resto)
      if (!resultado.hasOwnProperty("valor")) return {
        resto: código,
        menor_resto: resultado.menor_resto || resto,
      }

      valores.push(resultado.valor)
      resto = resultado.resto
    }

    return { valor: valores, resto }
  }
})

const opcional = (analisador, valor_padrão) => ({
  tipo: "opcional",
  analisador,
  valor_padrão,
  analisar: código => {
    const resultado = analisador.analisar(código)
    if (resultado.hasOwnProperty("valor")) return resultado
    return { valor: valor_padrão, resto: código, menor_resto: resultado.menor_resto, erro: resultado.erro }
  }
})

const vários = analisador => ({
  tipo: "vários",
  analisador,
  analisar: código => {
    const valores = []
    let resto = código

    while (true) {
      const { valor, resto: novo_resto } = analisador.analisar(resto)
      if (novo_resto === resto) break
      valores.push(valor)
      resto = novo_resto
    }

    return { valor: valores, resto }
  }
})

const transformar = (analisador, transformador) => ({
  tipo: "transformar",
  analisador,
  transformador,
  analisar: código => {
    const { valor, resto, menor_resto } = analisador.analisar(código)
    if (resto === código) return { resto: código, menor_resto }
    try {
      return { valor: transformador(valor), resto, menor_resto }
    } catch (erro) {
      return { resto: código, menor_resto, erro }
    }
  }
})

const inversão = analisador => ({
  tipo: "inversão",
  analisador,
  analisar: código => {
    const { resto, menor_resto } = analisador.analisar(código)
    if (resto === código) return {
      valor: código[0],
      resto: código.slice(1),
    }
    return { resto: código, menor_resto }
  }
})

const faixa = (inicial, final) => ({
  tipo: "faixa",
  inicial,
  final,
  analisar: código => {
    if (código.length === 0 || código[0] < inicial || código[0] > final) return { resto: código, menor_resto: código }
    return {
      valor: código[0],
      resto: código.slice(1),
    }
  }
})

const operador = (literal, funcao) => transformar(
  símbolo(literal),
  () => funcao
);

const operação = (termo, operadores) => transformar(
  sequência(
    termo,
    vários(sequência(
      opcional(espaço),
      operadores,
      opcional(espaço),
      termo
    ))
  ),
  v => {
    const [primeiroTermo, operaçõesSequenciais] = v;
    if (operaçõesSequenciais.length === 0) return primeiroTermo;

    return escopo =>
      operaçõesSequenciais.reduce(
        (resultado, valSeq) => {
          const operador = valSeq[1];
          const próximoTermo = valSeq[3];
          return operador(resultado, próximoTermo(escopo));
        },
        primeiroTermo(escopo)
      );
  }
);

const espaço_em_branco = alternativa(
  símbolo(" "),
  símbolo("\n"),
)

const espaço = vários(
  alternativa(
    espaço_em_branco,
    sequência(
      símbolo("//"),
      vários(
        inversão(
          símbolo("\n")
        ),
      ),
      símbolo("\n"),
    ),
  ),
)

const número = transformar(
  sequência(
    faixa("0", "9"),
    vários(
      faixa("0", "9"),
    ),
  ),
  v => () => parseInt(v.flat(Infinity).join("")),
)

const número_negativo = transformar(
  sequência(
    símbolo("-"),
    faixa("0", "9"),
    vários(
      faixa("0", "9"),
    ),
  ),
  v => () => -parseInt(v.slice(1).flat(Infinity).join("")),
)

const letra = inversão(
  alternativa(
    espaço_em_branco,
    faixa("!", "?"),
    faixa("[", "^"),
    símbolo("`"),
    faixa("{", "~"),
  ),
)

const nome = transformar(
  sequência(
    letra,
    vários(
      alternativa(
        letra,
        faixa("0", "9"),
      ),
    ),
  ),
  v => v.flat(Infinity).join(""),
)

const endereço = transformar(
  vários(
    inversão(
      espaço_em_branco,
    ),
  ),
  v => v.join(""),
)

const texto = transformar(
  sequência(
    símbolo('"'),
    vários(
      inversão(
        símbolo('"'),
      ),
    ),
    símbolo('"'),
  ),
  v => () => v.flat(Infinity).join("").slice(1, -1)
)

const não = transformar(
  sequência(
    símbolo("!"),
    opcional(espaço),
    { analisar: código => expressão.analisar(código) },
  ),
  ([, , v]) => escopo => v(escopo) === 0 ? 1 : 0,
)

const valor_constante = transformar(
  nome,
  v => escopo => {
    let atualEscopo = escopo;
    while (atualEscopo) {
      if (atualEscopo.hasOwnProperty(v)) {
        return atualEscopo[v];
      }
      atualEscopo = atualEscopo.__parent__;
    }
    return undefined;
  },
)

const fatia = transformar(
  sequência(
    símbolo("["),
    { analisar: código => expressão.analisar(código) },
    opcional(sequência(
      símbolo(":"),
      opcional({ analisar: código => expressão.analisar(código) }),
    )),
    símbolo("]"),
  ),
  valorSeq => {
    const [, i_fn, opcionalFaixa,] = valorSeq;
    const faixa = opcionalFaixa ? opcionalFaixa[0] : undefined;
    const j_fn_opcional = opcionalFaixa ? opcionalFaixa[1] : undefined;

    return (escopo, valor) => {
      const i = i_fn(escopo);
      const j = j_fn_opcional ? j_fn_opcional(escopo) : undefined;

      if (typeof valor === "string") {
        if (faixa !== undefined || j !== undefined) {
          return valor.slice(i, j);
        } else {
          return valor.charCodeAt(i);
        }
      } else if (Array.isArray(valor)) {
        if (faixa !== undefined || j !== undefined) {
          return valor.slice(i, j);
        } else {
          return valor[i];
        }
      } else if (typeof valor === 'object' && valor !== null) {
        if (typeof i !== 'string' && typeof i !== 'number') {
          throw new Error(`Runtime Error: Object key must be a string or number, got type ${typeof i} for key '${i}'.`);
        }
        if (faixa !== undefined || j !== undefined) {
          // Check if this is a list object (has length property and numeric indices)
          if (typeof valor.length === 'number') {
            // Convert list object to array for slicing
            const arr = [];
            for (let idx = 0; idx < valor.length; idx++) {
              arr[idx] = valor[idx];
            }
            return arr.slice(i, j);
          } else {
            throw new Error(`Runtime Error: Slicing syntax not supported for object property access using key '${i}'.`);
          }
        }
        return valor[i];
      } else {
        if (valor === null || valor === undefined) {
          throw new Error(`Runtime Error: Cannot apply indexing/slicing to '${valor}'.`);
        }
        throw new Error(`Runtime Error: Cannot apply indexing/slicing to type '${typeof valor}' (value: ${String(valor).slice(0, 20)}).`);
      }
    };
  }
);

const conteúdo_modelo = transformar(
  inversão(
    vários(
      símbolo("`"),
    )
  ),
  v => () => v,
)

const expressão_modelo = transformar(
  sequência(
    símbolo("${"),
    { analisar: código => expressão.analisar(código) },
    símbolo("}"),
  ),
  ([, valor_fn,]) => escopo => valor_fn(escopo)
);

const modelo = transformar(
  sequência(
    símbolo("`"),
    vários(
      alternativa(
        expressão_modelo,
        conteúdo_modelo
      )
    ),
    símbolo("`")
  ),
  ([, conteúdo_fns,]) => escopo => conteúdo_fns.map(fn => {
    const valor2 = fn(escopo);
    if (typeof valor2 === "number") return String.fromCharCode(valor2);
    return valor2
  }).join("")
);

const tamanho = transformar(
  símbolo("[.]"),
  () => (escopo, valor) => valor.length,
);

const chaves = transformar(
  símbolo("[*]"),
  () => (escopo, objeto) => {
    const keys = Object.keys(objeto);
    
    // For real arrays, return all indices as strings
    if (Array.isArray(objeto)) {
      return keys;
    }
    
    // For list objects (objects with a length property), filter out numeric indices and length
    if (typeof objeto.length === 'number') {
      return keys.filter(key => key !== 'length' && !/^\d+$/.test(key));
    }
    
    // For regular objects, return all keys
    return keys;
  },
);

const lista = transformar(
  sequência(
    símbolo("{"),
    opcional(espaço),
    vários(
      alternativa(
        sequência( // Key-value pair
          alternativa( // Key can be nome or [expression]
            nome,
            sequência(
              símbolo("["),
              { analisar: código => expressão.analisar(código) },
              símbolo("]"),
            )
          ),
          símbolo(":"),
          opcional(espaço),
          { analisar: código => expressão.analisar(código) },
          opcional(símbolo(",")),
          opcional(espaço),
        ),
        sequência( // Spread syntax ...expression
          símbolo("..."),
          { analisar: código => expressão.analisar(código) },
          opcional(símbolo(",")),
          opcional(espaço),
        ),
        sequência( // Value-only (auto-indexed)
          { analisar: código => expressão.analisar(código) },
          opcional(símbolo(",")),
          opcional(espaço),
        ),
      ),
    ),
    símbolo("}")
  ),
  ([, , valores_vários,]) => escopo => {
    if (!valores_vários) return [];
    
    // Check for comma usage and reject it in lists
    for (const v_alt of valores_vários) {
      if (v_alt.includes(",")) {
        throw new Error("Erro de sintaxe: vírgulas não são permitidas entre itens da lista");
      }
    }
    
    // Check if we have any key-value pairs
    const hasKeyValuePairs = valores_vários.some(v_alt => 
      v_alt.length === 6 && v_alt[1] === ":"
    );
    
    if (!hasKeyValuePairs) {
      // Check if any spread operations exist - use object implementation for spreads
      const hasSpreads = valores_vários.some(v_seq => v_seq[0] === "...");
      
      if (!hasSpreads) {
        // Use the original array-based implementation for simple lists without spreads
        return valores_vários.map(v_seq => {
          const expr_fn = v_seq[0];
          return expr_fn(escopo);
        });
      } else {
        // Use object-based implementation for lists with spreads to handle object spreads
        // (fall through to object implementation below)
      }
    }
    
    // Use object-based implementation for lists with keys
    const listScope = { __parent__: escopo };
    let autoIndex = 0;
    
    // First pass: declare all property names in the scope
    for (const v_alt of valores_vários) {
      const firstEl = v_alt[0];
      if (firstEl === "...") {
        continue;
      } else if (v_alt.length === 6 && v_alt[1] === ":") {
        const key_alt_result = v_alt[0];
        let chave;
        if (typeof key_alt_result === "string") {
          chave = key_alt_result;
        } else {
          const key_expr_fn = key_alt_result[1];
          chave = key_expr_fn(escopo);
        }
        listScope[chave] = undefined;
      } else {
        listScope[autoIndex] = undefined;
        autoIndex++;
      }
    }
    
    // Second pass: evaluate property values
    autoIndex = 0;
    const resultado = valores_vários.reduce((resultado, v_alt) => {
      const firstEl = v_alt[0];
      if (firstEl === "...") {
        const spread_expr_fn = v_alt[1];
        const spreadValue = spread_expr_fn(escopo);
        if (Array.isArray(spreadValue)) {
          spreadValue.forEach(valor => {
            resultado[autoIndex] = valor;
            autoIndex++;
          });
        } else if (typeof spreadValue === 'object' && spreadValue !== null && typeof spreadValue.length === 'number') {
          // For list objects, copy indexed items and named properties
          for (let idx = 0; idx < spreadValue.length; idx++) {
            resultado[autoIndex] = spreadValue[idx];
            autoIndex++;
          }
          // Copy named properties (not numeric indices or length)
          for (const key in spreadValue) {
            if (key !== 'length' && !/^\d+$/.test(key)) {
              resultado[key] = spreadValue[key];
            }
          }
        } else if (typeof spreadValue === 'object' && spreadValue !== null) {
          Object.assign(resultado, spreadValue);
        }
        return resultado;
      } else if (v_alt.length === 6 && v_alt[1] === ":") {
        const key_alt_result = v_alt[0];
        const val_expr_fn = v_alt[3];
        let chave;
        if (typeof key_alt_result === "string") {
          chave = key_alt_result;
        } else {
          const key_expr_fn = key_alt_result[1];
          chave = key_expr_fn(escopo);
        }
        const valor = val_expr_fn(listScope);
        listScope[chave] = valor;
        resultado[chave] = valor;
        return resultado;
      } else {
        const val_expr_fn = v_alt[0];
        const valor = val_expr_fn(listScope);
        listScope[autoIndex] = valor;
        resultado[autoIndex] = valor;
        autoIndex++;
        return resultado;
      }
    }, {});

    resultado.length = autoIndex;
    
    // Convert to real array if it only has numeric properties and length
    const hasNamedProps = Object.keys(resultado).some(key => 
      key !== 'length' && !/^\d+$/.test(key)
    );
    
    if (!hasNamedProps) {
      // Convert to real array
      const realArray = [];
      for (let i = 0; i < autoIndex; i++) {
        realArray[i] = resultado[i];
      }
      return realArray;
    }
    
    return resultado;
  }
);



const atributo = transformar(
  sequência(
    símbolo("."),
    nome,
  ),
  ([, atributoNome]) => (escopo, objeto) => objeto[atributoNome],
);

const params_lista_com_parenteses = sequência(
  símbolo("("),
  opcional(espaço),
  nome,
  opcional(espaço),
  símbolo(")")
);

const params_lista_sem_parenteses = nome;

const lambda = transformar(
  sequência(
    alternativa(
      params_lista_com_parenteses,
      params_lista_sem_parenteses
    ),
    opcional(espaço),
    símbolo("=>"),
    opcional(espaço),
    { analisar: código => expressão.analisar(código) }
  ),
  (valorBrutoLambda) => {
    const [paramsResultado, , , , corpoExprFunc] = valorBrutoLambda;

    let nomeParam = null;
    if (Array.isArray(paramsResultado) && paramsResultado[0] === '(') {
      // Parentheses case: (param) or ()
      nomeParam = paramsResultado[2] || null;
    } else {
      // No parentheses case: param
      nomeParam = paramsResultado;
    }

    return definition_scope => {
      return (caller_context, ...valoresArgs) => {
        const fn_scope = { __parent__: definition_scope || null };
        if (nomeParam) {
          // Function has a parameter
          if (valoresArgs.length === 1) {
            fn_scope[nomeParam] = valoresArgs[0];
          } else {
            // This case should not happen with the new syntax, but keeping for safety
            fn_scope[nomeParam] = valoresArgs;
          }
        }
        // If nomeParam is null, it's a zero-parameter function, so we don't assign anything
        return corpoExprFunc(fn_scope);
      };
    };
  }
);

const chamada_função = transformar(
  sequência(
    símbolo("("),
    opcional(espaço),
    opcional(
      sequência(
        { analisar: código => expressão.analisar(código) },
        opcional(espaço),
      )
    ),
    opcional(espaço),
    símbolo(")"),
  ),
  ([, , arg_seq_optional,]) => (escopo, função) => {
    if (arg_seq_optional) {
      const arg_value = arg_seq_optional[0](escopo);
      return função(escopo, arg_value);
    } else {
      return função(escopo);
    }
  }
);

const parênteses = transformar(
  sequência(
    símbolo("("),
    opcional(espaço),
    { analisar: código => expressão.analisar(código) },
    opcional(espaço),
    símbolo(")"),
  ),
  valorSeq => {
    const [, , valor_fn,] = valorSeq;

    return outer_scope_param => {
      return valor_fn(outer_scope_param);
    };
  }
);

const termo1 = transformar(
  sequência(
    alternativa(
      valor_constante,
      parênteses,
      lista,
      número,
      texto,
    ),
    opcional(espaço),
    vários(
      alternativa(
        fatia,
        tamanho,
        chaves,
        atributo,
        chamada_função,
      ),
    ),
  ),
  valor => {
    const [valor_fn, , operações_fns] = valor;

    return escopo => {
      if (operações_fns.length === 0) {
        return valor_fn(escopo);
      }
      return operações_fns.reduce(
        (resultado, operação_fn) => operação_fn(escopo, resultado),
        valor_fn(escopo)
      );
    };
  }
);

const termo2 = alternativa(
  lambda,
  termo1,
  número_negativo,
  não,
  modelo,
  valor_constante,
  parênteses
);

const termo3 = operação(
  termo2,
  alternativa(
    operador("*", (v1, v2) => v1 * v2),
    operador("/", (v1, v2) => v1 / v2),
  ),
);

const termo4 = operação(
  termo3,
  alternativa(
    operador("+", (v1, v2) => v1 + v2),
    operador("-", (v1, v2) => v1 - v2),
  ),
);

const termo5 = operação(
  termo4,
  alternativa(
    operador(">=", (v1, v2) => v1 >= v2 ? 1 : 0),
    operador("<=", (v1, v2) => v1 <= v2 ? 1 : 0),
    operador(">", (v1, v2) => v1 > v2 ? 1 : 0),
    operador("<", (v1, v2) => v1 < v2 ? 1 : 0),
    operador("==", (v1, v2) => v1 === v2 ? 1 : 0),
    operador("!=", (v1, v2) => v1 !== v2 ? 1 : 0),
  ),
);

const termo6 = transformar(
  sequência(
    termo5,
    opcional(sequência(
      opcional(espaço),
      símbolo("?"),
      opcional(espaço),
      { analisar: código => expressão.analisar(código) },
      opcional(espaço),
      símbolo(":"),
      opcional(espaço),
      { analisar: código => expressão.analisar(código) },
    ), undefined)
  ),
  valor => {
    const [condição_fn, resto_opcional_val] = valor;

    if (!resto_opcional_val) return condição_fn;

    const [, , , valor_se_verdadeiro_fn, , , , valor_se_falso_fn] = resto_opcional_val;
    return escopo => condição_fn(escopo) !== 0 ? valor_se_verdadeiro_fn(escopo) : valor_se_falso_fn(escopo);
  }
);

const expressão = operação(
  termo6,
  alternativa(
    operador("&", (v1, v2) => v1 !== 0 ? v2 : 0),
    operador("|", (v1, v2) => v1 !== 0 ? v1 : v2),
  ),
);

const raw_expression_capture = código => {
  const { valor: valor_expr_fn, resto: resto_expr } = expressão.analisar(código);

  if (resto_expr === código) {
    return { resto: código };
  }

  const expressão_str_capturada = código.substring(0, código.length - resto_expr.length);
  return { valor: { valor_fn: valor_expr_fn, str: expressão_str_capturada.trim() }, resto: resto_expr };
};

const debug_command = transformar(
  sequência(
    símbolo("$"),
    opcional(espaço),
    { analisar: raw_expression_capture }
  ),
  (seq_result) => {
    const { valor_fn, str } = seq_result[2];
    return (escopo) => {
      const valor_calculado = valor_fn(escopo);
      console.log(`$ ${str} = ${JSON.stringify(valor_calculado)}`);
      return { type: 'debug', expression: str, value: valor_calculado };
    };
  }
);

const const_declaration_seq = sequência(
  nome,
  opcional(espaço),
  símbolo("="),
  opcional(espaço),
  { analisar: código => expressão.analisar(código) }
);

const declarações_constantes = vários(
  sequência(
    alternativa(
      const_declaration_seq,
      debug_command
    ),
    espaço
  )
);

const _0 = opcional(
  transformar(
    sequência(
      opcional(espaço),
      opcional(vários(
        sequência(
          sequência(
            nome,
            opcional(espaço),
            símbolo("#"),
            opcional(espaço),
            endereço,
          ),
          espaço,
        ),
      ), []),

      opcional(espaço),
      opcional(declarações_constantes, []),
      opcional(espaço),
      expressão,
      opcional(espaço),
    ),
    valorSeq => {
      const [, importaçõesDetectadas_val, , atribuições_val, , valor_fn_expr] = valorSeq;
      const importações = importaçõesDetectadas_val.map(([[nome, , , , endereço]]) => [nome, endereço])

      const corpo = outer_scope_param => {
        const blockScope = { __parent__: outer_scope_param || null };

        for (const atrib_ou_debug_item of atribuições_val) {
          const actual_item = atrib_ou_debug_item[0];
          if (Array.isArray(actual_item) && actual_item.length === 5 && actual_item[2] === '=') {
            const [nome_val] = actual_item;
            blockScope[nome_val] = undefined;
          }
        }

        for (const atrib_ou_debug_item of atribuições_val) {
          const actual_item = atrib_ou_debug_item[0];
          if (Array.isArray(actual_item) && actual_item.length === 5 && actual_item[2] === '=') {
            const [nome_val, , , , valorAtribuição_fn] = actual_item;
            blockScope[nome_val] = valorAtribuição_fn(blockScope);
          } else {
            const debug_fn = actual_item;
            debug_fn(blockScope);
          }
        }

        return valor_fn_expr(blockScope);
      };

      return [importações, [], corpo];
    }
  ),
  [[], [], () => { }]
);

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
      const posição_erro = estado.conteúdos[endereço].length - (módulo_bruto.menor_resto?.length ?? 0)
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

export default ([retorno, estado]) => {
  const etapa_atual = estado.etapa ?? "iniciar";
  return etapas[etapa_atual](retorno, estado);
}