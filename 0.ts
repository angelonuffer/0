#!/usr/bin/env -S deno run --allow-read

const [filePath] = Deno.args;

if (!filePath) {
  try {
    // Importa os módulos de teste e executa suas funções `runTests`.
    const numeroMod = await import("./gramática/tipos_literais/número.ts");
    const adicaoMod = await import("./gramática/operadores/adição.ts");
    const expressaoMod = await import("./gramática/expressão.ts");
    const espacoMod = await import("./gramática/espaço.ts");

    let totalPassed = 0;
    if (typeof numeroMod.runTests === "function") totalPassed += numeroMod.runTests();
    if (typeof adicaoMod.runTests === "function") totalPassed += adicaoMod.runTests();
    if (typeof expressaoMod.runTests === "function") totalPassed += expressaoMod.runTests();
    if (typeof espacoMod.runTests === "function") totalPassed += espacoMod.runTests();

    console.log(`Todos os testes executados com sucesso. Total passados: ${totalPassed}`);
    Deno.exit(0);
  } catch (err) {
    console.error("Falha ao executar os testes:", err instanceof Error ? err.message : String(err));
    Deno.exit(1);
  }
}

try {
  const content = Deno.readTextFileSync(filePath);
  console.log(content);
} catch (err) {
  console.error(`Erro ao ler '${filePath}':`, err instanceof Error ? err.message : String(err));
  Deno.exit(1);
}
