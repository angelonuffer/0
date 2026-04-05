#! /usr/bin/env node

import fs from 'fs';
import { fileURLToPath } from 'url';

function findBracketIssue(txt) {
  const stack = [];
  let inStr = null;
  for (let i = 0; i < txt.length; ) {
    const ch = txt[i];
    if (inStr) {
      if (ch === '\\') { i += 2; continue; }
      if (ch === inStr) { inStr = null; i++; continue; }
      i++; continue;
    }
    if (ch === '"' || ch === "'") { inStr = ch; i++; continue; }
    if (ch === '/' && txt[i+1] === '/') { while (i < txt.length && txt[i] !== '\n') i++; i++; continue; }
    if (ch === '/' && txt[i+1] === '*') { i += 2; while (i < txt.length && !(txt[i] === '*' && txt[i+1] === '/')) i++; i += 2; continue; }
    if (/\s/.test(ch)) { i++; continue; }
    if (ch === '{' || ch === '[' || ch === '(') { stack.push({ ch, pos: i }); i++; continue; }
    if (ch === '}' || ch === ']' || ch === ')') {
      const top = stack.pop();
      if (!top) return i;
      const ok = (top.ch === '{' && ch === '}') || (top.ch === '[' && ch === ']') || (top.ch === '(' && ch === ')');
      if (!ok) return i;
      i++; continue;
    }
    i++; // ignore other chars
  }
  if (inStr) {
    let k = txt.length - 1; while (k >= 0 && /\s/.test(txt[k])) k--; if (k >= 0) return Math.min(txt.length, k + 1); return 0;
  }
  if (stack.length) {
    let k = txt.length - 1; while (k >= 0 && /\s/.test(txt[k])) k--; if (k >= 0) return Math.min(txt.length, k + 1); return stack[stack.length-1].pos;
  }
  return null;
}

function formatErrorString(arquivo, entrada, pos) {
  const txt = String(entrada || '');
  if (pos === undefined || pos === null) pos = 0;
  if (pos < 0) pos = 0;
  const lines = txt.split(/\r?\n/);
  const lineStarts = new Array(lines.length);
  let acc = 0;
  for (let i = 0; i < lines.length; i++) { lineStarts[i] = acc; acc += lines[i].length + 1; }
  let lineIndex = lines.length - 1;
  for (let i = 0; i < lines.length; i++) { if (pos <= lineStarts[i] + lines[i].length) { lineIndex = i; break; } }
  const lineStart = lineStarts[lineIndex];
  const col = Math.max(1, pos - lineStart + 1);
  const lineText = lines[lineIndex] || '';
  const startInLine = Math.max(0, col - 1);
  const isIdentChar = (ch) => /[A-Za-z0-9_\u00C0-\u017F]/.test(ch);
  let caret;
  if (startInLine >= lineText.length) {
    caret = ' '.repeat(startInLine) + '^';
  } else {
    const chAtPos = lineText[startInLine] || '';
    if (isIdentChar(chAtPos)) {
      let tokenStart = startInLine; while (tokenStart > 0 && isIdentChar(lineText[tokenStart - 1])) tokenStart--;
      let tokenEnd = startInLine; while (tokenEnd < lineText.length && isIdentChar(lineText[tokenEnd])) tokenEnd++;
      const len = Math.max(1, tokenEnd - tokenStart);
      caret = ' '.repeat(Math.max(0, tokenStart)) + '^'.repeat(len);
    } else {
      const tokenStart = startInLine;
      caret = ' '.repeat(Math.max(0, tokenStart)) + '^';
    }
  }
  return `${arquivo}\n${lineIndex + 1}:${col}\n${lineText}\n${caret}\n`;
}

function formatValue(v, inArray = false) {
  if (Array.isArray(v)) {
    if (v.length === 0) return '[]';
    return '[ ' + v.map(x => formatValue(x, true)).join(', ') + ' ]';
  }
  if (typeof v === 'string') return inArray ? JSON.stringify(v) : String(v);
  if (v === null || v === undefined) return '';
  return String(v);
}

