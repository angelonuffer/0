#!/usr/bin/env node

// External test runner for syntax error position validation
// This script tests syntax error position display by running the interpreter
// with invalid code and validating the error position output

import { execSync } from 'child_process';
import { writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';

const testCases = [
  {
    name: "Caractere inválido no meio da expressão",
    code: "2 + @ 3",
    expectedLine: 1,
    expectedColumn: 7  // Parser stops at the '3' after '@'
  },
  {
    name: "Tokens extras após expressão válida",
    code: "2 + 3 xyz",
    expectedLine: 1,
    expectedColumn: 7  // Position of 'x' in 'xyz'
  },
  {
    name: "Operador duplo inválido",
    code: "2 ++ 3",
    expectedLine: 1,
    expectedColumn: 3  // Position of second '+'
  },
  {
    name: "Parênteses não fechados",
    code: "(2 + 3",
    expectedLine: 1,
    expectedColumn: 1  // Parser can't parse from the beginning
  },
  {
    name: "Lista com sintaxe inválida",
    code: "{1, 2 3}",
    expectedLine: 1,
    expectedColumn: 3  // Position after '{1'
  },
  {
    name: "Função sem corpo",
    code: "args =>",
    expectedLine: 1,
    expectedColumn: 6  // Position where body should start
  },
  {
    name: "Erro em múltiplas linhas",
    code: "2 + 3\n@ invalid",
    expectedLine: 2,
    expectedColumn: 1  // Position of '@' on line 2
  },
  {
    name: "Número mal formado",
    code: "2.3.4",
    expectedLine: 1,
    expectedColumn: 2  // Position where parsing stopped after '2'
  },
  {
    name: "String não fechada",
    code: '"hello world',
    expectedLine: 1,
    expectedColumn: 1  // Parser fails completely from the start
  },
  {
    name: "Colchetes não fechados",
    code: "lista[0",
    expectedLine: 1,
    expectedColumn: 6  // Position where closing bracket should be
  }
];

function runTest(testCase) {
  const tempFile = `/tmp/syntax_test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.0`;
  
  try {
    // Write test code to temporary file
    writeFileSync(tempFile, testCase.code);
    
    // Run the interpreter and capture output
    const result = execSync(`node 0_node.js ${tempFile}`, {
      encoding: 'utf8',
      cwd: process.cwd(),
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    // Should not reach here if syntax error occurred
    return {
      name: testCase.name,
      success: false,
      error: "Expected syntax error but code executed successfully",
      output: result
    };
    
  } catch (error) {
    // Expected to catch syntax error
    const output = error.stdout || error.stderr || '';
    
    // Parse error output to extract line and column
    const lines = output.split('\n');
    let errorLine = '';
    
    for (const line of lines) {
      if (line.includes(':') && line.match(/\d+:\d+:/)) {
        errorLine = line;
        break;
      }
    }
    
    if (!errorLine) {
      return {
        name: testCase.name,
        success: false,
        error: "Could not find line:column pattern in error output",
        output: output
      };
    }
    
    // Extract line and column numbers
    const match = errorLine.match(/(\d+):(\d+):/);
    if (!match) {
      return {
        name: testCase.name,
        success: false,
        error: "Could not parse line:column from error output",
        output: output,
        errorLine: errorLine
      };
    }
    
    const actualLine = parseInt(match[1], 10);
    const actualColumn = parseInt(match[2], 10);
    
    const lineMatches = actualLine === testCase.expectedLine;
    const columnMatches = actualColumn === testCase.expectedColumn;
    
    return {
      name: testCase.name,
      success: lineMatches && columnMatches,
      expected: `${testCase.expectedLine}:${testCase.expectedColumn}`,
      actual: `${actualLine}:${actualColumn}`,
      lineMatches,
      columnMatches,
      output: output,
      errorLine: errorLine
    };
    
  } finally {
    // Clean up temporary file
    try {
      unlinkSync(tempFile);
    } catch (e) {
      // Ignore cleanup errors
    }
  }
}

function runAllTests() {
  console.log('🧪 Executando testes de posição de erro de sintaxe...\n');
  
  let passed = 0;
  let failed = 0;
  
  for (const testCase of testCases) {
    const result = runTest(testCase);
    
    if (result.success) {
      console.log(`✅ ${result.name}`);
      console.log(`   Posição: ${result.actual}`);
      passed++;
    } else {
      console.log(`❌ ${result.name}`);
      console.log(`   Esperado: ${result.expected || 'syntax error'}`);
      console.log(`   Atual: ${result.actual || 'no error or unparseable'}`);
      if (result.error) {
        console.log(`   Erro: ${result.error}`);
      }
      if (result.lineMatches === false) {
        console.log(`   ❌ Linha incorreta`);
      }
      if (result.columnMatches === false) {
        console.log(`   ❌ Coluna incorreta`);
      }
      if (result.output) {
        console.log(`   Saída: ${result.output.replace(/\n/g, '\\n')}`);
      }
      failed++;
    }
    console.log('');
  }
  
  console.log(`\n📊 Resultados: ${passed} passaram, ${failed} falharam`);
  
  if (failed > 0) {
    process.exit(1);
  }
}

runAllTests();