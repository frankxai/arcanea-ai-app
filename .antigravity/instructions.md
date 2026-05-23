# Arcanea - Antigravity Configuration

Read `.arcanea/ops/AGENT_BOOTSTRAP.md` first.
Read `.arcanea/ops/ao.md` for ops protocol.
Read `.arcanea/ops/commands/*.md` for shared commands.

Use `agy` as the active Google/Antigravity harness. Gemini CLI is legacy and should not be reinstalled for Arcanea agent work.

## Cached-belief validation (non-negotiable)

Per root `CLAUDE.md` § Cached-Belief Validation Protocol — applies to AG sessions same as Claude Code:

- Any claim about CURRENT state (versions, ship status, file paths, deploys, test results) requires same-turn disk verification (Read/Bash) OR explicit prefix: `unverified, from [memory|prior-turn] (date X):`.
- Memory is authoritative ONLY for intent, strategy, preferences, decision history. NEVER for current state.
- Vague status claims ("100% complete", "fully active", "audited") without artifact references are violations. Either show the disk path or downgrade the claim.

Before reporting completion: run the verifying command (`pnpm typecheck`, `find . -name "*.spec.ts"`, `git log`) and quote its output. Don't fabricate test pass strings.

## Multi-CLI alignment

AG is one of five tools on this substrate (Claude Code primary, Codex, AG, OpenCode, Cursor). All five read `.arcanea/CLAUDE.md` + `MEMORY.md` + root `CLAUDE.md`. The substrate is the alignment, not the CLI.

At session end: commit your work and write `docs/ops/HANDOVER_<date>_<topic>.md` so the next tool inherits state without re-litigation.

## Known AG failure modes (2026-05-20 audit)

1. Overclaiming "100% complete" when work is partial — especially around multimodal/Higgsfield/Veo claims.
2. Working on stale duplicates (e.g., `~/arcanea-onchain/` last touched Feb 22) when canonical is the newer nested working tree (`Arcanea/arcanea-onchain/`, touched May 6). Always verify canonical via `~/.claude/skills/arcanea-meta/references/canonical-locations.md` first.
3. Hallucinating test passes (e.g., quoting "5/5 Playwright passed" when the spec dir doesn't exist). Verify with `find . -name "*.spec.ts"` before quoting results.
4. Brand-misreading side-folders (e.g., `~/arcanea.ai/` retreats experiment) as canonical. The canonical identity lives in `.arcanea/CLAUDE.md` — a creative multiverse, not a retreat business.

## Bridge to Claude commands & skills

Same bridge as Codex. Indexes at `.codex/claude-command-index.md` and `.codex/claude-skill-index.md` are tool-agnostic. Regenerate via:

```powershell
node scripts/generate-codex-claude-bridge.mjs
```

Never modify `.claude/`, `.codex/`, `.antigravity/` bridge indexes by hand — always regenerate.
