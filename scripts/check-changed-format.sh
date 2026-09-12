#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -ne 2 ]; then
  echo 'Usage: bash scripts/check-changed-format.sh <base> <head>' >&2
  exit 2
fi

cd "$(git rev-parse --show-toplevel)"
FORMAT_BASE=$(git rev-parse --verify --end-of-options "$1^{commit}")
FORMAT_HEAD=$(git rev-parse --verify --end-of-options "$2^{commit}")
FORMAT_PATHS=$(mktemp "${RUNNER_TEMP:-${TMPDIR:-/tmp}}/arcanea-format.XXXXXX")
trap 'rm -f "$FORMAT_PATHS"' EXIT

# Materialize the diff before reading it: process substitution would hide a git
# failure behind mapfile's success and incorrectly report no files to check.
git diff --name-only --diff-filter=ACMRT -z "$FORMAT_BASE" "$FORMAT_HEAD" -- > "$FORMAT_PATHS"
mapfile -d '' CHANGED_FILES < "$FORMAT_PATHS"

FORMATTABLE_FILES=()
for file in "${CHANGED_FILES[@]}"; do
  case "$file" in
    *.css|*.graphql|*.html|*.js|*.json|*.jsx|*.md|*.mdx|*.mjs|*.scss|*.ts|*.tsx|*.yaml|*.yml)
      if [ -f "$file" ]; then
        FORMATTABLE_FILES+=("$file")
      fi
      ;;
  esac
done

if [ "${#FORMATTABLE_FILES[@]}" -eq 0 ]; then
  echo 'No changed files supported by Prettier.'
  exit 0
fi

printf 'Checking %s changed file(s) with Prettier.\n' "${#FORMATTABLE_FILES[@]}"
pnpm exec prettier --check --ignore-unknown -- "${FORMATTABLE_FILES[@]}"
