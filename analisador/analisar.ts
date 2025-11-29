export type ParseResult =
  | { resultado: unknown; resto: string }
  | { esperava: unknown[]; resto: string };

function isObject(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null;
}

function pularEspaçosEComentários(input: string): string {
  let i = 0;
  while (i < input.length) {
    const c = input[i];
    // Skip whitespace (space, tab, newline, carriage return)
    if (c === ' ' || c === '\t' || c === '\n' || c === '\r') {
      i++;
      continue;
    }
    // Skip single-line comment: // ... \n
    if (c === '/' && i + 1 < input.length && input[i + 1] === '/') {
      i += 2;
      while (i < input.length && input[i] !== '\n') {
        i++;
      }
      if (i < input.length && input[i] === '\n') {
        i++;
      }
      continue;
    }
    // Skip multi-line comment: /* ... */
    if (c === '/' && i + 1 < input.length && input[i + 1] === '*') {
      i += 2;
      while (i < input.length - 1 && !(input[i] === '*' && input[i + 1] === '/')) {
        i++;
      }
      if (i < input.length - 1) {
        i += 2; // skip */
      } else {
        // Unclosed comment, skip to end
        i = input.length;
      }
      continue;
    }
    // Not whitespace or comment, stop
    break;
  }
  return input.slice(i);
}

type RangeGrammar = { faixa: { de: string; até: string } };
type KeyedElement = { chave: string; gramática: unknown };
type SequenceGrammar = { sequência: (unknown | KeyedElement)[] };
type AlternativeGrammar = { alternativa: unknown[] };

function isRangeGrammar(g: unknown): g is RangeGrammar {
  return isObject(g) && "faixa" in g;
}

function isSequenceGrammar(g: unknown): g is SequenceGrammar {
  return isObject(g) && "sequência" in g && Array.isArray((g as Record<string, unknown>)["sequência"]);
}

function isAlternativeGrammar(g: unknown): g is AlternativeGrammar {
  return isObject(g) && "alternativa" in g && Array.isArray((g as Record<string, unknown>)["alternativa"]);
}

function parseRange(input: string, g: RangeGrammar): ParseResult {
  const faixa = g.faixa;
  if (!isObject(faixa) || typeof faixa.de !== "string" || typeof faixa.até !== "string") {
    throw new Error("Gramática 'faixa' inválida: esperado { de: string, até: string }");
  }
  const primeiro = input.charAt(0);
  if (!primeiro) return { esperava: [g], resto: input };
  const deCode = faixa.de.charCodeAt(0);
  const ateCode = faixa.até.charCodeAt(0);
  const c = primeiro.charCodeAt(0);
  if (c >= deCode && c <= ateCode) return { resultado: primeiro, resto: input.slice(1) };
  return { esperava: [g], resto: input };
}

function parseSequence(input: string, g: SequenceGrammar): ParseResult {
  const seq = g["sequência"] as unknown[];
  const hasChaves = seq.some((s) => isObject(s) && "chave" in (s as Record<string, unknown>));

  if (hasChaves) {
    let rest = input;
    const resultObj: Record<string, unknown> = {};

    for (const sub of seq) {
      if (isObject(sub) && "chave" in sub && "gramática" in sub) {
        const subRec = sub as Record<string, unknown>;
        const chave = String(subRec.chave);
        const gram = subRec.gramática as unknown;
        const r = analisar(rest, gram);
        if ((r as { resultado?: unknown }).resultado !== undefined) {
          resultObj[chave] = (r as { resultado: unknown }).resultado;
          rest = (r as { resto: string }).resto;
          continue;
        }
        return { esperava: (r as { esperava: unknown[] }).esperava, resto: rest };
      } else {
        const r = analisar(rest, sub);
        if ((r as { resultado?: unknown }).resultado !== undefined) {
          rest = (r as { resto: string }).resto;
          continue;
        }
        return { esperava: (r as { esperava: unknown[] }).esperava, resto: rest };
      }
    }

    return { resultado: resultObj, resto: rest };
  }

  // sequence without keys
  let rest = input;
  let acc = "";
  for (const sub of seq) {
    const r = analisar(rest, sub);
    if ((r as { resultado?: unknown }).resultado === undefined) {
      return { esperava: (r as { esperava: unknown[] }).esperava, resto: rest };
    }
    acc += String((r as { resultado: unknown }).resultado);
    rest = (r as { resto: string }).resto;
  }
  return { resultado: acc, resto: rest };
}

function parseAlternative(input: string, g: AlternativeGrammar): ParseResult {
  const collected: unknown[] = [];
  for (const sub of g.alternativa) {
    const r = analisar(input, sub as unknown);
    if ((r as { resultado?: unknown }).resultado !== undefined) return r;
    if ((r as { esperava?: unknown[] }).esperava !== undefined) {
      const ev = (r as { esperava: unknown[] }).esperava;
      const seen = new Set<string>();
      for (const c of collected) {
        try {
          seen.add(JSON.stringify(c));
        } catch {
          // ignore
        }
      }
      for (const e of ev) {
        try {
          const key = JSON.stringify(e);
          if (!seen.has(key)) {
            seen.add(key);
            collected.push(e);
          }
        } catch {
          if (!collected.includes(e)) collected.push(e);
        }
      }
    }
  }
  if (collected.length > 0) return { esperava: collected, resto: input };
  return { esperava: g.alternativa.slice(), resto: input };
}

export default function analisar(input: string, grammar: unknown): ParseResult {
  // Skip whitespace and comments before parsing
  const cleanInput = pularEspaçosEComentários(input);
  
  if (typeof grammar === "string") {
    if (cleanInput.startsWith(grammar)) return { resultado: grammar, resto: cleanInput.slice(grammar.length) };
    return { esperava: [grammar], resto: cleanInput };
  }

  if (isRangeGrammar(grammar)) return parseRange(cleanInput, grammar);
  if (isSequenceGrammar(grammar)) return parseSequence(cleanInput, grammar);
  if (isAlternativeGrammar(grammar)) return parseAlternative(cleanInput, grammar);

  throw new Error("Gramática não suportada pelo analisador");
}
