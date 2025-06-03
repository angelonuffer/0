#!/usr/bin/env bash

# rodar_testes.sh - Script para executar testes da Linguagem 0

SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &> /dev/null && pwd)

# Verifica se o Node.js está instalado
if ! command -v node &> /dev/null
then
    echo "Node.js não encontrado. Por favor, instale Node.js para rodar os testes."
    exit 1
fi

# Cria um arquivo JavaScript temporário para executar os testes
# Este script JS importará o interpretador 0.js e o arquivo de teste.
JS_RUNNER_SCRIPT=$(mktemp /tmp/runner_XXXXXX.mjs)

# O nome do arquivo de teste (corrigido de número.0 para numero.0)
TEST_FILE="testes/numero.0"

# Conteúdo do script JS runner
# Usamos .mjs para permitir 'import' de alto nível.
cat > "$JS_RUNNER_SCRIPT" <<EOF
// Importa o interpretador da Linguagem 0 usando o caminho absoluto
import _0 from '${SCRIPT_DIR}/0.js';
import fs from 'fs';
import path from 'path';

// Função para simular o 'fetch' para arquivos locais, pois 0.js usa fetch.
// Isso é uma simplificação; um 'fetch' real tem mais features.
global.fetch = async (url) => {
  try {
    const data = fs.readFileSync(url, 'utf-8');
    return {
      text: async () => data,
      ok: true,
    };
  } catch (error) {
    return {
      text: async () => '',
      ok: false,
      statusText: error.message,
    };
  }
};

async function executarTestes() {
  let passedCount = 0;
  let failedCount = 0;
  let testResults;

  try {
    // Lê o conteúdo do arquivo de teste .0
    const testFileContent = fs.readFileSync('$TEST_FILE', 'utf-8');

    // Executa o código de teste da Linguagem 0
    const parseOutput = _0(testFileContent); // _0 (built with transformar) returns [Promise | null, String]

    if (!parseOutput || parseOutput[0] === null) {
        console.error("Erro: Falha ao executar o código do arquivo de teste (parser interno retornou null).");
        // parseOutput can be null if code is empty, or parseOutput[0] can be null if seq inside _0 failed.
        // parseOutput[1] would be the remaining code.
        process.exit(1);
    }

    const promiseValue = parseOutput[0]; // This is the promise from the async transform function in _0
    // parseOutput[1] is the remaining code string, should be empty if all parsed by _0's seq.

    const evaluatedValue = await promiseValue; // This is the actual value from the async transform function.
    console.log("DEBUG: evaluatedValue is Array?", Array.isArray(evaluatedValue));
    console.log("DEBUG: evaluatedValue typeof", typeof evaluatedValue);
    // console.log("DEBUG: evaluatedValue content", evaluatedValue); // Potentially verbose

    // At this point, evaluatedValue is what uniteste.descrever(...) returned.
    // This should be the array of test objects.
    let rawResults = evaluatedValue;

    // Se o resultado for uma função (comum em 0.js para módulos que exportam uma função principal),
    // execute-a com um escopo vazio.
    // No nosso caso, o transformador async em _0 já fez a chamada final (valor(escopo)),
    // então rawResults deveria ser o valor final (a lista de testes).
    // Manteremos a verificação por segurança ou se a estrutura do teste mudar.
    if (typeof rawResults === 'function') {
        testResults = await rawResults({});
    } else {
        testResults = rawResults;
    }

    // testResults deveria ser agora a lista de objetos de teste.
    if (!Array.isArray(testResults)) {
      console.error("Resultado da execução dos testes não foi uma lista como esperado.");
      console.error("Recebido:", testResults);
      process.exit(1);
    }

    console.log("\n--- Resultados dos Testes ---");
    for (const result of testResults) {
      if (result.status === "passou") {
        console.log(\`PASSOU: \${result.suite} - \${result.teste}\`);
        passedCount++;
      } else {
        console.log(\`FALHOU: \${result.suite} - \${result.teste}\`);
        if (result.mensagem) {
          console.log(\`  Mensagem: \${result.mensagem}\`);
        }
        failedCount++;
      }
    }

  } catch (error) {
    console.error("\nERRO GERAL AO EXECUTAR OS TESTES:", error);
    failedCount++; // Considera erro geral como uma falha
  }

  console.log("\n--- Resumo ---");
  console.log(\`Testes executados: \${passedCount + failedCount}\`);
  console.log(\`Passaram: \${passedCount}\`);
  console.log(\`Falharam: \${failedCount}\`);
  console.log("--------------");

  if (failedCount > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

executarTestes();
EOF

# Garante que 0.js está no diretório atual ou ajusta o caminho se necessário.
# O script runner espera que 0.js esteja no mesmo diretório de onde node é chamado.
if [ ! -f "0.js" ]; then
    echo "Erro: 0.js não encontrado no diretório atual."
    echo "Certifique-se de que você está executando rodar_testes.sh a partir do diretório raiz do projeto."
    rm "$JS_RUNNER_SCRIPT"
    exit 1
fi

# Executa o script JS runner com Node.js
# Adiciona a flag para módulos ES
# Não precisamos mais passar PROJECT_ROOT_PATH como env var
node --experimental-modules "$JS_RUNNER_SCRIPT"

# Remove o script temporário
rm "$JS_RUNNER_SCRIPT"
