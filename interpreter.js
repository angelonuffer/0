// interpreter.js

// Forward declarations
let parseExpr;
let parseArrFunc;
let parseLst;
let parseObj;

const DEBUG_LOG = true; // Ensure DEBUG_LOG is true for this run

const log = (...args) => {
  if (DEBUG_LOG) {
    console.log(...args);
  }
};

// Helper: trimSpace
const trimSpace = (parser) => (input) => {
  const trimmedInput = input.trimStart();
  const result = parser(trimmedInput);
  if (result.success) return result;
  return { ...result, success: false, remaining: input };
};

// --- Basic Parsers ---
const parseNumber = trimSpace((input) => {
  const match = input.match(/^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/);
  if (match) {
    return { success: true, value: parseFloat(match[0]), remaining: input.slice(match[0].length) };
  }
  return { success: false, remaining: input };
});

const parseString = (str) => trimSpace((input) => {
  if (input.startsWith(str)) {
    return { success: true, value: str, remaining: input.slice(str.length) };
  }
  return { success: false, remaining: input };
});

// MODIFIED: parseIdentifier to support dot notation (for general use)
parseIdentifier = trimSpace((input) => {
  // Regex allows dots, but when used for specific property access in parseAccessCallChain, it should be simple.
  const match = input.match(/^[a-zA-Z_][a-zA-Z0-9_]*(\.[a-zA-Z_][a-zA-Z0-9_]*)*/);
  if (match && input.startsWith(match[0])) {
    return {
        success: true,
        value: { type: 'identifier', name: match[0] },
        remaining: input.slice(match[0].length)
    };
  }
  return { success: false, remaining: input };
});

// Specific parser for simple identifiers (no dots), used for property names in member access
const parseSimpleIdentifier = trimSpace((input) => {
  const match = input.match(/^[a-zA-Z_][a-zA-Z0-9_]*/);
  if (match && input.startsWith(match[0])) {
    return {
      success: true,
      value: { type: 'identifier', name: match[0] },
      remaining: input.slice(match[0].length)
    };
  }
  return { success: false, remaining: input };
});


const parseStringLiteral = trimSpace((input) => {
  if (input.startsWith('"')) {
    let i = 1; let value = ""; let escaped = false;
    while (i < input.length) {
      const char = input[i];
      if (escaped) {
        if (char === 'n') value += '\n'; else if (char === 't') value += '\t'; else if (char === 'r') value += '\r'; else value += char;
        escaped = false;
      } else if (char === '\\') { escaped = true; }
      else if (char === '"') { return { success: true, value: { type: 'string_literal', value: value }, remaining: input.slice(i + 1) }; }
      else { value += char; }
      i++;
    }
    return { success: false, remaining: input, error: "Unterminated string literal." };
  }
  return { success: false, remaining: input };
});

// --- Parser Combinators ---
const sequence = (parsers) => (input) => {
  log(`sequence: trying on input starting with: "${input.substring(0, 40)}..."`);
  let currentInput = input; const results = [];
  for (const parser of parsers) {
    const result = parser(currentInput);
    if (result.success) {
      log(`sequence: parser success, value type: ${result.value && result.value.type ? result.value.type : typeof result.value}, remaining: "${result.remaining.substring(0,20)}..."`);
      results.push(result.value); currentInput = result.remaining;
    } else {
      log(`sequence: parser failed, error: ${result.error}, on input: "${currentInput.substring(0,20)}...", original input to sequence: "${input.substring(0,20)}..."`);
      return { success: false, remaining: input, error: result.error };
    }
  }
  log(`sequence: ALL success, results count: ${results.length}, remaining: "${currentInput.substring(0,20)}..."`);
  return { success: true, value: results, remaining: currentInput };
};

const choice = (parsers) => (input) => {
  log(`choice: trying on input starting with: "${input.substring(0, 40)}..."`);
  for (const parser of parsers) {
    const result = parser(input);
    if (result.success) { log(`choice: parser success, value type: ${result.value && result.value.type ? result.value.type : typeof result.value}, remaining: "${result.remaining.substring(0,20)}..."`); return result; }
  }
  log(`choice: ALL failed on input starting with: "${input.substring(0, 40)}..."`);
  return { success: false, remaining: input };
};

