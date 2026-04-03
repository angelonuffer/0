import fs from "fs";
function segmentar(s) {
  const src = String(s);
  const len = src.length;

  // (removed standalone ./path fast-path — handle via normal tokenization)

  const out = [];
  let i = 0;

  while (i < len) {
    const ch = src[i];
    if (/\s/.test(ch)) { i++; continue; }

    // comments: // to end-of-line, or /* ... */
    if (ch === '/' && src[i+1] === '/') {
      i += 2;
      while (i < len && src[i] !== '\n') i++;
      continue;
    }
    if (ch === '/' && src[i+1] === '*') {
      i += 2;
      while (i < len && !(src[i] === '*' && src[i+1] === '/')) i++;
      if (i < len) i += 2; // skip closing */
      continue;
    }

    if (ch === '@') { out.push({ carregamento: '@' }); i++; continue; }
    if (ch === '+') { out.push({ soma: '+' }); i++; continue; }
    if (ch === '(') { out.push({ abre_parênteses: '(' }); i++; continue; }
    if (ch === ')') { out.push({ fecha_parênteses: ')' }); i++; continue; }

    // endereco literal starting with ./ inside expressions
    if (ch === '.' && src[i+1] === '/') {
      let j = i + 2;
      while (j < len && /[-_./A-Za-z0-9]/.test(src[j])) j++;
      out.push({ endereço: src.slice(i, j) });
      i = j;
      continue;
    }

    if (ch === '[') {
      if (src.slice(i, i + 3) === '[.]') { out.push({ tamanho: '[.]' }); i += 3; continue; }
      return [{ erro: {} }];
    }

    if (ch === '"') {
      let j = i + 1;
      let buf = '';
      while (j < len) {
        const c = src[j];
        if (c === '\\' && j + 1 < len) { buf += src[j + 1]; j += 2; continue; }
        if (c === '"') break;
        buf += c; j++;
      }
      if (j >= len || src[j] !== '"') return [{ erro: {} }];
      out.push({ texto: buf });
      i = j + 1; continue;
    }

    // Numbers (allow optional leading + or -)
    if ((ch === '-' || ch === '+') && /[0-9]/.test(src[i + 1])) {
      let j = i + 1; while (j < len && /[0-9]/.test(src[j])) j++;
      out.push({ número: src.slice(i, j) }); i = j; continue;
    }
    if (/[0-9]/.test(ch)) {
      let j = i; while (j < len && /[0-9]/.test(src[j])) j++;
      out.push({ número: src.slice(i, j) }); i = j; continue;
    }

    // Identifiers: accept Unicode letters (including accents) or underscore,
    // followed by letters/digits/underscore. Use the Unicode flag to match
    // characters like 'ã', 'ç' and other non-ASCII letters.
    if (/[\p{L}_]/u.test(ch)) {
      let j = i + 1; while (j < len && /[\p{L}0-9_]/u.test(src[j])) j++;
      out.push({ identificador: src.slice(i, j) }); i = j; continue;
    }

    return [{ erro: {} }];
  }

  return out;
}

function analisar(entrada = '') {
  const src = String(entrada);
  const tokens = segmentar(src.trim());
  let pos = 0;
  const peek = () => tokens[pos] || { EOF: true };
  const expect = (key) => {
    const t = peek();
    if (t && Object.prototype.hasOwnProperty.call(t, key)) { pos++; return t; }
    return null;
  };

  function parseInner() {
    // Parse a single atomic expression (no top-level EOF requirement)
    const t = peek();
    if (!t || t.EOF) return { error: true };

    if (t.número !== undefined) {
      const n = expect('número').número;
      if (peek().soma !== undefined) {
        expect('soma');
        const r = expect('número');
        if (!r) return { error: true };
        return { soma: [ { número: n }, { número: r.número } ] };
      }
      return { número: n };
    }

    if (t.identificador !== undefined) {
      const id = expect('identificador').identificador;
      if (peek().tamanho !== undefined) { expect('tamanho'); return { tamanho: { símbolo: id } }; }
      return { símbolo: id };
    }

    if (t.texto !== undefined) { const s = expect('texto').texto; return { texto: s }; }

    if (t.carregamento !== undefined) { expect('carregamento'); const s = expect('texto'); if (!s) return { error: true }; return { carregamento: { texto: s.texto } }; }

    if (t.endereço !== undefined) { const a = expect('endereço'); return { endereço: a.endereço }; }

    if (t.abre_parênteses !== undefined) {
      // parenthesized expression: parse inner expression (no EOF) and allow optional tamanho
      expect('abre_parênteses');
      const inner = parseInner();
      if (!inner || inner.error) return { error: true };
      if (!expect('fecha_parênteses')) return { error: true };
      if (peek().tamanho !== undefined) { expect('tamanho'); return { tamanho: inner }; }
      return inner;
    }

    return { error: true };
  }

  // top-level parse requires that the parsed node consumes all tokens
  const out = parseInner();
  if (out && !out.error && peek().EOF) return out;
  return { erro: {} };
}

