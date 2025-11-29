#!/usr/bin/env -S deno run --allow-read

const [filePath] = Deno.args;

if (!filePath) {
  try {
    // Lista de caminhos dos módulos de teste (mantidos em forma de strings
    // para permitir prefixar a saída por arquivo ao executá-los).
    const modules = [
      "./gramática/tipos_literais/número.ts",
      "./gramática/tipos_literais/texto.ts",
      "./gramática/operadores/adição.ts",
      "./gramática/operadores/subtração.ts",
      "./gramática/operadores/multiplicação.ts",
      "./gramática/operadores/divisão.ts",
      "./gramática/expressão.ts",
      "./gramática/espaço.ts",
    ];

    let totalPassed = 0;

    for (const modPath of modules) {
      try {
        const mod = await import(modPath);

        if (typeof mod.runTests === "function") {
          const origLog = console.log;
          const origError = console.error;

          // Prefixa cada linha de saída com o caminho do módulo atual
          console.log = (...args: unknown[]) => origLog(`[${modPath}]`, ...args);
          console.error = (...args: unknown[]) => origError(`[mod:${modPath}]`, ...args);

          try {
            const passed = mod.runTests();
            if (typeof passed === "number") totalPassed += passed;
          } catch (err) {
            console.error("Falha ao executar os testes:", err instanceof Error ? err.message : String(err));
          } finally {
            // Restaura as funções originais para não poluir outros módulos
            console.log = origLog;
            console.error = origError;
          }
        }
      } catch (err) {
        console.error(`Erro ao importar '${modPath}':`, err instanceof Error ? err.message : String(err));
      }
    }

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