const map = (parser, fn) => (input) => {
  log(`map: trying on input starting with: "${input.substring(0, 40)}..."`);
  const result = parser(input);
  if (result.success) {
    const mappedValue = fn(result.value);
    log(`map: success, value type: ${mappedValue && mappedValue.type ? mappedValue.type : typeof mappedValue}, remaining: "${result.remaining.substring(0,20)}..."`);
    return { success: true, value: mappedValue, remaining: result.remaining };
  }
  log(`map: failed, error: ${result.error}, on input: "${input.substring(0,20)}..."`);
  return result;
};

const many = (parser) => (input) => {
  log(`many: trying on input starting with: "${input.substring(0,40)}..."`);
  let currentInput = input; const results = []; let iteration = 0;
  while (true) {
    log(`many: iter ${iteration}, currentInput: "${currentInput.substring(0,40)}..."`);
    const result = parser(currentInput);
    if (result.success) {
      log(`many: iter ${iteration} success, value type: ${result.value && result.value.type ? result.value.type : typeof result.value}, remaining: "${result.remaining.substring(0,20)}..."`);
      if (result.remaining === currentInput && results.length > 0 && result.value === null) { log("many: non-consuming null success, breaking"); break; }
      if (result.remaining === currentInput && result.value !== null) {
           if (results.length > 0 && JSON.stringify(results[results.length-1]) === JSON.stringify(result.value)) { log("many: non-consuming same value, breaking"); break; }
           if (results.length > 1000) { log("many: iteration limit, breaking"); break; }
       }
      results.push(result.value); currentInput = result.remaining;
      if (currentInput === result.remaining && currentInput === input && results.length > 0){
           if (results.length > 1 && results[results.length-1] === results[results.length-2]){ log("many: overall non-consuming same result, breaking"); break; }
           if (results.length === 1 && currentInput === input) { log("many: overall non-consuming first item, breaking"); break; }
       }
    } else { log(`many: iter ${iteration} failed, breaking.`); break; }
    iteration++;
  }
  log(`many: finished, results count: ${results.length}, remaining: "${currentInput.substring(0,20)}..."`);
  return { success: true, value: results, remaining: currentInput };
};

const some = (parser) => (input) => { const result = many(parser)(input); if (result.value.length > 0) return result; return { success: false, remaining: input, error: "Expected at least one match for 'some' combinator."};};
const optional = (parser) => (input) => { const result = parser(input); if (result.success) return result; return { success: true, value: null, remaining: input }; };
const sepBy1 = (parser, separator) => map(sequence([parser, many(map(sequence([separator, parser]), parts => parts[1]))]), (result) => [result[0], ...result[1]]);
const sepBy = (parser, separator) => optional(sepBy1(parser, separator));

// --- Grammar Rules ---
parseArrFunc = trimSpace((input) => { return { success: false, remaining: input, error:"Arrow func not fully implemented for this test."}; });

// MODIFIED: parseObj to handle shorthand properties and trailing comma
parseObj = trimSpace((input) => {
  log(`parseObj (body): trying on input: "${input.substring(0, 40)}..."`);
  const parseStandardKeyValuePair = map(
    sequence([
      parseSimpleIdentifier, // Use simple identifier for keys
      parseString(':'),
      (inp) => parseExpr(inp)
    ]),
    (parts) => ({
      type: 'property',
      key: parts[0].name,
      value: parts[2]
    })
  );

  const parseShorthandProperty = map(
    parseSimpleIdentifier, // Use simple identifier for shorthand
    (identifierAst) => ({
      type: 'property',
      key: identifierAst.name,
      value: identifierAst // Value is the identifier AST itself
    })
  );

  const parseProperty = choice([
    parseStandardKeyValuePair,
    parseShorthandProperty
  ]);

  const objectContentParser = sequence([
    parseString('{'),
    map(
      sepBy(parseProperty, parseString(',')),
      (properties) => properties || []
    ),
    optional(parseString(',')),
    parseString('}')
  ]);

  const result = objectContentParser(input);

  if (result.success) {
    log(`parseObj (body): success, remaining: "${result.remaining.substring(0,20)}..."`);
    return {
      success: true,
      value: { type: 'object_literal', properties: result.value[1] },
      remaining: result.remaining
    };
  }
  log(`parseObj (body): failed, error: ${result.error}, for input: "${input.substring(0,20)}..."`);
  return { success: false, remaining: result.remaining, error: result.error };
});


