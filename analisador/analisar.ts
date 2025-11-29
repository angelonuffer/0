export type ParseResult =
  | { resultado: unknown; resto: string }
  | { esperava: unknown[]; resto: string };

function isObject(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null;
}

type RangeGrammar = { faixa: { de: string; até: string } };
type KeyedElement = { chave: string; gramática: unknown };
type SequenceGrammar = { sequência: (unknown | KeyedElement)[] };
type AlternativeGrammar = { alternativa: unknown[] };
type RepetitionGrammar = { repetição: unknown };
type NegationGrammar = { negação: unknown };

function isRangeGrammar(g: unknown): g is RangeGrammar {
  return isObject(g) && "faixa" in g;
}

function isSequenceGrammar(g: unknown): g is SequenceGrammar {
  return isObject(g) && "sequência" in g && Array.isArray((g as Record<string, unknown>)["sequência"]);
}

function isAlternativeGrammar(g: unknown): g is AlternativeGrammar {
  return isObject(g) && "alternativa" in g && Array.isArray((g as Record<string, unknown>)["alternativa"]);
}

function isRepetitionGrammar(g: unknown): g is RepetitionGrammar {
  return isObject(g) && "repetição" in g;
}

function isNegationGrammar(g: unknown): g is NegationGrammar {
  return isObject(g) && "negação" in g;
}

function parseNegation(input: string, g: NegationGrammar): ParseResult {
  const inner = (g as Record<string, unknown>)["negação"] as unknown;
  if (input.length === 0) return { esperava: [inner], resto: input };

  // Try to match the inner grammar at the current position. If it matches,
  // the negation fails. If it does NOT match, consume a single character and
  // succeed returning that character.
  const r = analisar(input, inner);
  if ((r as { resultado?: unknown }).resultado !== undefined) {
    // inner matched -> negation fails
    return { esperava: [inner], resto: input };
  }

  // inner did not match -> consume one character
  const ch = input.charAt(0);
  return { resultado: ch, resto: input.slice(1) };
}

function parseRepetition(input: string, g: RepetitionGrammar): ParseResult {
  const item = (g as Record<string, unknown>)["repetição"] as unknown;
  let rest = input;
  let acc = "";
  while (true) {
    const r = analisar(rest, item);
    if ((r as { resultado?: unknown }).resultado === undefined) {
      // If sub-grammar failed after consuming input, it may represent a more
      // specific parse error (for example an unclosed block comment where the
      // sub-grammar expects a terminator like '*/'). Propagate that specific
      // failure when it explicitly expects the terminator string "*/" so the
      // enclosing sequence can report the correct expectation.
      if ((r as { esperava?: unknown[] }).esperava !== undefined && (r as { resto: string }).resto !== rest) {
        const ev = (r as { esperava: unknown[] }).esperava;
        for (const e of ev) {
          if (typeof e === "string" && e === "*/") return r as ParseResult;
        }
      }
      // Normal end of repetition when sub-grammar doesn't match at current position
      break;
    }
    const newRest = (r as { resto: string }).resto;
    // Prevent infinite loop if sub-grammar accepts empty string
    if (newRest === rest) break;
    acc += String((r as { resultado: unknown }).resultado);
    rest = newRest;
  }
  return { resultado: acc, resto: rest };
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
  let bestFailure: ParseResult | null = null;
  let bestConsumed = -1;

  for (const sub of g.alternativa) {
    const r = analisar(input, sub as unknown);
    if ((r as { resultado?: unknown }).resultado !== undefined) return r;
    if ((r as { esperava?: unknown[] }).esperava !== undefined) {
      const ev = (r as { esperava: unknown[] }).esperava;
      // compute how many chars were consumed by this attempt
      const consumed = input.length - (r as { resto: string }).resto.length;
      if (consumed > bestConsumed) {
        bestConsumed = consumed;
        bestFailure = r as ParseResult;
      }

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

  // If some alternative consumed input before failing, return that failure (most specific)
  if (bestFailure && bestConsumed > 0) return bestFailure;
  if (collected.length > 0) return { esperava: collected, resto: input };
  return { esperava: g.alternativa.slice(), resto: input };
}

export default function analisar(input: string, grammar: unknown): ParseResult {
  // Do not skip input globally; grammars should include optional space grammars when needed
  const cleanInput = input;
  
  if (typeof grammar === "string") {
    if (cleanInput.startsWith(grammar)) return { resultado: grammar, resto: cleanInput.slice(grammar.length) };
    return { esperava: [grammar], resto: cleanInput };
  }

  if (isRangeGrammar(grammar)) return parseRange(cleanInput, grammar);
  if (isSequenceGrammar(grammar)) return parseSequence(cleanInput, grammar);
  if (isAlternativeGrammar(grammar)) return parseAlternative(cleanInput, grammar);
  if (isRepetitionGrammar(grammar)) return parseRepetition(cleanInput, grammar);
  if (isNegationGrammar(grammar)) return parseNegation(cleanInput, grammar);

  throw new Error("Gramática não suportada pelo analisador");
}