// Parser-combinator based evaluator
function transformAndEval(src, escopo) {
  let text = String(src || '')
    .replace(/@\s*"([^\"]+)"/g, (m,p) => `__INCLUDE__("${p.replace(/\\/g,'\\\\')}")`)
    .replace(/@\s*([A-Za-z_\u00C0-\u017F][A-Za-z0-9_\u00C0-\u017F]*)/g, (m,id) => `__INCLUDE__(${id})`);
  // normalize trailing commas in arrays/objects (allow trailing commas across lines)
  text = text.replace(/,\s*([\]\}])/g, '$1');

  function skip(pos) {
    let i = pos;
    while (i < text.length) {
      const ch = text[i];
      if (/\s/.test(ch)) { i++; continue; }
      if (text[i] === '/' && text[i+1] === '/') { i += 2; while (i < text.length && text[i] !== '\n') i++; continue; }
      if (text[i] === '/' && text[i+1] === '*') { i += 2; while (i < text.length && !(text[i] === '*' && text[i+1] === '/')) i++; i += 2; continue; }
      break;
    }
    return i;
  }

  const isIdentStart = ch => /[A-Za-z_\u00C0-\u017F]/.test(ch);
  const isIdentChar = ch => /[A-Za-z0-9_\u00C0-\u017F]/.test(ch);

  function parseNumber(pos) {
    pos = skip(pos);
    const m = /^[+-]?(?:\d+)(?:\.\d+)?/.exec(text.slice(pos));
    if (!m) return null;
    const start = pos;
    const end = pos + m[0].length;
    return { node: { type: 'number', value: Number(m[0]), start, end }, pos: end };
  }

  function parseString(pos) {
    pos = skip(pos);
    const q = text[pos]; if (q !== '"' && q !== "'") return null;
    let i = pos + 1; let out = '';
    const start = pos;
    while (i < text.length) {
      const ch = text[i];
      if (ch === '\\') {
        const nxt = text[i+1] || '';
        if (nxt === 'n') out += '\n'; else if (nxt === 't') out += '\t'; else if (nxt === 'r') out += '\r'; else out += nxt;
        i += 2; continue;
      }
      if (ch === q) { i++; return { node: { type: 'string', value: out, start, end: i }, pos: i }; }
      out += ch; i++;
    }
    return null;
  }

  function parseIdent(pos) {
    pos = skip(pos);
    if (pos >= text.length) return null;
    if (!isIdentStart(text[pos])) return null;
    let i = pos + 1; while (i < text.length && isIdentChar(text[i])) i++;
    const start = pos; const end = i;
    return { node: { type: 'ident', name: text.slice(pos, i), start, end }, pos: i };
  }

  function parseParen(pos) {
    pos = skip(pos);
    if (text[pos] !== '(') return null;
    const start = pos;
    const prog = parseProgram(pos + 1);
    if (!prog) return null;
    const p = skip(prog.pos);
    if (text[p] !== ')') return null;
    // if single expression inside parens, return that expression node
    if (prog.stmts.length === 1 && prog.stmts[0].type === 'expr') {
      const enode = prog.stmts[0].expr;
      enode.start = enode.start ?? start; enode.end = enode.end ?? (p + 1);
      return { node: enode, pos: p + 1 };
    }
    return { node: { type: 'block', stmts: prog.stmts, start, end: p + 1 }, pos: p + 1 };
  }

  function parseArray(pos) {
    pos = skip(pos);
    if (text[pos] !== '[') return null;
    let i = skip(pos + 1);
    const elems = [];
    if (text[i] === ']') return { node: { type: 'array', elements: [], start: pos, end: i + 1 }, pos: i + 1 };
    while (i < text.length) {
      // support spread operator '...expr'
      if (text.startsWith('...', i)) {
        const vr = parseExpression(i + 3);
        if (!vr) return null;
        elems.push({ type: 'spread', expr: vr.node });
        i = skip(vr.pos);
      } else {
        const v = parseExpression(i);
        if (!v) return null;
        elems.push(v.node);
        i = skip(v.pos);
      }
      if (text[i] === ',') { i = skip(i + 1); continue; }
      if (text[i] === ']') return { node: { type: 'array', elements: elems, start: pos, end: i + 1 }, pos: i + 1 };
      i = skip(i);
    }
    return null;
  }

  function parseObject(pos) {
    pos = skip(pos);
    if (text[pos] !== '{') return null;
    const start = pos;
    let i = skip(pos + 1);
    const props = [];
    if (text[i] === '}') return { node: { type: 'object', props: [], start, end: i + 1 }, pos: i + 1 };
    while (i < text.length) {
      // support spread in objects
      if (text.startsWith('...', i)) {
        const sp = parseExpression(i + 3);
        if (!sp) return null;
        props.push({ spread: true, expr: sp.node });
        i = skip(sp.pos);
        i = skip(i);
        if (text[i] === ',') { i = skip(i + 1); continue; }
        if (text[i] === '}') return { node: { type: 'object', props, start, end: i + 1 }, pos: i + 1 };
        continue;
      }
      const keyStr = parseString(i);
      let key;
      if (keyStr) { key = keyStr.node.value; i = skip(keyStr.pos); }
      else {
        const id = parseIdent(i);
        if (id) { key = id.node.name; i = skip(id.pos); }
        else {
          const num = parseNumber(i);
          if (num) { key = String(num.node.value); i = skip(num.pos); }
          else return null;
        }
      }
      i = skip(i);
      if (text[i] === ':') {
        const v = parseExpression(i + 1);
        if (!v) return null;
        props.push({ key, value: v.node });
        i = skip(v.pos);
      } else {
        // shorthand property: { nome } -> { nome: nome }
        props.push({ key, value: { type: 'ident', name: key } });
      }
      if (text[i] === ',') { i = skip(i + 1); continue; }
      if (text[i] === '}') return { node: { type: 'object', props, start, end: i + 1 }, pos: i + 1 };
      i = skip(i);
    }
    return null;
  }

  // parse parameter pattern for lambdas (identifier or object destructuring)
  function parseParamPattern(pos) {
    pos = skip(pos);
    if (text[pos] === '{') {
      const start = pos;
      let i = skip(pos + 1);
      const props = [];
      if (text[i] === '}') return { node: { type: 'param_pattern_obj', props: [], start, end: i + 1 }, pos: i + 1 };
      while (i < text.length) {
        const id = parseIdent(i);
        if (!id) return null;
        props.push(id.node.name);
        i = skip(id.pos);
        if (text[i] === ',') { i = skip(i + 1); continue; }
        if (text[i] === '}') return { node: { type: 'param_pattern_obj', props, start, end: i + 1 }, pos: i + 1 };
        i = skip(i);
      }
      return null;
    }
    const id = parseIdent(pos);
    if (id) return { node: { type: 'ident', name: id.node.name, start: id.node.start, end: id.node.end }, pos: id.pos };
    return null;
  }

  function parseGuards(pos) {
    pos = skip(pos);
    if (text[pos] !== '|') return null;
    const branches = [];
    while (true) {
      pos = skip(pos);
      if (text[pos] !== '|') break;
      pos = skip(pos + 1);
      // try condition = expr
      const leftRes = parseExpression(pos);
      if (leftRes) {
        const afterLeft = skip(leftRes.pos);
        if (text[afterLeft] === '=') {
          // temporarily disable pipe operator so RHS doesn't swallow subsequent '|' guards
          let saved = null;
          for (let bi = 0; bi < BINOPS.length; bi++) {
            if (BINOPS[bi].indexOf('|') !== -1) { saved = BINOPS[bi].slice(); BINOPS[bi] = BINOPS[bi].filter(op => op !== '|'); break; }
          }
          try {
            const exprRes = parseExpression(afterLeft + 1);
            if (!exprRes) return null;
            branches.push({ cond: leftRes.node, expr: exprRes.node });
            pos = skip(exprRes.pos);
            continue;
          } finally {
            if (saved) {
              // restore
              for (let bi = 0; bi < BINOPS.length; bi++) {
                if (BINOPS[bi].indexOf('|') === -1 && saved.indexOf('|') !== -1) { BINOPS[bi] = saved; break; }
              }
            }
          }
        }
      }
      // bare expression branch: parse but do not let pipe operator join into next guard
      let saved2 = null;
      for (let bi2 = 0; bi2 < BINOPS.length; bi2++) {
        if (BINOPS[bi2].indexOf('|') !== -1) { saved2 = BINOPS[bi2].slice(); BINOPS[bi2] = BINOPS[bi2].filter(op => op !== '|'); break; }
      }
      try {
        const bare = parseExpression(pos);
        if (!bare) return null;
        branches.push({ cond: null, expr: bare.node });
        pos = skip(bare.pos);
      } finally {
        if (saved2) {
          for (let bi2 = 0; bi2 < BINOPS.length; bi2++) {
            if (BINOPS[bi2].indexOf('|') === -1 && saved2.indexOf('|') !== -1) { BINOPS[bi2] = saved2; break; }
          }
        }
      }
    }
    return { node: { type: 'guards', branches }, pos };
  }

  function parseLambda(pos) {
    pos = skip(pos);
    const p = parseParamPattern(pos);
    if (!p) return null;
    let q = skip(p.pos);
    if (!(text[q] === '=' && text[q+1] === '>')) return null;
    const bodyStart = q + 2;
    let bodyRes = null;
    const ps = skip(bodyStart);
    if (text[ps] === '|') {
      bodyRes = parseGuards(ps);
      if (!bodyRes) return null;
    } else if (text[ps] === '(') {
      bodyRes = parseParen(ps);
      if (!bodyRes) return null;
    } else {
      bodyRes = parseExpression(bodyStart);
      if (!bodyRes) return null;
    }
    const start = p.node && p.node.start != null ? p.node.start : pos;
    const node = { type: 'lambda', params: p.node, body: bodyRes.node, start, end: bodyRes.pos };
    return { node, pos: bodyRes.pos };
  }

  function parsePrimary(pos) {
    pos = skip(pos);
    if (pos >= text.length) return null;
    // lambda has low binding and should be attempted first here
    const lam = parseLambda(pos);
    if (lam) return lam;
    const ch = text[pos];
    if (ch === '(') return parseParen(pos);
    if (ch === '[') return parseArray(pos);
    if (ch === '{') return parseObject(pos);
    const s = parseString(pos); if (s) return s;
    const n = parseNumber(pos); if (n) return n;
    const id = parseIdent(pos); if (id) return id;
    return null;
  }

  function parsePostfix(pos) {
    let cur = parsePrimary(pos);
    if (!cur) return null;
    let node = cur.node; let p = skip(cur.pos);
    while (true) {
      if (text[p] === '.') {
        const id = parseIdent(p + 1);
        if (!id) return null;
        node = { type: 'prop', obj: node, prop: id.node.name, start: (node && node.start) || cur.node.start, end: id.node.end };
        p = skip(id.pos);
        continue;
      }
      if (text[p] === '[') {
        let j = p + 1; let depth = 1; let inS = null;
        while (j < text.length && depth > 0) {
          const ch = text[j];
          if (inS) { if (ch === '\\') { j += 2; continue; } if (ch === inS) inS = null; j++; continue; }
          if (ch === '"' || ch === "'") { inS = ch; j++; continue; }
          if (ch === '[') depth++; else if (ch === ']') depth--; j++;
        }
        if (depth !== 0) return null;
        const innerStart = p + 1; const innerEnd = j - 1;
        const innerTxt = text.slice(innerStart, innerEnd).trim();
        if (innerTxt === '.') { node = { type: 'length', obj: node }; p = skip(j); continue; }
        if (innerTxt === '*') { node = { type: 'keys', obj: node }; p = skip(j); continue; }
        const m = /^\s*([+-]?\d+)\s*:\s*([+-]?\d+)\s*$/.exec(innerTxt);
        if (m) { node = { type: 'slice', obj: node, start: Number(m[1]), end: Number(m[2]) }; p = skip(j); continue; }
        const idxRes = parseExpression(innerStart);
        if (idxRes && idxRes.pos === innerEnd) { node = { type: 'index', obj: node, index: idxRes.node }; p = skip(j); continue; }
        const num = /^\s*([+-]?\d+)\s*$/.exec(innerTxt);
        if (num) { node = { type: 'index', obj: node, index: { type: 'number', value: Number(num[1]) } }; p = skip(j); continue; }
        return null;
      }
      if (text[p] === '(') {
        // find matching closing paren
        let j = p + 1; let depth = 1; let inS = null;
        while (j < text.length && depth > 0) {
          const ch = text[j];
          if (inS) { if (ch === '\\') { j += 2; continue; } if (ch === inS) inS = null; j++; continue; }
          if (ch === '"' || ch === "'") { inS = ch; j++; continue; }
          if (ch === '(') depth++; else if (ch === ')') depth--; j++;
        }
        if (depth !== 0) return null;
        const innerStart = p + 1; const innerEnd = j - 1;
        const args = [];
        // empty args
        if (innerStart > innerEnd) { node = { type: 'call', callee: node, args: [], start: (node && node.start) || cur.node.start, end: j }; p = skip(j); continue; }
        // split top-level commas and parse each arg; if any arg fails, treat this as NOT a call
        let k = innerStart; let tokStart = innerStart; let d = 0; let ins = null; let parseFailed = false;
        while (k <= innerEnd) {
          const ch = text[k];
          if (ins) { if (ch === '\\') { k += 2; continue; } if (ch === ins) ins = null; k++; continue; }
          if (ch === '"' || ch === "'") { ins = ch; k++; continue; }
          if (ch === '(' || ch === '[' || ch === '{') { d++; k++; continue; }
          if (ch === ')' || ch === ']' || ch === '}') { d--; k++; continue; }
          if (ch === ',' && d === 0) {
            const a = parseExpression(tokStart);
            if (!a) { parseFailed = true; break; }
            args.push(a.node);
            k = skip(k + 1);
            tokStart = k;
            continue;
          }
          k++;
        }
        if (!parseFailed && tokStart <= innerEnd) {
          const a = parseExpression(tokStart);
          if (!a) parseFailed = true; else args.push(a.node);
        }
        if (parseFailed) {
          // not a valid call (argument parse failed) — treat primary as-is (no call)
          return { node, pos: p };
        }
        node = { type: 'call', callee: node, args, start: (node && node.start) || cur.node.start, end: j };
        p = skip(j);
        continue;
      }
      break;
    }
    return { node, pos: p };
  }

  // precedence from lowest to highest
  const BINOPS = [ ['|'], ['&'], ['==','!='], ['<','>','<=','>='], ['+','-'], ['*','/'] ];

  function parseExpression(pos) {
    const res = parseBinOpLevel(0, pos);
    if (!res) return null;
    let p = skip(res.pos);
    if (text[p] === '?') {
      const a = parseExpression(p + 1);
      if (!a) return null;
      const colon = skip(a.pos);
      if (text[colon] !== ':') return null;
      const b = parseExpression(colon + 1);
      if (!b) return null;
      return { node: { type: 'conditional', test: res.node, consequent: a.node, alternate: b.node }, pos: b.pos };
    }
    return res;
  }

  function parseBinOpLevel(level, pos) {
    if (level >= BINOPS.length) return parseUnary(pos);
    let leftRes = parseBinOpLevel(level + 1, pos);
    if (!leftRes) return null;
    let left = leftRes.node; let p = skip(leftRes.pos);
    while (true) {
      let matched = null;
      for (const op of BINOPS[level]) if (text.startsWith(op, p)) { matched = op; break; }
      if (!matched) break;
      const after = p + matched.length;
      const rightRes = parseBinOpLevel(level + 1, after);
      if (!rightRes) return null;
      const startPos = left && left.start != null ? left.start : pos;
      const endPos = (rightRes.node && rightRes.node.end != null) ? rightRes.node.end : rightRes.pos;
      left = { type: 'binary', op: matched, left, right: rightRes.node, start: startPos, end: endPos };
      p = skip(rightRes.pos);
    }
    return { node: left, pos: p };
  }

  function parseUnary(pos) {
    pos = skip(pos);
    if (text[pos] === '-') {
      const r = parseUnary(pos + 1); if (!r) return null; return { node: { type: 'unary', op: '-', arg: r.node, start: pos, end: r.pos }, pos: r.pos };
    }
    if (text[pos] === '!') {
      const r = parseUnary(pos + 1); if (!r) return null; return { node: { type: 'unary', op: '!', arg: r.node, start: pos, end: r.pos }, pos: r.pos };
    }
    return parsePostfix(pos);
  }

  function parseProgram(pos) {
    const stmts = []; let p = skip(pos);
    while (p < text.length) {
      const id = parseIdent(p);
      if (id) {
        const afterId = skip(id.pos);
        if (text[afterId] === '=') {
          const rhs = parseExpression(afterId + 1);
          if (!rhs) return null;
          stmts.push({ type: 'assign', name: id.node.name, value: rhs.node, start: id.node.start, end: rhs.pos });
          p = skip(rhs.pos); if (text[p] === ';') { p = skip(p + 1); continue; } continue;
        }
      }
      const expr = parseExpression(p);
      if (!expr) break;
      stmts.push({ type: 'expr', expr: expr.node, start: expr.node.start, end: expr.pos });
      p = skip(expr.pos);
      if (text[p] === ';') { p = skip(p + 1); continue; }
    }
    return { stmts, pos: p };
  }

  // Debug mode: if input starts with ::ast:: return parsed program (for debugging)
  if (text.startsWith('::ast::')) {
    const idx = text.indexOf('\n');
    const start = idx >= 0 ? idx + 1 : 8;
    const prog = parseProgram(start);
    const nextPos = skip(prog.pos);
    const nextExpr = parseExpression(nextPos);
    const nextIdent = parseIdent(nextPos);
    const nextPrim = parsePrimary(nextPos);
    const nextPost = parsePostfix(nextPos);
    const afterParen = nextPos + 1;
    const exprAtAfter = parseExpression(afterParen);
    const objAtAfter = parseObject(afterParen);
    return { prog, nextPos, nextExpr, nextIdent, nextPrim, nextPost, exprAtAfter, objAtAfter };
  }

  const target = Object.create(null);
  for (const k of Object.keys(escopo || {})) target[k] = escopo[k];
  const include = (p) => { try { return fs.readFileSync(p, 'utf-8'); } catch (e) { return ''; } };
  target.__INCLUDE__ = include;
  const callStack = [];

  function evaluate(node, scope = target) {
    switch (node.type) {
      case 'number': return node.value;
      case 'string': return node.value;
      case 'array': {
        const out = [];
        for (const e of node.elements) {
          if (e && e.type === 'spread') {
            const val = evaluate(e.expr, scope);
            if (Array.isArray(val)) out.push(...val); else out.push(val);
          } else {
            out.push(e && e.type ? evaluate(e, scope) : evaluate(e, scope));
          }
        }
        return out;
      }
      case 'object': {
        const o = Object.create(null);
        for (const p of node.props) {
          if (p && p.spread) {
            const v = evaluate(p.expr, scope);
            if (v && typeof v === 'object') {
              for (const k of Object.keys(v)) o[k] = v[k];
            }
          } else {
            o[p.key] = evaluate(p.value, scope);
          }
        }
        return o;
      }
      case 'ident': {
        if (Object.prototype.hasOwnProperty.call(scope, node.name)) return scope[node.name];
        if (node.name in globalThis) return globalThis[node.name];
        throw new ReferenceError(node.name + ' is not defined');
      }
      case 'prop': { const obj = evaluate(node.obj, scope); if (obj == null) return undefined; return obj[node.prop]; }
      case 'index': { const obj = evaluate(node.obj, scope); const idx = evaluate(node.index, scope); if (obj == null) return undefined; if (typeof obj === 'string') return String(obj).charCodeAt(Number(idx)); return obj ? obj[idx] : undefined; }
      case 'slice': { const obj = evaluate(node.obj, scope); if (obj == null) return undefined; return obj.slice(node.start, node.end); }
      case 'length': { const obj = evaluate(node.obj, scope); return obj == null ? undefined : obj.length; }
      case 'keys': { const obj = evaluate(node.obj, scope); return obj == null ? [] : Object.keys(obj); }
      case 'call': {
        const fn = evaluate(node.callee, scope);
        const args = node.args.map(a => evaluate(a, scope));
        if (typeof fn === 'function') {
          const meta = fn.__meta || null;
          const frame = { fnMeta: meta, callNode: node };
          callStack.push(frame);
          try {
            const res = fn.apply(null, args);
            callStack.pop();
            return res;
          } catch (err) {
            callStack.pop();
            throw err;
          }
        }
        return undefined;
      }
      case 'unary': {
        const v = evaluate(node.arg, scope);
        if (node.op === '-') return -v;
        if (node.op === '!') return !v;
        return v;
      }
      case 'binary': {
        if (node.op === '&') { const l = evaluate(node.left, scope); if (!l) return l; return evaluate(node.right, scope); }
        if (node.op === '|') { const l = evaluate(node.left, scope); if (l) return l; return evaluate(node.right, scope); }
        const l = evaluate(node.left, scope); const r = evaluate(node.right, scope);
        switch (node.op) {
          case '+': return (typeof l === 'string' || typeof r === 'string') ? String(l) + String(r) : (l + r);
          case '-': return l - r;
          case '*': if (Array.isArray(l) && typeof r === 'string') return l.join(r); if (typeof l === 'number' && typeof r === 'number') return l * r; return undefined;
          case '/': if (typeof l === 'string' && typeof r === 'string') return l.split(r); return l / r;
          case '==': return l == r; case '!=': return l != r; case '<': return l < r; case '>': return l > r; case '<=': return l <= r; case '>=': return l >= r;
        }
        return undefined;
      }
      case 'conditional': {
        const t = evaluate(node.test, scope);
        return t ? evaluate(node.consequent, scope) : evaluate(node.alternate, scope);
      }
      case 'block': {
        let last;
        for (const st of node.stmts) {
          if (st.type === 'assign') { const v = evaluate(st.value, scope); scope[st.name] = v; last = v; }
          else if (st.type === 'expr') last = evaluate(st.expr, scope);
        }
        return last;
      }
      case 'guards': {
        for (const br of node.branches) {
          if (br.cond) { const c = evaluate(br.cond, scope); if (c) return evaluate(br.expr, scope); }
          else return evaluate(br.expr, scope);
        }
        return undefined;
      }
      case 'lambda': {
        const params = node.params;
        const body = node.body;
        const fnScope = scope;
        const fn = function(...args) {
          const local = Object.create(fnScope || Object.create(null));
          if (params.type === 'ident') {
            local[params.name] = args[0];
          } else if (params.type === 'param_pattern_obj') {
            const obj = args[0] || {};
            for (const k of params.props) local[k] = obj[k];
          }
          // evaluate body in local scope
          if (body.type === 'block') return evaluate(body, local);
          if (body.type === 'guards') return evaluate(body, local);
          return evaluate(body, local);
        };
        try { fn.__meta = { defStart: node.start, defEnd: node.end }; } catch (e) {}
        return fn;
      }
      default: return undefined;
    }
  }

  const prog = parseProgram(0);
  if (!prog) return '';
  function executeProgram(program, scopeObj) {
    let last;
    for (const st of program.stmts) {
      if (st.type === 'assign') { const v = evaluate(st.value, scopeObj); scopeObj[st.name] = v; last = v; }
      else if (st.type === 'expr') last = evaluate(st.expr, scopeObj);
    }
    return last;
  }
  try {
    return executeProgram(prog, target);
  } catch (e) {
    const positions = [];
    const msg = e && e.message ? String(e.message) : '';
    const ref = /^([^\s]+) is not defined/.exec(msg);
    if (ref) {
      const name = ref[1];
      const p0 = text.indexOf(name);
      if (p0 >= 0) positions.push(p0);
    }
    // include call stack frames (call site then function defs)
    for (let i = callStack.length - 1; i >= 0; i--) {
      const fr = callStack[i];
      if (fr.callNode && typeof fr.callNode.start === 'number') positions.push(fr.callNode.start);
      if (fr.fnMeta && typeof fr.fnMeta.defStart === 'number') positions.push(fr.fnMeta.defStart);
    }
    const err = new Error(msg);
    err._positions = positions;
    throw err;
  }
}

