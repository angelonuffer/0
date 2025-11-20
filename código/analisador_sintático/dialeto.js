const analisar = ({ entrada, gramática }) => {
  entrada = String(entrada || '');
  if (entrada.length === 0) return { valor: '', resto: entrada };
  switch (gramática.tipo) {
    case 'repetição': {
      let acumulado = '';
      for (let i = 0; i < entrada.length; i++) {
        const ch = entrada[i];
        const sub = analisar({ entrada: ch, gramática: gramática.gramática });
        if (sub && sub.resto.length !== ch.length) {
          acumulado += String(sub.valor || '');
        } else {
          return { valor: acumulado, resto: entrada.slice(i) };
        }
      }
      return { valor: acumulado, resto: '' };
    }
    case 'faixa': {
      if (entrada.length > 1) return { valor: '', resto: entrada };
      if (entrada >= gramática.de && entrada <= gramática.até) return { valor: entrada, resto: '' };
      return { valor: '', resto: entrada };
    }
    default:
      return { valor: undefined, resto: entrada };
  }
};

export default { analisar };