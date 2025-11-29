function isObject(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null;
}

function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a === null || b === null) return a === b;
  if (Array.isArray(a) && Array.isArray(b)) {
    const aa = a as unknown[];
    const bb = b as unknown[];
    if (aa.length !== bb.length) return false;
    for (let i = 0; i < aa.length; i++) if (!deepEqual(aa[i], bb[i])) return false;
    return true;
  }
  if (isObject(a) && isObject(b)) {
    const ka = Object.keys(a).sort();
    const kb = Object.keys(b).sort();
    if (ka.length !== kb.length) return false;
    for (let i = 0; i < ka.length; i++) if (ka[i] !== kb[i]) return false;
    for (const k of ka) if (!deepEqual(a[k], b[k])) return false;
    return true;
  }
  // Fallback for primitives and mismatched types
  return false;
}

export default function iguais(a: unknown, b: unknown): void {
  if (!deepEqual(a, b)) {
    const msgA = tryStringify(a);
    const msgB = tryStringify(b);
    throw new Error(`Valores diferentes:\nA: ${msgA}\nB: ${msgB}`);
  }
}

function tryStringify(x: unknown): string {
  try {
    const s = JSON.stringify(x, null, 2);
    return s === undefined ? String(x) : s;
  } catch {
    return String(x);
  }
}
