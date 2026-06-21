import { bloco } from "./texto.js"

const iguais = (a, b) => {
  if (a === b) return true;
  if (a == null || b == null) return a === b;
  if (Number.isNaN(a) && Number.isNaN(b)) return true;
  if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime();
  if (a instanceof RegExp && b instanceof RegExp) return a.toString() === b.toString();
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) if (!iguais(a[i], b[i])) return false;
    return true;
  }
  if (typeof a === 'object' && typeof b === 'object') {
    const ka = Object.keys(a);
    const kb = Object.keys(b);
    if (ka.length !== kb.length) return false;
    ka.sort();
    kb.sort();
    for (let i = 0; i < ka.length; i++) if (ka[i] !== kb[i]) return false;
    for (const k of ka) if (!iguais(a[k], b[k])) return false;
    return true;
  }
  return false;
}

export const testar = testes => {
  const falhas = testes.map(({ função, argumento, retorno_esperado }) => {
    try {
      const retorno = função(argumento)
      if (! iguais(retorno, retorno_esperado)) {
        return bloco(`
          . função:
          .   ${função.name || "anônima"}
          . argumento:
          .   ${JSON.stringify(argumento, null, 2).replace(/\n/g, "\n  ")}
          . retorno esperado:
          .   ${JSON.stringify(retorno_esperado, null, 2).replace(/\n/g, "\n  ")}
          . retorno:
          .   ${JSON.stringify(retorno, null, 2).replace(/\n/g, "\n  ")}
        `)
      }
    } catch (erro) {
      return bloco(`
        . função:
        .   ${função.name || "anônima"}
        . argumento:
        .   ${JSON.stringify(argumento, null, 2).replace(/\n/g, "\n  ")}
        . erro interno:
        .   ${erro.stack}
      `)
    }
    return null
  }).filter(resultado => resultado !== null)
  if (falhas.length === 0) return {
    código: 0,
    saída: `✅ Todos os ${testes.length} testes passaram!`,
  }
  if (falhas.length === 1) return {
    código: 1,
    saída: `${falhas[0]}\n\n🚨 1 de ${testes.length} teste falhou.`,
  }
  return {
    código: 1,
    saída: `${falhas.join("\n\n")}\n\n🚨 ${falhas.length} de ${testes.length} testes falharam.`,
  }
}