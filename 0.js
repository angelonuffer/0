import fs from 'fs';
import path from 'path';

function removerComentarios(src) {
  return src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
}

function splitTopLevelLines(src) {
  const lines = [];
  let cur = '';
  let depth = 0;
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (ch === '(' || ch === '{' || ch === '[') depth++;
    if (ch === ')' || ch === '}' || ch === ']') depth--;
    if (ch === '\n' && depth === 0) { lines.push(cur); cur = ''; }
    else cur += ch;
  }
  if (cur.trim()) lines.push(cur);
  return lines.map(l => l.trim()).filter(Boolean);
}

function splitRespectingQuotes(s) {
  const res = [];
  let cur = '';
  let inStr = false, esc = false;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (inStr) {
      cur += ch;
      if (esc) esc = false; else if (ch === '\\') esc = true; else if (ch === '"') inStr = false;
    } else {
      if (ch === '"') { inStr = true; cur += ch; }
      else if (/\s/.test(ch)) { if (cur.trim()) { res.push(cur.trim()); cur = ''; } }
      else cur += ch;
    }
  }
  if (cur.trim()) res.push(cur.trim());
  return res;
}

function formatResult(v) {
  if (v === undefined) return '';
  if (v === null) return '';
  if (typeof v === 'boolean') return v ? '1' : '0';
  if (typeof v === 'string') return v;
  if (typeof v === 'number') {
    if (Object.is(v, -0)) return '-0';
    return String(v);
  }
  if (Array.isArray(v)) {
    const items = v.map(x => typeof x === 'string' ? "'"+x+"'" : formatResult(x));
    return '[ ' + items.join(', ') + ' ]';
  }
  if (typeof v === 'object') {
    try { return JSON.stringify(v); } catch (e) { return String(v); }
  }
  return String(v);
}

