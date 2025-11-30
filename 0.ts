#!/usr/bin/env -S deno run --allow-read --allow-net

import { parse as yamlParse } from "https://deno.land/std@0.203.0/yaml/mod.ts";
import { join } from "https://deno.land/std@0.203.0/path/mod.ts";

type TestSpec = {
  entrada?: string;
  "saída"?: string;
  saida?: string;
  erro?: string;
};

async function findYamlFiles(dir: string): Promise<string[]> {
  const out: string[] = [];
  for await (const entry of Deno.readDir(dir)) {
    const path = join(dir, entry.name);
    if (entry.isDirectory) {
      out.push(...await findYamlFiles(path));
    } else if (
      entry.isFile &&
      (entry.name.endsWith(".yaml") || entry.name.endsWith(".yml"))
    ) {
      out.push(path);
    }
  }
  return out;
}

function expectKeys(obj: unknown): TestSpec {
  return (obj ?? {}) as TestSpec;
}

async function loadImpl(): Promise<unknown> {
  const candidates = [
    "./gramática/mod.ts",
    "./gramática.ts",
    "./gramática/index.ts",
    "./gramatica/mod.ts",
    "./gramatica.ts",
  ];
  for (const c of candidates) {
    try {
      const m = await import(c);
      return m;
    } catch {
      // try next
    }
  }
  throw new Error(
    "Não foi possível carregar a implementação em `gramática` (procure por ./gramática/mod.ts ou ./gramática.ts)",
  );
}

function pickImpl(
  module: unknown,
): ((input: string) => Promise<unknown>) | undefined {
  const mod = module as Record<string, unknown> | undefined;
  const keys = ["run", "parse", "default", "evaluate", "process"] as const;
  for (const k of keys) {
    const maybe = mod ? mod[k as string] : undefined;
    if (typeof maybe === "function") {
      const fn = maybe as (...args: unknown[]) => unknown;
      return (s: string) => Promise.resolve(fn(s));
    }
  }
  return undefined;
}

async function runTest(
  filePath: string,
  implFn: (input: string) => Promise<unknown>,
) {
  const text = await Deno.readTextFile(filePath);
  const doc = yamlParse(text) as unknown;
  const spec = expectKeys(doc ?? {});
  const entrada = spec.entrada ?? "";
  const expectedOut = spec["saída"] ?? spec.saida;
  const expectedErr = spec.erro;

  let actualOut: string | undefined;
  let actualErr: string | undefined;
  try {
    const res = await implFn(entrada);
    if (res == null) {
      actualOut = "";
    } else if (typeof res === "string") {
      actualOut = res;
    } else if (typeof res === "object") {
      const r = res as Record<string, unknown>;
      actualOut = (r["output"] as string | undefined) ??
        (r["saída"] as string | undefined) ??
        (r["saida"] as string | undefined) ??
        (r["result"] as string | undefined);
      actualErr = (r["error"] as string | undefined) ??
        (r["erro"] as string | undefined) ?? (r["err"] as string | undefined);
      if (actualOut == null && actualErr == null) {
        try {
          actualOut = JSON.stringify(r);
        } catch {
          actualOut = String(r);
        }
      }
    } else {
      actualOut = String(res);
    }
  } catch (ex: unknown) {
    if (ex instanceof Error) {
      const e = ex as Error & { consumed?: string };
      const msg = e.message ?? "";
      const consumed = e.consumed;
      if (!consumed) {
        actualErr = msg;
      } else {
        // compute line and column from consumed prefix
        const before = consumed;
        const lineNum = before.split("\n").length;
        const lastNewline = before.lastIndexOf("\n");
        const caretCol = before.length - lastNewline;
        const inputLines = entrada.split("\n");
        const ctx = inputLines[lineNum - 1] ?? "";

        // extract expected token/description from original error message
        const msgLines = msg.split("\n").map((l) => l.replace(/\r$/, ""));
        let expected = "";
        for (let i = msgLines.length - 1; i >= 0; i--) {
          const t = msgLines[i].trim();
          if (t.length === 0) continue;
          if (/^\d+:\d+:/.test(t)) break;
          if (/^\^+$/.test(t)) continue;
          expected = t;
          break;
        }

        const left = `${lineNum}:${caretCol}: `;
        const caretPadding = " ".repeat(left.length + caretCol - 1);
        const expectedLine = expected ? `${caretPadding}${expected}\n` : "";
        actualErr = `${left}${ctx}\n${caretPadding}^\n${expectedLine}`;
      }
    } else {
      actualErr = String(ex);
    }
  }

  const pass = (() => {
    if (expectedErr !== undefined) {
      return (actualErr ?? "").trim() === expectedErr.trim();
    }
    if (expectedOut !== undefined) {
      return (actualOut ?? "").trim() === expectedOut.trim();
    }
    return true;
  })();

  return {
    filePath,
    pass,
    expectedOut,
    expectedErr,
    actualOut,
    actualErr,
    input: entrada,
  };
}

async function main() {
  const args = Deno.args;
  const rootTests = "./testes";

  if (args.length === 0) {
    const files = await findYamlFiles(rootTests);
    if (files.length === 0) {
      console.log("Nenhum arquivo de teste encontrado em `testes/`.");
      return;
    }

    let module;
    try {
      module = await loadImpl();
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error(e.message);
      } else {
        console.error(String(e));
      }
      Deno.exit(2);
    }
    const implFn = pickImpl(module);
    if (!implFn) {
      console.error(
        "A implementação em `gramática` não exporta uma função utilizável (procure por `run`, `parse`, `default`, `evaluate` ou `process`).",
      );
      Deno.exit(2);
    }

    let failed = 0;
    for (const f of files.sort()) {
      const r = await runTest(f, implFn);
      if (r.pass) {
        console.log(`OK  ${f}`);
      } else {
        failed++;
        console.log(`FAIL ${f}`);
        console.log("  entrada:");
        console.log(indent(r.input));
        if (r.expectedErr !== undefined) {
          console.log("  erro esperado:");
          console.log(indent(r.expectedErr));
          console.log("  erro obtido:");
          console.log(indent(r.actualErr ?? "(nenhum)\n"));
        } else {
          console.log("  saída esperada:");
          console.log(indent(r.expectedOut ?? "(nenhuma)\n"));
          console.log("  saída obtida:");
          console.log(indent(r.actualOut ?? "(nenhuma)\n"));
        }
      }
    }

    if (failed > 0) {
      console.log(`${failed} teste(s) falharam.`);
      Deno.exit(1);
    } else {
      console.log("Todos os testes passaram.");
    }
  } else {
    console.log(
      "Uso: executar sem argumentos para rodar todos os testes em `testes/`.",
    );
  }
}

function indent(s: string) {
  return s.split("\n").map((l) => "    " + l).join("\n");
}

await main();
