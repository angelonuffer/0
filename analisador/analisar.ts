export type ParseResult =
  | { resultado: unknown; resto: string }
  | { esperava: unknown[]; resto: string };

function isObject(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null;
}

type Grammar =
  | string
  | RangeGrammar
  | SequenceGrammar
  | AlternativeGrammar
  | RepetitionGrammar
  | NegationGrammar;

function isSuccess(r: ParseResult): r is { resultado: unknown; resto: string } {
  return (r as { resultado?: unknown }).resultado !== undefined;
}

function isFailure(r: ParseResult): r is { esperava: unknown[]; resto: string } {
  return (r as { esperava?: unknown[] }).esperava !== undefined;
}

type RangeGrammar = { faixa: { de: string; até: string } };
type KeyedElement = { chave: string; gramática: unknown };
type SequenceGrammar = { sequência: (unknown | KeyedElement)[] };
type AlternativeGrammar = { alternativa: unknown[] };
type RepetitionGrammar = { repetição: unknown };
type NegationGrammar = { negação: unknown };
type LeftAssocGrammar = { esquerda: Record<string, unknown> };

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

function isLeftAssocGrammar(g: unknown): g is LeftAssocGrammar {
  return isObject(g) && "esquerda" in g && isObject((g as Record<string, unknown>)["esquerda"]);
}

function parseNegation(input: string, g: NegationGrammar): ParseResult {
  const inner = (g as Record<string, unknown>)["negação"] as unknown;
  if (input.length === 0) return { esperava: [inner], resto: input };
  // se a gramática interna casa aqui, a negação falha
  const r = analisar(input, inner);
  if (isSuccess(r)) return { esperava: [inner], resto: input };

  // se não casou, consumir um caractere e retornar sucesso
  const ch = input.charAt(0);
  return { resultado: ch, resto: input.slice(1) };
}

function parseRepetition(input: string, g: RepetitionGrammar): ParseResult {
  const item = (g as Record<string, unknown>)["repetição"] as unknown;
  let rest = input;
  let acc = "";
  while (true) {
    const r = analisar(rest, item);
    if (isFailure(r)) {
      // Se a sub-gramática falhou após consumir input, pode ser um erro mais
      // específico (por exemplo comentário não fechado). Propagar quando a
      // expectativa incluía o terminador explícito "*/".
      if (r.resto !== rest) {
        for (const e of r.esperava) {
          if (typeof e === "string" && e === "*/") return r;
        }
      }
      break;
    }
    const newRest = r.resto;
    // Prevent infinite loop if sub-grammar accepts empty string
    if (newRest === rest) break;
    acc += String(r.resultado);
    rest = newRest;
  }
  return { resultado: acc, resto: rest };
}

function parseRange(input: string, g: RangeGrammar): ParseResult {
  const faixa = g.faixa;
  if (!isObject(faixa) || typeof faixa.de !== "string" || typeof faixa.até !== "string") {
    throw new Error("Gramática 'faixa' inválida: esperado { de: string, até: string }");
  }
  if (input.length === 0) return { esperava: [g], resto: input };
  const primeiro = input.charAt(0);
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
        if (isSuccess(r)) {
          resultObj[chave] = r.resultado;
          rest = r.resto;
          continue;
        }
        return { esperava: r.esperava, resto: rest };
      } else {
        const r = analisar(rest, sub);
        if (isSuccess(r)) {
          rest = r.resto;
          continue;
        }
        return { esperava: r.esperava, resto: rest };
      }
    }

    return { resultado: resultObj, resto: rest };
  }

  // sequence without keys
  let rest = input;
  let acc = "";
  for (const sub of seq) {
    const r = analisar(rest, sub);
    if (isFailure(r)) return { esperava: r.esperava, resto: rest };
    acc += String(r.resultado);
    rest = r.resto;
  }
  return { resultado: acc, resto: rest };
}

function parseAlternative(input: string, g: AlternativeGrammar): ParseResult {
  const collected: unknown[] = [];
  let bestFailure: ParseResult | null = null;
  let bestConsumed = -1;

  for (const sub of g.alternativa) {
    const r = analisar(input, sub as unknown);
    if (isSuccess(r)) return r;
    if (isFailure(r)) {
      const ev = r.esperava;
      // compute how many chars were consumed by this attempt
      const consumed = input.length - r.resto.length;
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
  if (isLeftAssocGrammar(grammar)) return parseLeftAssoc(cleanInput, grammar as LeftAssocGrammar);

  throw new Error("Gramática não suportada pelo analisador");
}

function parseLeftAssoc(input: string, g: LeftAssocGrammar): ParseResult {
  const cfg = (g as Record<string, unknown>)["esquerda"] as Record<string, unknown>;
  const primeiro = cfg["primeiro"] as unknown;
  const operador = cfg["operador"] as unknown;
  const segundo = cfg["segundo"] as unknown;
  const espaço = cfg["espaço"] as unknown;
  const keys = (cfg["keys"] as Record<string, string> | undefined) ?? {};
  const leftKey = keys["left"] ?? "parcela_1";
  const opKey = keys["op"] ?? "operador";
  const rightKey = keys["right"] ?? "parcela_2";

  const rFirst = analisar(input, primeiro);
  if (isFailure(rFirst)) return rFirst;
  let rest = rFirst.resto;
  let left: unknown = rFirst.resultado;

  while (true) {
    const save = rest;
    // optional espaço before operator
    if (espaço !== undefined) {
      const rSpace = analisar(rest, espaço);
      if (isFailure(rSpace)) return rSpace;
      rest = rSpace.resto;
    }

    const rOp = analisar(rest, operador);
    if (isFailure(rOp)) {
      rest = save;
      break;
    }
    const afterOp = rOp.resto;

    if (espaço !== undefined) {
      const rSpace2 = analisar(afterOp, espaço);
      if (isFailure(rSpace2)) return rSpace2;
      rest = rSpace2.resto;
    } else {
      rest = afterOp;
    }

    const rRight = analisar(rest, segundo);
    if (isFailure(rRight)) {
      // don't consume operator if right fails
      rest = save;
      break;
    }

    // build left-assoc node
    const node: Record<string, unknown> = {};
    node[leftKey] = left;
    node[opKey] = rOp.resultado;
    node[rightKey] = rRight.resultado;

    left = node;
    rest = rRight.resto;
  }

  return { resultado: left, resto: rest };
}
