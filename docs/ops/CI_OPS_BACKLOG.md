# CI Ops Backlog — Agent-Ready Plans

> Created: 2026-04-17 | Context: Branch cleanup mega-session (PRs #20-30)
> Any agent can pick these up. Each is self-contained with scope, steps, and done criteria.

---

## 1. Fix TypeScript Errors (164 errors → 0)

**Priority**: HIGH — Once at 0, flip `continue-on-error` to `false` in `.github/workflows/ci.yml` and TypeScript becomes a blocking gate.

**Scope**: `apps/web/` only — 164 errors across ~20 files.

**Error breakdown**:
| Code | Count | Meaning |
|------|-------|---------|
| TS2322 | 52 | Type assignment mismatch |
| TS2339 | 49 | Property doesn't exist on type |
| TS2345 | 20 | Argument type mismatch |
| TS2769 | 18 | No overload matches |
| TS2451 | 6 | Duplicate identifier |
| TS2393 | 6 | Duplicate function implementation |
| Other | 13 | Mixed |

**Top offenders** (fix these first for biggest impact):
1. `app/academy/academy-content.tsx` — 17 errors
2. `app/arcanea-vault/vault-constellation-3d.tsx` — 16 errors
3. `app/creator-economy/creator-economy-data.ts` — 15 errors
4. `app/claw/dashboard/page.tsx` — 10 errors
5. `app/api/author/[bookSlug]/chapters/[chapterSlug]/route.ts` — 10 errors

**Steps**:
1. Run `cd apps/web && npx tsc --noEmit 2>&1 | grep "error TS"` to get current list
2. Fix files in order of most errors (batch similar fixes)
3. Most TS2322/TS2339/TS2345 are type annotation issues — add proper types, not `any`
4. After each batch, verify with `npx tsc --noEmit`
5. When error count = 0, edit `.github/workflows/ci.yml`:
   - Remove `continue-on-error: true` from TypeScript check step
   - Change `::warning::` back to `::error::`
6. Commit and push — CI should go green with TypeScript as a blocking gate

**Done criteria**: `npx tsc --noEmit` exits 0. CI TypeScript step is blocking.

---

## 2. pnpm/action-setup v4 → v6 Migration

**Priority**: MEDIUM — v4 runs on Node.js 20 which is deprecated June 2026, removed September 2026.

**Deadline**: Before 2026-09-16 (Node 20 removal from GitHub runners)

**Why it broke last time**: v6 enforces that `packageManager` in `package.json` exactly matches the `version` input. It also can't have BOTH — you use one or the other. Our lockfile v6 (pnpm 8) was rejected by pnpm 9 in CI.

**Steps**:
1. **Upgrade pnpm locally**: `corepack prepare pnpm@9.15.0 --activate`
2. **Update package.json**: `"packageManager": "pnpm@9.15.0"` (no `+sha512` hash)
3. **Regenerate lockfile**: `pnpm install --no-frozen-lockfile` (creates lockfile v9)
4. **Update all workflow files** (ci.yml, deploy-web.yml, quality-gate.yml):
   - Change `pnpm/action-setup@v4` → `@v6`
   - **Remove** the `version` input (v6 reads from `packageManager` in package.json)
   - **Remove** `PNPM_VERSION` env var (no longer needed)
5. **Test locally**: `pnpm install --frozen-lockfile` must pass
6. **Push as single PR** — all changes together (lockfile + package.json + workflows)
7. **Verify CI passes** before merging
8. **Update dependabot.yml**: Remove the `pnpm/action-setup` major ignore rule

**Key gotcha**: The lockfile MUST be committed in the same PR as the workflow changes. If they're in separate PRs, GitHub's squash merge corrupts the lockfile.

**Done criteria**: All 3 workflows use `pnpm/action-setup@v6`, no `PNPM_VERSION` env var, lockfile v9, CI green.

---

## 3. CODEOWNERS for Agentic Workflow

**Priority**: LOW — Nice-to-have for traceability, not a blocker.

**Philosophy**: In an agentic workflow, CODEOWNERS isn't about gatekeeping — it's about **routing**. Which agent/skill is best suited to review changes in a given area.

**File**: `.github/CODEOWNERS`

**Proposed content**:
```
# Agentic CODEOWNERS — routing, not gatekeeping
# These map areas to the agent types best suited to review them

# Core infrastructure — ops agent
.github/                    @frankxai
package.json                @frankxai
pnpm-lock.yaml              @frankxai
*.config.*                  @frankxai

# Web app — frontend agent
apps/web/                   @frankxai
apps/web/components/        @frankxai

# Intelligence substrate — lore/guardian agent
.arcanea/                   @frankxai
book/                       @frankxai

# Supabase — backend agent
supabase/                   @frankxai

# Packages — specialist agent per package
packages/                   @frankxai
```

**Note**: On a free GitHub plan, CODEOWNERS doesn't enforce anything — it just shows suggested reviewers. It becomes useful if you upgrade to Pro or go public.

**Steps**:
1. Create `.github/CODEOWNERS` with content above
2. Commit and push
3. Future: If using branch protection, CODEOWNERS auto-assigns reviewers

**Done criteria**: File exists, no CI impact.
