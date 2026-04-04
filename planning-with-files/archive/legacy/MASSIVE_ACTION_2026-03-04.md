# Massive Action Plan - 2026-03-04

## Problem Map

1. Deployment failures are recurring because build-time errors are fixed one-at-a-time without parity hardening.
2. CI workflows were inconsistent (Node and package manager mismatch), so passing CI did not guarantee Vercel success.
3. Dependency resolution drift (Supabase peer mismatch) created avoidable install warnings and non-determinism.
4. Execution quality is diluted by AI slop patterns: inline-style sprawl, raw colors, weak PR verification discipline.

## Solution Architecture

1. Stabilize deploy path first:
- Remove unsupported runtime imports.
- Fix strict typing where Next.js/Vercel fails.
- Keep temporary stubs over risky integrations until package compatibility is verified.

2. Enforce environment parity:
- Node 20 baseline everywhere.
- pnpm-only workspace pipeline.
- frozen lockfile in CI.

3. Lock dependency consistency:
- Align `@supabase/supabase-js` with `@supabase/ssr` peer requirements.
- Keep lockfile updated after version changes.

4. Raise agent standards:
- Mandatory DoD and verification evidence.
- Explicit ownership and rollback notes.
- Guardrails for design-token and code-style consistency.

## Execution Plan

## Track 1 - Deploy Stability (immediate)
- [x] Fix 3D evolution type blocker.
- [x] Revert spline import that is not exported by package.
- [x] Push hotfixes to `production/main`.
- [ ] Validate clean Vercel build.

## Track 2 - CI Parity (immediate)
- [x] Update workflows to Node 20.
- [x] Replace npm gates with pnpm workspace flows.
- [x] Use frozen lockfile in CI install steps.
- [ ] Consolidate required check list in branch protection.

## Track 3 - Quality Hardening (next 48h)
- [ ] Add lint rule for raw color literals outside token files.
- [ ] Add lint rule for excessive inline styles in app pages.
- [ ] Resolve known TypeScript debt in active surfaces.

## Standards Contract for All Agents

1. No merge without passing changed-scope build/type-check/lint.
2. No runtime dependency imports unless package export path is verified.
3. No hidden assumptions: include risk, verification, rollback in every PR.
4. No token bypass: use design tokens instead of ad hoc color literals.
5. No broad staging in dirty trees: stage only intended files and list them in handoff.

## Verification Commands

```bash
pnpm install --frozen-lockfile
pnpm --filter @arcanea/web type-check
pnpm --filter @arcanea/web build
```
