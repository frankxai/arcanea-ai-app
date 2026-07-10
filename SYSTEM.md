# arcanea-ai-app — System

<!-- STARLIGHT-REPO-CONTRACT:START -->
## Starlight repository contract

Contract: `starlight.repo_profile.v2` · Team: `arcanea-creative-worlds-team` · Priority: `tier-0`
### Purpose

Canonical Arcanea platform, creative world engine, and creator experience.

### Runtime boundary

- Operating unit: `arcanea`
- Classification: `production`
- Services: `nextjs`, `stripe`, `supabase`
- Persistent stores: `supabase-postgres`
- Auth owner: `arcanea-ai-app`

### Delivery

- Providers: `github`, `vercel`
- Projects: `prj_90OIWsAmfeswv8IG8WxqEAFefTOV`
- Domains: `arcanea.ai`
- Promotion: `green-low-risk`
- Rollback: Revert the bounded change or promote the last verified deployment after confirming data compatibility.
<!-- STARLIGHT-REPO-CONTRACT:END -->

## Canonical Vercel route

Provider truth was refreshed read-only on 2026-07-10.

- Canonical Git repository: `frankxai/arcanea-ai-app`.
- Canonical Vercel project: `arcanea-ai-app` (`prj_90OIWsAmfeswv8IG8WxqEAFefTOV`).
- Vercel project root: repository root (`.`).
- Next.js application root: `apps/web`.
- Build contract: `pnpm --filter @arcanea/web... --workspace-concurrency=1 build`.
- Output contract: `apps/web/.next`.
- Intended production domain: `arcanea.ai`.

The intended domain is not currently listed on the canonical project. The project currently exposes
only Vercel-generated aliases, reports `live=false`, `framework=services`, and Node `24.x`.
Changing the remote framework/runtime, attaching or moving `arcanea.ai`, or promoting a deployment
requires the named human release gate.

Nearby projects such as `arcanea-ai-appx`, `arcanea-web`, `arcanea-2`, and
`arcanea-platform` are non-canonical duplicate candidates. Do not relink this worktree, attach the
production domain to them, or retire them without an explicit migration and rollback decision.

Detailed evidence and the current release diagnosis live in
`planning-with-files/ARCANEA_VERCEL_ROUTE_CONTRACT_2026-07-10.md`.
