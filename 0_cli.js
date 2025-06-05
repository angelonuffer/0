#!/usr/bin/env node

import _0 from './0.js';
import fs from 'fs';
import path from 'path';

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
      console.error(`Error loading file specified by @${load.name}: ${loadPath}`);
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
      console.error(`Error reading imported module file: ${importPath}`);
      console.error(e.message);
      process.exit(1);
    }
    let nestedParsedOutput;
    try {
      nestedParsedOutput = _0(importContent);
    } catch (e) {
      console.error(`Error interpreting imported module ${importPath}:`);
      console.error(e);
      process.exit(1);
    }
    if (!nestedParsedOutput || nestedParsedOutput[0] === null) {
      console.error(`Error parsing imported module ${importPath}: Interpreter returned null.`);
      process.exit(1);
    }
    const [nestedAst, nestedRemainingCode] = nestedParsedOutput;
    if (nestedRemainingCode && nestedRemainingCode.trim().length > 0) {
      const errorPosition = importContent.length - nestedRemainingCode.length;
      const lines = importContent.substring(0, errorPosition).split('\n');
      const lineNum = lines.length;
      const colNum = lines[lines.length - 1].length + 1;
      console.error(`Syntax error in imported module ${importPath} at line ${lineNum}, column ${colNum}:`);
      console.error(`Unexpected input: "${nestedRemainingCode.trim().split('\n')[0]}"`);
      process.exit(1);
    }
    const [nestedImports, nestedLoads, nestedExecuteFn] = nestedAst;
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
    // No change to this error handling
    console.error(`Error reading module file: ${modulePath}`);
    console.error(error.message);
    process.exit(1);
  }

  let parsedOutput;
  try {
    parsedOutput = _0(moduleContent);
  } catch (e) {
    // No change
    console.error(`Error interpreting module ${modulePath}:`);
    console.error(e);
    process.exit(1);
  }

  if (!parsedOutput || parsedOutput[0] === null) {
    // No change
    console.error(`Error parsing module ${modulePath}: Interpreter returned null.`);
    process.exit(1);
  }

  const [ast, remainingCode] = parsedOutput;

  if (remainingCode && remainingCode.trim().length > 0) {
    // No change
    const errorPosition = moduleContent.length - remainingCode.length;
    const lines = moduleContent.substring(0, errorPosition).split('\n');
    const lineNum = lines.length;
    const colNum = lines[lines.length - 1].length + 1;
    console.error(`Syntax error in module ${modulePath} at line ${lineNum}, column ${colNum}:`);
    console.error(`Unexpected input: "${remainingCode.trim().split('\n')[0]}"`);
    process.exit(1);
  }

  const [imports, loads, executeFn] = ast;
  const stdinContent = await readStdin();
  const argvForScope = rawCliArgs;
  const preparedScope = await buildScopeRecursively(imports, loads, path.dirname(modulePath), argvForScope, stdinContent);

  let moduleMainFunction;
  try {
    moduleMainFunction = executeFn(preparedScope);
  } catch (e) {
    // No change
    console.error(`Error during initial execution of module ${modulePath} (before returning main function):`);
    console.error(e);
    process.exit(1);
  }

  if (typeof moduleMainFunction !== 'function') {
    // No change
    console.error(`Module ${modulePath} did not return a function. Expected a function, but got: ${typeof moduleMainFunction}`);
    process.exit(1);
  }

  let result;
  try {
    result = moduleMainFunction(moduleSpecificArgsForModuleFunction, stdinContent);
    if (result && typeof result.then === 'function') {
        result = await result;
    }
  } catch (e) {
    // No change
    console.error(`Error during execution of the main function from module ${modulePath}:`);
    console.error(e);
    process.exit(1);
  }

  if (!Array.isArray(result) || result.length !== 2) {
    // No change
    console.error(`Module ${modulePath}'s main function did not return the expected [exitCode, stdOutContent] array.`);
    console.error(`Received: ${JSON.stringify(result)}`);
    process.exit(1);
  }

  const [exitCode, rawStdOutContent] = result; // Renamed to rawStdOutContent

  if (typeof exitCode !== 'number') {
    // No change
    console.error(`Module ${modulePath}'s main function returned an invalid exit code (not a number): ${exitCode}`);
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
  console.error("Unexpected critical error in 0_cli.js execution pipeline:");
  console.error(error);
  process.exit(1); // Default to 1 for unexpected CLI errors
});
