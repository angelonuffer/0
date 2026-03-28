import fs from "fs";
import analisar from "./fontes/analisar.js";

export async function interpretar({ entrada, arquivo = "<entrada>", escopo = {} }) {
  const parsed = analisar(entrada, arquivo);

  if (parsed.vazio) return { saída: "", erro: "" };

  if (parsed.texto) return { saída: parsed.texto, erro: "" };

  if (parsed.inclusão) {
    try {
      const content = fs.readFileSync(parsed.inclusão.texto, 'utf-8');
      return { saída: content.trim(), erro: "" };
    } catch (e) {
      return { saída: "", erro: `${arquivo}\n1:1\n${entrada}\n^\n` };
    }
  }

  if (parsed.arquivo) {
    try {
      const content = fs.readFileSync(parsed.arquivo, 'utf-8');
      return { saída: content.trim(), erro: "" };
    } catch (e) {
      return { saída: "", erro: `${arquivo}\n1:1\n${entrada}\n^\n` };
    }
  }

  if (parsed.soma) {
    try {
      const sum = parsed.soma.reduce((acc, item) => acc + Number(item.número), 0);
      return { saída: String(sum), erro: "" };
    } catch (e) {
      return { saída: "", erro: `${arquivo}\n1:1\n${entrada}\n^\n` };
    }
  }

  if (parsed.número) return { saída: parsed.número, erro: "" };

  if (parsed.símbolo) {
    const name = parsed.símbolo;
    if (escopo && Object.prototype.hasOwnProperty.call(escopo, name)) {
      return { saída: String(escopo[name]), erro: "" };
    }
    return { saída: "", erro: "" };
  }

  if (parsed.cru) {
    try {
      const normalized = parsed.cru.replace(/!\s+/g, "!").replace(/\s+\)/g, ")").replace(/\(\s+/g, "(");

      // helper to include file contents at runtime inside evaluated expressions
      const include = (p) => {
        try {
          return fs.readFileSync(String(p), 'utf-8').trim();
        } catch (e) {
          return "";
        }
      };

      // replace @ "path" with include("path") and @ identifier with include(identifier)
      let withIncludes = normalized.replace(/@\s*"([^"]+)"/g, (m, p) => `include("${p}")`);
      withIncludes = withIncludes.replace(/@\s*([A-Za-z_]\w*)/g, (m, id) => `include(${id})`);

      // support the language's [.] operator: convert expressions like X[.] into __ATDOT__(X)
      const wrapAtDot = s => `__ATDOT__(${s})`;
      withIncludes = withIncludes.replace(/(\([^)]*\)|\[[^\]]*\]|"[^"]*"|'[^']*'|[A-Za-z_]\w*|\d+)\s*\[\.\]/g, (m, expr) => wrapAtDot(expr));

      // helper for [.] semantics: last element for arrays, length for strings
      const __ATDOT__ = (x) => {
        if (Array.isArray(x)) return x[x.length - 1];
        if (typeof x === 'string') return x.length;
        return undefined;
      };

      const fn = new Function('fs', 'include', '__ATDOT__', `return (${withIncludes});`);
      let result = fn(fs, include, __ATDOT__);
      if (typeof result === 'boolean') result = result ? 1 : 0;
      if (result === undefined || result === null) return { saída: "", erro: "" };
      return { saída: String(result), erro: "" };
    } catch (e) {
      return { saída: "", erro: `${arquivo}\n1:1\n${entrada}\n^\n` };
    }
  }

  return { saída: "", erro: "" };
}

export default { interpretar };
