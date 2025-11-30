import { throwSyntaxError } from "./errors.ts";

export function stripComments(src: string): string {
  let out = "";
  let i = 0;
  const len = src.length;
  let inString = false;
  let escaped = false;
  while (i < len) {
    const ch = src[i];
    const next = src[i + 1];

    if (inString) {
      out += ch;
      if (escaped) {
        escaped = false;
      } else if (ch === "\\") {
        escaped = true;
      } else if (ch === '"') {
        inString = false;
      }
      i += 1;
      continue;
    }

    if (ch === '"') {
      inString = true;
      out += ch;
      i += 1;
      continue;
    }

    if (ch === "/" && next === "/") {
      i += 2;
      while (i < len && src[i] !== "\n") {
        i += 1;
      }
      if (i < len && src[i] === "\n") {
        out += "\n";
        i += 1;
      }
      continue;
    }

    if (ch === "/" && next === "*") {
      const startIdx = i;
      i += 2;
      let closed = false;
      while (i < len) {
        if (src[i] === "*" && src[i + 1] === "/") {
          i += 2;
          closed = true;
          break;
        }
        if (src[i] === "\n") out += "\n";
        else out += " ";
        i += 1;
      }
      if (!closed) {
        const before = src.slice(0, startIdx);
        const lineNum = before.split("\n").length;
        const lastNewline = before.lastIndexOf("\n");
        const col = startIdx - lastNewline;
        throwSyntaxError(src, lineNum, col, '*/', src.replace(/\n+$/g, ''));
      }
      continue;
    }

    out += ch;
    i += 1;
  }

  return out;
}