// Cache compiled dynamic evaluators to avoid rebuilding identical functions
const __evalCache = new Map();
// Reused regexes to avoid recompiling frequently-used patterns
const RE_SPLIT_STMTS = /\n|;/;
const RE_ASSIGN_LOCAL = /^([A-Za-z_]\w*)\s*=/;
const RE_TRAILING_COMMA = /,$/;
// Helper to read and trim file contents
  const readTrim = p => fs.readFileSync(String(p), 'utf-8').trim();

async function avaliar(arg, maybeEscopo) {
  // normalizar argumento: aceitar string, { conteúdo, endereço } ou { entrada, arquivo, escopo }
  let entrada, arquivo = "<entrada>", escopo = {};
  const calledWithWrapper = !!(arg && typeof arg === 'object' && !Array.isArray(arg) && (
    'entrada' in arg || 'arquivo' in arg || 'escopo' in arg
  ));

  const ok = v => calledWithWrapper ? { saída: v, erro: "" } : { saída: v };

  // Helper to read a file and return the standardized response shape.
  // Options:
  //  - asLength: return the content length as string
  //  - specialCarregamento: preserve the historical parsed.carregamento
  //    success shape for non-wrapper callers ({ saída, erro: {} })
  const readFileResp = (path, { asLength = false, specialCarregamento = false } = {}) => {
    try {
      const content = readTrim(path);
      const out = asLength ? String(content.length) : content;
      if (specialCarregamento && !calledWithWrapper) return { saída: out, erro: {} };
      return ok(out);
    } catch (e) {
      if (calledWithWrapper) return { saída: "", erro: errLocationString() };
      return { saída: "", erro: errObject() };
    }
  };

  if (calledWithWrapper) {
    entrada = arg.entrada !== undefined ? arg.entrada : (arg.conteúdo !== undefined ? arg.conteúdo : '');
    arquivo = arg.arquivo !== undefined ? arg.arquivo : (arg.endereço !== undefined ? arg.endereço : arquivo);
    escopo = arg.escopo !== undefined ? arg.escopo : escopo;
  } else if (arg && typeof arg === 'object' && !Array.isArray(arg)) {
    // objeto passado diretamente como entrada, e.g. { conteúdo, endereço }
    if ('conteúdo' in arg || 'endereço' in arg) {
      entrada = arg['conteúdo'] !== undefined ? arg['conteúdo'] : '';
      arquivo = arg['endereço'] !== undefined ? arg['endereço'] : arquivo;
    } else {
      entrada = String(arg);
    }
  } else {
    entrada = arg === undefined ? '' : String(arg);
  }

  // suportar assinatura `(entrada, escopo)` usada pelos testes unitários
  if (maybeEscopo && typeof maybeEscopo === 'object') escopo = maybeEscopo;

  // Avoid expensive work for empty input and handle top-level `%` early.
  const entradaTrim = String(entrada).trim();
  if (entradaTrim === "") return { saída: "" };
  // DEBUG: inspect incoming trimmed entrada for fast-path matching

  // Fast-paths for simple file includes and related forms to avoid full parsing
  try {
    // debug
      // console.error('FASTPATH entradaTrim:', JSON.stringify(entradaTrim));
    // @ "./path"
    let m = entradaTrim.match(/^@\s*"([^"]+)"$/);
    if (m) {
      // console.error('FASTPATH match @"path" ->', m[1]);
      const content = readTrim(m[1]);
      return ok(content);
    }
    // direct path like ./file
    m = entradaTrim.match(/^(\.\/[-_\.\/A-Za-z0-9]+)$/);
    if (m) {
      // console.error('FASTPATH match ./file ->', m[1]);
      const content = readTrim(m[1]);
      return ok(content);
    }
    // parenthesized include with [.] length: (@ "./file")[.]
    m = entradaTrim.match(/^\(\s*@\s*"([^"]+)"\s*\)\s*\[\.\]$/);
    if (m) {
      // console.error('FASTPATH match ("path")[.] ->', m[1]);
      const content = readTrim(m[1]);
      return ok(String(content.length));
    }
    // assignment followed by include by variable name:
    // caminho = "./foo"
    // @ caminho
    const lines = entradaTrim.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if (lines.length === 2) {
      const assign = lines[0].match(/^([A-Za-z_]\w*)\s*=\s*"([^"]+)"$/);
      const includeLine = lines[1].match(/^@\s*([A-Za-z_]\w*)$/);
      // fast-path assignment check (debugging removed)
      if (assign && includeLine && assign[1] === includeLine[1]) {
        // console.error('FASTPATH match var assign + @var ->', assign[2]);
        let pathToReadA = assign[2];
        const content = readTrim(pathToReadA);
        return ok(content);
      }
    }
  } catch (e) {
    // fall through to normal parsing
  }
  // Segmenter-based quick checks (cover tokens that the segmenter understands)
  try {
    const toks = segmentar(entradaTrim);
    if (Array.isArray(toks)) {
      if (toks.length === 2 && toks[0].carregamento !== undefined && toks[1].texto !== undefined) {
        // attempt read (fast-path)
        const pathToRead = toks[1].texto;
        const content = readTrim(pathToRead);
        return ok(content);
      }
      if (toks.length === 1 && toks[0].endereço !== undefined) {
        // attempt read endereço (fast-path)
        const pathToRead2 = toks[0].endereço;
        const content = readTrim(pathToRead2);
        return ok(content);
      }
      if (toks.length === 5 && toks[0].abre_parênteses !== undefined && toks[1].carregamento !== undefined && toks[2].texto !== undefined && toks[3].fecha_parênteses !== undefined && toks[4].tamanho === '[.]') {
        // attempt read parenthesized include (fast-path)
        const pathToRead3 = toks[2].texto;
        const content = readTrim(pathToRead3);
        return ok(String(content.length));
      }
    }
  } catch (e) {
    // ignore
  }


  const parsed = analisar(entrada, arquivo);

  if (parsed.texto) return { saída: parsed.texto };

  const errLocationString = () => `${arquivo}\n1:1\n${entrada}\n^\n`;
  const errObject = () => {
    const e = { linha: 1, coluna: 1, conteúdo: entrada };
    if (arquivo && arquivo !== '<entrada>') e.endereço = arquivo;
    return e;
  };

  if (parsed.carregamento) {
    return readFileResp(parsed.carregamento.texto, { specialCarregamento: true });
  }

  if (parsed.endereço) {
    return readFileResp(parsed.endereço);
  }

  if (parsed.tamanho) {
    const inner = parsed.tamanho;
    // arquivo/carregamento -> tamanho do conteúdo do arquivo
    if (inner.carregamento) return readFileResp(inner.carregamento.texto, { asLength: true });
    if (inner.endereço) return readFileResp(inner.endereço, { asLength: true });
    if (inner.texto) {
      return ok(String(inner.texto.length));
    }
    if (inner.símbolo) {
      const name = inner.símbolo;
      if (escopo && Object.prototype.hasOwnProperty.call(escopo, name)) {
        const v = escopo[name];
        if (Array.isArray(v)) return { saída: String(v.length) };
        if (typeof v === 'string') return { saída: String(v.length) };
        if (v && typeof v === 'object') return { saída: String(Object.keys(v).length) };
        return { saída: "" };
      }
      if (calledWithWrapper) return { saída: "", erro: errLocationString() };
      return { erro: errObject() };
    }
  }

  if (parsed.soma) {
    try {
      const sum = parsed.soma.reduce((acc, item) => acc + Number(item.número), 0);
      return ok(String(sum));
    } catch (e) {
      if (calledWithWrapper) return { saída: "", erro: errLocationString() };
      return { saída: "", erro: errObject() };
    }
  }

  if (parsed.número) return { saída: parsed.número };

  if (parsed.símbolo) {
    const name = parsed.símbolo;
    if (escopo && Object.prototype.hasOwnProperty.call(escopo, name)) {
      return ok(String(escopo[name]));
    }
    if (calledWithWrapper) return { saída: "", erro: errLocationString() };
    return { erro: errObject() };
  }

  if (parsed.erro) {
    try {
      let normalized = String(entrada).replace(/!\s+/g, "!").replace(/\s+\)/g, ")").replace(/\(\s+/g, "(");
      // Strip line and block comments before dynamic evaluation
      normalized = normalized.replace(/\/\/.*$/gm, '');
      normalized = normalized.replace(/\/\*[\s\S]*?\*\//g, '');

      const include = (p) => {
        try {
          return readTrim(p);
        } catch (e) {
          return "";
        }
      };

      let withIncludes = normalized.replace(/@\s*"([^\"]+)"/g, (m, p) => `include("${p}")`);
      withIncludes = withIncludes.replace(/@\s*([A-Za-z_]\w*)/g, (m, id) => `include(${id})`);
      // Inline path literals like ./foo/bar -> include("./foo/bar")
      withIncludes = withIncludes.replace(/(\.\/[-_\.\/A-Za-z0-9]+)/g, (m, p) => `include("${p}")`);

      const wrapAtDot = s => `__ATDOT__(${s})`;
      withIncludes = withIncludes.replace(/(\([^)]*\)|\[[^\]]*\]|"[^\"]*"|'[^']*'|[A-Za-z_]\w*|\d+)\s*\[\.\]/g, (m, expr) => wrapAtDot(expr));
      // Support bracket-star: expr[*] -> Object.keys(expr)
      withIncludes = withIncludes.replace(/(\([^)]*\)|\[[^\]]*\]|"[^\"]*"|'[^']*'|[A-Za-z_]\w*|\d+)\s*\[\*\]/g, (m, expr) => `Object.keys(${expr})`);

      const __ATDOT__ = (x) => {
        if (Array.isArray(x)) return x.length;
        if (typeof x === 'string') return x.length;
        return undefined;
      };

      let expr = withIncludes.trim();
      // Provide logical-and/or semantics used by the language: '&' returns
      // right if left truthy else 0; '|' returns left if left truthy else right.
      // Replace tokens with unique identifiers that will be provided to the
      // dynamic function as helpers (__AND__, __OR__). This avoids complex
      // parsing here.
      // Map language logical operators to JS '&&' and '||' which return
      // one of the operands (matching the language semantics expected
      // by the tests: e.g. `1 & 2` -> 2, `0 & 1` -> 0).
      expr = expr.replace(/\s*&\s*/g, ' && ');
      expr = expr.replace(/\s*\|\s*/g, ' || ');
      // Transform common list/string operations into JS equivalents so the
      // dynamic evaluator produces the intended semantics instead of NaN.
      // Examples handled:
      //   lista * ","   -> (lista).join(",")
      //   [1,2] * ","     -> ([1,2]).join(",")
      //   "a-b" / "-"  -> ("a-b").split("-")
      expr = expr.replace(/(\[[^\]]*\]|[A-Za-z_]\w*|\([^)]*\))\s*\*\s*("[^"]*"|'[^']*')/g, '($1).join($2)');
      expr = expr.replace(/("[^"]*"|'[^']*'|\[[^\]]*\]|[A-Za-z_]\w*|\([^)]*\))\s*\/\s*("[^"]*"|'[^']*')/g, '($1).split($2)');
      if (expr.startsWith('(') && expr.endsWith(')')) expr = expr.slice(1, -1);
      // Convert newline-separated array/object entries into comma-separated
      // lists so they become valid JS (the source language allows line
      // separated items inside [ ] and { }). Use non-greedy matches to
      // reduce risk with nested structures.
      expr = expr.replace(/\[([^\]]*?)\]/gs, (m, inner) => {
        if (inner.indexOf('\n') === -1) return m;
        return '[' + inner.split(/\n/).map(l => l.trim().replace(/,$/, '')).filter(Boolean).join(', ') + ']';
      });
      expr = expr.replace(/\{([^\}]*?)\}/gs, (m, inner) => {
        // If block contains newlines, join entries with commas (multiline object
        // literal). For single-line objects that omit commas (e.g. `a: 1 b: 2`)
        // insert commas between a value and the next key so the expression
        // becomes a valid JS object literal.
        if (inner.indexOf('\n') !== -1) {
          return '{' + inner.split(/\n/).map(l => l.trim().replace(/,$/, '')).filter(Boolean).join(', ') + '}';
        }
        // single-line: insert commas between a trailing value and the next key
        const fixed = inner.replace(/([\]"'\)\w\d])\s+([A-Za-z_]\w*\s*:)/g, '$1, $2');
        return '{' + fixed + '}';
      });
      // Wrap destructuring parameter objects used directly before =>
      expr = expr.replace(/\{\s*([^\}]*?)\s*\}\s*=>/gs, (m, inner) => {
        const parts = inner.split(/[\s,]+/).map(s => s.trim()).filter(Boolean);
        return `({${parts.join(', ')}}) =>`;
      });
      // Transform guard-style branches after arrow functions early so the
      // subsequent direct-eval attempt can succeed on guard syntax.
      expr = expr.replace(/=>\s*((?:\s*\|[^\n]+\n?)+)/g, (m, guards) => {
        // Split on '|' tokens so single-line and multi-line guards are handled
        // uniformly. Trim and ignore empty tokens.
        const tokens = guards.split('|').map(t => t.trim()).filter(Boolean);
        const clauses = [];
        let fallback = null;
        for (let tk of tokens) {
          if (tk.includes('=')) {
            const parts = tk.split('=').map(s => s.trim());
            clauses.push({ cond: parts[0], res: parts[1] });
          } else {
            fallback = tk;
          }
        }
        if (clauses.length === 0) return m;
        let out = '';
        for (let i = 0; i < clauses.length; i++) {
          out += `(${clauses[i].cond}) ? (${clauses[i].res}) : `;
        }
        out += fallback !== null ? `(${fallback})` : 'undefined';
        return '=> (' + out + ');';
      });
      // Insert semicolons between adjacent expressions that are separated
      // only by whitespace (e.g. `"str" id` -> `"str"; id`) so the
      // later splitting into statements works correctly.
      expr = expr.replace(/(["'\)\]\d])\s+([A-Za-z_\(\[\u00C0-\u017F])/g, '$1; $2');
      // Convert parenthesized multiline blocks into IIFEs so statements
      // inside parentheses become valid JS (they create a local scope and
      // return the last expression). Process innermost parentheses first.
      // Replace innermost parentheses that contain semicolons (i.e. multiple
      // statements) with IIFEs. Use a stack-based scan so nested parentheses
      // with inner parentheses are handled correctly.
      // Non-recursive parenthesis block replacer: collect all matching
      // parentheses pairs then replace from innermost to outermost. This
      // reduces repeated rescans and allocations compared to the previous
      // recursive approach.
      {
        const pairs = [];
        const stack = [];
        for (let i = 0; i < expr.length; i++) {
          const ch = expr[i];
          if (ch === '(') { stack.push(i); continue; }
          if (ch === ')') {
            const start = stack.pop();
            if (start === undefined) continue;
            pairs.push([start, i]);
          }
        }
        if (pairs.length > 0) {
          // Apply replacements from last pair to first so indices remain valid
          for (let pi = pairs.length - 1; pi >= 0; pi--) {
            const [start, end] = pairs[pi];
            const inner = expr.slice(start + 1, end);
            // Skip replacing parenthesized blocks that are actually object or
            // array literals (e.g. `({...})` or `([...])`) since converting
            // them into IIFEs breaks their literal semantics.
            const innerTrim = inner.trim();
            if (innerTrim.startsWith('{') || innerTrim.startsWith('[')) continue;
            if (inner.indexOf(';') === -1 && inner.indexOf('\n') === -1) continue;
            const parts = inner.split(RE_SPLIT_STMTS).map(l => l.trim().replace(RE_TRAILING_COMMA, '')).filter(Boolean);
            const last = parts.pop();
            const locals = new Set();
            for (let p of parts) {
              const mm = p.match(RE_ASSIGN_LOCAL);
              if (mm) locals.add(mm[1]);
            }
            const decl = locals.size ? `let ${Array.from(locals).join(', ')};\n` : '';
            const body = decl + (parts.length ? parts.map(l => l + ';').join('\n') + '\n' : '') + `return (${last});`;
            const newText = `(function(){\n${body}\n})()`;
            expr = expr.slice(0, start) + newText + expr.slice(end + 1);
          }
        }
      }
      // Handle slice expressions like `arr[1:3]` -> `arr.slice(1,3)` for JS
      expr = expr.replace(/(\[[^\]]*\]|\([^)]*\)|[A-Za-z_]\w*)\s*\[\s*([0-9]+)\s*:\s*([0-9]+)\s*\]/g, '($1).slice($2,$3)');
      // Handle general index access: attempt direct evaluation first — many
      // bracketed expressions are valid JS already (including nested
      // indexing such as [[1,2],[3,4]][0][1]). If direct evaluation works
      // we'll use the result; otherwise fall back to the regexp-based
      // __INDEX__ transformation below.
      
      try {
        const testFn = new Function('fs', 'include', '__ATDOT__', '__INDEX__', 'return (' + expr + ');');
        const __INDEX__ = (a, b) => {
          try {
            if (a == null) return undefined;
            if (Array.isArray(a)) return a[b];
            if (typeof a === 'string') {
              const n = Number(b);
              return Number.isNaN(n) ? undefined : a.charCodeAt(n);
            }
            if (typeof a === 'object') return a[b];
            return undefined;
          } catch (e) { return undefined; }
        };
        let testResult = testFn(fs, include, __ATDOT__, __INDEX__);
        if (typeof testResult === 'boolean') testResult = testResult ? 1 : 0;
        if (testResult !== undefined) {
          const formatValue = (v) => {
            if (Array.isArray(v)) {
              if (v.length === 0) return '[]';
              return '[ ' + v.map(formatValue).join(', ') + ' ]';
            }
            if (typeof v === 'string') {
              return '"' + v.replace(/"/g, '\\"') + '"';
            }
            if (v === null || v === undefined) return '';
            return String(v);
          };
          let saída;
          if (Array.isArray(testResult)) saída = formatValue(testResult);
          else if (typeof testResult === 'string') saída = testResult;
          else saída = formatValue(testResult);
          return ok(String(saída));
        }
      } catch (e) {
        // ignore and fall back to regex-based index transformation
      }

      // Handle general index access: a[b] -> __INDEX__(a,b), but skip string-literal property access and slices
      const indexRe = /(\[[^\]]*\]|\([^)]*\)|"[^"]*"|'[^']*'|[A-Za-z_]\w*|\d+)\s*\[\s*([^\]]+?)\s*\]/g;
      const indexReplacer = (m, left, idx) => {
        if (/^\s*['\"]/.test(idx)) return m; // obj["prop"] -> leave as-is
        if (/:/.test(idx)) return m; // slice handled above
        return `(__INDEX__(${left}, ${idx}))`;
      };
      let prevExpr;
      do {
        prevExpr = expr;
        expr = expr.replace(indexRe, indexReplacer);
      } while (expr !== prevExpr);

      // Ensure arrow bodies that are plain object literals are wrapped in parentheses
      // so `=> { a: x }` becomes `=> ({ a: x })` which is a JS object expression.
      expr = expr.replace(/=>\s*\{([^\}]*?)\}/gs, (m, inner) => `=> ({${inner}})`);

      // Transform guard-style branches after arrow functions: `=> | cond = res | fallback` -> conditional chain
      expr = expr.replace(/=>\s*((?:\s*\|[^\n]+\n?)+)/g, (m, guards) => {
        const tokens = guards.split('|').map(t => t.trim()).filter(Boolean);
        const clauses = [];
        let fallback = null;
        for (let tk of tokens) {
          if (tk.includes('=')) {
            const parts = tk.split('=').map(s => s.trim());
            clauses.push({ cond: parts[0], res: parts[1] });
          } else {
            fallback = tk;
          }
        }
        if (clauses.length === 0) return m;
        let out = '';
        for (let i = 0; i < clauses.length; i++) {
          out += `(${clauses[i].cond}) ? (${clauses[i].res}) : `;
        }
        out += fallback !== null ? `(${fallback})` : 'undefined';
        return '=> (' + out + ');';
      });
      // Normalize newlines into statement separators so inner parenthesized
      // blocks with multiple lines become valid JS statements separated by
      // semicolons.
      expr = expr.replace(/\n+/g, ';');
      const parts = expr.split(/;+/).map(l => l.trim()).filter(l => l.length > 0);
      const last = parts.pop();
      // Inject directory module objects for any identifier that matches an
      // existing directory in the workspace (e.g. `testar` -> folder `testar/`).
      // The injected variables are consts that map file basenames to file
      // contents (strings). This makes expressions like `testar.resposta`
      // work in the dynamic evaluator.
      let injectionDecls = '';
      try {
        const idMatches = expr.match(/[A-Za-z_]\w*/g) || [];
        const seen = new Set();
        for (const nm of idMatches) {
          if (seen.has(nm)) continue; seen.add(nm);
          try {
            const st = fs.statSync(nm);
            if (st && st.isDirectory()) {
              injectionDecls += `const ${nm} = (function(){ try { const obj = {}; const files = fs.readdirSync(${JSON.stringify(nm)}); for (const f of files) { const key = f.replace(/\\.[^\\/.]+$/, ''); try { const content = fs.readFileSync(${JSON.stringify(nm + '/')} + f, 'utf-8').trim(); obj[key] = content; } catch(e) { obj[key] = ''; } } return obj; } catch(e) { return {}; } })();\n`;
            }
          } catch (e) { /* ignore not found */ }
        }
      } catch (e) { injectionDecls = ''; }

      const body = injectionDecls + (parts.length ? parts.map(l => l + ';').join('\n') + '\n' : '') + `return (${last});`;
      // (debug prints removed)
      let fn;
      // Reuse previously compiled evaluators when possible
      if (__evalCache.has(body)) {
        fn = __evalCache.get(body);
      } else {
        fn = new Function('fs', 'include', '__ATDOT__', '__INDEX__', body);
        __evalCache.set(body, fn);
      }
      const __INDEX__ = (a, b) => {
        try {
          if (a == null) return undefined;
          if (Array.isArray(a)) return a[b];
          if (typeof a === 'string') {
            const n = Number(b);
            return Number.isNaN(n) ? undefined : a.charCodeAt(n);
          }
          if (typeof a === 'object') return a[b];
          return undefined;
        } catch (e) { return undefined; }
      };
      let result = fn(fs, include, __ATDOT__, __INDEX__);
      if (typeof result === 'boolean') result = result ? 1 : 0;
      if (result === undefined || result === null) {
        return ok("");
      }

      // Format arrays and strings to match the expected textual representation
      // used by the tests (e.g. arrays like [ 1, 2, 3 ] and strings quoted
      // with single quotes inside arrays).
      const formatValue = (v) => {
        if (Array.isArray(v)) {
          if (v.length === 0) return '[]';
          return '[ ' + v.map(formatValue).join(', ') + ' ]';
        }
        if (typeof v === 'string') {
          // Use double-quotes for strings inside arrays to match test expectations.
          return '"' + v.replace(/"/g, '\\"') + '"';
        }
        if (v === null || v === undefined) return '';
        return String(v);
      };

      let saída;
      if (Array.isArray(result)) {
        saída = formatValue(result);
      } else if (typeof result === 'string') {
        saída = result;
      } else {
        saída = formatValue(result);
      }
      

      return ok(String(saída));
    } catch (e) {
      if (calledWithWrapper) return { saída: "", erro: `${arquivo}\n1:1\n${entrada}\n^\n` };
      return { erro: { linha: 1, coluna: 1, conteúdo: entrada } };
    }
  }

  return { saída: "" };
}

export async function interpretar({ entrada, arquivo = "", escopo = {} }) {
  return await avaliar({ entrada, arquivo, escopo });
}

export default { interpretar };
