import iguais from './iguais.js';

export default function testar(função, casos) {
  const falhas = [];
  let passaram = 0;
  const total = casos.length;

  for (const c of casos) {
    const { entrada, esperado } = c;
    try {
      const obtido = função(entrada);
      const ok = iguais(obtido, esperado);
      if (ok) {
        passaram++;
      } else {
        falhas.push({ teste: entrada, saída_esperada: esperado, saída_obtida: obtido });
      }
    } catch (e) {
      falhas.push({ teste: entrada, erro_esperado: esperado, erro_obtido: String(e) });
    }
  }

  return { falhas, passaram, total };
}
