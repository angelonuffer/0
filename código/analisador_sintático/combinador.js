import dialeto from "./dialeto.js"
import { TIPO_AST } from '../constantes.js';

/*
  combinador.js

  Adapta a API do módulo `dialeto` para a interface esperada pelos
  combinadores do analisador sintático. O `dialeto.analisar` foi projetado
  para exigir consumo total da string fornecida e pode retornar ou lançar
  objetos que descrevem consumo parcial. Este módulo tenta os maiores
  prefixes possíveis de `entrada` (varrendo de maior para menor) e traduz
  os retornos/exceções do `dialeto` para o formato usado pelos combinadores:

    { sucesso: boolean, valor: ASTNode|undefined, resto: string, menor_resto: string }

  Principais decisões e compatibilidade:
  - Para resultados totalmente aceitos (`res.sucesso === true`) retornamos
    o nó AST numérico correspondente e o `resto` referente ao que sobrou da
    entrada original após o prefixo aceito.
  - Se o `dialeto` retornar um reconhecimento parcial (sucesso=false
    mas com `valor`/`resto`) ou lançar uma exceção contendo `cause.valor`/`cause.resto`,
    esses valores são usados para construir um resultado compatível.
  - Se nada for reconhecido, retornamos o objeto de falha com `sucesso:false`.
  - Para depuração, defina a variável de ambiente `DEBUG_COMBINADOR=1`.

  Helpers extraídos neste arquivo facilitam leitura e manutenção,
  mantendo a lógica e o contrato original inalterados.
*/

const debugLog = msg => {
  if (!process.env.DEBUG_COMBINADOR) return;
  try { console.error(msg); } catch (e) { console.error('COMBINADOR_DEBUG: <could not stringify>'); }
}

const makeNumberNode = str => ({ tipo: TIPO_AST.NÚMERO, valor: parseInt(str, 10) });
const successResult = (valorStr, restoTotal) => ({
  sucesso: true,
  valor: makeNumberNode(valorStr),
  resto: restoTotal,
  menor_resto: restoTotal
});
const failureResult = entrada => ({ sucesso: false, valor: undefined, resto: entrada, menor_resto: entrada });

export default gramática => entrada => {
  for (let n = entrada.length; n > 0; n--) {
    const prefix = entrada.slice(0, n);
    if (prefix.length === 0) continue;

    try {
      const res = dialeto.analisar({ entrada: prefix, gramática });
      if (process.env.DEBUG_COMBINADOR) {
        try { console.error('COMBINADOR_DEBUG: prefix="' + prefix.replace(/\n/g, '\\n') + '", res=', JSON.stringify(res)); } catch (e) { console.error('COMBINADOR_DEBUG: <could not stringify>'); }
      }

      if (res && res.sucesso) {
        if (!res.valor || res.valor.length === 0) {
          return failureResult(entrada);
        }
        return {
          sucesso: true,
          valor: makeNumberNode(res.valor),
          resto: entrada.slice(n),
          menor_resto: entrada.slice(n)
        };
      }

      if (res && !res.sucesso && typeof res.valor === 'string' && res.valor.length > 0) {
        const accepted = res.valor;
        const resto_do_prefix = res.resto || '';
        const resto_total = resto_do_prefix + entrada.slice(n);
        debugLog('COMBINADOR_DEBUG: partial-res prefix="' + prefix.replace(/\n/g, '\\n') + '", accepted="' + accepted.replace(/\n/g, '\\n') + '", resto="' + resto_total.replace(/\n/g, '\\n') + '"');
        return successResult(accepted, resto_total);
      }

    } catch (e) {
      const cause = e && e.cause;
      if (cause && typeof cause.valor === 'string') {
        const accepted = cause.valor;
        if (!accepted || accepted.length === 0) {
          debugLog('COMBINADOR_DEBUG: prefix rejected (empty accepted)="' + prefix.replace(/\n/g, '\\n') + '"');
          continue;
        }
        const resto_do_prefix = (cause.resto || '');
        const resto_total = resto_do_prefix + entrada.slice(n);
        debugLog('COMBINADOR_DEBUG: partial accept prefix="' + prefix.replace(/\n/g, '\\n') + '", accepted="' + accepted.replace(/\n/g, '\\n') + '", resto="' + resto_total.replace(/\n/g, '\\n') + '"');
        return successResult(accepted, resto_total);
      }
      continue;
    }
  }

  return failureResult(entrada);
}