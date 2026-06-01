#!/usr/bin/env bash
set -euo pipefail

BOOK_SLUG="${1:-}"
CHAPTER_PATH="${2:-}"

if [[ -z "${BOOK_SLUG}" || -z "${CHAPTER_PATH}" ]]; then
  echo "Usage: post-chapter-commit.sh <book-slug> <chapter-path>" >&2
  exit 1
fi

REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
BOOK_DIR="${REPO_ROOT}/book/${BOOK_SLUG}"

cd "${REPO_ROOT}"
pnpm -F @arcanea/orchestrator exec tsx -e "
  import { runCouncil } from './src/commands/author-council.ts';
  runCouncil({ bookDir: '${BOOK_DIR}', chapterPath: '${CHAPTER_PATH}' })
    .then((r) => console.log('✓ audit written:', r.auditPath))
    .catch((err) => { console.error(err); process.exit(1); });
"
