# arcanea-ai-app — Testing

<!-- STARLIGHT-REPO-CONTRACT:START -->
## Starlight repository contract

Contract: `starlight.repo_profile.v2` · Team: `arcanea-creative-worlds-team` · Priority: `tier-0`
### Commands

- health: `pnpm run build`
- lint: `pnpm run lint`
- typecheck: `pnpm run type-check`
- test: `pnpm run test`
- build: `pnpm run build`
- security: `pwsh ../security/Invoke-RepoSecurityScan.ps1 -Path .`

Tests must cover failure paths, idempotency where state changes, adapter compatibility, and rollback-sensitive behavior. Skipped checks require a reason and may not be reported as passed.
<!-- STARLIGHT-REPO-CONTRACT:END -->
