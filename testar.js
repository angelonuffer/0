#!/usr/bin/env node

import _0 from './0.js';
import fs from 'fs';
import path from 'path';

const EXAMPLES_FILE = 'exemplos.md';

async function parseTestCases() {
  try {
    let content = fs.readFileSync(EXAMPLES_FILE, 'utf-8');
    content = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    const testCases = [];
    const parts = content.split('```');

    const enableDetailedLogging = false;
    let firstFailureLogged = false;

    for (let i = 1; i < parts.length; i += 2) {
      let code = "";
      let rawCode = "";
      let expectedOutput = "";
      let foundInBlock = false;

      const currentBlockContent = parts[i];
      const afterCurrentBlock = parts[i+1];

      if (!currentBlockContent && currentBlockContent !== "") {
          if (enableDetailedLogging && !firstFailureLogged) {
            console.log(`DEBUG: currentBlockContent at index ${i} is null or undefined.`);
            firstFailureLogged = true;
          }
          continue;
      }

      const blockSeparatorIndex = currentBlockContent.indexOf('\n---\n');

      if (blockSeparatorIndex !== -1) {
        rawCode = currentBlockContent.substring(0, blockSeparatorIndex);
        expectedOutput = currentBlockContent.substring(blockSeparatorIndex + '\n---\n'.length).trim();

        const firstNewlineInRawCode = rawCode.indexOf('\n');
        code = (firstNewlineInRawCode === -1 ? rawCode : rawCode.substring(firstNewlineInRawCode + 1)).trim();
        foundInBlock = true;
      } else {
        rawCode = currentBlockContent;
        const firstNewlineInRawCode = rawCode.indexOf('\n');
        code = (firstNewlineInRawCode === -1 ? rawCode : rawCode.substring(firstNewlineInRawCode + 1)).trim();

        if (afterCurrentBlock) {
          const externalSeparatorRegex = /(?:^|\n)\s*---\s*(?:\n|$)/;
          const separatorMatch = afterCurrentBlock.match(externalSeparatorRegex);

          if (separatorMatch) {
            const outputStartIndex = separatorMatch.index + separatorMatch[0].length;
            expectedOutput = afterCurrentBlock.substring(outputStartIndex).trim();
          } else {
            if (enableDetailedLogging && !firstFailureLogged) { console.log(`DEBUG: Separator "---" not found IN BLOCK for code starting with "${code.substring(0,30)}..." AND ALSO NOT FOUND AFTER BLOCK.`); firstFailureLogged = true; }
            continue;
          }
        } else {
             if (enableDetailedLogging && !firstFailureLogged) { console.log(`DEBUG: Missing afterCurrentBlock for code starting with: ${currentBlockContent.substring(0,30)}`); firstFailureLogged = true; }
             continue;
        }
      }

      if (!foundInBlock && expectedOutput) {
        let trimIndex = expectedOutput.length;
        const nextMajorHeadingRelativeIndex = expectedOutput.indexOf('\n# ');
        if (nextMajorHeadingRelativeIndex !== -1) { trimIndex = Math.min(trimIndex, nextMajorHeadingRelativeIndex); }
        const nextSubHeadingRelativeIndex = expectedOutput.indexOf('\n## ');
        if (nextSubHeadingRelativeIndex !== -1) { trimIndex = Math.min(trimIndex, nextSubHeadingRelativeIndex); }
        const nextSubSubHeadingRelativeIndex = expectedOutput.indexOf('\n### ');
        if (nextSubSubHeadingRelativeIndex !== -1) { trimIndex = Math.min(trimIndex, nextSubSubHeadingRelativeIndex); }
        const explanationPatterns = [ "\n\nExemplo:", "\n\nNeste caso,", "\n\nExplicação:", "\n\nEsses exemplos", "\n\nEste exemplo", "\n\nAqui,", "\n\nPara obter", "\n\nFunções podem", "\n\nNa linguagem 0,"];
        for (const pattern of explanationPatterns) { const foundIndex = expectedOutput.indexOf(pattern); if (foundIndex !== -1) { trimIndex = Math.min(trimIndex, foundIndex); } }
        expectedOutput = expectedOutput.substring(0, trimIndex).trim();
      }

      if (typeof code === 'string' && typeof expectedOutput === 'string') {
        if (code.length > 0) {
            testCases.push({ code, expectedOutput });
        } else if (code.length === 0 && foundInBlock) {
            testCases.push({ code, expectedOutput });
        }
      }
    }
    return testCases;
  } catch (error) {
    console.error(`Error reading or parsing ${EXAMPLES_FILE}:`, error);
    return [];
  }
}

