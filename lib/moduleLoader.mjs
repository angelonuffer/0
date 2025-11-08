/**
 * Module Loader Utility
 * 
 * Provides async module loading with support for:
 * - Local/relative/absolute paths
 * - Package specifiers (e.g., 'lodash')
 * - HTTP/HTTPS URLs with lazy loading
 * - Caching and request coalescing
 * 
 * All modules in this repository are ESM.
 */

import { pathToFileURL } from 'node:url';
import { resolve as resolvePath, dirname } from 'node:path';
import { existsSync } from 'node:fs';
import { writeFile, unlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { randomBytes } from 'node:crypto';

// Cache for loaded modules: specifier -> module namespace
const _cache = new Map();

// In-flight requests for coalescing: specifier -> Promise
const _inflight = new Map();

/**
 * Load a module dynamically with caching and request coalescing
 * 
 * @param {string} specifier - Module specifier (path, URL, or package name)
 * @param {Object} options - Load options
 * @param {string} options.referrer - Path of the module importing this specifier (for relative resolution)
 * @returns {Promise<Object>} - Module namespace (the result of import())
 */
export async function loadModule(specifier, { referrer = null } = {}) {
  // Normalize the specifier for caching
  const cacheKey = referrer 
    ? `${specifier}::${referrer}`
    : specifier;
  
  // Check cache first
  if (_cache.has(cacheKey)) {
    return _cache.get(cacheKey);
  }
  
  // Check if request is in-flight for coalescing
  if (_inflight.has(cacheKey)) {
    return _inflight.get(cacheKey);
  }
  
  // Start new load request
  const loadPromise = _loadModuleImpl(specifier, referrer);
  _inflight.set(cacheKey, loadPromise);
  
  try {
    const module = await loadPromise;
    _cache.set(cacheKey, module);
    return module;
  } finally {
    _inflight.delete(cacheKey);
  }
}

/**
 * Internal implementation of module loading
 */
async function _loadModuleImpl(specifier, referrer) {
  // Determine if this is a URL, package specifier, or file path
  if (specifier.startsWith('http://') || specifier.startsWith('https://')) {
    return await _loadHttpModule(specifier);
  }
  
  // Handle relative paths
  if (specifier.startsWith('./') || specifier.startsWith('../')) {
    if (!referrer) {
      throw new Error(`Cannot resolve relative specifier "${specifier}" without a referrer`);
    }
    
    const referrerDir = dirname(referrer);
    const resolvedPath = resolvePath(referrerDir, specifier);
    
    if (!existsSync(resolvedPath)) {
      throw new Error(`Module not found: ${resolvedPath}`);
    }
    
    const fileUrl = pathToFileURL(resolvedPath).href;
    return await import(fileUrl);
  }
  
  // Handle absolute paths
  if (specifier.startsWith('/')) {
    if (!existsSync(specifier)) {
      throw new Error(`Module not found: ${specifier}`);
    }
    
    const fileUrl = pathToFileURL(specifier).href;
    return await import(fileUrl);
  }
  
  // Try as package specifier (node_modules resolution)
  try {
    return await import(specifier);
  } catch (error) {
    // If it looks like a file path without ./ prefix, try resolving from referrer
    if (referrer && !specifier.includes('/')) {
      const referrerDir = dirname(referrer);
      const resolvedPath = resolvePath(referrerDir, specifier);
      
      if (existsSync(resolvedPath)) {
        const fileUrl = pathToFileURL(resolvedPath).href;
        return await import(fileUrl);
      }
    }
    
    throw new Error(`Failed to load module "${specifier}": ${error.message}`);
  }
}

/**
 * Load a module from an HTTP/HTTPS URL
 */
async function _loadHttpModule(url) {
  try {
    // Fetch the remote content
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const contentType = response.headers.get('content-type') || '';
    const content = await response.text();
    
    // For JavaScript content, try data URL import first
    if (contentType.includes('javascript') || contentType.includes('ecmascript') || url.endsWith('.js') || url.endsWith('.mjs')) {
      try {
        // Encode as data URL and import
        const dataUrl = `data:text/javascript;charset=utf-8,${encodeURIComponent(content)}`;
        return await import(dataUrl);
      } catch (dataUrlError) {
        // Fallback to temporary file
        return await _loadFromTempFile(content, url);
      }
    }
    
    // For other content types, use temporary file
    return await _loadFromTempFile(content, url);
    
  } catch (error) {
    throw new Error(`Failed to load module from ${url}: ${error.message}`);
  }
}

/**
 * Load module content by writing to a temporary file
 */
async function _loadFromTempFile(content, originalUrl) {
  const tempFileName = `module-${randomBytes(16).toString('hex')}.mjs`;
  const tempFilePath = resolvePath(tmpdir(), tempFileName);
  
  try {
    // Write content to temp file
    await writeFile(tempFilePath, content, 'utf-8');
    
    // Import from file URL
    const fileUrl = pathToFileURL(tempFilePath).href;
    const module = await import(fileUrl);
    
    // Clean up temp file (best effort, non-blocking)
    unlink(tempFilePath).catch(() => {
      // Ignore cleanup errors
    });
    
    return module;
  } catch (error) {
    // Clean up on error
    try {
      await unlink(tempFilePath);
    } catch {
      // Ignore cleanup errors
    }
    throw error;
  }
}

/**
 * Clear the module cache
 * Useful for testing or when modules need to be reloaded
 */
export function clearCache() {
  _cache.clear();
}

/**
 * Export cache for diagnostic/testing purposes
 */
export { _cache };
