# Arcanea Vercel Project Selection

Generated: 2026-07-05T06:39:31.756Z
Decision: fix-current-linked-project-first
Recommended project: arcanea-ai-app
Alternate project: arcanea-ai-appx

## Rationale

- arcanea-ai-app is the current linked project and has recorded God Mode branch preview evidence.
- arcanea-ai-app needs framework/node/domain/live-state repair, but those are direct project-setting/domain actions.
- arcanea-ai-appx has better framework/node/root posture, but it is not linked to the current worktree and still has npm-based project commands.
- No inspected Arcanea candidate currently owns arcanea.ai/www.arcanea.ai, so domain movement requires explicit production-owner and rollback approval either way.

## Project Scores

### arcanea-ai-app

Role: current-linked-release-project
Score: 7/14
Framework: services
Node: 24.x
Root: .
Build: pnpm --filter @arcanea/web... --workspace-concurrency=1 build
Install: corepack enable && pnpm install --prod=false --frozen-lockfile
Risk: Lowest repo-continuity risk because the current worktree and recorded God Mode preview already point here.

Checks:
- PASS linked-current-worktree: Project is linked from .vercel/project.json.
- MISS framework-nextjs: Framework is services.
- MISS node-22: Node version is 24.x.
- PASS pnpm-build-install: Build/install commands are pnpm-aligned.
- MISS domain-attached: Production domain is not attached.
- PASS candidate-preview: A recorded God Mode branch preview exists.

Primary fixes:
- Patch Vercel project framework to nextjs.
- Patch Vercel project Node runtime to 22.x.
- Keep rootDirectory "." and root vercel.json outputDirectory apps/web/.next unless a human chooses apps/web root.
- Attach arcanea.ai/www.arcanea.ai only after domain owner and rollback path are explicit.
- Create a fresh preview from the packaged God Mode branch.

### arcanea-ai-appx

Role: nearby-alternate-web-project
Score: 4/14
Framework: nextjs
Node: 22.x
Root: apps/web
Build: npm run build
Install: npm install
Risk: Better framework/runtime/root posture, but higher continuity risk because this worktree is not linked here and command settings are npm-based.

Checks:
- MISS linked-current-worktree: Project is not linked from the current worktree.
- PASS framework-nextjs: Framework is nextjs.
- PASS node-22: Node version is 22.x.
- MISS pnpm-build-install: Build/install commands need pnpm/frozen-lockfile correction.
- MISS domain-attached: Production domain is not attached.
- MISS candidate-preview: No recorded God Mode branch preview exists.

Primary fixes:
- Relink current worktree to this project only after human selection.
- Replace npm install/build commands with pnpm/frozen-lockfile commands.
- Confirm branch/deployment history for the God Mode app before attaching production domain.
- Attach arcanea.ai/www.arcanea.ai only after rollback path is explicit.

## Decision Rules

- Prefer the linked project when it has current branch/deployment evidence and can be repaired with settings changes.
- Prefer a relink only when the alternate project has correct build commands, confirmed current branch previews, and explicit domain ownership.
- Do not force attach arcanea.ai while any existing production owner or rollback path is unclear.
- Do not promote until release-readiness strict mode passes and a fresh God Mode preview is visually verified.

## Next Actions

- Patch arcanea-ai-app framework/node settings through the approved Vercel remediation packet.
- Refresh Vercel connector snapshot and release-readiness report.
- Package/stage only included God Mode paths, leaving excluded dirty paths out.
- Create one fresh preview from the packaged branch or draft PR.
- Attach arcanea.ai/www.arcanea.ai to the selected release project only after confirming current production owner and rollback path.