async function runTests(testCasesToRun, allTestCases) {
  if (!testCasesToRun || testCasesToRun.length === 0) {
    console.log("No test cases selected to run.");
    return { passedCount: 0, failedCount: 0, errorCount: 0 };
  }
  let passedCount = 0;
  let failedCount = 0;
  let errorCount = 0;
  const totalToRun = testCasesToRun.length;
  const overallTotal = allTestCases.length;

  console.log(`\nRunning ${totalToRun} selected test case(s)...`);

  for (let i = 0; i < totalToRun; i++) {
    const tc = testCasesToRun[i];
    const originalIndex = allTestCases.findIndex(originalTc => originalTc.code === tc.code && originalTc.expectedOutput === tc.expectedOutput);

    process.stdout.write(`Test ${originalIndex + 1}/${overallTotal} (Selected ${i + 1}/${totalToRun}): `);
    // console.log(`Code:\n${tc.code}`); // Optional: print code for every test

    try {
      const executionResult = await _0(tc.code);
      let actualValue;
      if (Array.isArray(executionResult)) {
        actualValue = executionResult[0];
      } else {
        console.warn("\nWarning: _0 did not return an array for test case:", tc);
        actualValue = executionResult;
      }

      if (actualValue && typeof actualValue.then === 'function') {
        actualValue = await actualValue;
      }

      if (typeof actualValue === 'function') {
        actualValue = actualValue({});
      }

      let actualOutputString;
      if (typeof actualValue === 'string') {
        actualOutputString = `"${actualValue}"`;
      } else if (Array.isArray(actualValue)) {
        actualOutputString = `[${actualValue.map(item => typeof item === 'string' ? `"${item}"` : String(item)).join(",")}]`;
      } else if (typeof actualValue === 'object' && actualValue !== null) {
        let objStr = "{";
        const keys = Object.keys(actualValue);
        for(let k=0; k < keys.length; k++) {
            const key = keys[k];
            const val = actualValue[key];
            objStr += `"${key}":${typeof val === 'string' ? `"${val}"` : String(val)}`;
            if (k < keys.length - 1) objStr += ",";
        }
        objStr += "}";
        actualOutputString = objStr;
      } else if (typeof actualValue === 'undefined') {
        actualOutputString = "undefined";
      }
      else {
        actualOutputString = String(actualValue);
      }

      let expectedOutputToCompare = tc.expectedOutput;

      if (actualOutputString === expectedOutputToCompare) {
        process.stdout.write("PASS\n");
        passedCount++;
      } else {
        process.stdout.write("FAIL\n");
        failedCount++;
        console.log("  --- Code ---");
        console.log(tc.code);
        console.log("  --- Expected Output ---");
        console.log(tc.expectedOutput);
        console.log("  --- Actual Output (Stringified) ---");
        console.log(actualOutputString);
        console.log("  -------------------------");
      }
    } catch (error) {
      failedCount++; // Count errors as failures for summary purposes
      errorCount++;
      process.stdout.write("ERROR\n");
      console.error("  Error details:", error.message);
      console.log("  --- Code ---");
      console.log(tc.code);
      console.log("  -------------------------");
    }
  }
  console.log(`\n--- Test Summary (for this selection) ---`);
  console.log(`Total Selected Tests: ${totalToRun}`);
  console.log(`Passed: ${passedCount}`);
  console.log(`Failed (incl. errors): ${failedCount}`);
  if (errorCount > 0) console.log(`Errors during execution: ${errorCount}`);
  console.log(`---------------------------------------`);
  return { passedCount, failedCount, errorCount };
}

