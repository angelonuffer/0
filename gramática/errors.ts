export function makeError(message: string, consumed?: string) {
  const e = new Error(message) as Error & { consumed?: string };
  e.consumed = consumed;
  return e;
}

export function formatLineDiagnostic(src: string, line: number, col: number, expected: string) {
  const lines = src.split("\n");
  const ctx = lines[line - 1] ?? "";
  const left = `${line}:${col}: `;
  const caretPadding = " ".repeat(left.length + col - 1);
  return `${left}${ctx}\n${caretPadding}^\n${caretPadding}${expected}\n`;
}

export function throwSyntaxError(
  src: string,
  line: number,
  col: number,
  expected: string,
  consumed?: string,
): never {
  const msg = formatLineDiagnostic(src, line, col, expected);
  const e = makeError(msg, consumed ?? src.slice(0, col - 1));
  throw e;
}
