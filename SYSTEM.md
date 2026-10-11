# Arcanea system

Arcanea is a BYOK-first creative intelligence workspace and an original creative
world. Product work belongs to [programme 276](https://github.com/frankxai/arcanea-ai-app/issues/276)
and its existing owning issues. Follow [AGENTS.md](AGENTS.md) and the newest
execution records before making architectural changes.

## Repository and delivery

| Boundary              | Verified source or owner                                                        |
| --------------------- | ------------------------------------------------------------------------------- |
| Canonical repository  | `frankxai/arcanea-ai-app`                                                       |
| Operating unit / team | `arcanea` / `arcanea-creative-worlds-team`                                      |
| Application           | `apps/web`, Next.js; workspace package `@arcanea/web`                           |
| Vercel project        | `arcanea-ai-app`, `prj_90OIWsAmfeswv8IG8WxqEAFefTOV`                            |
| Production aliases    | `arcanea.ai`, `www.arcanea.ai`, `app.arcanea.ai`                                |
| Auth and private data | Product-owned Supabase Auth/Postgres; policies and migrations stay in this repo |
| Design implementation | `packages/design-system`; app surfaces also follow TASTE.md and DESIGN.md       |
| Commercial work       | Existing commerce 511 and credit/economics 529 ownership                        |
| Durable orchestration | Existing Queen/SIS integration, owned by 284                                    |

The repository at `b4520829644ba57c2ca60119833319f1137dfb99` pins Node 24 in
`.nvmrc` and `pnpm@11.28.4` in `package.json`. On 11 October 2026, Frank explicitly
selected the checked-in Node 24 / pinned pnpm contract after the earlier supplied
Node 20 instruction was raised. That decision resolves this session's runtime
conflict and agrees with checked-in AGENTS.md. Use those source pins; changes to
runtime or dependencies need their own scope. Runtime agreement alone does not
establish passing checks or application release acceptance.

`vercel.json` declares:

```text
framework: nextjs
installCommand: corepack enable && pnpm install --prod=false --frozen-lockfile
buildCommand: node scripts/check-auth-env.mjs && pnpm turbo run build --filter=@arcanea/web
outputDirectory: apps/web/.next
```

Read-only Vercel metadata on 11 October 2026 reports Node `24.x` and project
framework `services`. Repository configuration says `nextjs`; the tool response
does not expose the remote root-directory setting. These facts do not authorize
a remote configuration change.

Production deployment `dpl_BKXFz8BfWwnSUi9K4z739aJAZznf` was READY at
`b4520829644ba57c2ca60119833319f1137dfb99` with the aliases above. Requery source,
checks and deployment before any promotion. READY and an attached domain do not
establish customer onboarding, provider output, checkout or fulfillment.

## Product and trust boundaries

The core workspace connects projects, docs, memory, creations, continuity,
provenance and project graph context. Reuse its existing implementations before
adding another canvas, memory service or orchestration authority. A private user
space needs verified actor/tenant isolation; it does not imply a separate Supabase
project for every user.

Keep four boundaries explicit:

- Official canon and licensed Arcanea material, governed by `.arcanea/lore/CANON_LOCKED.md`.
- Each creator's private projects and authorized exports.
- Internal development, operational memory, credentials and review evidence.
- Approved community/developer artifacts and their individual release licenses.

Installed tools, source packages and agent profiles are discoverable capabilities.
Activation, dispatch, permissions, publication and customer acceptance require
their own evidence. [SCHEMA.md](SCHEMA.md), [SKILLS.md](SKILLS.md) and the
[delivery-team proposal](docs/architecture/ARCANEA_DELIVERY_TEAM.md) describe these
interfaces; they install no runtime service or enforcement hook.

## Maintenance and rollback

Use one writer per lane, exact-revision checks and the repo's existing release
gates. Maintenance covers auth/session recovery, private save/reopen/export,
provider failures, cost accounting, deployment binding, dependency security,
accessibility and support. Tests should reproduce actual failures and record
cleanup. Preserve customer work and rejected evidence.

Rollback through a bounded reviewed revert or the last verified deployment after
checking data compatibility. Database changes, billing, secrets, permissions and
other gated effects retain their existing human decision; this guide grants none.

These guides were recovered from historical commit
`b4c990e5d4639f230f6d59b82c949aa386af45ed` and reconciled against current source
and read-only deployment metadata. The old claim that arcanea.ai was absent from
the project is stale. Current task evidence is in
[CURRENT_STATE_2026-10-11_SOURCE_GUIDES.md](planning-with-files/CURRENT_STATE_2026-10-11_SOURCE_GUIDES.md).
