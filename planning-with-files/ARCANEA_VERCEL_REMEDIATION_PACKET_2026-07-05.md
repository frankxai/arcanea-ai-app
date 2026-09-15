# Arcanea Vercel Remediation Packet

Generated: 2026-07-05T06:39:31.860Z
Project: arcanea-ai-app (prj_90OIWsAmfeswv8IG8WxqEAFefTOV)
Team: team_q6LNT6rnFRlqlcjBJ2Wxz6PE
Target domain: arcanea.ai

## Current Gate

- Decision: blocked
- Counts: 17 pass, 4 warn, 4 blockers
- Preview ready: false
- Production ready: false

## Target Settings

- Framework: services -> nextjs
- Node: 24.x -> 22.x
- Domains: arcanea-ai-app.vercel.app, arcanea-ai-app-starlight-intelligence.vercel.app, arcanea-ai-app-frankx-eth-starlight-intelligence.vercel.app
- Live: false
- Domain audit: domain-owned-but-release-project-unassigned; served by Vercel: true; release project has domain: false
- Project selection: fix-current-linked-project-first; recommended: arcanea-ai-app; alternate: arcanea-ai-appx; score: 7/14
- Latest deployment: dpl_5uA8PAXkJFqYkpDuG39L11gq9a1Q / BLOCKED / backup/claude-snapshots
- God Mode candidate: dpl_3ufoFcuwU9HnEpNeGNxZVZPuvdKT / READY / codex/arcanea-homepage-world-engine

## Actions

### confirm-release-project-selection

Owner: Vercel release operator

Confirm the remediation should repair the current linked arcanea-ai-app project instead of relinking to a nearby alternate.

Why blocked:
- Project selection audit decision is fix-current-linked-project-first.
- Recommended project is arcanea-ai-app; alternate is arcanea-ai-appx.
- Lowest repo-continuity risk because the current worktree and recorded God Mode preview already point here.

Preconditions:
- Review planning-with-files/ARCANEA_VERCEL_PROJECT_SELECTION_2026-07-05.md.
- Confirm arcanea-ai-app remains the intended release project for this God Mode slice.
- Only choose arcanea-ai-appx if a human accepts relinking, command migration, preview-history, and domain-risk work.

Success evidence:
- Release-readiness report includes a passing vercel-project-selection-audit check.
- Vercel remediation actions target the selected release project only.

### patch-project-framework-and-node

Owner: Vercel release operator

Align the remote Vercel project with the repo Next.js and Node posture.

Why blocked:
- Project selection audit recommends repairing arcanea-ai-app first.
- Remote framework is services, expected nextjs.
- Remote Node version is 24.x, expected 22.x.

API:
- PATCH https://api.vercel.com/v9/projects/prj_90OIWsAmfeswv8IG8WxqEAFefTOV?teamId=team_q6LNT6rnFRlqlcjBJ2Wxz6PE
- Body:
```json
{
  "framework": "nextjs",
  "nodeVersion": "22.x"
}
```

PowerShell:
```powershell
$body = @'
{
  "framework": "nextjs",
  "nodeVersion": "22.x"
}
'@
Invoke-RestMethod -Method Patch -Uri "https://api.vercel.com/v9/projects/prj_90OIWsAmfeswv8IG8WxqEAFefTOV?teamId=team_q6LNT6rnFRlqlcjBJ2Wxz6PE" -Headers @{ Authorization = "Bearer $env:VERCEL_TOKEN"; "Content-Type" = "application/json" } -Body $body
```

Success evidence:
- Vercel connector _get_project reports framework nextjs.
- Vercel connector _get_project reports nodeVersion 22.x.
- node scripts/arcanea-release-readiness.mjs --json no longer reports remote-vercel-framework or remote-node-version blockers.

### attach-production-domain

Owner: Vercel release operator

Attach arcanea.ai to this Vercel project or confirm the correct production project is different.

Why blocked:
- The inspected Vercel project does not list arcanea.ai among its domains.
- The project record reports live=false.
- Domain audit confirms arcanea.ai is owned under the Starlight Vercel team and served by Vercel.
- Known domain association currently visible: arcanea-lobechat-labs / lobe.arcanea.ai.

API:
- POST https://api.vercel.com/v10/projects/prj_90OIWsAmfeswv8IG8WxqEAFefTOV/domains?teamId=team_q6LNT6rnFRlqlcjBJ2Wxz6PE
- Body:
```json
{
  "name": "arcanea.ai"
}
```

