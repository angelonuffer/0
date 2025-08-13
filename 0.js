// Representa um resultado de sucesso na análise que não consome nenhum código e tem um valor nulo.
// É útil para casos como sufixos opcionais em regras de gramática.
const sucesso = {
  tipo: "sucesso",
  analisar: código => ({ valor: null, resto: código, menor_resto: código }),
};

// Cria um analisador que espera por um símbolo (string) específico.
// Se o símbolo for encontrado no início do código, ele é consumido e retornado como valor.
// Caso contrário, a análise falha.
const símbolo = símbolo_esperado => ({
  tipo: "símbolo",
  símbolo: símbolo_esperado,
  analisar: código => {
    if (código.startsWith(símbolo_esperado)) return {
      valor: símbolo_esperado,
      resto: código.slice(símbolo_esperado.length),
    }
    // Falha: retorna o código original, indicando que nada foi consumido.
    return { resto: código, menor_resto: código }
  }
})

// Cria um analisador que tenta vários outros analisadores em ordem.
// Retorna o resultado do primeiro analisador que tiver sucesso.
// Inclui uma otimização de "fatoração de prefixo" para melhorar o desempenho.
const alternativa = (...analisadores) => {
  // Função auxiliar para obter um identificador único para um analisador, usado na otimização.
  const getParserId = (parser) => {
    if (!parser || typeof parser.tipo !== "string") return null;

    switch (parser.tipo) {
      case "símbolo": return `símbolo_${parser.símbolo}`;
      case "faixa": return `faixa_${parser.inicial}_${parser.final}`;
      default: return null;
    }
  };

  /**
   * Otimização de Fatoração de Prefixo (Left-Factoring).
   * Agrupa analisadores que começam com o mesmo "prefixo" (o mesmo símbolo ou faixa).
   * Por exemplo, se a regra for `A | B` onde `A = 'x' 'y'` e `B = 'x' 'z'`,
   * a otimização transforma a regra em `'x' ('y' | 'z')`.
   * Isso evita a reanálise do prefixo comum e melhora a eficiência.
   */
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
            return sucesso; // Para analisadores simples que são prefixos
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
        // Se a análise foi bem-sucedida (consumiu algo ou retornou um valor), retorna o resultado.
        if (resultado.resto !== código || resultado.hasOwnProperty("valor")) return resultado
        // Rastreia o ponto mais distante que qualquer alternativa conseguiu analisar, para melhores mensagens de erro.
        if (resultado.menor_resto && resultado.menor_resto.length < menor_resto.length) {
          menor_resto = resultado.menor_resto
        }
      }
      // Falha: nenhuma alternativa teve sucesso.
      return { resto: código, menor_resto }
    }
  };
}

// Cria um analisador que espera por uma sequência de outros analisadores.
// Todos os analisadores na sequência devem ter sucesso em ordem.
// O valor retornado é uma lista dos valores de cada analisador na sequência.
const sequência = (...analisadores) => ({
  tipo: "sequência",
  analisadores,
  analisar: código => {
    const valores = []
    let resto = código

    for (const analisador of analisadores) {
      const resultado = analisador.analisar(resto)
      if (!resultado.hasOwnProperty("valor")) return {
        // Se qualquer parte da sequência falhar, a sequência inteira falha.
        resto: código,
        menor_resto: resultado.menor_resto || resto,
      }

      valores.push(resultado.valor)
      resto = resultado.resto
    }

    return { valor: valores, resto }
  }
})

// Cria um analisador que torna outro analisador opcional.
// Se o analisador interno tiver sucesso, seu resultado é retornado.
// Se falhar, a análise ainda é considerada um sucesso, e um valor padrão é retornado.
const opcional = (analisador, valor_padrão) => ({
  tipo: "opcional",
  analisador,
  valor_padrão,
  analisar: código => {
    const resultado = analisador.analisar(código)
    if (resultado.hasOwnProperty("valor")) return resultado
    // O analisador interno falhou, então retorna o valor padrão sem consumir código.
    return { valor: valor_padrão, resto: código, menor_resto: resultado.menor_resto, erro: resultado.erro }
  }
})

// Cria um analisador que aplica outro analisador zero ou mais vezes.
// Coleta todos os resultados bem-sucedidos em uma lista.
// Sempre tem sucesso (pode retornar uma lista vazia).
const vários = analisador => ({
  tipo: "vários",
  analisador,
  analisar: código => {
    const valores = []
    let resto = código

    while (true) {
      const { valor, resto: novo_resto } = analisador.analisar(resto)
      // Para quando o analisador interno não consegue mais consumir código.
      if (novo_resto === resto) break
      valores.push(valor)
      resto = novo_resto
    }

    return { valor: valores, resto }
  }
})

// Cria um analisador que transforma o valor de outro analisador.
// Se o analisador interno for bem-sucedido, seu valor é passado para uma função de transformação.
// O resultado da transformação se torna o novo valor.
const transformar = (analisador, transformador) => ({
  tipo: "transformar",
  analisador,
  transformador,
  analisar: código => {
    const { valor, resto, menor_resto } = analisador.analisar(código)
    // Se o analisador interno falhou, propaga a falha.
    if (resto === código) return { resto: código, menor_resto }
    try {
      // Aplica a função de transformação ao valor.
      return { valor: transformador(valor), resto, menor_resto }
    } catch (erro) {
      // Captura erros que podem ocorrer durante a transformação.
      return { resto: código, menor_resto, erro }
    }
  }
})

