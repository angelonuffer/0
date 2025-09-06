# Language 0 (Linguagem 0)

Language 0 is a functional programming language with mathematical syntax designed to be universal and platform-independent. It runs as an interpreted language on Node.js with no traditional build process.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Prerequisites and Installation
- **Node.js version 22** is required (as specified in CI)
- The interpreter runs directly on Node.js with no compilation step
- Install via: `curl -sSL https://cdn.jsdelivr.net/gh/Nuffem/0@main/install.sh | bash`

### Running Tests and Validation
- **Main test command**: `node 0_node.js testes/0`
- **Timing**: Test suite completes in ~0.2 seconds, runs 145 comprehensive tests
- **NEVER CANCEL**: Always wait for tests to complete - they are very fast
- **Exit codes**: Tests return 0 on success, 1 on failure
- Always run tests before and after making changes to validate correctness

### Running Individual Programs
- **Command**: `node 0_node.js <file.0>`
- **Working directory**: MUST run from repository root directory for module imports to work
- **Timing**: Individual programs run in ~0.06 seconds

### Module System and Imports
- **Import syntax**: `module_name # ./path/to/file.0`
- **Path resolution**: Relative to current working directory

## Validation Scenarios

### Always Test These Scenarios After Changes
1. **Run full test suite**: `node 0_node.js testes/0` - must pass all tests
2. **Test syntax error handling**:
   ```bash
   echo 'invalid syntax' > test_error.0
   node 0_node.js test_error.0  # Should show syntax error
   ```

### Writing Tests
Use the built-in test framework:
```
uniteste # uniteste.0

uniteste.descrever({"Test Group" {
  uniteste.iguais({
    2 + 2
    4
  })
}})
```

## Common Tasks and Navigation

### Repository Structure
```
├── 0.js                    # Main entry point
├── 0_node.js              # Node.js runtime wrapper  
├── LEIAME.md               # Portuguese README with syntax info
├── exemplos.md             # Comprehensive language examples
├── lista.0                 # List utility module
├── uniteste.0              # Test framework module
├── install.sh              # Installation script
├── testes/                 # Test files directory
│   ├── 0                   # Main test suite definition
│   ├── aritmética.0        # Arithmetic tests
│   ├── função.0            # Function tests
│   └── ... (20+ test files)
└── código_fonte/           # Modular source code
    ├── combinadores/       # Parser combinators (reusable)
    ├── analisador_léxico/  # Lexical analyzer (tokenization)
    ├── analisador_sintático/ # Syntax analyzer (AST)
    ├── analisador_semântico/ # Semantic analysis utilities
    └── autômato/           # Execution automaton (state machine)
```

### Key Files for Understanding Language Syntax
- `exemplos.md` - Language examples and syntax guide (11KB)
- `LEIAME.md` - Installation and basic usage
- `código_fonte/README.md` - Technical architecture overview
- `testes/` directory - Live examples of all language features

### Common Operations
- **Math**: `2 + 3 * 4` (precedence: `* /` before `+ -`)
- **Logic**: `1 & 0` (and), `1 | 0` (or), `!1` (not)
- **Comparison**: `5 > 3`, `2 == 2`, `4 != 5`
- **Lists**: `{1 2 3}`, list access `list[0]`, slicing `list[1:3]`
- **Functions**: `args => args[0] + args[1]`
- **Comments**: `// comment text`

### Error Patterns and Debugging
- **Syntax errors**: Show file, line, column with context
- **Module not found**: Check working directory and relative paths

## Language-Specific Guidelines

### When Modifying Core Interpreter (código_fonte/)
- **Parser combinators** (`combinadores/`): Generic, reusable parsing functions
- **Lexical analyzer** (`analisador_léxico/`): Token recognition and whitespace handling
- **Syntax analyzer** (`analisador_sintático/`): AST construction and expression parsing
- **Automaton** (`autômato/`): Module loading, dependency resolution, effect processing
- Each module has an `index.js` that exports main functions

### Language Features to Test
- Arithmetic with precedence: `2 + 3 * 4` → `14`
- List operations: Join, map, reduce functions in `lista.0`
- String division: `"a,b,c" / ","` → `{"a" "b" "c"}`
- Module imports and dependency resolution
- Function definitions and calls

### CI/Build Information
- **CI command**: `node 0_node.js testes/0` (same as manual testing)
- **No linting tools**: Validation happens through comprehensive test suite
- **No build artifacts**: Language is interpreted, no compilation step
- **No package.json**: Not a traditional Node.js project structure

## Critical Reminders
- **ALWAYS run from repository root** for module imports to work correctly
- **NO build process** - this is an interpreted language
- **Test suite is comprehensive** - 145 tests cover all language features
- **Fast execution** - Tests and programs run in milliseconds, not minutes
- **Node.js 22 required** - Ensure correct version for compatibility