# Arcanea Vercel Domain Audit

Date: 2026-07-05
Domain: `arcanea.ai`
Team: Starlight Intelligence (`team_q6LNT6rnFRlqlcjBJ2Wxz6PE`)

## Decision

`domain-owned-but-release-project-unassigned`

`arcanea.ai` is registered under the Starlight Vercel team and is served by Vercel, but it is not attached to the current release project `arcanea-ai-app`.

## Findings

- `arcanea.ai` is a third-party registrar domain under the Starlight team.
- Vercel edge network is enabled for the domain.
- Current nameservers are `ui-dns.*`, not Vercel DNS nameservers.
- `arcanea.ai` and `www.arcanea.ai` both resolve to `216.150.1.1`.
- `https://arcanea.ai` returns `307` to `https://www.arcanea.ai/` with server `Vercel`.
- `https://www.arcanea.ai` returns `200` with server `Vercel`.
- Vercel domain inspect only showed one project association: `arcanea-lobechat-labs` for `lobe.arcanea.ai`.
- `arcanea-ai-app`, `arcanea-ai-appx`, `arcanea-web`, `arcanea-2`, and `arcanea-platform` do not list `arcanea.ai` or `www.arcanea.ai` in their inspected project domains.

## Release Meaning

The domain blocker is not a purchase/ownership problem. It is a production routing decision:

- either attach `arcanea.ai` / `www.arcanea.ai` to the intended God Mode release project after fixing project settings,
- or relink this repo to the actual intended production project after confirming build/runtime settings,
- but do not force-move the domain until the current production owner and rollback path are explicit.

## Verified Candidates

- `arcanea-ai-app`: current repo link, framework `services`, Node `24.x`, root `.`, no production domain.
- `arcanea-ai-appx`: Next.js, Node `22.x`, root `apps/web`, no production domain, install/build commands still npm-based.
- `arcanea-lobechat-labs`: owns `lobe.arcanea.ai`, not the God Mode app root.

## Evidence Commands

```text
mcp Vercel _list_teams
mcp Vercel _list_projects for team_q6LNT6rnFRlqlcjBJ2Wxz6PE
mcp Vercel _get_project for arcanea-ai-app, arcanea-ai-appx, arcanea-web, arcanea-2, arcanea-platform
vercel domains inspect arcanea.ai --scope starlight-intelligence --non-interactive --no-color
vercel domains inspect www.arcanea.ai --scope starlight-intelligence --non-interactive --no-color
vercel project inspect arcanea-ai-app --scope starlight-intelligence --non-interactive --no-color
vercel project inspect arcanea-ai-appx --scope starlight-intelligence --non-interactive --no-color
vercel project inspect arcanea-lobechat-labs --scope starlight-intelligence --non-interactive --no-color
Resolve-DnsName arcanea.ai
Resolve-DnsName www.arcanea.ai
Invoke-WebRequest -Uri https://arcanea.ai -Method Head -MaximumRedirection 0
Invoke-WebRequest -Uri https://www.arcanea.ai -Method Head -MaximumRedirection 0
```
