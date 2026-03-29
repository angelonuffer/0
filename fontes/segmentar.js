export default function segmentar(s) {
  const src = String(s);
  const trimmed = src; // caller should trim

  function isLetter(ch) { return /[A-Za-z_]/.test(ch); }
  function isDigit(ch) { return /[0-9]/.test(ch); }
  function isIdentChar(ch) { return /[A-Za-z0-9_]/.test(ch); }

  

  function tokenize(s) {
    const out = [];
    let i = 0;
    const len = s.length;

      if (s.startsWith('./')) {
      let j = 2;
      while (j < len) {
        const ch = s[j];
        if (/[-_./A-Za-z0-9]/.test(ch)) j++; else break;
      }
      if (j === len) {
        return [ { endereço: s } ];
      }
    }

    while (i < len) {
      const ch = s[i];
      if (/\s/.test(ch)) { i++; continue; }
      if (ch === '@') { out.push({ carregamento: '@' }); i++; continue; }
      if (ch === '+') { out.push({ soma: '+' }); i++; continue; }
      if (ch === '(') { out.push({ abre_parênteses: '(' }); i++; continue; }
      if (ch === ')') { out.push({ fecha_parênteses: ')' }); i++; continue; }
      if (ch === '[') {
        if (s[i+1] === '.' && s[i+2] === ']') { out.push({ tamanho: '[.]' }); i += 3; continue; }
        // unexpected bracket form -> error
        return [ { erro: {} } ];
      }
      if (ch === '"') {
        let j = i + 1;
        let buf = '';
        while (j < len) {
          const c = s[j];
          if (c === '\\' && j + 1 < len) { buf += s[j+1]; j += 2; continue; }
          if (c === '"') break;
          buf += c; j++;
        }
        if (j >= len || s[j] !== '"') { return [ { erro: {} } ]; }
        out.push({ texto: buf });
        i = j + 1; continue;
      }
      if ((ch === '+' || ch === '-') && isDigit(s[i+1])) {
        let j = i + 1; while (j < len && isDigit(s[j])) j++;
        out.push({ número: s.slice(i, j) }); i = j; continue;
      }
      if (isDigit(ch)) {
        let j = i; while (j < len && isDigit(s[j])) j++;
        out.push({ número: s.slice(i, j) }); i = j; continue;
      }
      if (isLetter(ch)) {
        let j = i + 1; while (j < len && isIdentChar(s[j])) j++;
        out.push({ identificador: s.slice(i, j) }); i = j; continue;
      }
      // any other unknown character is treated as an error
      return [ { erro: {} } ];
    }
    return out;
  }

  return tokenize(trimmed);
}
