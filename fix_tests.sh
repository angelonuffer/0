#!/bin/bash

# Fix test files to use single argument syntax

# Function to fix a test file
fix_test_file() {
    local file="$1"
    echo "Fixing $file..."
    
    # Backup original
    cp "$file" "${file}.backup"
    
    # Apply transformations
    sed -i 's/uniteste\.descrever("\([^"]*\)" \[/uniteste.descrever(["\1", [/g' "$file"
    
    # For now, let's try to fix closing brackets manually for each file
    echo "Manual fixes needed for $file"
}

# Process remaining files
fix_test_file "testes/lista_com_chaves.0" 
fix_test_file "testes/objeto.0"