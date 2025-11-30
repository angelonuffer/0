import { tokenizeExpression } from "./tokens.ts";
import { stripComments } from "./comments.ts";
import { shuntingYard, evalRPN } from "./expr.ts";
import { throwSyntaxError } from "./errors.ts";

export function parse(
  input: string,
): string | { result: string; consumed: string } {
  const src = input.trim();

  if (src.length === 0) return { result: "", consumed: "" };

  if (src.startsWith("+")) {
    throwSyntaxError(src, 1, 1, "[0-9]", "");
  }

  if (src.startsWith('"')) {
    let i = 1;
    while (i < src.length) {
      const ch = src[i];
      if (ch === '"') {
        const inner = src.slice(1, i);
        const out = inner.replace(/\\"/g, '"').replace(/\\n/g, "\n").replace(/\\t/g, "\t");
        return { result: out, consumed: src.slice(0, i + 1) };
      }
      if (ch === "\\") i += 2;
      else i += 1;
    }
    throwSyntaxError(src, 1, src.length + 1, '"', src.replace(/\n+$/g, ''));
  }

  const cleaned = stripComments(src);
  const expr = cleaned.trim();

  if (/^[0-9+\-*/()\s]+$/.test(expr)) {
    const tokens = tokenizeExpression(expr);
    const offset = cleaned.indexOf(expr);
    for (let i = 0; i < tokens.length; i++) {
      const tk = tokens[i];
      if (tk.type === "op") {
        const prev = tokens[i - 1];
        if (!prev || prev.type === "op") {
          const posInExpr = (tk.pos ?? 0) + offset;
          const col = posInExpr + 1;
          throwSyntaxError(src, 1, col, "[0-9]", src.slice(0, col - 1));
        }
      }
    }
    const rpn = shuntingYard(tokens);
    if (rpn == null) {
      return { result: src, consumed: input } as { result: string; consumed: string };
    }
    const v = evalRPN(rpn);
    if (v == null) {
      return { result: src, consumed: input } as { result: string; consumed: string };
    }
    return { result: String(v), consumed: input } as { result: string; consumed: string };
  }

  return { result: src, consumed: input } as { result: string; consumed: string };
}

export default parse;
