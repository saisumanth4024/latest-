#!/bin/bash

# Run tests with coverage
npx vitest run --coverage

# Display coverage summary
echo "Test coverage summary:"
cat coverage/coverage-summary.json | jq '.total'