parseLst = trimSpace((input_for_trim_wrapper) => {
  log(`parseLst (body): trying on input: "${input_for_trim_wrapper.substring(0, 40)}..."`);
  const listContentParser = sequence([
    parseString('['),
    map(
      sepBy((inp) => parseExpr(inp), parseString(',')),
      (elements) => elements || []
    ),
    optional(parseString(',')),
    parseString(']')
  ]);
  const result = listContentParser(input_for_trim_wrapper);
  if (result.success) {
    log(`parseLst (body): success, remaining: "${result.remaining.substring(0,20)}..."`);
    return {
      success: true,
      value: { type: 'list_literal', elements: result.value[1] },
      remaining: result.remaining
    };
  }
  log(`parseLst (body): failed, error: ${result.error}, for input: "${input_for_trim_wrapper.substring(0,20)}..."`);
  return { success: false, remaining: result.remaining, error: result.error };
});

const parseAtom = trimSpace((input) => {
  log(`parseAtom (body): trying on input: "${input.substring(0, 40)}..."`);
  const result = choice([
    parseNumber, parseStringLiteral, parseArrFunc, parseLst, parseObj,
    map(sequence([parseString('('), (inp) => parseExpr(inp), parseString(')')]), parts => parts[1]),
    parseIdentifier // General identifier (can include dots) for standalone use
  ])(input);
  if (result.success) log(`parseAtom (body): success, type: ${(result.value && result.value.type) ? result.value.type : typeof result.value}, remaining: "${result.remaining.substring(0,20)}..."`);
  else log(`parseAtom (body): failed on input: "${input.substring(0,20)}..."`);
  return result;
});

const parseAccessCallChain = (input) => {
  log(`parseAccessCallChain: trying on input: "${input.substring(0, 40)}..."`);
  let baseResult = parseAtom(input);
  if (!baseResult.success) { log(`parseAccessCallChain: parseAtom failed.`); return baseResult; }
  log(`parseAccessCallChain: parseAtom success, AST type: ${(baseResult.value && baseResult.value.type) ? baseResult.value.type : typeof baseResult.value}, remaining: "${baseResult.remaining.substring(0,20)}..."`);
  let currentAst = baseResult.value; let currentRemaining = baseResult.remaining;
  while (true) {
    log(`parseAccessCallChain loop: trying dot on: "${currentRemaining.substring(0,20)}..."`);
    const dotResult = parseString('.')(currentRemaining);
    if (dotResult.success) {
      log(`parseAccessCallChain loop: dot success, trying simple identifier on: "${dotResult.remaining.substring(0,20)}..."`);
      const propIdRes = parseSimpleIdentifier(dotResult.remaining); // Use parseSimpleIdentifier for properties
      if (propIdRes.success) {
        log(`parseAccessCallChain loop: propertyId success: ${propIdRes.value.name}`);
        currentAst = { type: 'member_access', object: currentAst, property: propIdRes.value }; // Store identifier AST
        currentRemaining = propIdRes.remaining;
        continue;
      } else {
        log(`parseAccessCallChain loop: simple propertyId failed after dot.`);
        return { success: false, remaining: input, error: "Syntax error: Expected simple identifier after '.'." };
      }
    }
    log(`parseAccessCallChain loop: trying open paren on: "${currentRemaining.substring(0,20)}..."`);
    const openParenRes = parseString('(')(currentRemaining);
    if (openParenRes.success) {
      log(`parseAccessCallChain loop: open paren success, trying args on: "${openParenRes.remaining.substring(0,20)}..."`);
      const argsRes = sepBy((inp) => parseExpr(inp), parseString(','))(openParenRes.remaining);
      log(`parseAccessCallChain loop: args parsed, trying close paren on: "${argsRes.remaining.substring(0,20)}..."`);
      const closeParenRes = parseString(')')(argsRes.remaining);
      if (closeParenRes.success) {
        log(`parseAccessCallChain loop: close paren success.`);
        currentAst = { type: 'call', func: currentAst, args: argsRes.value || [] };
        currentRemaining = closeParenRes.remaining;
        continue;
      } else { log(`parseAccessCallChain loop: close paren failed.`); return { success: false, remaining: input, error: "Syntax error: Expected ')' after args." };}
    }
    log(`parseAccessCallChain loop: neither dot nor paren matched, breaking.`); break;
  }
  log(`parseAccessCallChain: returning success, final AST type: ${(currentAst && currentAst.type) ? currentAst.type : typeof currentAst}, remaining: "${currentRemaining.substring(0,20)}..."`);
  return { success: true, value: currentAst, remaining: currentRemaining };
};

