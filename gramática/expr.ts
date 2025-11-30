import { Token } from "./tokens.ts";

export function shuntingYard(tokens: Token[]): (string | number)[] | null {
  const prec: Record<string, number> = { "+": 1, "-": 1, "*": 2, "/": 2 };
  const output: (string | number)[] = [];
  const ops: string[] = [];
  for (const tk of tokens) {
    if (tk.type === "number") output.push(Number(tk.value));
    else if (tk.type === "op") {
      while (
        ops.length > 0 &&
        ops[ops.length - 1] !== "(" &&
        (prec[ops[ops.length - 1]] ?? 0) >= (prec[tk.value] ?? 0)
      ) {
        output.push(ops.pop() as string);
      }
      ops.push(tk.value);
    } else if (tk.type === "paren") {
      if (tk.value === "(") ops.push("(");
      else {
        while (ops.length > 0 && ops[ops.length - 1] !== "(") {
          output.push(ops.pop() as string);
        }
        if (ops.length === 0) return null;
        ops.pop();
      }
    }
  }
  while (ops.length > 0) {
    const op = ops.pop() as string;
    if (op === "(" || op === ")") return null;
    output.push(op);
  }
  return output;
}

export function evalRPN(rpn: (string | number)[]): number | null {
  const st: number[] = [];
  for (const t of rpn) {
    if (typeof t === "number") st.push(t);
    else {
      const b = st.pop();
      const a = st.pop();
      if (a === undefined || b === undefined) return null;
      let r: number;
      if (t === "+") r = a + b;
      else if (t === "-") r = a - b;
      else if (t === "*") r = a * b;
      else r = Math.trunc(a / b);
      st.push(r);
    }
  }
  return st.length === 1 ? st[0] : null;
}