const errorTestCases = [
  {
    code: "a = 5 + ;",
    // In `símbolo` and `regex`, the `found` part is `código.slice(0, 20).split(/\s/)[0]`
    // For `expressão` -> `termo6` -> `termo5` -> `termo4` -> `termo3` -> `termo2` -> `número` (which is `regex(/\d+/)`)
    // If `+` is followed by `;`, `stripLeadingWhitespaceAndComments` will process `+ ;` to `+;`
    // Then `número` (via `regex`) will be called on code starting with `;`.
    // `regex(/\d+/)` will fail. `found` will be `;`.
    // So the message should be "Expected regex '\d+' but found ';...'"
    expectedError: /Syntax Error: Expected regex '\d+' but found ';\.\.\.'/
  },
  {
    code: "print(;",
    // `parênteses` calls `símbolo(")")`.
    // Code passed to `símbolo(")")` will be `;`. `stripLeadingWhitespaceAndComments` does nothing.
    // `símbolo` will try to match `)` but find `;`.
    // `found` will be `;`.
    // Message: "Expected token ')' but found ';...'"
    expectedError: /Syntax Error: Expected token '\)' but found ';\.\.\.'/
  },
  {
    code: "let x = 10 y = 20", // Missing semicolon or operator between expressions (assuming simple top-level parsing)
    // This depends on how the top-level `expressão` or `declarações_constantes` is structured.
    // If `declarações_constantes` expects a separator or end, and finds `y` after `10`.
    // Or if `expressão` after `10` tries to parse `y` as an operator.
    // `operaçõesSequenciais` in `operação` for `termo4` (for `+`, `-`) or `termo3` (`*`, `/`)
    // It would try `operadores` then `termo`. If `y` is not a valid operator.
    // `alt(operador("+",...), operador("-",...))`
    // `símbolo("+")` on `y` fails. `símbolo("-")` on `y` fails.
    // `alt` returns the error from the last parser, so `Expected token '-' but found 'y...'`
    // This assumes `y` is not stripped. `stripLeadingWhitespaceAndComments("y = 20")` is "y = 20".
    // The `expressão` is `operação(termo6, alt(operador("&"), operador("|")))`.
    // After `10`, the `opcional(vários(seq(operadores,termo)))` in `operação` for `termo4` (for `+`)
    // will try `operadores` which is `alt(operador("+",...), operador("-",...))`.
    // `símbolo("+")` on "y = 20" fails: "Expected token '+' but found 'y...'"
    // `símbolo("-")` on "y = 20" fails: "Expected token '-' but found 'y...'"
    // `alt` returns the last error: "Expected token '-' but found 'y...'"
    expectedError: /Syntax Error: Expected token '-' but found 'y\.\.\.'/
  },
  {
    code: "{a:1 b:2}", // Missing comma in object literal
    // `objeto` parser: `vários(alt(seq(key,símbolo(":"),expr,opcional(símbolo(","))), seq(símbolo("..."),expr,opcional(símbolo(",")))))`
    // After `a:1`, it expects `opcional(símbolo(","))`. If comma is not there, this optional parser succeeds with `""`.
    // Then `vários` tries another iteration. It attempts `alt(...)`.
    // It tries `seq(key, símbolo(":"), expr, opcional(símbolo(",")))`.
    // `key` (`alt(nome, seq(símbolo("["),...))`) will parse `b`.
    // Then `símbolo(":")` is attempted on code starting with `b:2` (after `b` is consumed). No, `nome` consumes `b`. Code is `:2}`.
    // `símbolo(":")` on `:2}` succeeds. Code is `2}`.
    // `expressão` on `2}` succeeds (parses `2`). Code is `}`.
    // `opcional(símbolo(","))` on `}`. `símbolo(",")` fails: "Expected token ',' but found '}...'"
    // `opcional` returns `""` and original code `}`. This is fine.
    // The issue is that `vários` should have stopped if the main parser inside it failed before `opcional(símbolo(","))`.
    // The current `vários` logic: `if (valor === null) return [null, código];`
    // If `alt(...)` inside `vários` returns `[null, código_com_b_ainda]` because `símbolo(",")` was expected by a `seq` and failed.
    // `seq` for `key, ":", expr, opcional(",")`: if `opcional(",")` fails it's not an error from `opcional` itself.
    // The problem is that `b:2` is parsed as a valid entry.
    // The structure is `símbolo("{"), opcional(vários(alt(SEQ_KV, SEQ_SPREAD))), símbolo("}")`.
    // `SEQ_KV` is `seq(KEY, símbolo(":"), VAL, opcional(símbolo(",")))`.
    // For `{a:1 b:2}`:
    // `a:1` is parsed by `SEQ_KV`. `opcional(símbolo(","))` gets code ` b:2}`. `símbolo(",")` fails. `opcional` returns `""`, code ` b:2}`.
    // `SEQ_KV` for `a:1` returns `[["a",":",1,""], " b:2}"]`.
    // `vários` gets this. Then it calls `alt(SEQ_KV, SEQ_SPREAD)` on ` b:2}`.
    // `SEQ_KV` on ` b:2}`:
    //   `KEY` parses `b`. Code is `:2}`.
    //   `símbolo(":")` parses `:`. Code is `2}`.
    //   `VAL` parses `2`. Code is `}`.
    //   `opcional(símbolo(","))` gets code `}`. `símbolo(",")` fails. `opcional` returns `""`, code `}`.
    // `SEQ_KV` for `b:2` returns `[["b",":",2,""], "}`]`.
    // `vários` gets this. Then it calls `alt(SEQ_KV, SEQ_SPREAD)` on `}`.
    // `alt` fails. `SEQ_KV` fails (e.g. `KEY` fails on `}`). `SEQ_SPREAD` fails. `alt` returns an error.
    // `vários` receives `[error, código_original_para_vários_que_era_}]`.
    // This error from `vários` then propagates.
    // Error from `KEY` (which is `alt(nome, seq(símbolo("["),...))`) when parsing `}`:
    //   `nome` (regex) on `}` fails: "Expected regex '[a-zA-ZÀ-ÿ_][a-zA-ZÀ-ÿ0-9_]*' but found '}...'"
    //   `seq(símbolo("["),...)` on `}` fails. `símbolo("[")` on `}`: "Expected token '[' but found '}...'"
    // `alt` for `KEY` returns the last error: "Expected token '[' but found '}...'"
    expectedError: /Syntax Error: Expected token '\[' but found '}\.\.\.'/
  },
];