const parseBinaryOperation = (parserName, higherPrecedenceParser, operatorParser, termConstructor) => (input) => {
  log(`${parserName} (binOp body): input: "${input.substring(0,40)}..."`);
  let leftResult = higherPrecedenceParser(input);
  if (!leftResult.success) return leftResult;
  log(`${parserName} (binOp body): left success, val_type: ${(leftResult.value && leftResult.value.type) ? leftResult.value.type : typeof leftResult.value}, op remaining: "${leftResult.remaining.substring(0,20)}..."`);
  let currentRemaining = leftResult.remaining; let finalAst = leftResult.value;
  while (true) {
    const opResult = operatorParser(currentRemaining);
    if (!opResult.success) break;
    log(`${parserName} (binOp body): op success: ${opResult.value}, right-side remaining: "${opResult.remaining.substring(0,20)}..."`);
    const rightResult = higherPrecedenceParser(opResult.remaining);
    if (!rightResult.success) { log(`${parserName} (binOp body): right-side failed.`); return { success: false, remaining: input, error: `Syntax error: Expected expr after op '${opResult.value}'.` }; }
    log(`${parserName} (binOp body): right-side success, val_type: ${(rightResult.value && rightResult.value.type) ? rightResult.value.type : typeof rightResult.value}`);
    finalAst = termConstructor(finalAst, opResult.value, rightResult.value); currentRemaining = rightResult.remaining;
    log(`${parserName} (binOp body): loop success, new AST type: ${finalAst.type}, next remaining: "${currentRemaining.substring(0,20)}..."`);
  }
  log(`${parserName} (binOp body): returning final AST type: ${ (finalAst && finalAst.type) ? finalAst.type : typeof finalAst }, remaining: "${currentRemaining.substring(0,20)}..."`);
  return { success: true, value: finalAst, remaining: currentRemaining };
};

const parseMultiplication = trimSpace((input) => {
  log(`parseMultiplication (body): input: "${input.substring(0,40)}..."`);
  const operatorParser = choice([parseString('*'), parseString('/')]);
  const result = parseBinaryOperation("parseMultiplication", parseAccessCallChain, operatorParser, (left, op, right) => ({ type: 'binary', operator: op, left, right }))(input);
  if (!result.success) log(`parseMultiplication (body): failed. Error: ${result.error}`);
  return result;
});

const parseAddition = trimSpace((input) => {
  log(`parseAddition (body): input: "${input.substring(0,40)}..."`);
  const operatorParser = choice([parseString('+'), parseString('-')]);
  const result = parseBinaryOperation("parseAddition", parseMultiplication, operatorParser, (left, op, right) => ({ type: 'binary', operator: op, left, right }))(input);
  if (!result.success) log(`parseAddition (body): failed. Error: ${result.error}`);
  return result;
});

parseExpr = parseAddition;
log("parseExpr is now assigned to parseAddition.");

