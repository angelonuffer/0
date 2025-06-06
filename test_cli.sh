#!/bin/bash

# test_cli.sh - Basic tests for 0_cli.js

CLI_SCRIPT="./0_cli.js"
TEST_MODULE="./test_module.0"
TEMP_OUTPUT_FILE="temp_cli_output.txt"

# Cleanup function
cleanup() {
  rm -f "$TEMP_OUTPUT_FILE"
}
trap cleanup EXIT

echo "Running tests for 0_cli.js..."
test_count=0
passed_count=0

# Test 1: Successful execution
echo -n "Test 1: Successful execution with test_module.0... "
test_count=$((test_count + 1))
expected_output="Test Module Executed Successfully.
Args and stdin were passed (not echoed here to keep it simple).
"
# Simulate some stdin
echo "Hello from stdin" | "$CLI_SCRIPT" "$TEST_MODULE" arg1 arg2 > "$TEMP_OUTPUT_FILE"
exit_code=$?

output_matches=0
if diff -q <(echo -n "$expected_output") "$TEMP_OUTPUT_FILE" >/dev/null; then
  output_matches=1
fi

if [ "$exit_code" -eq 0 ] && [ "$output_matches" -eq 1 ]; then
  echo "PASS"
  passed_count=$((passed_count + 1))
else
  echo "FAIL"
  echo "  Exit code: $exit_code (expected 0)"
  echo "  Output diff:"
  diff <(echo -n "$expected_output") "$TEMP_OUTPUT_FILE" || true
fi
rm -f "$TEMP_OUTPUT_FILE"


# Test 2: No arguments
echo -n "Test 2: No arguments provided to 0_cli.js... "
test_count=$((test_count + 1))
"$CLI_SCRIPT" > "$TEMP_OUTPUT_FILE" 2>&1 # Capture stderr
exit_code=$?
# Expected error message part
expected_error_msg="Usage: ./0_cli.js <path_to_module.0>"
if [ "$exit_code" -ne 0 ] && grep -q "$expected_error_msg" "$TEMP_OUTPUT_FILE"; then
  echo "PASS"
  passed_count=$((passed_count + 1))
else
  echo "FAIL"
  echo "  Exit code: $exit_code (expected non-zero)"
  echo "  Stderr/Stdout content:"
  cat "$TEMP_OUTPUT_FILE"
fi
rm -f "$TEMP_OUTPUT_FILE"


# Test 3: Module file not found
echo -n "Test 3: Module file not found... "
test_count=$((test_count + 1))
"$CLI_SCRIPT" "./non_existent_module.0" > "$TEMP_OUTPUT_FILE" 2>&1 # Capture stderr
exit_code=$?
expected_error_msg="Error reading module file: ./non_existent_module.0"
if [ "$exit_code" -ne 0 ] && grep -q "$expected_error_msg" "$TEMP_OUTPUT_FILE"; then
  echo "PASS"
  passed_count=$((passed_count + 1))
else
  echo "FAIL"
  echo "  Exit code: $exit_code (expected non-zero)"
  echo "  Stderr/Stdout content:"
  cat "$TEMP_OUTPUT_FILE"
fi
rm -f "$TEMP_OUTPUT_FILE"

# Test 4: Module with syntax error
echo -n "Test 4: Module with syntax error... "
test_count=$((test_count + 1))
SYNTAX_ERROR_MODULE="syntax_error_module.0"
echo "this is ( not valid 0 code" > "$SYNTAX_ERROR_MODULE"
"$CLI_SCRIPT" "$SYNTAX_ERROR_MODULE" > "$TEMP_OUTPUT_FILE" 2>&1 # Capture stderr
exit_code=$?
# This will depend on the exact error from _0.js, let's check for "Syntax error" and "Unexpected input"
if [ "$exit_code" -ne 0 ] && grep -q "Syntax error in module" "$TEMP_OUTPUT_FILE" && grep -q "Unexpected input" "$TEMP_OUTPUT_FILE"; then
  echo "PASS"
  passed_count=$((passed_count + 1))
else
  echo "FAIL"
  echo "  Exit code: $exit_code (expected non-zero)"
  echo "  Stderr/Stdout content:"
  cat "$TEMP_OUTPUT_FILE"
fi
rm -f "$SYNTAX_ERROR_MODULE" "$TEMP_OUTPUT_FILE"


echo ""
echo "Tests finished: $passed_count / $test_count passed."

if [ "$passed_count" -eq "$test_count" ]; then
  exit 0
else
  exit 1
fi
