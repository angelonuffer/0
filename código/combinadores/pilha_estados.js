// State stack for tracking parser context and nested delimiters
// This implements the pushdown automaton concept for better error reporting

class PilhaEstados {
  constructor() {
    this.pilha = [];
    this.maior_progresso_posição = 0;
    this.erro_na_maior_posição = null;
  }

  // Push a delimiter context onto the stack
  empilhar(delimitador, tipo, posição) {
    this.pilha.push({
      delimitador,  // The closing delimiter expected (e.g., ']', '}', ')')
      tipo,         // Type of context (e.g., 'lista', 'objeto', 'parêntese')
      posição,      // Position where delimiter was opened
    });
  }

  // Pop a delimiter context from the stack
  desempilhar() {
    if (this.pilha.length > 0) {
      return this.pilha.pop();
    }
    return null;
  }

  // Peek at the top of the stack without popping
  topo() {
    if (this.pilha.length > 0) {
      return this.pilha[this.pilha.length - 1];
    }
    return null;
  }

  // Check if stack is empty (all delimiters matched)
  vazia() {
    return this.pilha.length === 0;
  }

  // Get all unclosed delimiters
  delimitadoresAbertos() {
    return this.pilha.map(ctx => ({
      delimitador: ctx.delimitador,
      tipo: ctx.tipo,
      posição: ctx.posição
    }));
  }

  // Update progress tracking for error reporting
  atualizarProgresso(posição, código_resto, mensagem_erro = null) {
    const progresso_atual = código_resto ? (código_resto.length > 0 ? posição : posição + 1) : posição;
    
    if (progresso_atual > this.maior_progresso_posição) {
      this.maior_progresso_posição = progresso_atual;
      this.erro_na_maior_posição = mensagem_erro ? {
        mensagem: mensagem_erro,
        posição: progresso_atual,
        pilha: [...this.pilha]
      } : null;
    }
  }

  // Get the error at the furthest position reached
  obterMelhorErro() {
    if (this.erro_na_maior_posição) {
      return this.erro_na_maior_posição;
    }
    
    // If there are unclosed delimiters, that's likely the error
    if (!this.vazia()) {
      const topo = this.topo();
      return {
        mensagem: `Esperado "${topo.delimitador}" para fechar ${topo.tipo}`,
        posição: this.maior_progresso_posição,
        pilha: [...this.pilha]
      };
    }
    
    return null;
  }

  // Clone the stack for backtracking-free parsing
  clonar() {
    const nova_pilha = new PilhaEstados();
    nova_pilha.pilha = [...this.pilha];
    nova_pilha.maior_progresso_posição = this.maior_progresso_posição;
    nova_pilha.erro_na_maior_posição = this.erro_na_maior_posição;
    return nova_pilha;
  }
}

// Global state stack instance - this will be used during parsing
let pilhaGlobal = null;

const inicializarPilha = () => {
  pilhaGlobal = new PilhaEstados();
  return pilhaGlobal;
};

const obterPilhaGlobal = () => {
  if (!pilhaGlobal) {
    pilhaGlobal = new PilhaEstados();
  }
  return pilhaGlobal;
};

const resetarPilhaGlobal = () => {
  pilhaGlobal = null;
};

export {
  PilhaEstados,
  inicializarPilha,
  obterPilhaGlobal,
  resetarPilhaGlobal
};
