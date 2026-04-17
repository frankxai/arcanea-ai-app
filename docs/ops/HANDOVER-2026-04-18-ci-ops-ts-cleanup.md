# Handover — 2026-04-18 (CI Ops Backlog — TS Cleanup Sprint)

## Situation

`arcanea-ai-app` / apps/web had **168 TypeScript errors** against the plan at `docs/ops/CI_OPS_BACKLOG.md` Task #1. This session executed a 5-PR sprint that brought the count to **0 locally** (PR #37 branch `fix/ts-errors-batch5`), plus prepared the follow-up gate-flip PR #38. **Main still has 18 errors** until #37 merges. All CI is currently hard-blocked by a GitHub Actions billing/spending-limit issue — see next section.

## 🚨 Hard blocker: GitHub Actions billing

**All CI across the repo is hard-failing in 1 second** — main, PR #37, PR #38. The check-run annotation reveals:

> "The job was not started because recent account payments have failed or your spending limit needs to be increased. Please check the 'Billing & plans' section in your settings"

**Nothing in code can fix this.** First action on resuming: **GitHub → Settings → Billing & plans**. Verify resolution by checking `gh run list --branch main --limit 1` — latest run's Install step should complete in >10s with real steps (not 1s with empty steps).

## What's Done

**Shipped to main:**
- **PR #32** `14019257` — `.github/CODEOWNERS` (agentic routing, zero CI impact)
- **PR #34** `d76d0581` — 37 TS errors (168→131) + fixed main's broken `pnpm-lock.yaml` (was out of sync with `packages/design-system` from a parallel merge) + made `deploy-web.yml` type-check non-blocking
- **PR #35** `81ed1182` — 81 TS errors (115→34); critical discovery: `apps/web/types/three.d.ts` was a hand-rolled shadow stub silently blocking `@types/three`
- **PR #36** `2e6d4178` — 27 TS errors (45→18); react-markdown component fix + 7 studio API routes cast + js-yaml ambient shim

**Open / in-flight:**
- **PR #37** `fix/ts-errors-batch5` HEAD `8af86d02` (rebased onto main + empty retrigger). Final 18→0 fixes for WorldGraph (9), author-ai-panel (6), liquid-glass (1), split-text (1), gallery-components (1). Local `tsc --noEmit` exits 0. Local `pnpm install --frozen-lockfile` passes. **CI blocked by account billing, not code.**
- **PR #38** `ops/ci-typecheck-blocking` — follow-up that flips typecheck gate to blocking in `ci.yml` + `deploy-web.yml`. 2-file diff (10 insertions, 10 deletions). Ready to merge AFTER #37.
- **PR #33** `feat/pnpm-v6` — **DRAFT / BLOCKED.** `ERR_PNPM_BROKEN_LOCKFILE "expected a single document in the stream, but found more"` in CI under both pnpm 9.15.0 and pnpm 8.15.0 lockfiles. Local install passes. Committed blob is clean (0 CR, 18063 LF, no multi-doc separators). Suspicion: `pnpm/action-setup@v6` (released 2026-04-10, adds pnpm 11 support) has an undocumented incompatibility with our heavy `pnpm.overrides` in root package.json.

## What's Not Done