function splitObjectEntries(s) {
  const parts = [];
  let i = 0;
  while (i < s.length) {
    while (i < s.length && /[\s\n]/.test(s[i])) i++;
    if (i >= s.length) break;
    let key = '';
    if (s[i] === '"') {
      let j = i+1; key = '"';
      while (j < s.length) { key += s[j]; if (s[j] === '"' && s[j-1] !== '\\') { j++; break; } j++; }
      i = j;
    } else { let j = i; while (j < s.length && /[^:\s]/.test(s[j])) j++; key = s.slice(i, j).trim(); i = j; }
    while (i < s.length && /\s/.test(s[i])) i++;
    if (s[i] === ':') {
      i++; while (i < s.length && /\s/.test(s[i])) i++;
      let valStart = i; let depth = 0;
      while (i < s.length) {
        const ch = s[i];
        if ((ch === '\n' || ch === ' ') && depth === 0) {
          let k = i+1; while (k < s.length && /\s/.test(s[k])) k++; if (k >= s.length || /[A-Za-z_\"]/ .test(s[k])) break;
        }
        if (ch === '{' || ch === '[' || ch === '(') depth++; else if (ch === '}' || ch === ']' || ch === ')') depth--;
        i++;
      }
      const val = s.slice(valStart, i).trim(); parts.push(key + ': ' + val);
    } else { parts.push(key + ': ' + key); }
  }
  return parts;
}

function transpile(src) {
  src = String(src);
  src = removerComentarios(src);

  // module imports like ./file.0 -> __import("./file.0")
  src = src.replace(/(^|\s|\()((?:\.\/|\/)\S+?\.0)(?=[\s\)\];]|$)/g, '$1__import("$2")');
  // @ "path"
  src = src.replace(/@\s*"([^"]+)"/g, '__read("$1")');

  // arrays [a b c] -> [a, b, c]
  src = src.replace(/\[([^\]]*)\]/g, (m, inside) => {
    if (/\d+\s*:\s*\d+/.test(inside)) return '[' + inside.replace(/\s+/g, '') + ']';
    const parts = splitRespectingQuotes(inside.trim()); return '[' + parts.filter(Boolean).join(', ') + ']';
  });

  // objects { a: 1 b:2 }
  src = src.replace(/\{([^{}]*?)\}/g, (m, inside) => {
    if (/=>/.test(src) && /=>/.test(m) === false && /:\s*/.test(inside)) { const parts = splitObjectEntries(inside.trim()); return '{' + parts.join(', ') + '}'; }
    return '{' + inside + '}';
  });

  // destructuring params { a b } => -> ({a,b}) =>
  src = src.replace(/\{\s*([A-Za-z0-9_\s]+?)\s*\}\s*=>/g, (m, inside) => '{' + inside.trim().split(/\s+/).filter(Boolean).join(',') + '} =>');

  // arrow functions with branch lines starting with |
  src = src.replace(/=>\s*\n((?:\|[^\n]*\n?)+)/g, (m, blk) => {
    const lines = blk.split(/\n/).map(l=>l.trim()).filter(Boolean); let js = '{\n';
    for (const line of lines) { const withoutPipe = line.replace(/^\|\s*/, ''); const m2 = withoutPipe.match(/(.+)=(.+)/); if (m2) js += 'if (' + m2[1].trim() + ') return (' + m2[2].trim() + ');\n'; else js += 'return (' + withoutPipe.trim() + ');\n'; }
    js += '}'; return js;
  });

  src = src.replace(/\b==\b/g, '===').replace(/\b!=\b/g, '!==');
  src = src.replace(/%\s*/g, '');
  src = src.replace(/\[\.\]/g, '.length');
  src = src.replace(/(\[[^\]]+\]|[A-Za-z_À-ÿ][A-Za-z0-9_À-ÿ]*)\s*\*\s*"([^"]*)"/g, '($1).join("$2")');
  src = src.replace(/([A-Za-z_À-ÿ][A-Za-z0-9_À-ÿ\[\]\.\'\"]*)\s*\/\s*"([^"]*)"/g, '$1.split("$2")');
  src = src.replace(/([^\s\(\)\[\],]+)\s*&\s*([^\s\(\)\[\],]+)/g, '($1 ? $2 : 0)');
  src = src.replace(/([^\s\(\)\[\],]+)\s*\|\s*([^\s\(\)\[\],]+)/g, '($1 ? $1 : $2)');

  // wrap multi-line parenthesized blocks into IIFE
  src = src.replace(/\(\s*([\s\S]*?)\s*\)/g, (m, inner) => {
    const lines = splitTopLevelLines(inner).map(l => l.trim()).filter(Boolean);
    if (lines.length <= 1) return '(' + inner + ')';
    const stmts = lines.map(line => (/^[A-Za-z_À-ÿ][A-Za-z0-9_À-ÿ]*\s*=/.test(line) ? 'let ' + line + ';' : line + (line.endsWith(';') ? '' : ';')));
    const last = stmts.pop(); const body = stmts.join('\n') + '\nreturn ' + last.replace(/;$/, ''); return '(()=>{\n' + body + '\n})()';
  });

  return src;
}

function readFileSyncUtf8(relPath) { try { return fs.readFileSync(path.resolve(process.cwd(), relPath), 'utf8'); } catch (e) { return ''; } }

export async function interpretar(entrada, arquivo = '0.teste.js') {
  try {
    const src = String(entrada);
    // quick syntax checks
    const withoutComments = removerComentarios(src);
    const firstNonWs = withoutComments.trimStart()[0] || '';
    if (firstNonWs === '=') {
      const idx = withoutComments.indexOf('=');
      return { saída: '', erro: buildError(arquivo, withoutComments, idx, idx+1, 'Opções: {, h, ., (, [, 0-9, ", -, !, %, @') };
    }
    // unclosed string
    if ((withoutComments.match(/\"/g) || []).length % 2 === 1) {
      const idx = src.lastIndexOf('\"');
      const { line, col } = posFromIndex(src, idx+1);
      return { saída: '', erro: buildError(arquivo, src, idx, idx+1) };
    }
    const code = transpile(entrada);
    const __read = (p) => readFileSyncUtf8(p).toString().trim();
    const __import = (p) => {
      const txt = readFileSyncUtf8(p).toString().trim();
      if (/^[0-9]+$/.test(txt)) return Number(txt);
      const t = transpile(txt);
      try {
        let val;
        try { val = eval(t); } catch (e) {
          // try function literal
          try { val = eval('(' + t + ')'); } catch (e2) {
            const m = String(e).match(/([A-Za-z_À-ÿ][A-Za-z0-9_À-ÿ]*) is not defined/);
            const name = m ? m[1] : null;
            const err = new Error(String(e));
            err.__import = { module: p, src: txt, name };
            throw err;
          }
        }
        // If the imported value is a function, wrap it so runtime errors include module info
        if (typeof val === 'function') {
          const orig = val;
          const wrapped = function(...args) {
            try { return orig.apply(this, args); }
            catch (e) {
              if (!e || typeof e !== 'object') throw e;
              const m = String(e).match(/([A-Za-z_À-ÿ][A-Za-z0-9_À-ÿ]*) is not defined/);
              const name = m ? m[1] : null;
              if (!e.__import) e.__import = { module: p, src: txt, name };
              throw e;
            }
          };
          try { Object.defineProperty(wrapped, 'name', { value: val.name || 'imported', configurable: true }); } catch (_) {}
          return wrapped;
        }
        return val;
      } catch (err) { throw err; }
    };
    const program = buildProgram(code);
    const fn = new Function('__read','__import', program);
    const result = fn(__read, __import);
    return { saída: formatResult(result), erro: '' };
  } catch (err) {
    // Format known errors
    try {
      const msg = String(err);
      const src = String(entrada);
      // ReferenceError: <name> is not defined
      const ref = msg.match(/^(?:ReferenceError: )?([A-Za-z_À-ÿ][A-Za-z0-9_À-ÿ]*) is not defined/);
      if (ref) {
        const name = ref[1];
        // Prefer token occurrence in the last non-comment code line (helps main expression errors)
        let idx = findTokenIndexInLastCodeLine(src, name);
        if (idx < 0) idx = findTokenIndexPreserveComments(src, name);
        if (idx >= 0) {
          // underline only the identifier (not the call parentheses)
          let end = idx + name.length;
          // Try to build a call-stack style error if there are call sites
          const stackErr = buildCallStackError(arquivo, src, name);
          if (stackErr) return { saída: '', erro: stackErr };
          return { saída: '', erro: buildError(arquivo, src, idx, end) };
        }
      }

      // import error propagated
      if (err && err.__import) {
        const info = err.__import;
        // try to build caller chain: find last call like d( ) and its definition
        const callerCallMatch = src.match(/([A-Za-z_À-ÿ][A-Za-z0-9_À-ÿ]*)\s*\([^\)]*\)\s*$/m);
        // naive: find last parenthesized call occurrence
        const callRegex = /([A-Za-z_À-ÿ][A-Za-z0-9_À-ÿ]*)\s*\([^\)]*\)/g;
        let lastCall = null; let m;
        while ((m = callRegex.exec(src)) !== null) lastCall = {name: m[1], idx: m.index};
        const lines = [];
        if (lastCall) {
          const { line, col, lineText } = posFromIndexFull(src, lastCall.idx);
          lines.push({ line, col, lineText, span: lastCall.name.length });
          // find definition
          const defIdx = src.indexOf(lastCall.name + ' =');
          if (defIdx >= 0) {
            const defPos = posFromIndexFull(src, defIdx);
            const defLineText = defPos.lineText;
            const defCol = defPos.col + defLineText.indexOf(lastCall.name);
            lines.push({ line: defPos.line, col: defCol, lineText: defLineText, span: lastCall.name.length });
          }
        }
        // module error position
        const modSrc = info.src || '';
        const modName = info.name;
        let modIdx = -1;
        if (modName) modIdx = findTokenIndexPreserveComments(modSrc, modName);
        if (modIdx < 0) modIdx = 0;
        // build message
        const out = buildImportStackError(arquivo, src, info, lines);
        return { saída: '', erro: out };
      }

      // detect unexpected ':' at line start inside object
      const linesArr = src.split('\n');
      for (let li = 0; li < linesArr.length; li++) {
        if (/^\s*:\s*/.test(linesArr[li])) {
          const col = linesArr[li].search(/:/) + 1;
          const lineStartIdx = nthIndexOf(src, '\n', li) + 1;
          const idx = lineStartIdx + col - 1;
          return { saída: '', erro: buildError(arquivo, src, idx, idx+1) };
        }
      }

      // Syntax-like tokens
      // unexpected char $
      const dollar = findCharOutsideStrings(src, '$');
      if (dollar >= 0) return { saída: '', erro: buildError(arquivo, src, dollar, dollar+1) };

      // unbalanced braces/brackets/parentheses
      const unclosed = findUnclosed(src);
      if (unclosed) {
        const { ch, idx } = unclosed;
        // point to the problematic location: prefer reported index, else point to a nearby closing brace
        let pos;
        if (idx !== null) pos = idx;
        else {
          const lastClose = src.lastIndexOf('}');
          pos = lastClose >= 0 ? lastClose : Math.max(0, src.length - 1);
        }
        return { saída: '', erro: buildError(arquivo, src, pos, pos+1) };
      }

      // fallback: show generic error at line 1 col 1
      return { saída: '', erro: buildError(arquivo, src, 0, 1, msg.replace(/\n/g,'\n')) };
    } catch (e) {
      return { saída: '', erro: String(err) };
    }
  }
}

function buildProgram(code) {
  // if single expression, return it directly
  if (!/\n/.test(code) && !/;/.test(code) && !/=[^=]/.test(code)) {
    return 'return (' + code + ');';
  }
  const lines = splitTopLevelLines(code).map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) return 'return undefined;';
  const stmts = lines.map((line, idx) => {
    if (/^[A-Za-z_À-ÿ][A-Za-z0-9_À-ÿ]*\s*=/.test(line)) return 'let ' + line + ';';
    return line + (line.endsWith(';') ? '' : ';');
  });
  const last = stmts.pop();
  const body = stmts.join('\n') + '\nreturn ' + last.replace(/;$/, '');
  return 'return (function(){\n' + body + '\n})()';
}

function buildError(arquivo, src, startIdx, endIdx, extra) {
  
  const { line, col, lineText } = posFromIndexFull(src, startIdx);
  const startCol = col; const len = Math.max(1, endIdx - startIdx);
  const caret = '^'.repeat(len);
  let out = arquivo + '\n' + line + ':' + startCol + '\n' + lineText + '\n' + ' '.repeat(startCol-1) + caret;
  if (extra) out += '\n' + extra;
  return out;
}

function posFromIndex(src, idx) {
  const before = src.slice(0, idx);
  const lines = before.split('\n');
  const line = lines.length;
  const col = lines[lines.length-1].length + 1;
  return { line, col };
}

function posFromIndexFull(src, idx) {
  if (idx < 0) idx = 0;
  const before = src.slice(0, idx);
  const lines = before.split('\n');
  const line = lines.length;
  const col = lines[lines.length-1].length + 1;
  const allLines = src.split('\n');
  const lineText = allLines[line-1] || '';
  return { line, col, lineText };
}

function findTokenIndex(src, name) {
  // find whole-word occurrence
  const re = new RegExp('\\b' + name + '\\b');
  const m = src.match(re);
  if (!m) return -1;
  return src.indexOf(m[0]);
}

function stripCommentsPreserveLength(src) {
  let out = '';
  let i = 0;
  while (i < src.length) {
    if (src[i] === '/' && src[i+1] === '*') {
      let j = i+2; while (j < src.length && !(src[j-1] === '*' && src[j] === '/')) j++; j = Math.min(j+1, src.length);
      out += ' '.repeat(j-i); i = j; continue;
    }
    if (src[i] === '/' && src[i+1] === '/') {
      let j = i+2; while (j < src.length && src[j] !== '\n') j++; out += ' '.repeat(j-i); i = j; continue;
    }
    out += src[i]; i++;
  }
  return out;
}

function findTokenIndexPreserveComments(src, name) {
  const stripped = stripCommentsPreserveLength(src);
  const re = new RegExp('\\b' + name + '\\b','g');
  const matches = [...stripped.matchAll(re)].map(x => x.index).filter(i => i != null);
  if (!matches.length) return -1;
  return matches[matches.length-1];
}

function findTokenIndexInLastCodeLine(src, name) {
  const lines = src.split('\n');
  // scan from bottom to top for a non-comment line containing the token
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i];
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith('//')) continue;
    const re = new RegExp('\\b' + name + '\\b');
    const m = line.match(re);
    if (m) {
      // compute absolute index
      const before = lines.slice(0, i).map(l => l.length + 1).reduce((a,b)=>a+b, 0);
      return before + line.indexOf(m[0]);
    }
  }
  return -1;
}