CLI:
```bash
vercel domains add arcanea.ai arcanea-ai-app
```
Note: Use --force only after confirming arcanea.ai should move away from any existing project.

PowerShell:
```powershell
$body = @'
{
  "name": "arcanea.ai"
}
'@
Invoke-RestMethod -Method Post -Uri "https://api.vercel.com/v10/projects/prj_90OIWsAmfeswv8IG8WxqEAFefTOV/domains?teamId=team_q6LNT6rnFRlqlcjBJ2Wxz6PE" -Headers @{ Authorization = "Bearer $env:VERCEL_TOKEN"; "Content-Type" = "application/json" } -Body $body
```

Success evidence:
- Vercel connector _get_project lists arcanea.ai in domains.
- Vercel connector _get_project or CLI domain inspect lists www.arcanea.ai on the selected release project when www is used.
- Any returned domain verification records are satisfied in DNS.
- node scripts/arcanea-release-readiness.mjs --json no longer reports production-domain blocker.

### separate-backup-branch-noise-from-release-candidate

Owner: Vercel release operator

Keep blocked backup snapshot deployments from being mistaken for the God Mode release candidate, while still requiring a fresh preview for the current package.

Why blocked:
- Latest deployment is BLOCKED on backup/claude-snapshots.
- Latest recorded God Mode candidate is READY on 97093bf51ee9944ad9ea68d1fa81492d1b35e08f.

Shell:
```bash
Use the Vercel connector _list_deployments tool to confirm the latest branch/ref state.
Use the Vercel connector _get_deployment_build_logs tool on any BLOCKED/ERROR deployment before assigning release blame.
After staging and committing the God Mode slice, create one preview deployment from the release branch or draft PR.
```

Success evidence:
- Release-readiness report keeps backup/claude-snapshots BLOCKED state as a warning, not a production blocker.
- A fresh READY preview exists for the committed God Mode release branch.
- node scripts/arcanea-release-readiness.mjs --json no longer warns that current God Mode changes are undeployed.

### refresh-and-verify-project-state

Owner: Vercel release operator

Refresh local/remote evidence after external Vercel changes.

Shell:
```bash
node scripts/arcanea-release-readiness.mjs --json
node scripts/arcanea-release-readiness.mjs --strict
```

Success evidence:
- Release-readiness report is regenerated under .visual-qa/arcanea-god-mode-2026-07-05/release-readiness-report.json.
- Strict mode exits 0 before any preview promotion.
- planning-with-files/ARCANEA_VERCEL_REMOTE_SNAPSHOT_*.json is refreshed from the Vercel connector after settings changes.

### preview-then-promote

Owner: Vercel release operator

Use Vercel preview promotion flow only after the release gate is clean.

Vercel CLI:
```bash
vercel list --status READY
vercel inspect <deployment-url>
vercel curl /api/health --deployment <deployment-url>
vercel httpstat / --deployment <deployment-url>
vercel logs --deployment <deployment-url> --level error --limit 50
vercel promote <deployment-url> --yes
vercel promote status
vercel logs --environment production --level error --since 5m
vercel httpstat /
```

Preconditions:
- Release scope has zero unknown dirty paths.
- Strict release-readiness gate passes.
- A READY preview deployment exists for the God Mode branch or PR.

Success evidence:
- Preview URL visually verified for /, /genesis, /status, /method, /atlas/creatures, and /studio/store.
- Production logs show no recent errors after promotion.
- Vercel connector reports a production target for the promoted deployment.

## Guardrails

- Do not run mutation commands without an approved Vercel token and explicit operator intent.
- Do not paste token values into docs, reports, commands, or chat.
- Do not run vercel promote until node scripts/arcanea-release-readiness.mjs --strict passes.
- Do not stage paths excluded by the God Mode release scope manifest unless Frank explicitly expands scope.

## Official Sources

- Vercel project configuration: framework/build/output settings: https://vercel.com/docs/project-configuration/vercel-json
- Vercel REST API: update an existing project: https://vercel.com/docs/rest-api/reference/endpoints/projects/update-an-existing-project
- Vercel Node.js versions: https://vercel.com/docs/functions/runtimes/node-js/node-js-versions
- Vercel CLI domains: https://vercel.com/docs/cli/domains
- Vercel REST API: add a domain to a project: https://vercel.com/docs/rest-api/reference/endpoints/projects/add-a-domain-to-a-project
- Vercel preview promotion flow: https://vercel.com/docs/deployments/promote-preview-to-production
