# Package Health Audit

Date: 2026-03-28
Workspace: `C:\Users\frank\Arcanea-main-audit`
Reviewer: Codex

## Executive Summary

- Audited all `42` workspace packages under `packages/`
- `@arcanea/core` build blocker is fixed
- Package build status:
  - `32` pass
  - `9` fail
  - `1` has no build script
- Classification:
  - `22` ACTIVE
  - `9` NEEDS_FIX
  - `11` DORMANT
  - `0` ARCHIVE

## 2A. `@arcanea/core` Build Fix

Command run:

- `cd packages/core`
- `pnpm build`

Observed failure:

- `starweave` was present in constants but not in `GateName`
- `source-godbeast` was present in constants but not in `GodbeastName`
- source gate constants still referenced `amaterasu`

Fix applied:

- updated [`packages/core/src/types/mythology.ts`](C:\Users\frank\Arcanea-main-audit\packages\core\src\types\mythology.ts)
- updated [`packages/core/src/constants/mythology.ts`](C:\Users\frank\Arcanea-main-audit\packages\core\src\constants\mythology.ts)

Result:

- `pnpm build` now passes cleanly in `packages/core`

## 2B. Recursive Build Audit

Command run:

- `pnpm -r --no-bail run build`

Important note:

- the recursive workspace build still fails overall because `apps/web` is currently broken on `main`
- that blocker is outside this package-only scope and touches `/chat`, which was explicitly out of bounds for edits

Observed `apps/web` blocker:

- `apps/web/hooks/use-chat-sessions.ts` imports missing exports from `@/lib/chat/supabase-store`
- this blocks the main web build and release verification on `main`

## Package Matrix

| Package | npm | Build | README | Published | Classification |
| --- | --- | --- | --- | --- | --- |
| agent-bus | @arcanea/agent-bus | PASS | yes | yes | ACTIVE |
| ai-core | @arcanea/ai-core | PASS | yes | no | DORMANT |
| aios | arcanea-intelligence-os | PASS | yes | yes | ACTIVE |
| ai-provider | @arcanea/ai-provider | PASS | yes | no | DORMANT |
| arcanea-hooks | @arcanea/hooks | PASS | yes | yes | ACTIVE |
| arcanea-mcp | @arcanea/mcp-server | FAIL | yes | yes | NEEDS_FIX |
| arcanea-security | @arcanea/security | PASS | yes | yes | ACTIVE |
| arcanea-skills | @arcanea/skills | NO_BUILD | yes | yes | DORMANT |
| arc-protocol | @arcanea/arc | PASS | yes | no | DORMANT |
| auth | @arcanea/auth | FAIL | yes | yes | NEEDS_FIX |
| chrome-extension | @arcanea/chrome-extension | PASS | yes | no | DORMANT |
| claude-arcanea | claude-arcanea | FAIL | yes | yes | NEEDS_FIX |
| cli | @arcanea/cli | FAIL | yes | yes | NEEDS_FIX |
| content-api | @arcanea/content-api | PASS | yes | no | DORMANT |
| core | @arcanea/core | PASS | yes | yes | ACTIVE |
| council | @arcanea/council | PASS | yes | yes | ACTIVE |
| creative-pipeline | @arcanea/creative-pipeline | PASS | yes | yes | ACTIVE |
| database | @arcanea/database | PASS | yes | no | DORMANT |
| extension-core | @arcanea/extension-core | PASS | yes | yes | ACTIVE |
| flow-engine | @arcanea/flow-engine | PASS | yes | yes | ACTIVE |
| grok-media | @arcanea/grok-media | PASS | no | no | DORMANT |
| guardian-evolution | @arcanea/guardian-evolution | PASS | yes | yes | ACTIVE |
| guardian-memory | @arcanea/guardian-memory | PASS | yes | yes | ACTIVE |
| hybrid-memory | @arcanea/hybrid-memory | PASS | yes | yes | ACTIVE |
| intelligence-bridge | @arcanea/intelligence-bridge | PASS | yes | yes | ACTIVE |
| media | @arcanea/media | PASS | no | no | DORMANT |
| memory-mcp | @arcanea/memory-mcp | PASS | yes | no | DORMANT |
| memory-system | @arcanea/memory-system | PASS | no | no | ACTIVE |
| os | @arcanea/library-pipeline | PASS | yes | yes | ACTIVE |
| overlay-chatgpt | @arcanea/overlay-chatgpt | FAIL | yes | yes | NEEDS_FIX |
| overlay-claude | @arcanea/overlay-claude | FAIL | yes | yes | NEEDS_FIX |
| overlay-copilot | @arcanea/overlay-copilot | FAIL | yes | yes | NEEDS_FIX |
| overlay-cursor | @arcanea/overlay-cursor | FAIL | yes | yes | NEEDS_FIX |
| overlay-gemini | @arcanea/overlay-gemini | FAIL | yes | yes | NEEDS_FIX |
| prompt-books | @arcanea/prompt-books | PASS | yes | yes | ACTIVE |
| rituals | @arcanea/rituals | PASS | yes | yes | ACTIVE |
| skill-registry | @arcanea/skill-registry | PASS | yes | yes | ACTIVE |
| sona-learner | @arcanea/sona-learner | PASS | yes | yes | ACTIVE |
| starlight-runtime | @arcanea/starlight-runtime | PASS | yes | yes | ACTIVE |
| swarm-coordinator | @arcanea/swarm-coordinator | PASS | yes | yes | ACTIVE |
| token-optimizer | @arcanea/token-optimizer | PASS | yes | yes | ACTIVE |
| vscode | arcanea-code | PASS | yes | no | DORMANT |