// Cria um analisador que tem sucesso se o analisador interno falhar (inversão lógica).
// É usado para analisar "qualquer coisa exceto...".
// Consome um único caractere se o analisador interno falhar.
const inversão = analisador => ({
  tipo: "inversão",
  analisador,
  analisar: código => {
    const { resto, menor_resto } = analisador.analisar(código)
    // Se o analisador interno falhou (não consumiu nada), a inversão tem sucesso.
    if (resto === código) return {
      valor: código[0],
      resto: código.slice(1),
    }
    // Se o analisador interno teve sucesso, a inversão falha.
    return { resto: código, menor_resto }
  }
})

// Cria um analisador que aceita qualquer caractere dentro de uma faixa especificada (inclusive).
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

// Cria um analisador para um operador literal (ex: "+", "*") que retorna uma função.
const operador = (literal, funcao) => transformar(
  símbolo(literal),
  () => funcao // Transforma o literal do operador na função de operação correspondente.
);

// Cria um analisador para operações de infixo (ex: a + b, c * d).
// Analisa um termo inicial, seguido por zero ou mais pares de [operador, termo].
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
  // Transforma a estrutura analisada em uma função que executa a operação.
  v => {
    const [primeiroTermo, operaçõesSequenciais] = v;
    if (operaçõesSequenciais.length === 0) return primeiroTermo;

    // Retorna uma função que será avaliada posteriormente com um escopo.
    return escopo =>
      // Reduz a sequência de operações, aplicando cada uma ao resultado da anterior.
      operaçõesSequenciais.reduce(
        (resultado, valSeq) => {
          const operadorFn = valSeq[1]; // A função do operador, ex: (a, b) => a + b
          const próximoTermoFn = valSeq[3]; // A função que retorna o próximo termo
          return operadorFn(resultado, próximoTermoFn(escopo));
        },
        primeiroTermo(escopo) // O valor inicial da redução.
      );
  }
);

// Analisa um único espaço em branco ou quebra de linha.
const espaço_em_branco = alternativa(
  símbolo(" "),
  símbolo("\n"),
)

// Analisa um ou mais espaços em branco ou comentários.
const espaço = vários(
  alternativa(
    espaço_em_branco,
    // Analisa comentários de linha única (// ... até a quebra de linha).
    sequência(
      símbolo("//"),
      vários(
        inversão(
          símbolo("\n") // Consome qualquer caractere até encontrar uma quebra de linha.
        ),
      ),
      símbolo("\n"),
    ),
  ),
)

// Analisa uma sequência de dígitos e a transforma em uma função que retorna o número.
const número = transformar(
  sequência(
    faixa("0", "9"), // Primeiro dígito
    vários(
      faixa("0", "9"), // Dígitos subsequentes
    ),
  ),
  // Concatena todos os dígitos e converte para um inteiro.
  // Retorna uma função para avaliação posterior (lazy evaluation).
  v => () => parseInt(v.flat(Infinity).join("")),
)

// Analisa qualquer caractere que não seja um espaço em branco ou um caractere especial de sintaxe.
// Usado para identificar o início de um nome/identificador.
const letra = inversão(
  alternativa(
    espaço_em_branco,
    faixa("!", "@"),
    faixa("[", "^"),
    símbolo("`"),
    faixa("{", "~"),
  ),
)

// Analisa um nome/identificador (uma letra seguida por letras ou números).
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
  // Concatena todos os caracteres para formar o nome.
  v => v.flat(Infinity).join(""),
)

// Analisa um endereço (ex: em uma declaração de importação), que é qualquer sequência de caracteres sem espaços.
const endereço = transformar(
  vários(
    inversão(
      espaço_em_branco,
    ),
  ),
  v => v.join(""),
)

// Analisa uma string literal entre aspas duplas.
const texto = transformar(
  sequência(
    símbolo('"'),
    vários(
      // Consome qualquer caractere que não seja uma aspa dupla.
      inversão(
        símbolo('"'),
      ),
    ),
    símbolo('"'),
  ),
  // Concatena os caracteres internos e remove as aspas.
  // Retorna uma função para avaliação posterior.
  v => () => v.flat(Infinity).join("").slice(1, -1)
)

// Analisa o operador de negação "!"
const não = transformar(
  sequência(
    símbolo("!"),
    opcional(espaço),
    { analisar: código => expressão.analisar(código) }, // Analisa a expressão a ser negada
  ),
  ([, , v]) => escopo => v(escopo) === 0 ? 1 : 0, // Nega o valor (0 se torna 1, qualquer outra coisa se torna 0)
)

// Analisa um nome e o transforma em uma função que busca seu valor no escopo.
const valor_constante = transformar(
  nome,
  // A função transformadora recebe o nome da variável.
  v => escopo => {
    let atualEscopo = escopo;
    // Procura a variável no escopo atual e nos escopos pais.
    while (atualEscopo) {
      if (atualEscopo.hasOwnProperty(v)) {
        return atualEscopo[v];
      }
      atualEscopo = atualEscopo.__parent__;
    }
    return undefined; // Retorna undefined se a variável não for encontrada.
  },
)