const parseExpression = (input) => {
  log(`parseExpression (top-level): input: "${input.substring(0,60)}..."`);
  const trimmedInput = input.trim();
  const result = parseExpr(trimmedInput);
  log(`parseExpression (top-level): parseExpr returned: success=${result.success}, val_type=${(result.value && result.value.type) ? result.value.type : typeof result.value}, remaining="${result.remaining ? result.remaining.substring(0,40) : ''}..."`);
  if (result.success) {
    if (result.remaining.trim() !== '') {
      log(`parseExpression (top-level): fail due to trailing input: "${result.remaining.trim().substring(0,40)}..."`);
      return { success: false, remaining: input, error: `Unexpected trailing input: '${result.remaining.trim()}'.` };
    }
  }
  return result;
};

// --- Evaluator ---
const evaluate = (ast, context) => {
  if (typeof ast === 'number') { return ast; }
  if (!ast || typeof ast.type !== 'string') { console.error("Invalid AST:", ast); throw new Error('Malformed AST'); }
  switch (ast.type) {
    case 'identifier':
      if (ast.name.includes('.')) {
        const parts = ast.name.split('.');
        let currentObject = context;
        for (let i = 0; i < parts.length; i++) {
          const partName = parts[i];
          if (i === 0 && partName in context) { // First part from global context
             currentObject = context[partName];
          }
          // Subsequent parts must be from the currentObject found so far
          else if (i > 0 && currentObject && typeof currentObject === 'object' && partName in currentObject) {
            currentObject = currentObject[partName];
          }
          // If it's not the first part AND not found on current object, or it IS the first part but not in global context
          else if (typeof currentObject === 'object' && partName in currentObject) { // Check currentObject again (covers first part if not global)
             currentObject = currentObject[partName];
          }
          else {
            // Fallback for cases like 'uniteste.descrever' being a flat key if the above logic fails
            // This might be redundant if member_access evaluation is robust
            const currentPath = parts.slice(0, i + 1).join('.');
            if (currentPath in context) {
                currentObject = context[currentPath];
                if (i === parts.length -1) return currentObject; // Found the full path as a flat key
                continue; // Continue to next part based on this new currentObject
            }
            throw new Error(`Cannot resolve property '${partName}' in path '${ast.name}'. Current object state: ${typeof currentObject}, part: ${partName}`);
          }
        }
        return currentObject;
      } else {
        if (ast.name in context) {
          return context[ast.name];
        }
        throw new Error(`Undefined variable: ${ast.name}`);
      }

    case 'string_literal': return ast.value;
    case 'binary': {
      const l = evaluate(ast.left, context), r = evaluate(ast.right, context);
      switch (ast.operator) {
        case '+': return l + r; case '-': return l - r; case '*': return l * r; case '/': if (r===0) throw new Error("Div by 0"); return l / r;
        default: throw new Error(`Unknown op: ${ast.operator}`);
      }
    }
    case 'function': return { type: 'closure', params: ast.params, body: ast.body, capturedContext: { ...context } };
    case 'call': {
      const fnVal = evaluate(ast.func, context);
      if (typeof fnVal !== 'object' || fnVal === null || fnVal.type !== 'closure') { throw new Error(`Not a function: ${ (ast.func && ast.func.type) ? ast.func.type : 'evaluated_expression'}`); }
      const closure = fnVal;
      const argVals = ast.args.map(arg => evaluate(arg, context));
      if (closure.params.length !== argVals.length) { throw new Error(`Arg count mismatch for ${ ((ast.func.type ==='identifier' || ast.func.type ==='member_access') && ast.func.name) || 'anonymous_function'}. Expected ${closure.params.length}, got ${argVals.length}`); }
      const callCtx = { ...closure.capturedContext };
      closure.params.forEach((p, i) => { callCtx[p.name] = argVals[i]; });
      return evaluate(closure.body, callCtx);
    }
    case 'member_access': {
      const objVal = evaluate(ast.object, context);
      if (typeof objVal !== 'object' || objVal === null) { throw new Error(`Not an object for member access on '${ast.property.name}'`); }
      const propName = ast.property.name;
      if (propName in objVal) { return objVal[propName]; }
      if (Array.isArray(objVal) && propName === 'length') { return objVal.length; }
      throw new Error(`Property '${propName}' not found on object.`);
    }
    case 'list_literal': return ast.elements.map(el => evaluate(el, context));
    case 'object_literal': {
      const obj = {};
      for (const prop of ast.properties) {
        obj[prop.key] = evaluate(prop.value, context);
      }
      return obj;
    }
    default: console.error("Unsupp AST:", ast.type, ast); throw new Error(`Unsupp eval: ${ast.type}`);
  }
};

