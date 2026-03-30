export default function segmentar(s) {
  const src = String(s);
  const len = src.length;

  // Fast-path: a standalone ./path that contains only allowed chars
  if (src.startsWith('./') && /^\.\/[-_./A-Za-z0-9]+$/.test(src)) {
    return [{ endereço: src }];
  }

  const out = [];
  let i = 0;

  while (i < len) {
    const ch = src[i];
    if (/\s/.test(ch)) { i++; continue; }

    if (ch === '@') { out.push({ carregamento: '@' }); i++; continue; }
    if (ch === '+') { out.push({ soma: '+' }); i++; continue; }
    if (ch === '(') { out.push({ abre_parênteses: '(' }); i++; continue; }
    if (ch === ')') { out.push({ fecha_parênteses: ')' }); i++; continue; }

    if (ch === '[') {
      if (src.slice(i, i + 3) === '[.]') { out.push({ tamanho: '[.]' }); i += 3; continue; }
      return [{ erro: {} }];
    }

    if (ch === '"') {
      let j = i + 1;
      let buf = '';
      while (j < len) {
        const c = src[j];
        if (c === '\\' && j + 1 < len) { buf += src[j + 1]; j += 2; continue; }
        if (c === '"') break;
        buf += c; j++;
      }
      if (j >= len || src[j] !== '"') return [{ erro: {} }];
      out.push({ texto: buf });
      i = j + 1; continue;
    }

    // Numbers (allow optional leading + or -)
    if ((ch === '-' || ch === '+') && /[0-9]/.test(src[i + 1])) {
      let j = i + 1; while (j < len && /[0-9]/.test(src[j])) j++;
      out.push({ número: src.slice(i, j) }); i = j; continue;
    }
    if (/[0-9]/.test(ch)) {
      let j = i; while (j < len && /[0-9]/.test(src[j])) j++;
      out.push({ número: src.slice(i, j) }); i = j; continue;
    }

    // Identifiers: letters or underscore, followed by letters/digits/underscore
    if (/[A-Za-z_]/.test(ch)) {
      let j = i + 1; while (j < len && /[A-Za-z0-9_]/.test(src[j])) j++;
      out.push({ identificador: src.slice(i, j) }); i = j; continue;
    }

    return [{ erro: {} }];
  }

  return out;
}
