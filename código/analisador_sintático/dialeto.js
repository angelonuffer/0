const analisar = ({ entrada, gramática }) => {
  entrada = String(entrada || '');
  if (entrada.length === 0) return { sucesso: false, valor: '', resto: entrada };
  switch (gramática.tipo) {
    case 'repetição': {
      let acumulado = '';
      for (let i = 0; i < entrada.length; i++) {
        const ch = entrada[i];
        const sub = analisar({ entrada: ch, gramática: gramática.gramática });
        if (sub && sub.sucesso) {
          acumulado += String(sub.valor || '');
        } else {
          return { sucesso: false, valor: acumulado, resto: entrada.slice(i) };
        }
      }
      return { sucesso: true, valor: acumulado, resto: '' };
    }
    case 'faixa': {
      if (entrada.length > 1) return { sucesso: false, valor: '', resto: entrada };
      if (entrada >= gramática.de && entrada <= gramática.até) return { sucesso: true, valor: entrada, resto: '' };
      return { sucesso: false, valor: '', resto: entrada };
    }
    default:
      return { sucesso: false, valor: undefined, resto: entrada };
  }
};

export default { analisar };