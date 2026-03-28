export default function segmentar(s) {
  const src = String(s);
  const trimmed = src; // caller should trim

  function isLetter(ch) { return /[A-Za-z_]/.test(ch); }
  function isDigit(ch) { return /[0-9]/.test(ch); }
  function isIdentChar(ch) { return /[A-Za-z0-9_]/.test(ch); }

  function tokenize(s) {
    const tokens = [];
    let i = 0;
    const len = s.length;

    if (s.startsWith('./')) {
      let j = 2;
      while (j < len) {
        const ch = s[j];
        if (/[-_./A-Za-z0-9]/.test(ch)) j++; else break;
      }
      if (j === len) {
        tokens.push({ type: 'FILE', value: s });
        tokens.push({ type: 'EOF' });
        return tokens;
      }
    }

    while (i < len) {
      const ch = s[i];
      if (/\s/.test(ch)) { i++; continue; }
      if (ch === '@') { tokens.push({ type: 'AT' }); i++; continue; }
      if (ch === '+') { tokens.push({ type: 'PLUS' }); i++; continue; }
      if (ch === '(') { tokens.push({ type: 'LPAREN' }); i++; continue; }
      if (ch === ')') { tokens.push({ type: 'RPAREN' }); i++; continue; }
      if (ch === '[') {
        if (s[i+1] === '.' && s[i+2] === ']') { tokens.push({ type: 'SIZE' }); i += 3; continue; }
        tokens.push({ type: 'LBRACK' }); i++; continue;
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
        if (j >= len || s[j] !== '"') { tokens.push({ type: 'INVALID' }); return tokens; }
        tokens.push({ type: 'STRING', value: buf });
        i = j + 1; continue;
      }
      if ((ch === '+' || ch === '-') && isDigit(s[i+1])) {
        let j = i + 1; while (j < len && isDigit(s[j])) j++;
        tokens.push({ type: 'NUMBER', value: s.slice(i, j) }); i = j; continue;
      }
      if (isDigit(ch)) {
        let j = i; while (j < len && isDigit(s[j])) j++;
        tokens.push({ type: 'NUMBER', value: s.slice(i, j) }); i = j; continue;
      }
      if (isLetter(ch)) {
        let j = i + 1; while (j < len && isIdentChar(s[j])) j++;
        tokens.push({ type: 'IDENT', value: s.slice(i, j) }); i = j; continue;
      }
      tokens.push({ type: 'UNKNOWN', value: ch }); i++; continue;
    }
    tokens.push({ type: 'EOF' });
    return tokens;
  }

  return tokenize(trimmed);
}