// Constantes para os índices do resultado da sequência de 'fatia'
const INDICE_FATIA_INICIO_FN = 1;
const INDICE_FATIA_OPCIONAL_FAIXA = 2;

// Constantes para os índices do resultado da sequência opcional de 'fatia'
const INDICE_FAIXA_SIMBOLO = 0;
const INDICE_FAIXA_FIM_FN_OPCIONAL = 1;

// Função auxiliar para processar o acesso a fatias e índices
const processarFatia = (valorSeq) => {
  const i_fn = valorSeq[INDICE_FATIA_INICIO_FN];
  const opcionalFaixa = valorSeq[INDICE_FATIA_OPCIONAL_FAIXA];

  const faixa = opcionalFaixa ? opcionalFaixa[INDICE_FAIXA_SIMBOLO] : undefined;
  const j_fn_opcional = opcionalFaixa ? opcionalFaixa[INDICE_FAIXA_FIM_FN_OPCIONAL] : undefined;

  // Retorna a função que será executada durante a avaliação.
  return (escopo, valor) => {
    const i = i_fn(escopo);
    const j = j_fn_opcional ? j_fn_opcional(escopo) : undefined;

    if (typeof valor === "string" || Array.isArray(valor)) {
      // Se 'faixa' (:) ou 'j' (fim da fatia) estão presentes, usa slice.
      if (faixa !== undefined || j !== undefined) {
        return valor.slice(i, j);
      }
      // Caso contrário, é um acesso a índice.
      // Para strings, retorna o código do caractere (comportamento específico da linguagem 0).
      return typeof valor === "string" ? valor.charCodeAt(i) : valor[i];
    }

    if (typeof valor === 'object' && valor !== null) {
      if (typeof i !== 'string' && typeof i !== 'number') {
        throw new Error(`Erro de Execução: A chave do objeto deve ser um texto ou número, mas foi recebido o tipo ${typeof i} para a chave '${i}'.`);
      }
      if (faixa !== undefined || j !== undefined) {
        throw new Error(`Erro de Execução: A sintaxe de fatiamento não é suportada para acesso a propriedades de objeto usando a chave '${i}'.`);
      }
      return valor[i];
    }

    if (valor === null || valor === undefined) {
      throw new Error(`Erro de Execução: Não é possível aplicar indexação/fatiamento a '${valor}'.`);
    }
    throw new Error(`Erro de Execução: Não é possível aplicar indexação/fatiamento ao tipo '${typeof valor}' (valor: ${String(valor).slice(0, 20)}).`);
  };
};

// Analisa o acesso a fatias e índices (ex: lista[0], texto[1:3])
const fatia = transformar(
  sequência(
    símbolo("["),
    { analisar: código => expressão.analisar(código) }, // Expressão do índice/início
    opcional(sequência(
      símbolo(":"),
      opcional({ analisar: código => expressão.analisar(código) }), // Expressão do fim (opcional)
    )),
    símbolo("]"),
  ),
  processarFatia // Usa a função auxiliar para transformar o resultado
);

// Analisa o conteúdo literal dentro de um modelo de texto (template string).
const conteúdo_modelo = transformar(
  inversão(
    vários(
      símbolo("`"), // Consome qualquer caractere até encontrar o acento grave de fechamento.
    )
  ),
  v => () => v, // Retorna o conteúdo como uma função.
)

// Analisa uma expressão interpolada dentro de um modelo de texto (ex: ${...}).
const expressão_modelo = transformar(
  sequência(
    símbolo("${"),
    { analisar: código => expressão.analisar(código) },
    símbolo("}"),
  ),
  ([, valor_fn,]) => escopo => valor_fn(escopo) // Extrai e retorna a função da expressão.
);

// Analisa um modelo de texto (template string) com expressões interpoladas.
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
  // Concatena as partes literais e os resultados das expressões.
  ([, conteúdo_fns,]) => escopo => conteúdo_fns.map(fn => {
    const valor = fn(escopo);
    // Converte números para caracteres, mantendo outros valores como estão.
    if (typeof valor === "number") return String.fromCharCode(valor);
    return valor
  }).join("")
);

// Analisa o acesso ao tamanho de uma lista ou texto (ex: lista[.]).
const tamanho = transformar(
  símbolo("[.]"),
  () => (escopo, valor) => valor.length,
);

// Analisa o acesso aos atributos (chaves) de um objeto (ex: obj[*]).
const atributos_objeto = transformar(
  símbolo("[*]"),
  () => (escopo, objeto) => Object.keys(objeto),
);

// Função auxiliar para transformar o resultado da análise de uma lista.
const processarLista = ([, , valores_seq,]) => escopo => {
  return valores_seq.flatMap(v_seq => {
    const isSpread = v_seq[0] === "...";
    const expr_fn = v_seq[1];
    // Se for spread, expande o resultado da expressão. Caso contrário, retorna o elemento.
    return isSpread ? expr_fn(escopo) : [expr_fn(escopo)];
  });
};

