# Vercel preview decision — proposed change

Scope: `scripts/vercel-ignore-build.sh` and its regression tests, from Arcanea main `4e104ae5e40d280d04f863137a505483f11e2409`.
Owner: Arcanea web release lane. This document and branch are a proposal until independently reviewed and merged.

## Observed issue

The ignored-build script skips `dependabot/*`, `docs/*` and other named branches before inspecting changed files, and skips any PR whose unauthenticated API response reports `draft: true`. A code-changing PR on one of those branches can therefore have no Vercel preview. A ready transition may retain the same commit, so its missing preview cannot be inferred from a green GitHub code check. The draft lookup adds an external request during build selection and can fail open or yield inconsistent results for a private repository.

## Decision and bounds

Preview builds are decided by the pending Git tree against `VERCEL_GIT_PREVIOUS_SHA`, not the branch label or mutable draft state. Preserve production always-build, the explicit `[agent-wip]` checkpoint and the fail-build decision when previous commit history is missing. The existing documentation path exclusions remain for this slice; whether `docs/`, `book/` or `wiki/` feed the built app requires separate consumer evidence before tightening them. A skipped WIP head is never an acceptable production-intent preview receipt.

Acceptance: changes to deployable code on dependency, documentation, agent, backup and release branches build; draft PR code builds; documentation-only changes still skip; all existing history, rename, production and failure cases pass. `node --test scripts/tests/vercel-ignore-build.test.mjs`: 15/15 passed locally. No credentials, Vercel project settings, production code or domains changed.

Cost: preview usage may increase for code-changing drafts and named branches; avoid speculative per-commit changes by batching coherent PR revisions. Measure Vercel build minutes and skipped-versus-built decisions on a bounded cohort before further filtering. Do not reduce preview evidence to save minutes; skip decisions must be explainable from the exact source tree.

Rollback: revert this branch-only change. Next gate: CI at exact head and independent review, then verify that a code-changing PR on a formerly skipped branch yields a preview deployment for the same Git SHA.
