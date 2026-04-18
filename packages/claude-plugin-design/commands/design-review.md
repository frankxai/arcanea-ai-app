---
description: Run the design-verifier subagent against an existing page to check quality, produce Playwright screenshots, Lighthouse scores, and diff-grep for anti-patterns.
---

# /design-review

Quality review of an existing page. Does NOT modify code — produces a report only. Use this to audit pages before promoting from preview, or after merging to verify production-side rendering.

## Input

User arguments: `$ARGUMENTS`

Expected format: a URL path or page file path. Examples:
- `/design-review /pricing`
- `/design-review apps/web/app/chat/page.tsx`
- `/design-review https://www.arcanea.ai` (full site review)

## Workflow

1. Dispatch `design-verifier` subagent with the target as context.
2. Run all 6 verification checks from the verifier's checklist:
   - Diff-grep (if a PR context exists)
   - Build (design-system + apps/web)
   - Playwright screenshots at 1920 / 1440 / 768
   - Lighthouse scores
   - Brand kit consistency
   - Reduced-motion graceful degradation
3. Produce the verification report markdown.
4. Save report to `docs/design-reviews/<YYYY-MM-DD>-<slug>.md`.
5. If any check FAILS: list specific fixes needed.

## Scope

- Read-only mode (no code changes)
- Playwright screenshots against deployed URL (preview or prod), never localhost
- Lighthouse scores must be fetched, not inferred

## Output

Verification report + PASS/FAIL summary per check.