async function runErrorTests(testCases) {
  if (!testCases || testCases.length === 0) {
    console.log("No error test cases provided.");
    return { passedCount: 0, failedCount: 0 };
  }
  let passedCount = 0;
  let failedCount = 0;
  const totalToRun = testCases.length;

  console.log(`\nRunning ${totalToRun} error message test case(s)...`);

  for (let i = 0; i < totalToRun; i++) {
    const tc = testCases[i];
    process.stdout.write(`Error Test ${i + 1}/${totalToRun} (${tc.code.substring(0, 30).replace(/\n/g, "\\n")}...): `);

    try {
      const executionResult = await _0(tc.code); // _0 is already async or returns promise from transform

      if (executionResult && executionResult[0] && executionResult[0].error === true) {
        const errorMessage = executionResult[0].message;
        let match = false;
        if (tc.expectedError instanceof RegExp) {
          match = tc.expectedError.test(errorMessage);
        } else {
          match = errorMessage === tc.expectedError;
        }

        if (match) {
          process.stdout.write("PASS\n");
          passedCount++;
        } else {
          process.stdout.write("FAIL\n");
          failedCount++;
          console.log("  --- Code ---");
          console.log(tc.code);
          console.log("  --- Expected Error Pattern ---");
          console.log(String(tc.expectedError));
          console.log("  --- Actual Error Message ---");
          console.log(errorMessage);
          console.log("  --- Full Error Object ---");
          console.log(JSON.stringify(executionResult[0], null, 2));
          console.log("  -------------------------");
        }
      } else {
        process.stdout.write("FAIL (No error reported)\n");
        failedCount++;
        console.log("  --- Code ---");
        console.log(tc.code);
        console.log("  --- Expected Error Pattern ---");
        console.log(String(tc.expectedError));
        console.log("  --- Actual Result (No error object) ---");
        console.log(JSON.stringify(executionResult, null, 2));
        console.log("  -------------------------");
      }
    } catch (e) {
      // This catch block is for unexpected errors in the test runner or _0 itself,
      // not for the expected parsing errors.
      process.stdout.write("ERROR (Test runner exception)\n");
      failedCount++;
      console.error("  Exception during error test execution:", e.message);
      console.log("  --- Code ---");
      console.log(tc.code);
      console.log("  -------------------------");
    }
  }

  console.log(`\n--- Error Test Summary ---`);
  console.log(`Total Error Tests: ${totalToRun}`);
  console.log(`Passed: ${passedCount}`);
  console.log(`Failed: ${failedCount}`);
  console.log(`--------------------------`);
  return { passedCount, failedCount };
}


