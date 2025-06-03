#!/usr/bin/env bash

SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &> /dev/null && pwd)
JS_RUNNER_SCRIPT=$(mktemp /tmp/minimal_runner_XXXXXX.mjs)

cat > "$JS_RUNNER_SCRIPT" <<EOF
import _0 from '${SCRIPT_DIR}/0.js';
import fs from 'fs';
import path from 'path';

// Mock fetch for 0.js if it tries to import/load anything (it shouldn't for this minimal case)
global.fetch = async (url) => {
  console.log("MINIMAL_TEST_RUNNER: Mock fetch called for URL:", url);
  try {
    // For this minimal test, we don't expect any actual file loads via fetch.
    // If it tries to load uniteste.0 or similar, that's unexpected for dummyFunc("Hello").
    // So, we'll return a synthetic "module not found" or empty content.
    // const data = fs.readFileSync(url, 'utf-8');
    console.warn("MINIMAL_TEST_RUNNER: Mock fetch - returning synthetic 'not found' for URL:", url);
    return {
      text: async () => '',
      ok: false,
      status: 404,
      statusText: 'Not Found (Mock)'
    };
  } catch (error) {
    // This catch block might not be reached if fs.readFileSync is commented out.
    console.error("MINIMAL_TEST_RUNNER: Mock fetch - error for URL:", url, error);
    return {
      text: async () => '',
      ok: false,
      status: 500,
      statusText: error.message
    };
  }
};

async function runMinimal() {
  const testFileContent = fs.readFileSync('minimal_test.0', 'utf-8');
  console.log("MINIMAL_TEST_RUNNER: Read minimal_test.0 content:", testFileContent);
  try {
    const parseOutput = _0(testFileContent); // _0 returns [value_or_promise, remaining_code]

    if (!parseOutput) {
      console.error("MINIMAL_TEST_RUNNER: _0 call returned null or undefined. This is unexpected.");
      process.exit(1);
      return;
    }

    let result;
    const valueOrPromise = parseOutput[0];

    if (valueOrPromise && typeof valueOrPromise.then === 'function') {
      console.log("MINIMAL_TEST_RUNNER: _0 returned a Promise. Awaiting...");
      result = await valueOrPromise;
    } else {
      console.log("MINIMAL_TEST_RUNNER: _0 returned a direct value (or error object).");
      result = valueOrPromise;
    }

    console.log("MINIMAL_TEST_RUNNER: Result from _0 (awaited/direct):", JSON.stringify(result, null, 2));

    if (result && typeof result === 'object' && result.error) {
      console.error("MINIMAL_TEST_RUNNER: _0 evaluation resulted in an error object:", JSON.stringify(result, null, 2));
    } else {
      // For this test, the "result" itself isn't the main focus, but the logs during parsing.
      // If it's a function (e.g. dummyFunc was defined as a lambda), it's fine.
      console.log("MINIMAL_TEST_RUNNER: _0 evaluation result type:", typeof result);
    }

  } catch (e) {
    console.error("MINIMAL_TEST_RUNNER: Error during _0 execution or promise resolution:", e);
    console.error("MINIMAL_TEST_RUNNER: Error stack:", e.stack);
    process.exit(1); // Exit with error if any exception occurs
  }
  // If no exceptions, exit successfully. The actual "success" is determined by analyzing logs.
  console.log("MINIMAL_TEST_RUNNER: Execution finished.");
  process.exit(0);
}

runMinimal();
EOF

# Ensure 0.js is in the current directory or adjust path if needed.
if [ ! -f "0.js" ]; then
    echo "Erro: 0.js não encontrado no diretório atual."
    echo "Certifique-se de que você está executando o script a partir do diretório que contém 0.js."
    rm "$JS_RUNNER_SCRIPT"
    exit 1
fi

# Grant execute permission to the temporary runner script
chmod +x "$JS_RUNNER_SCRIPT"

# Execute the script JS runner with Node.js
node --experimental-modules "$JS_RUNNER_SCRIPT"
EXIT_CODE=$?

# Remove the script temporário
rm "$JS_RUNNER_SCRIPT"

exit $EXIT_CODE
