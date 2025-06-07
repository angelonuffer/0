#!/usr/bin/env node

import _0 from './0.js';
import fs from 'fs';
import path from 'path';
import errorMessages from './error_messages.js';

// buildScopeRecursively function remains the same
async function buildScopeRecursively(currentImports, currentLoads, basePathForResolution, cliArgs, stdinContent) {
  const scope = {
    ARGV: cliArgs,
    STDIN: stdinContent,
  };
  for (const load of currentLoads) {
    const loadPath = path.resolve(basePathForResolution, load.address);
    try {
      scope[load.name] = fs.readFileSync(loadPath, 'utf-8');
    } catch (e) {
      console.error(`${errorMessages["17"]} @${load.name}: ${loadPath}`);
      console.error(e.message);
      process.exit(1);
    }
  }
  for (const imp of currentImports) {
    const importPath = path.resolve(basePathForResolution, imp.address);
    let importContent;
    try {
      importContent = fs.readFileSync(importPath, 'utf-8');
    } catch (e) {
      console.error(`${errorMessages["12"]}: ${importPath}`);
      console.error(e.message);
      process.exit(1);
    }

    const [status, nestedAst, nestedRemainingCode] = _0(importContent);

    if (status !== 0) {
      const message = errorMessages[status] || `Unknown error code: ${status}`;
      console.error(`Error parsing imported module ${importPath}: ${message}`);
      // Added section for nestedAst details
      if (nestedAst !== null && nestedAst !== undefined) {
        if (typeof nestedAst === 'object' && Object.keys(nestedAst).length > 0) {
          try {
            console.error("Parser diagnostic details: ", JSON.stringify(nestedAst));
          } catch (e) {
            console.error("Parser diagnostic details (not serializable): ", nestedAst);
          }
        } else if (typeof nestedAst === 'string' && nestedAst.trim().length > 0) {
          console.error("Parser diagnostic details: ", nestedAst);
        }
      }
      if (nestedRemainingCode && nestedRemainingCode.trim().length > 0) { // If parser provides remaining code info
          const errorPosition = importContent.length - nestedRemainingCode.length;
          const lines = importContent.substring(0, errorPosition).split('\n');
          const lineNum = lines.length;
          const colNum = lines[lines.length - 1].length + 1;
          console.error(`Error location details: Unexpected input near line ${lineNum}, column ${colNum}: "${nestedRemainingCode.trim().split('\n')[0]}"`);
      }
      process.exit(1); // Or use a specific exit code for this, e.g., errorMessages[13] -> process.exit(13) if desired
    }

    // const [nestedAst, nestedRemainingCode] = nestedParsedOutput; // Already destructured
    if (nestedRemainingCode && nestedRemainingCode.trim().length > 0) {
      const errorPosition = importContent.length - nestedRemainingCode.length;
      const lines = importContent.substring(0, errorPosition).split('\n');
      const lineNum = lines.length;
      const colNum = lines[lines.length - 1].length + 1;
      // Use error code 14 from json
      const message = errorMessages["14"] || "Syntax error in imported module";
      console.error(`${message} ${importPath} at line ${lineNum}, column ${colNum}:`);
      console.error(`Unexpected input: "${nestedRemainingCode.trim().split('\n')[0]}"`);
      process.exit(1);
    }
    const [nestedImports, nestedLoads, nestedExecuteFn] = nestedAst; // This is fine
    const nestedScope = await buildScopeRecursively(nestedImports, nestedLoads, path.dirname(importPath), cliArgs, stdinContent);
    let importedValue = nestedExecuteFn(nestedScope);
    if (importedValue && typeof importedValue.then === 'function') {
      importedValue = await importedValue;
    }
    scope[imp.name] = importedValue;
  }
  return scope;
}

// readStdin function remains the same
async function readStdin() {
  return new Promise((resolve, reject) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('readable', () => {
      let chunk;
      while ((chunk = process.stdin.read()) !== null) {
        data += chunk;
      }
    });
    process.stdin.on('end', () => {
      resolve(data);
    });
    process.stdin.on('error', reject);
  });
}

