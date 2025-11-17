// Parser combinators - Generic reusable parsing functions
// These combinators are not specific to the project and can be reused by other projects

const símbolo = símbolo_esperado => código => {
  if (código.startsWith(símbolo_esperado)) return {
    sucesso: true,
    valor: símbolo_esperado,
    resto: código.slice(símbolo_esperado.length),
  }
  return { 
    sucesso: false, 
    valor: undefined,
    resto: código, 
    menor_resto: código,
    erro: { mensagem: `Esperado "${símbolo_esperado}"`, posição: código }
  }
}

const alternativa = (...analisadores) => código => {
  let menor_resto = código
  let melhor_erro = null
  
  for (const analisador of analisadores) {
    const resultado = analisador(código)
    
    // Se teve sucesso, retorna imediatamente
    if (resultado.sucesso) return resultado
    
    // Acompanha o progresso mais profundo (menor resto)
    const resto_atual = resultado.menor_resto || resultado.resto
    if (resto_atual.length < menor_resto.length) {
      menor_resto = resto_atual
      melhor_erro = resultado.erro
    }
  }
  
  return { 
    sucesso: false,
    valor: undefined,
    resto: código, 
    menor_resto,
    erro: melhor_erro || { mensagem: "Nenhuma alternativa corresponde", posição: código }
  }
}

const sequência = (...analisadores) => código => {
  const valores = []
  let resto = código
  let menor_resto_global = código

  for (const analisador of analisadores) {
    const resultado = analisador(resto)
    
    // Atualiza o menor_resto_global com o progresso mais profundo
    const resto_atual = resultado.menor_resto || resultado.resto
    if (resto_atual.length < menor_resto_global.length) {
      menor_resto_global = resto_atual
    }
    
    if (!resultado.sucesso) {
      return {
        sucesso: false,
        valor: undefined,
        resto: código,
        menor_resto: menor_resto_global,
        erro: resultado.erro
      }
    }

    valores.push(resultado.valor)
    resto = resultado.resto
  }

  return { sucesso: true, valor: valores, resto, menor_resto: menor_resto_global }
}

const opcional = (analisador, valor_padrão) => código => {
  const resultado = analisador(código)
  if (resultado.sucesso) return resultado
  return { 
    sucesso: true, 
    valor: valor_padrão, 
    resto: código, 
    menor_resto: resultado.menor_resto || código, 
    erro: resultado.erro 
  }
}

const vários = analisador => código => {
  const valores = []
  let resto = código
  let menor_resto_global = código

  while (true) {
    const resultado = analisador(resto)
    
    // Atualiza o progresso mais profundo
    const resto_atual = resultado.menor_resto || resultado.resto
    if (resto_atual.length < menor_resto_global.length) {
      menor_resto_global = resto_atual
    }
    
    if (!resultado.sucesso || resultado.resto === resto) break
    valores.push(resultado.valor)
    resto = resultado.resto
    
    // Após sucesso, também atualiza com o novo resto (ponto alcançado)
    if (resto.length < menor_resto_global.length) {
      menor_resto_global = resto
    }
  }

  return { sucesso: true, valor: valores, resto, menor_resto: menor_resto_global }
}

const transformar = (analisador, transformador) => código => {
  const resultado = analisador(código)
  if (!resultado.sucesso) {
    return {
      sucesso: false,
      valor: undefined,
      resto: código,
      menor_resto: resultado.menor_resto || código,
      erro: resultado.erro
    }
  }
  try {
    return { 
      sucesso: true,
      valor: transformador(resultado.valor), 
      resto: resultado.resto, 
      menor_resto: resultado.menor_resto || resultado.resto
    }
  } catch (erro) {
    return { 
      sucesso: false,
      valor: undefined,
      resto: código, 
      menor_resto: resultado.menor_resto || código, 
      erro: { mensagem: erro.message, stack: erro.stack }
    }
  }
}

const inversão = analisador => código => {
  const resultado = analisador(código)
  if (!resultado.sucesso) {
    const novo_resto = código.slice(1)
    return {
      sucesso: true,
      valor: código[0],
      resto: novo_resto,
      menor_resto: novo_resto.length < código.length ? novo_resto : código
    }
  }
  return { 
    sucesso: false,
    valor: undefined,
    resto: código, 
    menor_resto: resultado.menor_resto || código,
    erro: { mensagem: "Inversão falhou", posição: código }
  }
}

const faixa = (inicial, final) => código => {
  if (código.length === 0 || código[0] < inicial || código[0] > final) {
    return { 
      sucesso: false,
      valor: undefined,
      resto: código, 
      menor_resto: código,
      erro: { mensagem: `Esperado caractere entre '${inicial}' e '${final}'`, posição: código }
    }
  }
  return {
    sucesso: true,
    valor: código[0],
    resto: código.slice(1),
  }
}

const operador = (literal, funcao) => transformar(
  símbolo(literal),
  () => ({ literal, funcao })
);

// operação is a higher-level combinator that depends on espaço
// It will be exported from a separate module to avoid circular dependencies
const createOperação = (espaço) => (termo, operadores) => transformar(
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

    return operaçõesSequenciais.reduce(
      (esquerda, valSeq) => {
        const operador = valSeq[1];
        const direita = valSeq[3];
        return {
          tipo: 'operação_binária',
          esquerda: esquerda,
          direita: direita,
          operador: operador.funcao
        };
      },
      primeiroTermo
    );
  }
);

export {
  símbolo,
  alternativa,
  sequência,
  opcional,
  vários,
  transformar,
  inversão,
  faixa,
  operador,
  createOperação
};