## ACTIVE Packages

- `agent-bus`
- `aios`
- `arcanea-hooks`
- `arcanea-security`
- `core`
- `council`
- `creative-pipeline`
- `extension-core`
- `flow-engine`
- `guardian-evolution`
- `guardian-memory`
- `hybrid-memory`
- `intelligence-bridge`
- `memory-system`
- `os`
- `prompt-books`
- `rituals`
- `skill-registry`
- `sona-learner`
- `starlight-runtime`
- `swarm-coordinator`
- `token-optimizer`

## NEEDS_FIX Packages

- `arcanea-mcp`
- `auth`
- `claude-arcanea`
- `cli`
- `overlay-chatgpt`
- `overlay-claude`
- `overlay-copilot`
- `overlay-cursor`
- `overlay-gemini`

### Failure themes

- `arcanea-mcp`
  - missing module `./data/guardian-swarm/index.js`
- `auth`
  - stale imports from `@arcanea/core` such as `ProviderType`, `Keystore`, `AuthSession`, `AuthAdapter`
- `claude-arcanea`
  - missing `./intelligence.js`
- `cli`
  - stale imports from `@arcanea/core` such as `toTailwindConfig`, `tokensToJSON`, `COLORS`, `ProviderType`, `OverlayLevel`
- overlay packages
  - stale imports from `@arcanea/core`
  - `Guardian` type drift (`codingStyle`, `helpPatterns`, `vibe`, `signOff`, etc.)

## DORMANT Packages

- `ai-core`
- `ai-provider`
- `arcanea-skills`
- `arc-protocol`
- `chrome-extension`
- `content-api`
- `database`
- `grok-media`
- `media`
- `memory-mcp`
- `vscode`

## README / Publish Gaps

Packages missing README:

- `grok-media`
- `media`
- `memory-system`

Packages not published to npm:

- `ai-core`
- `ai-provider`
- `arc-protocol`
- `chrome-extension`
- `content-api`
- `database`
- `grok-media`
- `media`
- `memory-mcp`
- `memory-system`
- `vscode`

## 2C. Satellite Repo Merge Status

Requested commands targeting `main...dev` were not valid because these repos do not use `main` as the stable base.

### `frankxai/arcanea-code`

- default branch: `dev`
- stable branch found: `production`
- compare run: `production...dev`
- result:
  - `status: ahead`
  - `ahead_by: 1198`
  - `behind_by: 0`

Recommendation:

- do **not** merge blindly
- `dev` is massively ahead of `production`
- requires a deliberate release-cut or staged cherry-pick process

### `frankxai/oh-my-arcanea`

- default branch: `dev`
- stable branch found: `master`
- compare run: `master...dev`
- result:
  - `status: ahead`
  - `ahead_by: 1459`
  - `behind_by: 0`

Recommendation:

- do **not** merge blindly
- branch gap is too large for a safe one-shot merge
- needs release branch discipline before any stabilization attempt

## Recommendations

1. Keep `@arcanea/core` fixed and merge that immediately.
2. Treat the overlay family, `auth`, `cli`, and `claude-arcanea` as one coordinated compatibility sweep against current `@arcanea/core`.
3. Fix `arcanea-mcp` separately by restoring or removing the missing `guardian-swarm` data entrypoint.
4. Decide whether dormant packages remain strategic. If yes, assign owners. If not, archive or consolidate them.
5. Do not claim ecosystem build health until `apps/web` is green and the `NEEDS_FIX` package set is reduced materially.
