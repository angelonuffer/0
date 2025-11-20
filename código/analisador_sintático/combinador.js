import dialeto from "./dialeto.js"
import { TIPO_AST } from '../constantes.js';

// Traduz comportamento do `dialeto` (que agora exige consumo total)
// para a API esperada pelos combinadores: tentar encontrar o maior
// prefixo da `entrada` que é totalmente consumido pelo `dialeto`.
export default gramática => entrada => {
  // Busca o maior prefixo que o dialeto reconhece consumindo-o totalmente.
  // O `dialeto.analisar` agora lança erro quando a entrada não corresponde
  // ou não é consumida totalmente. Capturamos essas exceções e continuamos
  // procurando por prefixes menores. Se encontrarmos um prefixo válido,
  // traduzimos para o formato esperado pelos combinadores.
  for (let n = entrada.length; n > 0; n--) {
    const prefix = entrada.slice(0, n)
    if (prefix.length === 0) continue; // dialeto não analisa entrada vazia
    try {
      const res = dialeto.analisar({ entrada: prefix, gramática })
      if (process.env.DEBUG_COMBINADOR) {
        try { console.error('COMBINADOR_DEBUG: prefix="' + prefix.replace(/\n/g, '\\n') + '", res=', JSON.stringify(res)); } catch(e) { console.error('COMBINADOR_DEBUG: <could not stringify>'); }
      }

      // Se não lançou, res é um objeto. Existem dois cenários:
      // 1) `dialeto` retorna sucesso=true (consumo total) -> aceitamos.
      // 2) `dialeto` retorna sucesso=false mas informa `valor`/`resto`
      //    (consumo parcial) -> aceitamos esse prefixo parcial e traduzimos o resto.
      if (res && res.sucesso) {
        if (!res.valor || res.valor.length === 0) {
          return { sucesso: false, valor: undefined, resto: entrada, menor_resto: entrada }
        }
        return {
          sucesso: true,
          valor: { tipo: TIPO_AST.NÚMERO, valor: parseInt(res.valor, 10) },
          resto: entrada.slice(n),
          menor_resto: entrada.slice(n)
        }
      }

      // Caso o dialeto tenha retornado um reconhecimento parcial (sucesso=false
      // mas com `valor` e `resto`), use essas informações para produzir um
      // resultado compatível com os combinadores.
      if (res && !res.sucesso && typeof res.valor === 'string' && res.valor.length > 0) {
        const accepted = res.valor;
        const resto_do_prefix = res.resto || '';
        const resto_total = resto_do_prefix + entrada.slice(n);
        if (process.env.DEBUG_COMBINADOR) console.error('COMBINADOR_DEBUG: partial-res prefix="' + prefix.replace(/\n/g, '\\n') + '", accepted="' + accepted.replace(/\n/g, '\\n') + '", resto="' + resto_total.replace(/\n/g, '\\n') + '"');
        return {
          sucesso: true,
          valor: { tipo: TIPO_AST.NÚMERO, valor: parseInt(accepted, 10) },
          resto: resto_total,
          menor_resto: resto_total
        }
      }

      // Caso o dialeto retorne sem sucesso, tratamos como não aceitação
    } catch (e) {
      // Se o dialeto forneceu informação parcial via `cause`, use-a
      // para retornar um reconhecimento parcial (compatibilidade).
      const cause = e && e.cause;
      if (cause && typeof cause.valor === 'string') {
        const accepted = cause.valor;
        if (!accepted || accepted.length === 0) {
          // nada aceito neste prefixo — continua procurando
          if (process.env.DEBUG_COMBINADOR) console.error('COMBINADOR_DEBUG: prefix rejected (empty accepted)="' + prefix.replace(/\n/g, '\\n') + '"');
          continue;
        }
        const resto_do_prefix = (cause.resto || '');
        // resto relativo à entrada original = resto_do_prefix + o que vem após o prefix
        const resto_total = resto_do_prefix + entrada.slice(n);
        if (process.env.DEBUG_COMBINADOR) console.error('COMBINADOR_DEBUG: partial accept prefix="' + prefix.replace(/\n/g, '\\n') + '", accepted="' + accepted.replace(/\n/g, '\\n') + '", resto="' + resto_total.replace(/\n/g, '\\n') + '"');
        return {
          sucesso: true,
          valor: { tipo: TIPO_AST.NÚMERO, valor: parseInt(accepted, 10) },
          resto: resto_total,
          menor_resto: resto_total
        }
      }
      // Exceção sem causa útil — continua procurando outros prefixes
      continue
    }
  }

  // Nenhum prefixo consumido completamente
  return { sucesso: false, valor: undefined, resto: entrada, menor_resto: entrada }
}