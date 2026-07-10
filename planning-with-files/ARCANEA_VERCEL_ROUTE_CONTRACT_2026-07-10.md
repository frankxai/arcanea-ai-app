# Arcanea Vercel Route Contract

Generated: 2026-07-10

Status: canonical route selected; production promotion blocked

This packet records read-only Vercel and repository evidence. It does not authorize a project
mutation, DNS change, deployment, promotion, credential change, or billing action.

## Canonical route

| Boundary | Canonical value | Evidence |
|---|---|---|
| Git repository | `frankxai/arcanea-ai-app` | `origin` and Vercel deployment metadata |
| Local branch | `codex/arcanea-homepage-world-engine` | `git branch --show-current` |
| Local HEAD at diagnosis | `1570e0b8bd0b9a52538739660145b8490be0c179` | `git rev-parse HEAD` |
| Vercel team | `team_q6LNT6rnFRlqlcjBJ2Wxz6PE` | `.vercel/project.json` and provider read-back |
| Vercel project | `arcanea-ai-app` / `prj_90OIWsAmfeswv8IG8WxqEAFefTOV` | local link and provider read-back |
| Vercel project root | repository root (`.`) | root `vercel.json`; local project link has no nested root |
| Next.js app root | `apps/web` | workspace and build/output configuration |
| Build command | `pnpm --filter @arcanea/web... --workspace-concurrency=1 build` | root `vercel.json` |
| Install command | `corepack enable && pnpm install --prod=false --frozen-lockfile` | root `vercel.json` |
| Output directory | `apps/web/.next` | root `vercel.json` |
| Intended production domain | `arcanea.ai` | estate repo profile and product doctrine |

The canonical choice minimizes repository and preview-history discontinuity. The local worktree is
already linked to this project, and its branch has prior Vercel deployment history. A relink to a
nearby project would change project history, environment binding, aliases, and rollback behavior.

## Provider state on 2026-07-10

Read-only `get_project` returned:

- Framework: `services`.
- Node runtime: `24.x`.
- Live: `false`.
- Custom domains: none.
- Provider aliases:
  - `arcanea-ai-app.vercel.app`
  - `arcanea-ai-app-starlight-intelligence.vercel.app`
  - `arcanea-ai-app-frankx-eth-starlight-intelligence.vercel.app`
- Latest deployment: `dpl_CHzkhYc8itSJxdvxJPPJmoU39L9r`, `BLOCKED`, preview target.

The checked-in link metadata records Next.js and Node `22.x`, while provider truth reports
`services` and Node `24.x`. Root `AGENTS.md` currently requires Node `20.x`, while
`.nvmrc` contains `22`. That three-way runtime conflict must be resolved as one explicit
engineering decision before changing the remote runtime. No runtime setting was changed here.

The intended domain `arcanea.ai` is not listed on the canonical project. Treat the repo-profile
domain as the desired route, not proof of current attachment.

## Duplicate-project inventory

| Project | Project ID | Framework / Node | Latest state | Canonical verdict |
|---|---|---|---|---|
| `arcanea-ai-app` | `prj_90OIWsAmfeswv8IG8WxqEAFefTOV` | services / 24.x | BLOCKED | Canonical; repair in place after approval |
| `arcanea-ai-appx` | `prj_bg70JJwiuYTOyP1oX2ddiatX1O95` | nextjs / 22.x | BLOCKED | Duplicate candidate; do not relink |
| `arcanea-web` | `prj_vEngtP0ncNaO9Ds0rKsw2tyWkI1m` | nextjs / 24.x | READY preview | Duplicate candidate; no production domain |
| `arcanea-2` | `prj_9OaL0ui2ApSCwKNAIAiqtRBuK08s` | unset / 24.x | ERROR | Legacy duplicate candidate |
| `arcanea-platform` | `prj_X3YSrJJVm68YqpOU2y7iGQnsnkPZ` | nextjs / 24.x | ERROR | Legacy duplicate candidate |

All inspected projects report `live=false` and none list `arcanea.ai`. This packet does not infer
that a duplicate can be deleted: retirement requires domain, environment, deployment-history, and
rollback review.

## Deployment diagnosis

### Newest overall deployment