async function main() {
  const rawCliArgs = process.argv.slice(2);

  if (rawCliArgs.length === 0) {
    console.error("Usage: ./0_cli.js <path_to_module.0> [module_args...]");
    process.exit(1);
  }

  const modulePath = rawCliArgs[0];
  const moduleSpecificArgsForModuleFunction = rawCliArgs.slice(1);

  let moduleContent;
  try {
    moduleContent = fs.readFileSync(modulePath, 'utf-8');
  } catch (error) {
    console.error(`${errorMessages["10"]}: ${modulePath}`);
    console.error(error.message);
    process.exit(1);
  }

  const [status, ast, remainingCode] = _0(moduleContent);

  if (status !== 0) {
    // Use error code 11 from json as a fallback if specific status message not found
    const message = errorMessages[status] || errorMessages["11"] || `Unknown error code: ${status}`;
    console.error(`Error parsing module ${modulePath}: ${message}`);
    // Added section for ast details
    if (ast !== null && ast !== undefined) {
      if (typeof ast === 'object' && Object.keys(ast).length > 0) {
        try {
          console.error("Parser diagnostic details: ", JSON.stringify(ast));
        } catch (e) {
          console.error("Parser diagnostic details (not serializable): ", ast);
        }
      } else if (typeof ast === 'string' && ast.trim().length > 0) {
        console.error("Parser diagnostic details: ", ast);
      }
    }
     if (remainingCode && remainingCode.trim().length > 0) { // If parser provides remaining code info
        const errorPosition = moduleContent.length - remainingCode.length;
        const lines = moduleContent.substring(0, errorPosition).split('\n');
        const lineNum = lines.length;
        const colNum = lines[lines.length - 1].length + 1;
        console.error(`Error location details: Unexpected input near line ${lineNum}, column ${colNum}: "${remainingCode.trim().split('\n')[0]}"`);
    }
    process.exit(1);
  }

  // const [ast, remainingCode] = parsedOutput; // Already destructured
  if (remainingCode && remainingCode.trim().length > 0) {
    const errorPosition = moduleContent.length - remainingCode.length;
    const lines = moduleContent.substring(0, errorPosition).split('\n');
    const lineNum = lines.length;
    const colNum = lines[lines.length - 1].length + 1;
    // Use error code 4 from json
    const message = errorMessages["4"] || "Syntax error";
    console.error(`${message} in module ${modulePath} at line ${lineNum}, column ${colNum}:`);
    console.error(`Unexpected input: "${remainingCode.trim().split('\n')[0]}"`);
    process.exit(1);
  }

  const [imports, loads, executeFn] = ast; // This is fine
  let stdinContent;
  if (process.stdin.isTTY) {
    stdinContent = "";
  } else {
    stdinContent = await readStdin();
  }
  const argvForScope = rawCliArgs;
  const preparedScope = await buildScopeRecursively(imports, loads, path.dirname(modulePath), argvForScope, stdinContent);

  let moduleMainFunction;
  try {
    moduleMainFunction = executeFn(preparedScope);
  } catch (e) {
    // Error during initial execution (not syntax, but runtime within the script logic before main fn)
    console.error(`${errorMessages["18"]} during initial execution of module ${modulePath} (before returning main function):`);
    console.error(e);
    process.exit(1);
  }

  if (typeof moduleMainFunction !== 'function') {
    console.error(`${errorMessages["15"]}. Module: ${modulePath}. Expected a function, but got: ${typeof moduleMainFunction}`);
    process.exit(1);
  }

  let result;
  try {
    result = moduleMainFunction(moduleSpecificArgsForModuleFunction, stdinContent);
    if (result && typeof result.then === 'function') {
        result = await result;
    }
  } catch (e) {
    // Error during main function execution
    console.error(`${errorMessages["18"]} during execution of the main function from module ${modulePath}:`);
    console.error(e);
    process.exit(1);
  }

  let exitCode, rawStdOutContent = ""; // Default stdout to empty
  if (Array.isArray(result) && result.length === 2) {
      [exitCode, rawStdOutContent] = result;
      if (typeof exitCode !== 'number') {
        console.error(`${errorMessages["16"]}. Module: ${modulePath}. Exit code is not a number: ${exitCode}`);
        process.exit(1);
      }
  } else if (typeof result === 'number') {
      exitCode = result;
      // rawStdOutContent remains ""
  } else {
      console.error(`${errorMessages["16"]}. Module: ${modulePath}. Main function did not return an exit code (number) or an [exitCode, stdOutContent] array.`);
      console.error(`Received: ${JSON.stringify(result)}`);
      process.exit(1);
  }

  // const [exitCode, rawStdOutContent] = result; // This line is replaced by the logic above

  // This check is now partially handled above for the array case.
  // If it was a direct number, it's fine.
  // Redundant check if the above logic is complete.
  if (typeof exitCode !== 'number') {
    console.error(`${errorMessages["16"]}. Module: ${modulePath}. Returned an invalid exit code structure or type: ${exitCode}`);
    process.exit(1);
  }

  const stdOutContent = String(rawStdOutContent); // Ensure it's a string

  // Write to standard output
  if (stdOutContent.length > 0) { // Only write if there's content
    process.stdout.write(stdOutContent);
  }

  // Exit with the specified code
  process.exit(exitCode);
}

main().catch(error => {
  // This catch block is for truly unexpected errors in the CLI script itself,
  // not for errors originating from the user's 0 module (those are handled earlier).
  console.error(`${errorMessages["18"]}:`);
  console.error(error);
  process.exit(1); // Default to 1 for unexpected CLI errors
});