// Analisa uma lista literal (ex: [1, 2, ...outra_lista]).
const lista = transformar(
  sequência(
    símbolo("["),
    opcional(espaço),
    vários(
      sequência(
        opcional(símbolo("..."), ""), // Spread operator (opcional)
        { analisar: código => expressão.analisar(código) }, // Expressão do elemento
        opcional(símbolo(",")),
        opcional(espaço)
      )
    ),
    símbolo("]")
  ),
  processarLista // Usa a função auxiliar para processar o resultado.
);

// Função auxiliar para transformar o resultado da análise de um objeto.
const processarObjeto = ([, , valores_vários,]) => escopo => {
  if (!valores_vários) return {};

  return valores_vários.reduce((resultado, v_alt) => {
    const primeiroElemento = v_alt[0];

    // Verifica se é a sintaxe de spread '...'
    if (primeiroElemento === "...") {
      const spread_expr_fn = v_alt[1];
      return { ...resultado, ...spread_expr_fn(escopo) };
    } else {
      // É um par chave-valor
      const chave_result = v_alt[0];
      const val_expr_fn = v_alt[3];

      let chave;
      // A chave pode ser um nome (string) ou uma expressão entre colchetes.
      if (typeof chave_result === "string") {
        chave = chave_result;
      } else {
        const key_expr_fn = chave_result[1];
        chave = key_expr_fn(escopo);
      }
      return { ...resultado, [chave]: val_expr_fn(escopo) };
    }
  }, {});
};