`dpl_CHzkhYc8itSJxdvxJPPJmoU39L9r` is a `BLOCKED` preview for
`backup/claude-snapshots` at commit `67686629d5511b5beba1d736e4921c92f9d5f7cd`.
The provider returned no build-log events. This is backup-branch deployment noise or a provider
policy decision, not evidence of a compile failure in the canonical release branch.

### Current release branch

`dpl_8n7399bpgD7Htsfzwymp1zRCyotV` is the latest inspected `ERROR` preview for
`codex/arcanea-homepage-world-engine` at the exact local HEAD
`1570e0b8bd0b9a52538739660145b8490be0c179`.

Provider build logs identified two local build regressions:

1. `apps/web/app/v3/v3-content.tsx` was missing while root and localized home routes imported it.
   Git history showed the checkpoint commit deleted the file without removing either import.
2. Two author routes used a default import from `js-yaml`, while the security override resolved the
   package to the ESM export shape where no default export exists.

Safe local remediation performed:

- Restored the four active production-home modules byte-for-byte from `origin/main`:
  - `apps/web/app/v3/v3-content.tsx`
  - `apps/web/app/v3/v3-below-fold.tsx`
  - `apps/web/app/v3/hero-showcase.tsx`
  - `apps/web/app/v3/hero-chat-box.tsx`
- Replaced only the two failing default imports with `import * as yaml from 'js-yaml'`.

The deleted experimental variations and obsolete `/v3` route wrappers were not restored. No
unrelated AgentHub, core-type, or lockfile work was modified.

### Last known production rollback point

The recent deployment list includes `dpl_8PK3YwLjacjMNvf77YqsZpntHvTf`, `READY`, target
`production`, branch `main`, commit `12e8618388715b50e22e42e241e2bc28a05fc3b7`.
The provider marks it as a rollback candidate. This is evidence only; promotion or rollback remains
human-gated.

## Local verification

- Managed repo-contract dry-run before projection: 11 expected changes, zero dirty-target conflicts.
- Managed repo-contract check after projection: zero changes; generator is idempotent.
- Projected `.agent-harness.json` validates against `starlight.repo_profile.v2`.
- Strict UTF-8/no-BOM check: pass across all 19 files changed by this lane.
- Targeted Git whitespace check: pass. The whole dirty worktree still has unrelated pre-existing
  whitespace findings under `packages/core`.
- Root `SECURITY.md` was made Git-visible so the required contract document is not silently ignored.
- Scoped secret scan: 69.16 KB across every file changed by this lane, zero leaks.
- Full estate security scanner: timed out twice while traversing this large monorepo, including once
  with dependency scanning disabled. This is not counted as a passing full-repo security gate.
- `pnpm --dir apps/web type-check`: pass; route types generated and `tsc --noEmit` exited zero.
- Targeted ESLint for the four restored homepage modules and two `js-yaml` call sites: pass with
  `--max-warnings=0`.
- `pnpm --dir apps/web build`: pass; Next.js 16.2.6 compiled and generated 353 static pages.

Build warnings that remain outside this bounded fix:

- The package-level `pnpm.overrides` field is ignored by the installed pnpm; workspace-level
  overrides still exist in `pnpm-workspace.yaml`.
- The Next.js `middleware` convention is deprecated in favor of `proxy`.
- Turbopack reports a broad file trace through `apps/web/lib/saga/loader.ts`.
- Edge runtime usage disables static generation for the affected page.

Verification ran with the available Node `24.16.0`, matching current provider truth but not resolving
the documented Node policy conflict. No preview, production deployment, domain, or provider setting
was mutated.

## Required gates before promotion

1. Resolve Node `20` versus `22` versus remote `24` and align `AGENTS.md`, `.nvmrc`, local
   verification, and Vercel project settings.
2. Confirm the canonical project decision and patch its framework/runtime only with named approval.
3. Decide whether backup branches should create previews or receive an ignored-build rule.
4. Create one coherent preview from the release branch after the dirty work is packaged.
5. Run typecheck, lint, targeted tests, production build, accessibility, reduced-motion, performance,
   and desktop/mobile visual QA.
6. Verify preview routes and logs.
7. Confirm current `arcanea.ai` owner, domain records, rollback target, and maintenance window before
   any attachment or move.
8. Promote only after the release-readiness gate is green and a named human approves the
   production-sensitive steps.
