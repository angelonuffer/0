import segmentar from './segmentar.js';

export default function analisar(entrada = "") {
  const src = String(entrada);
  const trimmed = src.trim();
  if (trimmed === "") return { vazio: 1 };

  const tokens = segmentar(trimmed);
  let pos = 0;
  function peek() { return tokens[pos] || { type: 'EOF' }; }
  function consume(type) { const t = peek(); if (t.type === type) { pos++; return t; } return null; }

  function parseInner() {
    const t = peek();
    if (t.type === 'NUMBER') {
      const n = consume('NUMBER').value;
      if (peek().type === 'PLUS') {
        consume('PLUS');
        const r = consume('NUMBER');
        if (r) return { soma: [ { número: n }, { número: r.value } ] };
        return { error: true };
      }
      return { número: n };
    }
    if (t.type === 'IDENT') {
      const id = consume('IDENT').value;
      if (peek().type === 'SIZE') { consume('SIZE'); return { tamanho: { símbolo: id } }; }
      return { símbolo: id };
    }
    if (t.type === 'STRING') { const s = consume('STRING').value; return { texto: s }; }
    if (t.type === 'LPAREN') { return parsePrimary(); }
    if (t.type === 'AT') { consume('AT'); const s = consume('STRING'); if (s) return { inclusão: { texto: s.value } }; return { error: true }; }
    if (t.type === 'FILE') { consume('FILE'); return { arquivo: t.value }; }
    return { error: true };
  }

  function parsePrimary() {
    const t = peek();
    if (t.type === 'AT') {
      consume('AT');
      const s = consume('STRING');
      if (!s) return { error: true };
      if (peek().type === 'EOF') return { inclusão: { texto: s.value } };
      return { error: true };
    }
    if (t.type === 'FILE') { consume('FILE'); if (peek().type === 'EOF') return { arquivo: t.value }; return { error: true }; }
    if (t.type === 'STRING') { consume('STRING'); if (peek().type === 'EOF') return { texto: t.value }; return { error: true }; }
    if (t.type === 'NUMBER') {
      const n = consume('NUMBER').value;
      if (peek().type === 'PLUS') {
        consume('PLUS');
        const r = consume('NUMBER');
        if (r && peek().type === 'EOF') return { soma: [ { número: n }, { número: r.value } ] };
        return { error: true };
      }
      if (peek().type === 'EOF') return { número: n };
      return { error: true };
    }
    if (t.type === 'IDENT') {
      const id = consume('IDENT').value;
      if (peek().type === 'SIZE') { consume('SIZE'); if (peek().type === 'EOF') return { tamanho: { símbolo: id } }; return { error: true }; }
      if (peek().type === 'EOF') return { símbolo: id };
      return { error: true };
    }
    if (t.type === 'LPAREN') {
      consume('LPAREN');
      const inner = parseInner();
      if (!inner || inner.error) return { error: true };
      if (!consume('RPAREN')) return { error: true };
      if (peek().type === 'SIZE') { consume('SIZE'); if (peek().type === 'EOF') return { tamanho: inner }; return { error: true }; }
      if (peek().type === 'EOF') return inner;
      return { error: true };
    }
    return { error: true };
  }

  const result = parsePrimary();
  if (result && !result.error) return result;
  return { erro: {} };
}
