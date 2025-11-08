/**
 * Basic tests for moduleLoader
 * 
 * Run with: node lib/test-moduleLoader.mjs
 */

import { loadModule, clearCache, _cache } from './moduleLoader.mjs';
import { writeFile, unlink } from 'node:fs/promises';
import { resolve } from 'node:path';
import { tmpdir } from 'node:os';

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    testsFailed++;
    throw new Error(message);
  } else {
    console.log(`✓ ${message}`);
    testsPassed++;
  }
}

async function test(name, fn) {
  console.log(`\n🧪 ${name}`);
  try {
    await fn();
  } catch (error) {
    console.error(`Test failed: ${error.message}`);
  }
}

// Test 1: Load a local ESM module
await test('Load local ESM module', async () => {
  // Create a temporary test module
  const testModulePath = resolve(tmpdir(), 'test-module-1.mjs');
  await writeFile(testModulePath, 'export const value = 42;', 'utf-8');
  
  try {
    const module = await loadModule(testModulePath);
    assert(module.value === 42, 'Module exports correct value');
    assert(_cache.has(testModulePath), 'Module is cached');
  } finally {
    await unlink(testModulePath).catch(() => {});
  }
});

// Test 2: Cache behavior
await test('Cache behavior', async () => {
  clearCache();
  
  const testModulePath = resolve(tmpdir(), 'test-module-2.mjs');
  await writeFile(testModulePath, 'export const timestamp = Date.now();', 'utf-8');
  
  try {
    const module1 = await loadModule(testModulePath);
    const module2 = await loadModule(testModulePath);
    
    assert(module1 === module2, 'Same module reference returned from cache');
    assert(module1.timestamp === module2.timestamp, 'Cached value is identical');
  } finally {
    await unlink(testModulePath).catch(() => {});
  }
});

// Test 3: Request coalescing
await test('Request coalescing', async () => {
  clearCache();
  
  const testModulePath = resolve(tmpdir(), 'test-module-3.mjs');
  await writeFile(testModulePath, 'export const value = "coalesced";', 'utf-8');
  
  try {
    // Fire multiple concurrent requests
    const [module1, module2, module3] = await Promise.all([
      loadModule(testModulePath),
      loadModule(testModulePath),
      loadModule(testModulePath)
    ]);
    
    assert(module1 === module2 && module2 === module3, 'All requests return same module reference');
  } finally {
    await unlink(testModulePath).catch(() => {});
  }
});

// Test 4: Relative path resolution
await test('Relative path resolution', async () => {
  clearCache();
  
  const baseDir = tmpdir();
  const mainPath = resolve(baseDir, 'main-test-4.mjs');
  const depPath = resolve(baseDir, 'dep-test-4.mjs');
  
  await writeFile(depPath, 'export const dep = "dependency";', 'utf-8');
  
  try {
    const module = await loadModule('./dep-test-4.mjs', { referrer: mainPath });
    assert(module.dep === 'dependency', 'Relative import resolved correctly');
  } finally {
    await unlink(depPath).catch(() => {});
  }
});

// Test 5: clearCache
await test('clearCache functionality', async () => {
  const testModulePath = resolve(tmpdir(), 'test-module-5.mjs');
  await writeFile(testModulePath, 'export const value = 5;', 'utf-8');
  
  try {
    await loadModule(testModulePath);
    assert(_cache.size > 0, 'Cache has entries');
    
    clearCache();
    assert(_cache.size === 0, 'Cache is empty after clearCache');
  } finally {
    await unlink(testModulePath).catch(() => {});
  }
});

// Test 6: Error handling for non-existent module
await test('Error handling for non-existent module', async () => {
  clearCache();
  
  try {
    await loadModule('/nonexistent/module/path.mjs');
    assert(false, 'Should have thrown an error');
  } catch (error) {
    assert(error.message.includes('Module not found'), 'Correct error message for missing module');
  }
});

// Summary
console.log('\n' + '='.repeat(50));
console.log(`Tests passed: ${testsPassed}`);
console.log(`Tests failed: ${testsFailed}`);
console.log('='.repeat(50));

if (testsFailed > 0) {
  process.exit(1);
}
