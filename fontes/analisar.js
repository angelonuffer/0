import segmentar from './segmentar.js';

export default function analisar(entrada = '') {
  const src = String(entrada);
  const tokens = segmentar(src.trim());
  let pos = 0;
  const peek = () => tokens[pos] || { EOF: true };
  const expect = (key) => {
    const t = peek();
    if (t && Object.prototype.hasOwnProperty.call(t, key)) { pos++; return t; }
    return null;
  };

  function parseInner() {
    // Parse a single atomic expression (no top-level EOF requirement)
    const t = peek();
    if (!t || t.EOF) return { error: true };

    if (t.número !== undefined) {
      const n = expect('número').número;
      if (peek().soma !== undefined) {
        expect('soma');
        const r = expect('número');
        if (!r) return { error: true };
        return { soma: [ { número: n }, { número: r.número } ] };
      }
      return { número: n };
    }

    if (t.identificador !== undefined) {
      const id = expect('identificador').identificador;
      if (peek().tamanho !== undefined) { expect('tamanho'); return { tamanho: { símbolo: id } }; }
      return { símbolo: id };
    }

    if (t.texto !== undefined) { const s = expect('texto').texto; return { texto: s }; }

    if (t.carregamento !== undefined) { expect('carregamento'); const s = expect('texto'); if (!s) return { error: true }; return { carregamento: { texto: s.texto } }; }

    if (t.endereço !== undefined) { const a = expect('endereço'); return { endereço: a.endereço }; }

    if (t.abre_parênteses !== undefined) {
      // parenthesized expression: parse inner expression (no EOF) and allow optional tamanho
      expect('abre_parênteses');
      const inner = parseInner();
      if (!inner || inner.error) return { error: true };
      if (!expect('fecha_parênteses')) return { error: true };
      if (peek().tamanho !== undefined) { expect('tamanho'); return { tamanho: inner }; }
      return inner;
    }

    return { error: true };
  }

  // top-level parse requires that the parsed node consumes all tokens
  const out = parseInner();
  if (out && !out.error && peek().EOF) return out;
  return { erro: {} };
}