- **Zero-error state not on main yet** — blocked on billing → #37 merge.
- **CI gate flip** — code is ready (PR #38), but pending billing resolution + #37 merge. Follow-up PR #38 already committed (branch `ops/ci-typecheck-blocking`).
- **PR #33 pnpm v6** — still blocked. Deadline 2026-09-16 (Node 20 deprecation). Safe to defer. Try `pnpm/action-setup@v5` (Node 24) as alternative.
- **Runtime validation of AI SDK v6 migration** — `author-ai-panel.tsx` changed from v5 API (`input`/`setInput`/`handleSubmit`/`isLoading`) to v6 (`sendMessage` + `status` + `DefaultChatTransport`). Types clean locally; runtime needs manual verification on preview URL after merge.
- **pre-existing smoke test issue** — `pnpm --filter @arcanea/web test:e2e -- --grep @smoke` returns "No tests found" because pnpm passes `--` literally. Non-blocking in deploy-web (continue-on-error added in PR #34, will be REMOVED by PR #38 — but smoke test is under `validate-web` job after `Type check`, and that's the step PR #38 flips). Fix is simple: drop `--` from workflow command, separate PR.

## Critical Context

**The lockfile drift pattern** — main's `pnpm-lock.yaml` has been subtly broken twice this sprint because parallel agent sessions added workspace packages (`packages/design-system`, `packages/orchestrator` from arcanea-code rename) WITHOUT regenerating the lockfile. Every PR branched from main in that window hit `ERR_PNPM_OUTDATED_LOCKFILE`. When you see this error: run `pnpm install --lockfile-only` on a fresh main checkout, commit, and open a sync PR. PR #34 and PR #37 both had to include lockfile regens.

**Parallel agents stomping branches** — twice this session, commits I thought were on a feature branch ended up on main, and my working tree picked up untracked files from sibling sessions that got accidentally committed. Mitigations: always `git branch --show-current` before commits; never `git add -A` / `git add .`.

**TypeScript `types` array in tsconfig restricts global type inclusion.** Root `apps/web/tsconfig.json` has `"types": ["node", "three"]`. If a new `@types/*` package is installed, it won't be picked up until added here. BUT — this alone didn't fix the three.js case. The real fix in PR #35 was **removing the shadow stub at `apps/web/types/three.d.ts`** which was taking precedence. Always grep `apps/web/types/*.d.ts` for `declare module` before installing an `@types/*` package.

**Supabase schema drift** — `Database` generated type is out of sync with many live tables (`ingested_documents`, `agent_registry`, `asset_metadata`, `subscribers`, `activity_log`, and others). The established escape pattern is `(await createClient()) as any` with a scoped `eslint-disable-next-line @typescript-eslint/no-explicit-any` + comment explaining. Used in 12+ API routes. Proper fix is regenerating `lib/database/types/supabase.ts` from the live schema — out of scope for this sprint.

**`UntypedServerSupabase` intersection trap** (in `lib/projects/server.ts`) — DON'T type an untyped Supabase shape as `ServerSupabase & { from: ... }`. TypeScript prefers the typed overload. Make it a pure shape: `{ from: (t: string) => UntypedQueryBuilder; auth: ServerSupabase['auth'] }`.

**AI SDK v6 migration cheat sheet** (for author-ai-panel.tsx pattern):
- `useChat({ api, body })` → `useChat({ transport: new DefaultChatTransport({ api, body }) })` (import `DefaultChatTransport` from `'ai'`)
- `{input, setInput, handleSubmit, isLoading}` gone → manage input with `useState`, call `sendMessage({ text })`, derive `isLoading = status === 'streaming' || status === 'submitted'`
- `msg.content` gone → `msg.parts` array of `{type, text?}`; extract text with filter+map+join (see `lib/chat/__tests__/extract-message.test.ts` for the reference helper)

**framer-motion v12 strictness** — `HTMLMotionProps<"div">` / `<"span">` fails on spread/union props with a confusing "Omit<..., 'ref'>" error. Minimum-impact fix is aliasing the component at call site: `const MDiv = m.div as any` then use `<MDiv ...>`. Applied to `liquid-glass.tsx` and `split-text.tsx`.

**@xyflow/react v12 generic constraint** — `NodeProps<T>` requires `T extends Record<string, unknown>`. Plain interfaces fail. Fix: `NodeProps<any>` at component boundary + one cast `data as WorldNodeData` inside. Additionally, `ReactFlow` default export trips TS2604/2786 under Bundler resolution — alias it: `const ReactFlowComponent = ReactFlow as any`. Both applied in PR #37.

## Next Actions (ordered)

1. **Resolve GitHub Actions billing.** GitHub → Settings → Billing & plans. Update payment or raise spending limit. Verify: `gh run list --branch main --limit 1` — latest Install should complete in >10s with real steps.

2. **Merge PR #37** once CI goes green. `gh pr merge 37 --squash --delete-branch`. Then verify: `git pull origin main && cd apps/web && npx tsc --noEmit` should exit 0.

3. **Merge PR #38** (typecheck gate flip) — only after #37. Verify by checking that next PR with deliberate TS error correctly blocks merge.

4. **Verify runtime for AI SDK v6 migration** on arcanea.ai preview. Open Author Studio, start a chat, confirm messages stream and render (`msg.parts[]` path works).

5. **Defer PR #33 pnpm v6** until needed. Deadline 2026-09-16. Try `pnpm/action-setup@v5` (Node 24) as alternative.

6. **Optional housekeeping**: fix smoke test `--grep` issue in deploy-web.yml (drop the `--`).

## Files to Read First

- `docs/ops/CI_OPS_BACKLOG.md` — the source-of-truth plan for this sprint
- `apps/web/tsconfig.json` — note the `types: ["node", "three"]` restriction
- `apps/web/types/` — grep for `declare module` shadow stubs before installing any `@types/*`
- `apps/web/lib/projects/server.ts` — reference for the correct `UntypedServerSupabase` pattern (pure shape, not intersection)
- `apps/web/lib/chat/__tests__/extract-message.test.ts` — reference helper for AI SDK v6 `parts[]` text extraction
- `apps/web/components/worlds/WorldGraph.tsx` (PR #37) — reference for @xyflow/react v12 `NodeProps<any>` escape pattern
- `.github/workflows/ci.yml` — where the gate flip happens (line 162)
- `.github/workflows/deploy-web.yml` — second gate flip target (line 64 of current main)
- `C:\Users\frank\.claude\projects\C--Users-frank-Arcanea\memory\project_ci_ops_session_2026_04_17.md` — full session memory with 10 patterns + lessons

## Repo Map

| Repo | Purpose | State |
|------|---------|-------|
| `apps/web/` | Next.js 16 production app — all TS error work here | clean locally (0 errors on PR #37 branch), main has 18 until #37 merges |
| `.github/workflows/` | CI gates — ci.yml, deploy-web.yml, quality-gate.yml | typecheck non-blocking pending #37 merge; then flip to blocking |
| `packages/design-system/` | New workspace package (parallel merge) | built + in lockfile; watch for regen churn |
| `packages/orchestrator/` | Renamed from `arcanea-code` (parallel merge) | shipped on main at `8b68101c` |
| `packages/arcanea-voice/` | Voice package touched by a different 2026-04-17 session | has uncommitted work; see `docs/ops/HANDOVER-2026-04-17-voice-system-fixes.md` |

## Memory relevance

Key memory entries for a continuing session:
- `project_ci_ops_session_2026_04_17.md` — **read this first**, has all patterns, lessons, deferred items, and the full session arc
- `feedback_cached_belief_validation.md` — disk-first rule; never cite state from memory without verifying
- `feedback_no_coauthor_contamination.md` — never add `Co-Authored-By: claude-flow`
- `feedback_ship_means_ship.md` — "put on website" = commit + push + deployed; don't stop at "build passed"
- `project_current_state.md` — broader context of Arcanea-wide deployments
- `project_repo_mapping.md` — origin=arcanea-ai-app (production), oss=arcanea
