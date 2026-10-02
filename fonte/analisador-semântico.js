export const analisador_semântico = ast => {
  if (ast?.número !== undefined) return Number(ast.número);

  if (ast?.operação) {
    const { operador, esquerda, direita } = ast.operação;
    const valor_esquerdo = analisador_semântico(esquerda);
    const valor_direito = analisador_semântico(direita);

    switch (operador) {
      case '+': return valor_esquerdo + valor_direito;
      case '-': return valor_esquerdo - valor_direito;
      case '*': return valor_esquerdo * valor_direito;
      case '/': return valor_esquerdo / valor_direito;
    }
  }
}
