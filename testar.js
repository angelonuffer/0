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
}

main().catch(error => {
  console.error("An unexpected error occurred in main execution pipeline:", error);
});
