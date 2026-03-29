#!/bin/bash
echo "Running pre-push quality gate..."
cd apps/web
npx next build --no-lint 2>&1 | tail -5
if [ $? -ne 0 ]; then
  echo "BUILD FAILED — fix before pushing"
  exit 1
fi
echo "Quality gate passed"