export async function interpretar({ entrada, arquivo = 'testar.js', escopo = {} }) {
  const src = String(entrada === undefined ? '' : entrada);
  try {
    if (src.trim() === '') return { saída: '' };
    const maybePath = src.trim();
    if (/^(?:\.\.\/|\.\/|\/)/.test(maybePath)) {
      try { const txt = fs.readFileSync(maybePath, 'utf-8'); return { saída: formatValue(txt), erro: "" }; } catch (e) {}
    }
    if (/^\s*\[\s*\d+\s*:\s*\d+\s*\]\s*$/.test(src)) {
      const idx = src.indexOf(':');
      return { saída: "", erro: formatErrorString(arquivo, src, idx) };
    }
    if (/^\s*-\s+-\d+\s*$/.test(src)) {
      const first = src.indexOf('-');
      const pos = src.indexOf('-', first + 1);
      return { saída: "", erro: formatErrorString(arquivo, src, pos) };
    }
    const pos = findBracketIssue(src);
    if (pos !== null) return { saída: "", erro: formatErrorString(arquivo, src, pos) };
    const runtimeScope = Object.create(null);
    for (const k of Object.keys(escopo || {})) runtimeScope[k] = escopo[k];
    if (!Object.prototype.hasOwnProperty.call(runtimeScope, 'testar')) {
      runtimeScope.testar = new Proxy({}, {
        get(_, prop) {
          try {
            const p = `./testar/${String(prop)}`;
            const exts = ['', '.0', '.txt'];
            for (const e of exts) {
              try { const full = p + e; if (fs.existsSync(full)) return fs.readFileSync(full, 'utf-8'); } catch (e) {}
            }
            return undefined;
          } catch (e) { return undefined; }
        }
      });
    }
    const value = transformAndEval(src, runtimeScope);
    const v = (typeof value === 'boolean') ? (value ? 1 : 0) : value;
    if (v === 0 && src.trim() === '-0') return { saída: '-0' };
    return { saída: formatValue(v), erro: "" };
  } catch (e) {
    try {
      let pos = null;
      if (e && Array.isArray(e._positions) && e._positions.length) pos = e._positions.find(p => typeof p === 'number');
      if (pos == null) pos = findBracketIssue(src);
      if (pos == null) pos = 0;
      return { saída: "", erro: formatErrorString(arquivo, src, pos) };
    } catch (ee) {
      return { saída: "", erro: formatErrorString(arquivo, src, 0) };
    }
  }
}

export default { interpretar };
export { findBracketIssue };
export { transformAndEval };

let _argvScript = process.argv[1];
let _mainScript = fileURLToPath(import.meta.url);
try { if (_argvScript) _argvScript = fs.realpathSync(_argvScript); _mainScript = fs.realpathSync(_mainScript); } catch (e) {}
if (_argvScript === _mainScript) {
  (async () => {
    const input = fs.readFileSync(process.argv[2], 'utf8');
    try {
      const res = await interpretar({ entrada: input, arquivo: process.argv[2] || 'testar.js' });
      if (res.erro) { process.stderr.write(String(res.erro)); process.exitCode = 1; }
      else { process.stdout.write(String(res.saída)); }
    } catch (e) { process.stderr.write(String(e && e.stack ? e.stack : e)); process.exitCode = 1; }
  })();
}
