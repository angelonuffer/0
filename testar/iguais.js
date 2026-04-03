function iguais(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return a === b;
  if (Number.isNaN(a) && Number.isNaN(b)) return true;
  if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime();
  if (a instanceof RegExp && b instanceof RegExp) return a.toString() === b.toString();
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) if (!iguais(a[i], b[i])) return false;
    return true;
  }
  if (typeof a === 'object' && typeof b === 'object') {
    const ka = Object.keys(a);
    const kb = Object.keys(b);
    if (ka.length !== kb.length) return false;
    ka.sort();
    kb.sort();
    for (let i = 0; i < ka.length; i++) if (ka[i] !== kb[i]) return false;
    for (const k of ka) if (!iguais(a[k], b[k])) return false;
    return true;
  }
  return false;
}

export default iguais;
