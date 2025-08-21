# Function Call Restriction Demonstration

This file demonstrates the new single-argument restriction for function calls.

## Examples that work (✅):

```
// Zero arguments
hello = () => "Hello World"
hello()

// Single argument
quadrado = x => x * x  
quadrado(5)

// Single argument (array)
soma = args => args[0] + args[1]
soma([3, 7])
```

## Examples that cause syntax errors (❌):

```
// Multiple arguments - NO LONGER ALLOWED
soma(3, 7)           // Syntax error
max(a, b, c)         // Syntax error  
func(x, y, z)        // Syntax error
```

## Migration Guide

To migrate existing code that uses multiple arguments:

**Before:**
```
func(arg1, arg2, arg3)
```

**After:**
```
func([arg1, arg2, arg3])
```

Then update the function definition to expect an array:
```
// Before
minha_func = (arg1, arg2, arg3) => { ... }

// After  
minha_func = args => {
  arg1 = args[0]
  arg2 = args[1] 
  arg3 = args[2]
  ...
}
```