function findCharOutsideStrings(src, ch) {
  let inStr = false, esc = false;
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (inStr) {
      if (esc) esc = false; else if (c === '\\') esc = true; else if (c === '"') inStr = false;
    } else {
      if (c === '"') inStr = true; else if (c === ch) return i;
    }
  }
  return -1;
}

function findUnclosed(src) {
  const stack = [];
  let inStr = false, esc = false;
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (inStr) {
      if (esc) esc = false; else if (c === '\\') esc = true; else if (c === '"') inStr = false;
      continue;
    }
    if (c === '"') { inStr = true; continue; }
    if (c === '{' || c === '[' || c === '(') stack.push({ch: c, idx: i});
    else if (c === '}' || c === ']' || c === ')') {
      const last = stack[stack.length-1];
      if (!last) return { ch: c, idx: i };
      const pairs = { '{':'}','[':']','(':')' };
      if (pairs[last.ch] === c) stack.pop(); else return { ch: c, idx: i };
    }
  }
  if (stack.length) {
    const last = stack[stack.length-1];
    return { ch: last.ch, idx: null };
  }
  return null;
}

function buildCallStackError(arquivo, src, missingName) {
  // find all call sites name(...)
  const stripped = stripCommentsPreserveLength(src);
  const callRegex = /([A-Za-z_À-ÿ][A-Za-z0-9_À-ÿ]*)\s*\([^\)]*\)/g;
  const calls = [];
  let m;
  while ((m = callRegex.exec(stripped)) !== null) calls.push({ name: m[1], idx: m.index });
  if (calls.length === 0) return null;
  // take last call as top frame
  const frames = [];
  const seen = new Set();
  let currentName = calls[calls.length-1].name;
  let currentIdx = calls[calls.length-1].idx;
  // push top call site
  frames.push({ kind: 'call', name: currentName, idx: currentIdx });
  seen.add(currentName);
  // follow definitions chain, avoiding duplicates
  while (true) {
    const defPattern = currentName + ' =';
    const defIdx = stripped.indexOf(defPattern);
    if (defIdx < 0) break;
    // avoid pushing same def twice
    if (!frames.some(f => f.kind === 'def' && f.name === currentName && f.defIdx === defIdx)) {
      frames.push({ kind: 'def', name: currentName, defIdx });
    }
    // search RHS for a call inside definition to continue chain
    const rhsStart = defIdx + defPattern.length;
    const substr = stripped.slice(rhsStart, rhsStart + 400);
    const callInside = substr.match(/([A-Za-z_À-ÿ][A-Za-z0-9_À-ÿ]*)\s*\(/);
    if (!callInside) break;
    const nextName = callInside[1];
    const nextIdx = stripped.indexOf(callInside[0], rhsStart);
    if (!nextName || seen.has(nextName)) break;
    frames.push({ kind: 'call', name: nextName, idx: nextIdx });
    seen.add(nextName);
    currentName = nextName; currentIdx = nextIdx;
  }
  // build output: top call site first
  let out = arquivo + '\n';
  // top call site
  const top = frames[0];
  const topPos = posFromIndexFull(src, top.idx);
  // underline the whole call (from start to closing parenthesis) if possible
  let topEnd = src.indexOf(')', top.idx);
  let topLen = 1;
  if (topEnd >= 0) topLen = Math.max(1, topEnd - top.idx + 1);
  out += topPos.line + ':' + topPos.col + '\n' + topPos.lineText + '\n' + ' '.repeat(topPos.col-1) + '^'.repeat(topLen) + '\n';
  // then subsequent frames (definitions or calls), but avoid repeating identical positions
  const printed = new Set();
  for (let i = 1; i < frames.length; i += 1) {
    const f = frames[i];
    // prefer highlighting a call inside the definition's RHS if present
    let posIdx = (f.defIdx != null) ? f.defIdx : f.idx;
    if (f.defIdx != null) {
      const rhsStart = f.defIdx + (f.name + ' =').length;
      const rhs = stripped.slice(rhsStart, rhsStart + 400);
      const callInside = rhs.match(/([A-Za-z_À-ÿ][A-Za-z0-9_À-ÿ]*)\s*\(/);
      if (callInside) {
        const callText = callInside[0];
        const found = stripped.indexOf(callText, rhsStart);
        if (found >= 0) posIdx = found + callText.indexOf(callInside[1]);
      }
    }
    if (printed.has(posIdx)) continue;
    printed.add(posIdx);
    const defPos = posFromIndexFull(src, posIdx);
    // underline token length if possible
    let spanLen = 1;
    const tokenMatch = src.slice(posIdx, posIdx + 100).match(/^([A-Za-z_À-ÿ][A-Za-z0-9_À-ÿ]*)/);
    if (tokenMatch) spanLen = tokenMatch[1].length;
    out += defPos.line + ':' + defPos.col + '\n' + defPos.lineText + '\n' + ' '.repeat(defPos.col-1) + '^'.repeat(spanLen) + '\n';
  }
  // build options: collect params of the function where missingName likely occurs
  // find definition that contains missingName usage
  const missingIdx = findTokenIndexPreserveComments(src, missingName);
  let funcDefLine = null;
  if (missingIdx >= 0) {
    // find nearest "name =" above missingIdx
    const before = src.slice(0, missingIdx);
    const defs = [...before.matchAll(/([A-Za-z_À-ÿ][A-Za-z0-9_À-ÿ]*)\s*=\s*/g)];
    if (defs.length) {
      const lastDef = defs[defs.length-1][1];
      // find params: pattern name = param =>
      const defRe = new RegExp(lastDef + '\\s*=\\s*([A-Za-z_À-ÿ][A-Za-z0-9_À-ÿ]*)\\s*=>');
      const pm = src.match(defRe);
      if (pm) funcDefLine = { defName: lastDef, param: pm[1] };
    }
  }
  const opts = [];
  // prefer listing declarations in source order, followed by their parameter (if any)
  const decls = [...src.matchAll(/([A-Za-z_À-ÿ][A-Za-z0-9_À-ÿ]*)\s*=/g)].map(x=>x[1]);
  for (const decl of decls) {
    if (!opts.includes(decl)) opts.push(decl);
    const paramRe = new RegExp(decl + '\\s*=\\s*([A-Za-z_À-ÿ][A-Za-z0-9_À-ÿ]*)\\s*=>');
    const pm = src.match(paramRe);
    if (pm && pm[1] && !opts.includes(pm[1])) opts.push(pm[1]);
  }
  out += 'Opções: ' + opts.join(', ');
  return out;
}

function buildImportStackError(arquivo, src, info, callerLines) {
  // callerLines is array of frames with line/col/lineText
  let out = arquivo + '\n';
  for (const l of callerLines) {
    out += l.line + ':' + l.col + '\n' + l.lineText + '\n' + ' '.repeat(l.col-1) + '^\n';
  }
  // normalize module path for display (strip leading ./)
  const displayModule = (info.module || '').replace(/^\.\//, '');
  out += '\n' + displayModule + '\n';
  const modSrc = info.src || '';
  // try to find parameter names in the module (e.g. "b =>") to show as options
  const paramMatch = modSrc.match(/\s*\(?\s*([A-Za-z_À-ÿ][A-Za-z0-9_À-ÿ]*(?:\s*,\s*[A-Za-z_À-ÿ][A-Za-z0-9_À-ÿ]*)*)\s*\)?\s*=>/);
  let opts = [];
  if (paramMatch) {
    opts = paramMatch[1].split(/\s*,\s*/).map(s => s.trim()).filter(Boolean);
  }
  // fallback: if no params, highlight the first token or missing name
  const modName = info.name || '';
  const modIdx = opts.length ? 0 : (findTokenIndexPreserveComments(modSrc, modName) >= 0 ? findTokenIndexPreserveComments(modSrc, modName) : 0);
  const modPos = posFromIndexFull(modSrc, modIdx);
  out += modPos.line + ':' + modPos.col + '\n' + modPos.lineText + '\n' + ' '.repeat(Math.max(0, modPos.col-1)) + '^\n';
  if (opts.length) out += 'Opções: ' + opts.join(', ');
  else if (modName) out += 'Opções: ' + modName;
  return out;
}

if (process.argv.length > 2) {
  const caminho = process.argv[2];
  try { const c = fs.readFileSync(caminho, 'utf8'); process.stdout.write(c); } catch (e) {}
}