// Analisa um objeto literal (ex: {a: 1, [b]: 2, ...outro_obj}).
const objeto = transformar(
  sequência(
    símbolo("{"),
    opcional(espaço),
    vários(
      alternativa(
        // Par chave-valor
        sequência(
          alternativa( // A chave pode ser um nome ou uma [expressão]
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
        // Sintaxe de spread ...expressão
        sequência(
          símbolo("..."),
          { analisar: código => expressão.analisar(código) },
          opcional(símbolo(",")),
          opcional(espaço),
        ),
      ),
    ),
    símbolo("}"),
  ),
  processarObjeto // Usa a função auxiliar para processar o resultado.
);

// Analisa o acesso a um atributo de objeto (ex: obj.nome).
const atributo = transformar(
  sequência(
    símbolo("."),
    nome,
  ),
  ([, atributoNome]) => (escopo, objeto) => objeto[atributoNome],
);

// Analisa uma lista de parâmetros com parênteses, ex: (a, b)
const params_lista_com_parenteses = sequência(
  símbolo("("),
  opcional(espaço),
  opcional(vários(sequência(nome, opcional(espaço), opcional(símbolo(",")), opcional(espaço))), []),
  opcional(espaço),
  símbolo(")")
);

// Analisa uma lista de parâmetros sem parênteses, ex: a, b => ... (ou apenas `a => ...`)
const params_lista_sem_parenteses = vários(sequência(nome, opcional(espaço)));

// Função auxiliar para transformar o resultado da análise de uma função lambda.
const processarLambda = (valorBrutoLambda) => {
  const [paramsResultado, , , , corpoExprFunc] = valorBrutoLambda;

  let listaNomesParams = [];
  // Determina a lista de nomes de parâmetros com base na sintaxe (com ou sem parênteses).
  if (Array.isArray(paramsResultado) && paramsResultado[0] === '(') {
    // Com parênteses: extrai os nomes da estrutura aninhada.
    if (paramsResultado[2]) {
      listaNomesParams = paramsResultado[2].map(paramSeq => paramSeq[0]);
    }
  } else {
    // Sem parênteses: a lista de nomes já está no formato correto.
    listaNomesParams = (paramsResultado || []).map(paramSeq => paramSeq[0]);
  }

  // Retorna uma função de alta ordem que captura o escopo de definição.
  return definition_scope => {
    // Retorna a função executável.
    return (caller_context, ...valoresArgs) => {
      const fn_scope = { __parent__: definition_scope || null };
      // Mapeia os argumentos recebidos para os nomes dos parâmetros no novo escopo da função.
      listaNomesParams.forEach((nomeArg, i) => {
        fn_scope[nomeArg] = valoresArgs[i];
      });
      // Executa o corpo da função com o escopo recém-criado.
      return corpoExprFunc(fn_scope);
    };
  };
};

// Analisa uma função anônima (lambda).
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
  processarLambda
);

// Analisa uma chamada de função.
const chamada_função = transformar(
  sequência(
    símbolo("("),
    opcional(espaço),
    vários(
      sequência(
        { analisar: código => expressão.analisar(código) }, // Analisa cada argumento.
        opcional(espaço),
        opcional(símbolo(",")),
        opcional(espaço),
      )
    ),
    opcional(espaço),
    símbolo(")"),
  ),
  // Transforma a lista de argumentos em uma chamada de função.
  ([, , args_seq,]) => (escopo, função) => {
    // Avalia cada argumento no escopo do chamador e passa para a função.
    return função(escopo, ...args_seq.map(arg_val_seq => arg_val_seq[0](escopo)));
  }
);

// Função auxiliar para processar uma expressão entre parênteses com possíveis declarações de constantes.
const processarParenteses = (valorSeq) => {
  const [, , constantes_val, , valor_fn,] = valorSeq;

  // Retorna a função que gerencia o escopo dos parênteses.
  return outer_scope_param => {
    const escopoParenteses = { __parent__: outer_scope_param || null };

    if (constantes_val && constantes_val.length > 0) {
      // Primeiro, inicializa todas as constantes como 'undefined' para permitir referências mútuas.
      for (const item_seq of constantes_val) {
        const actual_item = item_seq[0];
        if (Array.isArray(actual_item) && actual_item[2] === '=') {
          const [nome_val] = actual_item;
          escopoParenteses[nome_val] = undefined;
        }
      }
      // Em seguida, avalia e atribui o valor de cada constante.
      for (const item_seq of constantes_val) {
        const actual_item = item_seq[0];
        if (Array.isArray(actual_item) && actual_item[2] === '=') {
          const [nome_val, , , , valor_const_fn] = actual_item;
          escopoParenteses[nome_val] = valor_const_fn(escopoParenteses);
        } else {
          // Executa comandos de depuração ($) se houver.
          const debug_fn = actual_item;
          debug_fn(escopoParenteses);
        }
      }
    }
    // Finalmente, avalia a expressão principal dentro do novo escopo.
    return valor_fn(escopoParenteses);
  };
};

// Analisa uma expressão entre parênteses, que pode conter declarações de constantes locais.
const parênteses = transformar(
  sequência(
    símbolo("("),
    opcional(espaço),
    opcional({ analisar: código => declarações_constantes.analisar(código) }, []),
    opcional(espaço),
    { analisar: código => expressão.analisar(código) },
    opcional(espaço),
    símbolo(")"),
  ),
  processarParenteses
);

// Termo que lida com o encadeamento de operações de acesso (fatias, atributos, chamadas).
const termo1 = transformar(
  sequência(
    alternativa(
      valor_constante,
      parênteses,
    ),
    opcional(espaço),
    vários(
      alternativa(
        fatia,
        tamanho,
        atributos_objeto,
        atributo,
        chamada_função,
      ),
    ),
  ),
  valor => {
    const [valor_fn, , operações_fns] = valor;

    return escopo => {
      // Se não houver operações encadeadas, apenas retorna o valor base.
      if (operações_fns.length === 0) {
        return valor_fn(escopo);
      }
      // Caso contrário, aplica cada operação em sequência.
      return operações_fns.reduce(
        (resultado, operação_fn) => operação_fn(escopo, resultado),
        valor_fn(escopo)
      );
    };
  }
);

// Agrupa os elementos mais básicos da linguagem que podem iniciar uma expressão.
const termo2 = alternativa(
  lambda,
  termo1,
  número,
  não,
  texto,
  modelo,
  lista,
  objeto,
  valor_constante,
  parênteses
);

// Operações de multiplicação e divisão.
const termo3 = operação(
  termo2,
  alternativa(
    operador("*", (v1, v2) => v1 * v2),
    operador("/", (v1, v2) => v1 / v2),
  ),
);

// Operações de adição e subtração.
const termo4 = operação(
  termo3,
  alternativa(
    operador("+", (v1, v2) => v1 + v2),
    operador("-", (v1, v2) => v1 - v2),
  ),
);

// Operadores de comparação.
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

// Operador ternário (condição ? verdadeiro : falso).
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

// Operadores lógicos de curto-circuito.
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

// Função auxiliar para processar a estrutura de um módulo (arquivo .0).
const processarModulo = (valorSeq) => {
  const [, importaçõesDetectadas_val, carregamentosDetectadas_val, , atribuições_val, , valor_fn_expr] = valorSeq;
  const importações = importaçõesDetectadas_val.map(([[nome, , , , endereço]]) => [nome, endereço]);
  const carregamentos = carregamentosDetectadas_val.map(([[nome, , , , endereço]]) => [nome, endereço]);

  const corpo = outer_scope_param => {
    const blockScope = { __parent__: outer_scope_param || null };

    // Processa as atribuições de constantes no escopo do módulo.
    // O processo de duas passadas (primeiro undefined, depois o valor) permite referência mútua.
    for (const atrib_ou_debug_item of atribuições_val) {
      const actual_item = atrib_ou_debug_item[0];
      if (Array.isArray(actual_item) && actual_item[2] === '=') {
        const [nome_val] = actual_item;
        blockScope[nome_val] = undefined;
      }
    }

    for (const atrib_ou_debug_item of atribuições_val) {
      const actual_item = atrib_ou_debug_item[0];
      if (Array.isArray(actual_item) && actual_item[2] === '=') {
        const [nome_val, , , , valorAtribuição_fn] = actual_item;
        blockScope[nome_val] = valorAtribuição_fn(blockScope);
      } else {
        // Executa comandos de depuração ($).
        const debug_fn = actual_item;
        debug_fn(blockScope);
      }
    }

    // Retorna o valor final da expressão do módulo.
    return valor_fn_expr(blockScope);
  };

  // Retorna os componentes principais do módulo: importações, carregamentos e o corpo executável.
  return [importações, carregamentos, corpo];
};

// O analisador principal para um arquivo de código-fonte da linguagem 0.
// O analisador principal para um arquivo de código-fonte da linguagem 0.
const _0 = opcional(
  transformar(
    sequência(
      opcional(espaço),
      // Analisa importações de módulos (#)
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
      // Analisa carregamentos de arquivos de texto (@)
      opcional(vários(
        sequência(
          sequência(
            nome,
            opcional(espaço),
            símbolo("@"),
            opcional(espaço),
            endereço,
          ),
          espaço,
        ),
      ), []),
      opcional(espaço),
      opcional(declarações_constantes, []), // Declarações de constantes do módulo
      opcional(espaço),
      expressão, // A expressão principal do módulo
      opcional(espaço),
    ),
    processarModulo
  ),
  [[], [], () => { }] // Valor padrão se o arquivo estiver vazio.
);

// Efeitos colaterais puros que o interpretador pode executar.
// A máquina de estados produz uma lista desses efeitos, que são então executados pelo `0_node.js`.
const efeitos = Object.fromEntries([
  "atribua_retorno_ao_estado", // Atribui o resultado de um efeito a uma chave no estado da máquina.
  "atribua_valor_ao_estado",  // Atribui um valor direto a uma chave no estado da máquina.
  "delete_do_estado",          // Remove uma chave do estado da máquina.
  "saia",                      // Termina o processo com um código de saída.
  "escreva",                   // Escreve uma mensagem na saída padrão.
  "obtenha_argumentos",        // Obtém os argumentos da linha de comando.
  "carregue_localmente",       // Carrega o conteúdo de um arquivo do sistema de arquivos.
  "carregue_remotamente",      // Carrega o conteúdo de uma URL.
  "verifique_existência",      // Verifica se um arquivo ou diretório existe.
  "salve_localmente",          // Salva conteúdo em um arquivo local.
].map((nome, i) => [nome, (...argumentos) => [i, ...argumentos]]))

// Função auxiliar para resolver o endereço de um módulo importado.
const resolverEndereço = (caminhoBaseModulo, caminhoRelativo) => {
  if (caminhoRelativo.startsWith('https://')) {
    return caminhoRelativo;
  }
  // Usa a lógica de URL para resolver caminhos relativos de forma robusta.
  const diretorioBase = caminhoBaseModulo.includes('/') ? caminhoBaseModulo.substring(0, caminhoBaseModulo.lastIndexOf('/') + 1) : '';
  const urlBase = 'file:///' + diretorioBase;
  const urlResolvida = new URL(caminhoRelativo, urlBase);
  // Decodifica o caminho para lidar com caracteres especiais como %20.
  return decodeURIComponent(urlResolvida.pathname.substring(1));
}

// Função auxiliar para formatar e exibir um erro de sintaxe.
const relatarErroSintaxe = (código, endereço, menor_resto) => {
  const posição_erro = código.length - (menor_resto?.length ?? 0)
  const linhas = código.split('\n')
  const linhas_antes = código.substring(0, posição_erro).split('\n');
  const número_linha = linhas_antes.length
  const número_coluna = linhas_antes.at(-1).length + 1
  const linha = linhas[número_linha - 1]
  const linha_com_erro = (linha?.substring(0, número_coluna - 1) ?? "") +
    `\x1b[41m${linha?.[número_coluna - 1] ?? ""}\x1b[0m` +
    (linha?.substring(número_coluna) ?? "")
  return [
    efeitos.escreva(`Erro de sintaxe.`),
    efeitos.escreva(endereço),
    efeitos.escreva(`${número_linha}:${número_coluna}: ${linha_com_erro}`),
  ]
}

// A máquina de estados que gerencia a execução de um programa.
const etapas = {
  // Estado inicial: obtém os argumentos e verifica se o cache existe.
  iniciar: () => [
    efeitos.atribua_retorno_ao_estado("argumentos", efeitos.obtenha_argumentos()),
    efeitos.atribua_retorno_ao_estado("cache_existe", efeitos.verifique_existência("0_cache.json")),
    efeitos.atribua_valor_ao_estado("etapa", "carregar_cache"),
  ],
  // Carrega o cache de módulos se ele existir.
  carregar_cache: ({ cache_existe }) => {
    if (cache_existe) {
      return [
        efeitos.atribua_retorno_ao_estado("conteúdo_cache", efeitos.carregue_localmente("0_cache.json")),
        efeitos.atribua_valor_ao_estado("etapa", "avaliar_cache"),
      ]
    }
    return [
      efeitos.atribua_valor_ao_estado("conteúdo_cache", "{}"),
      efeitos.atribua_valor_ao_estado("etapa", "avaliar_cache"),
    ]
  },
  // Avalia o conteúdo do cache e inicializa as estruturas de estado.
  avaliar_cache: ({ conteúdo_cache, argumentos: [endereço] }) => [
    efeitos.atribua_valor_ao_estado("módulo_principal", endereço),
    efeitos.atribua_valor_ao_estado("conteúdos", {
      "0_cache.json": JSON.parse(conteúdo_cache),
      [endereço]: null, // Marca o módulo principal para ser carregado.
    }),
    efeitos.atribua_valor_ao_estado("módulos", {
      [endereço]: null, // Marca o módulo principal para ser avaliado.
    }),
    efeitos.atribua_valor_ao_estado("valores_módulos", {}),
    efeitos.atribua_valor_ao_estado("módulo_principal_estado", {}),
    efeitos.delete_do_estado("conteúdo_cache"),
    efeitos.delete_do_estado("argumentos"),
    efeitos.atribua_valor_ao_estado("etapa", "carregar_conteúdos"),
  ],
  // Encontra e carrega o próximo módulo cujo conteúdo ainda não foi carregado.
  carregar_conteúdos: ({ conteúdos }) => {
    const [endereço] = Object.entries(conteúdos).find(([, conteúdo]) => conteúdo === null) || []
    if (endereço === undefined) return [efeitos.atribua_valor_ao_estado("etapa", "avaliar_módulos")] // Todos os conteúdos foram carregados.

    // Se o conteúdo estiver no cache, usa-o.
    if (conteúdos["0_cache.json"][endereço]) return [
      efeitos.atribua_valor_ao_estado("endereço", endereço),
      efeitos.atribua_valor_ao_estado("conteúdo", conteúdos["0_cache.json"][endereço]),
      efeitos.atribua_valor_ao_estado("etapa", "carregar_conteúdo"),
    ]

    // Caso contrário, carrega da web ou do sistema de arquivos.
    return [
      efeitos.atribua_valor_ao_estado("endereço", endereço),
      efeitos.atribua_retorno_ao_estado("conteúdo",
        endereço.startsWith("https://") ?
          efeitos.carregue_remotamente(endereço) :
          efeitos.carregue_localmente(endereço)
      ),
      efeitos.atribua_valor_ao_estado("etapa", "carregar_conteúdo"),
    ]
  },
  // Armazena o conteúdo recém-carregado no estado e atualiza o cache.
  carregar_conteúdo: ({ conteúdos, endereço, conteúdo }) => {
    const novo_cache = { ...conteúdos["0_cache.json"] };
    if (endereço.startsWith("https://")) {
      novo_cache[endereço] = conteúdo;
    }

    return [
      efeitos.atribua_valor_ao_estado("conteúdos", {
        ...conteúdos,
        [endereço]: conteúdo,
        "0_cache.json": novo_cache,
      }),
      efeitos.atribua_valor_ao_estado("etapa", "carregar_conteúdos"),
    ]
  },
  // Encontra o próximo módulo a ser avaliado (parseado).
  avaliar_módulos: ({ módulos, conteúdos }) => {
    const [endereço] = Object.entries(módulos).find(([_, módulo]) => módulo === null) || []
    if (endereço === undefined) return [efeitos.atribua_valor_ao_estado("etapa", "executar_módulos")] // Todos os módulos foram avaliados.

    const módulo_bruto = _0.analisar(conteúdos[endereço])

    // Lida com erros de análise (parsing).
    if (módulo_bruto.erro || módulo_bruto.resto.length > 0) {
      if (módulo_bruto.erro) {
        return [
          efeitos.escreva(`Erro: ${módulo_bruto.erro.message}`),
          efeitos.escreva(módulo_bruto.erro.stack),
          efeitos.saia(1),
        ]
      }
      return [
        ...relatarErroSintaxe(conteúdos[endereço], endereço, módulo_bruto.menor_resto),
        efeitos.salve_localmente("0_cache.json", JSON.stringify(conteúdos["0_cache.json"], null, 2)),
        efeitos.saia(1),
      ]
    }

    const [importações, carregamentos, corpo] = módulo_bruto.valor;
    const resolved_importações = importações.map(([nome, end_rel]) => [nome, resolverEndereço(endereço, end_rel)]);
    const resolved_carregamentos = carregamentos.map(([nome, end_rel]) => [nome, resolverEndereço(endereço, end_rel)]);

    // Adiciona novas dependências às listas de conteúdos e módulos a serem processados.
    const novas_dependências_conteúdos = Object.fromEntries(
      [...resolved_importações, ...resolved_carregamentos]
        .filter(([, end]) => !conteúdos.hasOwnProperty(end))
        .map(([, end]) => [end, null])
    );
    const novas_dependências_módulos = Object.fromEntries(
      resolved_importações
        .filter(([, end]) => !módulos.hasOwnProperty(end))
        .map(([, end]) => [end, null])
    );

    return [
      efeitos.atribua_valor_ao_estado("conteúdos", { ...conteúdos, ...novas_dependências_conteúdos }),
      efeitos.atribua_valor_ao_estado("módulos", {
        ...módulos,
        ...novas_dependências_módulos,
        [endereço]: [resolved_importações, resolved_carregamentos, corpo],
      }),
      efeitos.atribua_valor_ao_estado("etapa", "carregar_conteúdos"), // Volta a carregar conteúdos, pois pode haver novas dependências.
    ]
  },
  // Executa os módulos na ordem correta de dependência.
  executar_módulos: ({ módulos, valores_módulos, conteúdos }) => {
    // Encontra um módulo que está pronto para ser executado.
    const [endereço, módulo] = Object.entries(módulos).find(
      ([e, m]) =>
        m !== null && // Já foi avaliado (parseado)
        !valores_módulos.hasOwnProperty(e) && // Ainda não foi executado
        m[0].every(([, dep_end]) => valores_módulos.hasOwnProperty(dep_end)) && // Todas as dependências de importação foram executadas
        m[1].every(([, dep_end]) => conteúdos[dep_end] !== undefined) // Todas as dependências de carregamento foram carregadas
    ) || [];

    if (endereço === undefined) {
      const todos_avaliados = Object.keys(módulos).every(e => valores_módulos.hasOwnProperty(e));
      if (todos_avaliados) {
        // Todos os módulos foram executados com sucesso.
        return [
          efeitos.salve_localmente("0_cache.json", JSON.stringify(conteúdos["0_cache.json"], null, 2)),
          efeitos.atribua_valor_ao_estado("etapa", "executar_módulo_principal")
        ]
      } else {
        // Se não há mais módulos para executar, mas nem todos foram avaliados, há uma dependência circular.
        return [
          efeitos.escreva("Erro: Dependência circular detectada."),
          efeitos.saia(1),
        ];
      }
    }

    const [importações, carregamentos, corpo] = módulo;

    // Cria o escopo do módulo com os valores das suas dependências.
    const escopo_importações = Object.fromEntries(
      importações.map(([nome, dep_end]) => [nome, valores_módulos[dep_end]])
    );
    const escopo_carregamentos = Object.fromEntries(
      carregamentos.map(([nome, end_conteúdo]) => [nome, conteúdos[end_conteúdo]])
    );
    const escopo = { ...escopo_importações, ...escopo_carregamentos };

    const valor = corpo(escopo); // Executa o corpo do módulo.

    return [
      efeitos.atribua_valor_ao_estado("valores_módulos", {
        ...valores_módulos,
        [endereço]: valor
      }),
      efeitos.atribua_valor_ao_estado("etapa", "executar_módulos"), // Continua o ciclo de execução.
    ];
  },
  // Executa o módulo principal, que pode ser uma sandbox de efeitos.
  executar_módulo_principal: estado => {
    const efeitos_módulo = estado.valores_módulos[estado.módulo_principal](estado.módulo_principal_estado);
    return [
      efeitos.atribua_valor_ao_estado("fila_efeitos_sandboxed", efeitos_módulo),
      efeitos.atribua_valor_ao_estado("etapa", "processar_efeito_sandboxed"),
    ];
  },
  // Processa a fila de efeitos gerada pela sandbox do módulo principal.
  processar_efeito_sandboxed: estado => {
    const { fila_efeitos_sandboxed, módulo_principal_estado } = estado;
    if (fila_efeitos_sandboxed.length === 0) {
      return [efeitos.atribua_valor_ao_estado("etapa", "finalizar_sandbox")];
    }
    const [efeito, ...resto_fila] = fila_efeitos_sandboxed;
    const [tipo] = efeito;
    if (tipo === 0) { // atribua_retorno_ao_estado
      const [, nome, sub_efeito] = efeito;
      return [
        efeitos.atribua_valor_ao_estado("destino_retorno_sandboxed", nome),
        efeitos.atribua_retorno_ao_estado("_temp_retorno_sandboxed", sub_efeito),
        efeitos.atribua_valor_ao_estado("fila_efeitos_sandboxed", resto_fila),
        efeitos.atribua_valor_ao_estado("etapa", "salvar_retorno_sandboxed"),
      ];
    } else if (tipo === 1) { // atribua_valor_ao_estado
      const [, nome, valor] = efeito;
      return [
        efeitos.atribua_valor_ao_estado("módulo_principal_estado", { ...módulo_principal_estado, [nome]: valor }),
        efeitos.atribua_valor_ao_estado("fila_efeitos_sandboxed", resto_fila),
        efeitos.atribua_valor_ao_estado("etapa", "processar_efeito_sandboxed"),
      ];
    } else if (tipo === 2) { // delete_do_estado
      const [, nome] = efeito;
      const novo_estado = { ...módulo_principal_estado };
      delete novo_estado[nome];
      return [
        efeitos.atribua_valor_ao_estado("módulo_principal_estado", novo_estado),
        efeitos.atribua_valor_ao_estado("fila_efeitos_sandboxed", resto_fila),
        efeitos.atribua_valor_ao_estado("etapa", "processar_efeito_sandboxed"),
      ];
    }
    // Para efeitos que não são da sandbox (ex: escreva, saia), passa-os para o executor principal.
    return [
      ...[efeito],
      efeitos.atribua_valor_ao_estado("fila_efeitos_sandboxed", resto_fila),
      efeitos.atribua_valor_ao_estado("etapa", "processar_efeito_sandboxed"),
    ]
  },
  // Salva o resultado de um efeito assíncrono de volta ao estado da sandbox.
  salvar_retorno_sandboxed: estado => {
    const { _temp_retorno_sandboxed, destino_retorno_sandboxed, módulo_principal_estado } = estado;
    return [
      efeitos.atribua_valor_ao_estado("módulo_principal_estado", { ...módulo_principal_estado, [destino_retorno_sandboxed]: _temp_retorno_sandboxed }),
      efeitos.delete_do_estado("_temp_retorno_sandboxed"),
      efeitos.delete_do_estado("destino_retorno_sandboxed"),
      efeitos.atribua_valor_ao_estado("etapa", "processar_efeito_sandboxed"),
    ];
  },
  // Finaliza a execução da sandbox.
  finalizar_sandbox: estado => {
    return [
      efeitos.delete_do_estado("fila_efeitos_sandboxed"),
      efeitos.atribua_valor_ao_estado("etapa", "finalizado"),
    ];
  },
}

export default estado => etapas[estado.etapa ?? "iniciar"](estado)