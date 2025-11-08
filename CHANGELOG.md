# CHANGELOG - Async Lazy Loading Implementation

## Version: Async Lazy Loading Release
**Date:** 2025-11-08

### Major Changes

#### 🚀 Async Semantic Analyzer
- Converted all semantic analyzer functions to async/await
- `avaliar()` and all sub-analyzers now return Promises
- Lambda functions are regular Functions that return Promises (not AsyncFunction)
- All recursive evaluation properly awaits results

#### ⚡ Lazy Module Loading
- **Removed** pre-fetch mechanism (~70 lines of code)
- Modules now load on-demand during evaluation
- No upfront cost for loading entire dependency trees
- Faster startup for simple programs

#### 🌐 Remote Module Support
- Full support for HTTP/HTTPS module imports
- Automatic caching of remote modules in `código/0_cache.json`
- Request coalescing for concurrent imports
- Fallback mechanisms for various import scenarios

#### 📚 New Module Loader Library
- Added `lib/moduleLoader.mjs` with comprehensive async module loading
- Supports local, relative, absolute, package, and URL specifiers
- Built-in caching and request deduplication
- Unit tested with 9/9 tests passing

### Breaking Changes

#### For Library Users
If you were using the internal API directly:

**Before:**
```javascript
import { avaliar } from './código/analisador_semântico/index.js';
const result = avaliar(ast, escopo);
```

**After:**
```javascript
import { avaliar } from './código/analisador_semântico/index.js';
const result = await avaliar(ast, escopo);
```

#### For Language Users
**No changes required!** Code written in the 0 language continues to work without modifications.

### Security Considerations

#### Remote Imports
⚠️ When importing from remote URLs:
- Only import from trusted sources
- Use commit-specific URLs (not branch names)
- Consider implementing a domain whitelist in production
- Review remote code before importing

#### Cache
- Remote modules are cached locally in `código/0_cache.json`
- Delete this file to clear the cache
- Cache entries are keyed by full URL

### Performance

#### Improvements
- **Startup:** Significantly faster for simple programs (no pre-loading)
- **I/O:** Only loads modules that are actually used
- **Memory:** Lower initial memory footprint

#### Trade-offs
- First remote import may have network latency
- Cache makes subsequent runs nearly instant
- Slightly more async overhead per operation

### Testing

All existing tests continue to pass:
- ✅ 203/203 language tests passing
- ✅ 9/9 module loader unit tests passing
- ✅ Remote HTTPS imports tested and working
- ✅ Error handling verified
- ✅ CodeQL security scan: 0 issues

### Files Changed

#### Added
- `lib/moduleLoader.mjs` - New module loader library
- `lib/test-moduleLoader.mjs` - Unit tests for module loader
- `docs/LAZY_LOADING.md` - Comprehensive documentation

#### Modified
- `código/analisador_semântico/index.js` - Made async
- `código/analisador_semântico/básico.js` - Made async
- `código/analisador_semântico/operações.js` - Made async
- `código/analisador_semântico/função.js` - Made async with async lambdas
- `código/analisador_semântico/coleção.js` - Made async
- `código/analisador_semântico/objeto.js` - Made async
- `código/analisador_semântico/escopo.js` - Added async thunk support
- `código/0_node.js` - Removed pre-fetch, made loading lazy and async
- `LEIAME.md` - Added lazy loading announcement

#### Deleted Code
- Removed `pré_carregar_urls_remotas()` function
- Removed `extrair_referências_endereços()` function
- Net reduction: ~70 lines

### Migration Guide

#### If You're Using Internal APIs

1. Add `await` to all `avaliar()` calls
2. Add `async` to functions that call `avaliar()`
3. Update function calls to await async lambdas
4. Test thoroughly with your use case

#### If You're Just Using the Language

No changes needed! Your .0 files work as-is.

### Future Enhancements

Potential improvements for future releases:
- Domain whitelist configuration
- Subresource integrity (SRI) support
- Configurable cache policies
- Timeout configuration for remote imports
- Progress indicators for slow imports

### Documentation

- [Lazy Loading Guide](./docs/LAZY_LOADING.md) - Complete guide to the new system
- [Module Loader API](./lib/moduleLoader.mjs) - JSDoc comments in source
- [README](./LEIAME.md) - Updated with async notice

### Contributors

This change was implemented to improve performance and enable remote module imports while maintaining backward compatibility for language users.