// --- Main `run` function ---
const run = (code, context = {}) => {
  const parseResult = parseExpression(code);
  if (parseResult.success) { return evaluate(parseResult.value, context); }
  throw new Error(`Syntax error in run: ${parseResult.error || "Unknown"}. Remaining: "${parseResult.remaining}"`);
};

// --- Node.js module exports and command-line execution ---
if (typeof module !== 'undefined' && module.exports) {
  if (require.main === module) {
    const fs = require('fs');
    const filePath = process.argv[2];
    if (!filePath) { console.error("File path needed."); process.exit(1); }
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) { console.error("Read error:", err); process.exit(1); }
      try {
        let code = data;
        code = code.split('\n').map(line => {
          const commentIndex = line.indexOf('#');
          if (commentIndex === 0) return '';
          if (commentIndex > -1) return line.substring(0, commentIndex).trimEnd();
          return line;
        }).filter(line => line.trim() !== '').join('\n');

        log("Starting parsing process for file content...");
        const programParser = many(parseExpr);
        const parseResult = programParser(code.trim());
        log("Finished parsing process for file content.");

        if (parseResult.success && parseResult.remaining.trim() === '') {
          const astNodes = parseResult.value;
          if (astNodes.length === 0 && code.trim() !== '') {
            console.error("Execution failed: Code was present but no expressions were parsed.");
            process.exit(1);
          } else if (astNodes.length === 0 && code.trim() === '') {
            if(DEBUG_LOG) console.log("Executed an empty script successfully."); else console.log("");
          } else {
            let lastResult;
            for (const astNode of astNodes) {
              lastResult = evaluate(astNode, {});
            }
            console.log(JSON.stringify(lastResult, null, 2));
          }
        } else {
          console.error("Execution failed: Could not parse the file content as a sequence of expressions.");
          if(parseResult.error && DEBUG_LOG) console.error("Parser error from 'many(parseExpr)':", parseResult.error);
          if (parseResult.remaining.trim() !== '') {
             log("Attempting to parse the problematic remaining input with parseExpr for detailed error...");
             const individualParseAttempt = parseExpr(parseResult.remaining.trim());
             if (!individualParseAttempt.success) {
                 console.error("The first failing expression starts near:", `"${parseResult.remaining.trim().substring(0, 70)}..."`);
                 if(individualParseAttempt.error && DEBUG_LOG) console.error("Specific parser error from individual parseExpr attempt:", individualParseAttempt.error);
                 else if (DEBUG_LOG) console.error("Individual parseExpr attempt failed without specific error message.");
             } else {
                console.error("Problematic remaining input near (unconsumed by 'many'):", `"${parseResult.remaining.trim().substring(0, 70)}..."`);
                if (DEBUG_LOG) console.error("Strangely, individual parseExpr succeeded on this remaining input.");
             }
          } else if (!parseResult.success) {
             console.error("Parsing failed: many(parseExpr) returned success:false (unexpected).");
          }
          process.exit(1);
        }
      } catch (e) {
        console.error("Execution runtime error:", e.message);
        if (DEBUG_LOG) console.error(e.stack);
        process.exit(1);
      }
    });
  } else {
    module.exports = {
        run, parseNumber, parseIdentifier, parseString, parseStringLiteral, parseSimpleIdentifier,
        parseArrowFunction: parseArrFunc, parseAccessCallChain, parseAtom,
        parseLst, parseObj, parseMultiplication, parseAddition,
        parseExpression, evaluate,
        sequence, choice, map, many, some, optional, sepBy, sepBy1,
    };
  }
} else {
  console.log('Interpreter.js loaded (non-Node.js environment).');
}
