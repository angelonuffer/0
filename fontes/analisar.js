import segmentar from './segmentar.js';

export default function analisar(entrada = "") {
  const src = String(entrada);
  const trimmed = src.trim();
  const tokens = segmentar(trimmed);
  let pos = 0;
  function peek() { return tokens[pos] || { EOF: true }; }
  function consume(key) { const t = peek(); if (t && Object.prototype.hasOwnProperty.call(t, key)) { pos++; return t; } return null; }

  function parseInner() {
    const t = peek();
    if (t && t.número !== undefined) {
      const n = consume('número').número;
      if (peek().soma !== undefined) {
        consume('soma');
        const r = consume('número');
        if (r) return { soma: [ { número: n }, { número: r.número } ] };
        return { error: true };
      }
      return { número: n };
    }
    if (t && t.identificador !== undefined) {
      const id = consume('identificador').identificador;
      if (peek().tamanho !== undefined) { consume('tamanho'); return { tamanho: { símbolo: id } }; }
      return { símbolo: id };
    }
    if (t && t.texto !== undefined) { const s = consume('texto').texto; return { texto: s }; }
    if (t && t.abre_parênteses !== undefined) { return parsePrimary(); }
    if (t && t.carregamento !== undefined) { consume('carregamento'); const s = consume('texto'); if (s) return { carregamento: { texto: s.texto } }; return { error: true }; }
    if (t && t.endereço !== undefined) { consume('endereço'); return { endereço: t.endereço }; }
    return { error: true };
  }

  function parsePrimary() {
    const t = peek();
    if (t && t.carregamento !== undefined) {
      consume('carregamento');
      const s = consume('texto');
      if (!s) return { error: true };
      if (peek().EOF) return { carregamento: { texto: s.texto } };
      return { error: true };
    }
    if (t && t.endereço !== undefined) { consume('endereço'); if (peek().EOF) return { endereço: t.endereço }; return { error: true }; }
    if (t && t.texto !== undefined) { consume('texto'); if (peek().EOF) return { texto: t.texto }; return { error: true }; }
    if (t && t.número !== undefined) {
      const n = consume('número').número;
      if (peek().soma !== undefined) {
        consume('soma');
        const r = consume('número');
        if (r && peek().EOF) return { soma: [ { número: n }, { número: r.número } ] };
        return { error: true };
      }
      if (peek().EOF) return { número: n };
      return { error: true };
    }
    if (t && t.identificador !== undefined) {
      const id = consume('identificador').identificador;
      if (peek().tamanho !== undefined) { consume('tamanho'); if (peek().EOF) return { tamanho: { símbolo: id } }; return { error: true }; }
      if (peek().EOF) return { símbolo: id };
      return { error: true };
    }
    if (t && t.abre_parênteses !== undefined) {
      consume('abre_parênteses');
      const inner = parseInner();
      if (!inner || inner.error) return { error: true };
      if (!consume('fecha_parênteses')) return { error: true };
      if (peek().tamanho !== undefined) { consume('tamanho'); if (peek().EOF) return { tamanho: inner }; return { error: true }; }
      if (peek().EOF) return inner;
      return { error: true };
    }
    return { error: true };
  }

  const result = parsePrimary();
  if (result && !result.error) return result;
  return { erro: {} };
}