function displayHelp() {
  console.log(`
Usage: ./testar.js [options] [test_index]

Options:
  [test_index]      Run a specific test by its 1-based index.
  -h, --help        Display this help message.

If no arguments are provided, all tests will be run.
  `);
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    displayHelp();
    return;
  }

  const allTestCases = await parseTestCases();
  if (!allTestCases) { // parseTestCases now returns empty array on error
    console.log("Failed to parse test cases. Exiting.");
    return;
  }
  if (allTestCases.length === 0 && (args.length === 0 || (args.length > 0 && (args[0] !== '--help' && args[0] !== '-h')))) {
    // Only print this if not explicitly asking for help and no tests found
    console.log("Parsing completed, but no test cases were extracted. Exiting.");
    return;
  }

  // This log appears even if help is shown, so move it after help check or make it conditional.
  // console.log(`Successfully parsed ${allTestCases.length} test cases overall.`);


  let testsToExecute = allTestCases;
  let specificTestRequested = false;

  if (args.length > 0 && !args.includes('--help') && !args.includes('-h')) {
    const testIndexArg = parseInt(args[0], 10);
    if (!isNaN(testIndexArg)) {
      if (testIndexArg > 0 && testIndexArg <= allTestCases.length) {
        testsToExecute = [allTestCases[testIndexArg - 1]];
        console.log(`Successfully parsed ${allTestCases.length} test cases overall.`);
        console.log(`Running specific test case: ${testIndexArg}`);
        specificTestRequested = true;
      } else {
        console.log(`Error: Test index ${testIndexArg} is out of range (1-${allTestCases.length}).`);
        displayHelp();
        return;
      }
    } else {
        console.log(`Error: Invalid argument '${args[0]}'. Provide a test index or --help.`);
        displayHelp();
        return;
    }
  }

  if (!specificTestRequested && allTestCases.length > 0) {
      console.log(`Successfully parsed ${allTestCases.length} test cases overall.`);
      console.log("Running all test cases...");
  } else if (!specificTestRequested && allTestCases.length === 0) {
      // Already handled by the check after parseTestCases()
      return;
  }

  await runTests(testsToExecute, allTestCases);

  // Run error tests every time, regardless of other arguments for now
  // TODO: Consider if error tests should also be selectable by index or a flag
  await runErrorTests(errorTestCases);
}

main().catch(error => {
  console.error("An unexpected error occurred in main execution pipeline:", error);
});
