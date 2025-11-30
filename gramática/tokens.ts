export type Token = { type: "number" | "op" | "paren"; value: string; pos?: number };

export function tokenizeExpression(src: string): Token[] {
  const re = /\d+|[+\-*/()]|\s+/g;
  const tokens: Token[] = [];
  for (const m of src.matchAll(re)) {
    const t = m[0];
    if (/^\s+$/.test(t)) continue;
    const pos = m.index ?? 0;
    if (/^\d+$/.test(t)) tokens.push({ type: "number", value: t, pos });
    else if (t === "(" || t === ")") tokens.push({ type: "paren", value: t, pos });
    else tokens.push({ type: "op", value: t, pos });
  }
  return tokens;
}
