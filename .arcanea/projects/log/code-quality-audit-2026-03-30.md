# Code Quality Audit
**Date**: 2026-03-30
**Scope**: New/modified files from last 10 commits in `apps/web/`

## Summary
- Files audited: 14
- Issues found: 7
- Issues fixed: 4
- Technical Debt Estimate: 1.5 hours (for remaining items)

## Overall Quality Score: 8/10

The new/modified files are well-structured with proper TypeScript typing, good component decomposition, and mostly correct accessibility. The main concerns are: an accidental nested directory, one missing `useMemo`, and a few accessibility gaps.

## TypeScript Issues

| File | Issue | Fixed? |
|------|-------|--------|
| `apps/web/components/saga/chapter-reader.tsx` | No `any` types, no missing return types, no unused imports | N/A (clean) |
| `apps/web/components/saga/reading-toolbar.tsx` | No issues found | N/A (clean) |
| `apps/web/app/codex/materials/page.tsx` | Non-null assertion `activeTabConfig!` (line 443) -- safe because `TABS` always has the active ID | No (acceptable) |
| `apps/web/lib/data/materials.ts` | Clean: all types exported, proper interfaces | N/A (clean) |
| `apps/web/lib/data/skills-catalog.ts` | Clean: strong typing throughout | N/A (clean) |
| `apps/web/app/books/page.tsx` | Clean: proper interfaces, server component | N/A (clean) |

## Accessibility Issues

| File | Issue | WCAG | Fixed? |
|------|-------|------|--------|
| `apps/web/components/saga/chapter-reader.tsx` | Notes textarea had no `aria-label` or associated `<label>` | 1.3.1 Info and Relationships | Yes |
| `apps/web/components/saga/chapter-reader.tsx` | TOC backdrop overlay used `<div onClick>` -- not keyboard accessible | 2.1.1 Keyboard | Yes (changed to `<button>`) |
| `apps/web/app/codex/materials/page.tsx` | Filter tab buttons missing `aria-pressed` state | 4.1.2 Name, Role, Value | Yes |
| `apps/web/app/codex/materials/page.tsx` | Material card expandable `<div onClick>` not keyboard accessible, no `aria-expanded` | 2.1.1 Keyboard, 4.1.2 | Yes (added `role`, `tabIndex`, `aria-expanded`, `onKeyDown`) |
| `apps/web/components/saga/reading-toolbar.tsx` | Font family button shows "Aa" for both serif/sans states | N/A | No (sr-only span present -- adequate) |

## Suspicious: Nested Directory

- **Path**: `apps/web/apps/web/components/saga/`
- **Contains**:
  - `chapter-reader.tsx` (104 lines -- older version without toolbar, themes, TOC, reactions)
  - `doc-reader.tsx` (101 lines -- doc reader component)
- **Analysis**: This is an accidental copy. The real files live at `apps/web/components/saga/`. The nested `chapter-reader.tsx` is an older snapshot missing all recent enhancements. The `doc-reader.tsx` may be the only copy of that component.
- **Recommendation**: Delete `apps/web/apps/web/` entirely. If `doc-reader.tsx` is needed, move it to `apps/web/components/saga/doc-reader.tsx` first. No imports reference the nested path.
- **Risk**: None -- no code imports from the nested path.

## React Best Practices

| File | Issue | Fixed? |
|------|-------|--------|
| `apps/web/components/saga/chapter-reader.tsx` | `extractHeadings(content)` called on every render without `useMemo`, causing `useEffect` dependency churn | Yes (wrapped in `useMemo`) |
| `apps/web/components/saga/chapter-reader.tsx` | `useCallback` handlers for preferences reference outer state in `savePrefs()` -- minor stale closure risk | No (acceptable -- deps are listed correctly) |
| `apps/web/app/books/page.tsx` | Proper server component, async data fetching, graceful fallbacks | N/A (good) |
| `apps/web/app/codex/materials/page.tsx` | `'use client'` correctly used -- needs `useState`, `framer-motion` | N/A (good) |
| `apps/web/app/codex/materials/layout.tsx` | Server component with metadata only | N/A (good) |
| `apps/web/components/saga/reading-toolbar.tsx` | Pure presentational component, all state lifted to parent | N/A (good) |

## Positive Findings

- **Strong typing**: All components use explicit interfaces, no `any` types found
- **Server/Client split**: `books/page.tsx` is a server component; `chapter-reader.tsx` and `codex/materials/page.tsx` correctly use `'use client'`
- **Accessible toolbar**: `reading-toolbar.tsx` has proper `aria-label` on every button, disabled states, `aria-disabled` on nav links
- **Clean data layer**: `lib/data/materials.ts` and `lib/data/skills-catalog.ts` have well-typed exports with helper functions
- **Progressive enhancement**: Scroll progress, keyboard nav, and touch gestures all have proper cleanup in `useEffect` returns
- **Good component decomposition**: `MaterialCard`, `MutationCard`, `MeteorCard` are focused, each under 100 lines
- **Lazy loading**: `ChatMarkdown` is dynamically imported with loading state
