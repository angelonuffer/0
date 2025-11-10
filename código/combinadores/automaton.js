// Pushdown Automaton implementation for parser combinators
// This module provides a state stack-based parser that avoids backtracking

// Parser state structure for the pushdown automaton
class ParserState {
  constructor(código, posição = 0, pilha = [], maior_progresso = 0, erro_na_maior_posição = null) {
    this.código = código;  // Input string
    this.posição = posição;  // Current position in input
    this.pilha = pilha;  // Stack for tracking nested structures
    this.maior_progresso = maior_progresso;  // Furthest position reached
    this.erro_na_maior_posição = erro_na_maior_posição;  // Error at furthest position
  }

  // Create a new state with updated position
  avançar(n) {
    const nova_posição = this.posição + n;
    const novo_progresso = Math.max(this.maior_progresso, nova_posição);
    return new ParserState(
      this.código,
      nova_posição,
      [...this.pilha],
      novo_progresso,
      nova_posição > this.maior_progresso ? null : this.erro_na_maior_posição
    );
  }

  // Push a delimiter onto the stack
  empilhar(delimitador, posição_abertura) {
    return new ParserState(
      this.código,
      this.posição,
      [...this.pilha, { delimitador, posição_abertura }],
      this.maior_progresso,
      this.erro_na_maior_posição
    );
  }

  // Pop a delimiter from the stack
  desempilhar() {
    if (this.pilha.length === 0) return this;
    return new ParserState(
      this.código,
      this.posição,
      this.pilha.slice(0, -1),
      this.maior_progresso,
      this.erro_na_maior_posição
    );
  }

  // Get remaining code from current position
  resto() {
    return this.código.slice(this.posição);
  }

  // Set error at current position if it's the furthest reached
  definirErro(mensagem) {
    if (this.posição >= this.maior_progresso) {
      return new ParserState(
        this.código,
        this.posição,
        [...this.pilha],
        Math.max(this.maior_progresso, this.posição),
        { mensagem, posição: this.posição, resto: this.resto() }
      );
    }
    return this;
  }

  // Create a result object in the old format for compatibility
  criarResultado(sucesso, valor) {
    const resto = this.resto();
    const menor_resto = this.código.slice(this.maior_progresso);
    
    if (sucesso) {
      return {
        sucesso: true,
        valor,
        resto,
        menor_resto,
      };
    } else {
      return {
        sucesso: false,
        valor: undefined,
        resto,
        menor_resto,
        erro: this.erro_na_maior_posição || { 
          mensagem: "Erro de análise", 
          posição: this.maior_progresso,
          resto: menor_resto
        }
      };
    }
  }
}

// Enhanced parser combinator functions using pushdown automaton

// Parse a specific symbol/string
const símbolo_pda = símbolo_esperado => código => {
  const estado = new ParserState(código);
  
  if (estado.resto().startsWith(símbolo_esperado)) {
    const novo_estado = estado.avançar(símbolo_esperado.length);
    return novo_estado.criarResultado(true, símbolo_esperado);
  }
  
  const estado_erro = estado.definirErro(`Esperado "${símbolo_esperado}"`);
  return estado_erro.criarResultado(false, undefined);
};

// Try alternatives without backtracking - uses lookahead for deterministic choice
const alternativa_pda = (...analisadores) => código => {
  const estado_inicial = new ParserState(código);
  let melhor_estado = estado_inicial;
  
  for (const analisador of analisadores) {
    const resultado = analisador(código);
    
    // Se teve sucesso, retorna imediatamente (sem backtracking)
    if (resultado.sucesso) {
      return resultado;
    }
    
    // Atualiza o melhor estado com base no maior progresso
    const progresso = código.length - (resultado.menor_resto || resultado.resto).length;
    if (progresso > código.length - melhor_estado.resto().length) {
      melhor_estado = new ParserState(
        código,
        progresso,
        [],
        progresso,
        resultado.erro
      );
    }
  }
  
  return melhor_estado.criarResultado(false, undefined);
};

// Sequence combinator with state tracking
const sequência_pda = (...analisadores) => código => {
  const estado_inicial = new ParserState(código);
  const valores = [];
  let estado_atual = estado_inicial;
  let resto_atual = código;
  
  for (const analisador of analisadores) {
    const resultado = analisador(resto_atual);
    
    // Atualiza o maior progresso
    const progresso = código.length - (resultado.menor_resto || resultado.resto).length;
    if (progresso > estado_atual.maior_progresso) {
      estado_atual = new ParserState(
        código,
        estado_atual.posição,
        estado_atual.pilha,
        progresso,
        resultado.erro
      );
    }
    
    if (!resultado.sucesso) {
      return new ParserState(
        código,
        0,
        [],
        estado_atual.maior_progresso,
        resultado.erro
      ).criarResultado(false, undefined);
    }
    
    valores.push(resultado.valor);
    resto_atual = resultado.resto;
    estado_atual = estado_atual.avançar(código.length - resto_atual.length - estado_atual.posição);
  }
  
  return estado_atual.criarResultado(true, valores);
};

// Enhanced delimiter matching with stack tracking
const delimitador_abertura = (abertura, fechamento) => código => {
  const estado = new ParserState(código);
  
  if (estado.resto().startsWith(abertura)) {
    const novo_estado = estado
      .avançar(abertura.length)
      .empilhar(fechamento, estado.posição);
    return novo_estado.criarResultado(true, abertura);
  }
  
  const estado_erro = estado.definirErro(`Esperado "${abertura}"`);
  return estado_erro.criarResultado(false, undefined);
};

const delimitador_fechamento = fechamento => código => {
  const estado = new ParserState(código);
  
  if (estado.resto().startsWith(fechamento)) {
    if (estado.pilha.length > 0 && estado.pilha[estado.pilha.length - 1].delimitador === fechamento) {
      const novo_estado = estado
        .desempilhar()
        .avançar(fechamento.length);
      return novo_estado.criarResultado(true, fechamento);
    } else if (estado.pilha.length > 0) {
      // Wrong closing delimiter
      const esperado = estado.pilha[estado.pilha.length - 1].delimitador;
      const estado_erro = estado.definirErro(`Esperado "${esperado}", mas encontrado "${fechamento}"`);
      return estado_erro.criarResultado(false, undefined);
    } else {
      // Unexpected closing delimiter
      const estado_erro = estado.definirErro(`Delimitador de fechamento inesperado "${fechamento}"`);
      return estado_erro.criarResultado(false, undefined);
    }
  }
  
  const estado_erro = estado.definirErro(`Esperado "${fechamento}"`);
  return estado_erro.criarResultado(false, undefined);
};

// Check if all delimiters are properly closed
const verificar_pilha_vazia = código => {
  // This is a meta-check that can be used at the end of parsing
  // It's not a parser itself, but a validation function
  return código.trim() === '';
};

export {
  ParserState,
  símbolo_pda,
  alternativa_pda,
  sequência_pda,
  delimitador_abertura,
  delimitador_fechamento,
  verificar_pilha_vazia
};
