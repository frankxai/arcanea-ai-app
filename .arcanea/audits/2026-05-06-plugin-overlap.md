# Plugin / Native-Skill Duplication Audit

**Date:** 2026-05-06
**Scope:** 21 enabled marketplace plugins vs ~725 native skills under `~/.claude/skills` and 14 Arcanea skills under `Arcanea/.arcanea/skills`
**Author:** ACOS audit pass

> **TL;DR** — Eight enabled plugins are top-tier and should stay. Four marketplace plugins fully duplicate stale native copies that we should delete. Two native skills (`verification-quality`, `swarm-*`) come from `claude-flow` lineage and conflict with Anthropic's `superpowers:verification-before-completion` — we keep the marketplace versions and demote the natives. Four plugins are situational keepers. None of the user-listed overlaps justifies an "Arcanize" (delete-marketplace, fork-native) decision: the marketplace versions are platform-quality and we have not customised the dupes.

---

## 1. Plugin Quality Ranking

| Plugin | Marketplace | Provides | Provenance | Grade | Recommendation |
|---|---|---|---|---|---|
| **superpowers** | claude-plugins-official | 14 skills (brainstorming, TDD, writing-plans, executing-plans, systematic-debugging, verification-before-completion, using-git-worktrees, dispatching-parallel-agents, subagent-driven-development, requesting/receiving-code-review, finishing-a-development-branch, writing-skills, using-superpowers) | obra (Jesse Vincent, Anthropic) | **A+** | Keep — backbone of the harness |
| **frontend-design** | claude-plugins-official | 1 skill (frontend-design) | Anthropic-official | **A+** | Keep — referenced by `CLAUDE.md` design protocol |
| **skill-creator** | claude-plugins-official | 1 skill (skill-creator) + scripts | Anthropic-official | **A+** | Keep — canonical skill authoring |
| **vercel** | claude-plugins-official | 25 skills (ai-sdk, ai-gateway, nextjs, next-cache-components, shadcn, turbopack, vercel-functions, vercel-storage, etc.) + commands + agents + hooks | Vercel-official | **A+** | Keep — directly maps to our stack |
| **supabase** | claude-plugins-official | 2 skills (supabase, supabase-postgres-best-practices) | Supabase-official | **A** | Keep — production DB stack |
| **code-review** | claude-plugins-official | 1 command (`/code-review:code-review`) | Anthropic-official | **A** | Keep — invoked from `/handover` and PR ops |
| **pr-review-toolkit** | claude-plugins-official | 6 agents (code-reviewer, code-simplifier, comment-analyzer, pr-test-analyzer, silent-failure-hunter, type-design-analyzer) + `/review-pr` | Anthropic-official | **A** | Keep — sub-agents are useful |
| **feature-dev** | claude-plugins-official | 3 agents (code-architect, code-explorer, code-reviewer) + `/feature-dev` | Anthropic-official | **A** | Keep — code-architect agent is unique |
| **github** | claude-plugins-official | (manifest-only — README) | Anthropic-official | **B+** | Keep — gh CLI hooks |
| **playwright** | claude-plugins-official | webapp-testing flow | Anthropic-official | **B+** | Keep — used by E2E tests |
| **claude-md-management** | claude-plugins-official | 1 skill (claude-md-improver), `/revise-claude-md` | Anthropic-official | **B+** | Keep — we edit CLAUDE.md weekly |
| **claude-code-setup** | claude-plugins-official | 1 skill (claude-automation-recommender) | Anthropic-official | **B** | Keep — but rarely invoked |
| **commit-commands** | claude-plugins-official | 3 commands (commit, commit-push-pr, clean_gone) | Anthropic-official | **B** | Keep — small, useful |
| **agent-sdk-dev** | claude-plugins-official | 2 agents (agent-sdk-verifier-py/ts), `/new-sdk-app` | Anthropic-official | **B** | Keep — only when building Agent SDK apps |
| **ralph-loop** | claude-plugins-official | `/ralph-loop`, `/cancel-ralph`, `/help` | Anthropic-official | **B** | Keep — overlaps `/loop` but differs |
| **typescript-lsp** | claude-plugins-official | LSP integration (no skills exposed in scan) | Anthropic-official | **B** | Keep — silent helper |
| **superpowers-lab** | superpowers-marketplace (obra) | 5 skills (finding-duplicate-functions, mcp-cli, slack-messaging, using-tmux-for-interactive-commands, windows-vm) | obra (3rd-party trusted) | **B+** | Keep — `windows-vm` + `finding-duplicate-functions` are gems |
| **code-simplifier** | claude-plugins-official | 1 agent (code-simplifier), no commands | Anthropic-official | **C+** | **Disable** — fully covered by `pr-review-toolkit:code-simplifier` |
| **context7** | claude-plugins-official | (no skills, no commands surfaced) | Anthropic-official | **C** | **Disable** — MCP-doc lookup; we have `defuddle` + WebFetch |
| **serena** | claude-plugins-official | (no skills, no commands surfaced — manifest only) | Anthropic-official | **C** | **Disable** — semantic-search MCP we never invoke |
| **explanatory-output-style** | claude-plugins-official | hooks only (output-style toggle) | Anthropic-official | **C** | **Disable** — output-style preference, no value here |

---

## 2. Duplication Matrix

Every confirmed name-collision between marketplace and `~/.claude/skills` (or `.arcanea/skills`).

| Skill | Marketplace source | Native path | Native lineage | Decision |
|---|---|---|---|---|
| `frontend-design` | `frontend-design@official` (Anthropic) | `~/.claude/skills/anthropic/frontend-design/SKILL.md` | Verbatim copy of Anthropic's open-source skill (LICENSE.txt present, identical heading) | **Subscribe-marketplace** — delete `~/.claude/skills/anthropic/frontend-design/`. Marketplace stays current; our copy is frozen. |
| `skill-creator` | `skill-creator@official` (Anthropic) | `~/.claude/skills/anthropic/skill-creator/` (with scripts) | Verbatim Anthropic copy (LICENSE.txt + `init_skill.py` etc.) | **Subscribe-marketplace** — delete `~/.claude/skills/anthropic/skill-creator/`. The scripts also ship in the plugin. |
| `skill-builder` (alias) | `skill-creator@official` | `~/.claude/skills/skill-builder/SKILL.md` | claude-flow's renamed wrapper | **Subscribe-marketplace** — delete native. We never invoke skill-builder vs skill-creator deliberately. |
| `code-reviewer` | `pr-review-toolkit:code-reviewer` AND `feature-dev:code-reviewer` | `~/.claude/skills/code-reviewer/` (claude-flow ancestor) | claude-flow agent definition | **Subscribe-marketplace** — delete native. The two marketplace versions overlap each other but are intentional (PR-context vs feature-context). |
| `code-review-checklist` / `code-review-excellence` / `code-review-ai-ai-review` | `code-review@official` covers the checklist usecase | `~/.claude/skills/code-review-*` (claude-flow) | claude-flow ecosystem | **Subscribe-marketplace** — delete the three claude-flow variants. |
| `code-simplifier` | `code-simplifier@official` AND `pr-review-toolkit:code-simplifier` | not present natively | n/a | **Disable `code-simplifier@official`** (the standalone plugin) — the toolkit variant is identical and bundled. |
| `verification-before-completion` | `superpowers:verification-before-completion` | `~/.claude/skills/verification-before-completion/` (empty dir) | Stub directory, no SKILL.md | **Subscribe-marketplace** — delete empty native dir. |
| `verification-quality` | none on marketplace (different scope) | `~/.claude/skills/verification-quality/SKILL.md` (claude-flow, "truth scoring 0.95 threshold") | claude-flow proprietary | **Native-only, but downgrade** — keep file but mark deprecated. Use `superpowers:verification-before-completion` as primary. The claude-flow truth-scoring system is not wired into our pipeline. |
| `swarm-orchestration` | none on marketplace (own scope) | `~/.claude/skills/swarm-orchestration/SKILL.md` | claude-flow / agentic-flow | **Native-only** — claude-flow lineage, but we use it. Keep. |
| `swarm-advanced` | none on marketplace | `~/.claude/skills/swarm-advanced/SKILL.md` | claude-flow | **Native-only** — keep, paired with our `swarm-lumina` (Arcanea-native). |
| `swarm-lumina` / `swarm-ultraworld` | none | `Arcanea/.arcanea/skills/.../` | **Arcanea original** | **Native-only** — keep, this is brand IP. |
| `brainstorming` | `superpowers:brainstorming` | `~/.claude/skills/brainstorming/` (empty dir) | Stub | **Subscribe-marketplace** — delete empty native dir. |
| `test-driven-development` | `superpowers:test-driven-development` | `~/.claude/skills/test-driven-development/` (empty dir) | Stub | **Subscribe-marketplace** — delete empty dir. |
| `writing-plans` / `executing-plans` | `superpowers:writing-plans`, `superpowers:executing-plans` | `~/.claude/skills/writing-plans/`, `executing-plans/` (empty dirs) | Stubs | **Subscribe-marketplace** — delete both empty dirs. (Keep `planning-with-files` — different scope.) |
| `using-git-worktrees` | `superpowers:using-git-worktrees` | `~/.claude/skills/using-git-worktrees/` (empty dir) | Stub | **Subscribe-marketplace** — delete empty dir. |
| `systematic-debugging` | `superpowers:systematic-debugging` | `~/.claude/skills/systematic-debugging/` (empty dir) | Stub | **Subscribe-marketplace** — delete empty dir. |
| `requesting/receiving-code-review` | `superpowers:requesting-code-review` / `receiving-code-review` | `~/.claude/skills/requesting-code-review/`, `receiving-code-review/` | Stubs (from skill-list) | **Subscribe-marketplace** — delete natives. |
| `vercel-ai-sdk`, `vercel-deployment`, `vercel-composition-patterns`, `vercel-react-best-practices`, `vercel-react-native-skills` | `vercel:ai-sdk`, `vercel:vercel-cli`, `vercel:react-best-practices` etc. (25-skill plugin) | `~/.claude/skills/vercel-*/` (5 stale stubs) | claude-flow renames | **Subscribe-marketplace** — delete the 5 native dirs. The official Vercel plugin is dramatically more comprehensive. |
| `supabase-postgres-best-practices` | `supabase:supabase-postgres-best-practices` | `~/.claude/skills/supabase-postgres-best-practices/` | claude-flow stub | **Subscribe-marketplace** — delete native. |
| `playwright-skill` | `playwright@official` (no exposed skill name in scan, but plugin owns Playwright tooling) | `~/.claude/skills/playwright-skill/` | claude-flow | **Subscribe-marketplace** — delete native. |
| `github-code-review` / `github-multi-repo` / `github-project-management` / `github-release-management` / `github-workflow-automation` | partially covered by `github@official` + `superpowers:requesting-code-review` | `~/.claude/skills/github-*` (5 claude-flow files) | claude-flow | **Native-only (situational)** — these are claude-flow swarm orchestrators, not 1:1 with `github@official`. Keep but flag as low-priority. |
| `nextjs-*` (15 native variants) | partially covered by `vercel:nextjs`, `vercel:next-cache-components`, `vercel:next-upgrade`, `vercel:next-forge` | `~/.claude/skills/nextjs-*` (15 dirs) | claude-flow renames | **Subscribe-marketplace** for the upgrade/cache/router topics. **Native-only** for our `nextjs-agent-team` (Arcanea-flavoured). Audit-and-prune separately. |
| `arcanea-design-system`, `premium-visual`, `lumina`, `nero`, `arcanea-canon`, `arcanea-creator-academy` | none | `Arcanea/.arcanea/skills/arcanea/*` | **Arcanea original IP** | **Native-only** — keep all. Brand moat. |
| `arcanea-frontend-excellence/SKILL.md` | partially overlaps `frontend-design@official` | `Arcanea/.arcanea/skills/arcanea-frontend-excellence/` | Arcanea fork | **Native-only (Arcanize rationale)** — this one earns the "Arcanize" label: it composes `frontend-design` patterns with Atlantean teal / Geist / glass-card rules from `CLAUDE.md`. Keep, point to marketplace `frontend-design` as upstream. |

**Net edits to filesystem (drop-list):**
- `~/.claude/skills/anthropic/frontend-design/`
- `~/.claude/skills/anthropic/skill-creator/`
- `~/.claude/skills/skill-builder/`
- `~/.claude/skills/code-reviewer/`, `code-review-checklist/`, `code-review-excellence/`, `code-review-ai-ai-review/`
- `~/.claude/skills/brainstorming/`, `test-driven-development/`, `writing-plans/`, `executing-plans/`, `using-git-worktrees/`, `systematic-debugging/`, `verification-before-completion/`, `requesting-code-review/`, `receiving-code-review/`
- `~/.claude/skills/vercel-ai-sdk/`, `vercel-deployment/`, `vercel-composition-patterns/`, `vercel-react-best-practices/`, `vercel-react-native-skills/`
- `~/.claude/skills/supabase-postgres-best-practices/`
- `~/.claude/skills/playwright-skill/`

(Re-scan for empty stubs before bulk delete; some may host unique content I did not sample.)

---

## 3. Subscribe List (post-cleanup `enabledPlugins`)

Keep these 17:

```
superpowers@claude-plugins-official
superpowers-lab@superpowers-marketplace
frontend-design@claude-plugins-official
skill-creator@claude-plugins-official
vercel@claude-plugins-official
supabase@claude-plugins-official
code-review@claude-plugins-official
pr-review-toolkit@claude-plugins-official
feature-dev@claude-plugins-official
github@claude-plugins-official
playwright@claude-plugins-official
claude-md-management@claude-plugins-official
claude-code-setup@claude-plugins-official
commit-commands@claude-plugins-official
agent-sdk-dev@claude-plugins-official
ralph-loop@claude-plugins-official
typescript-lsp@claude-plugins-official
```

---

## 4. Disable Candidates

Remove from `enabledPlugins` (4):

| Plugin | Reason |
|---|---|
| `code-simplifier@claude-plugins-official` | Fully duplicated by `pr-review-toolkit:code-simplifier`. Same author, same skill file. |
| `context7@claude-plugins-official` | Documentation MCP lookup — we already have `defuddle` (skill) + `WebFetch` (tool) + `superpowers-lab:mcp-cli`. Has not been invoked once on this branch. |
| `serena@claude-plugins-official` | Semantic-search MCP (LSP-adjacent). We use Grep + Glob + native LSP plugin — Serena adds a second LSP layer we never use. |
| `explanatory-output-style@claude-plugins-official` | Output-style toggle hooks. Conflicts with our `statusline` and adds nothing for headless-agent operation. |

**Effect:** 21 → 17 plugins. ~50–80MB less plugin cache, fewer skill-list collisions, faster session-start hook scan.

---

## 5. Hidden Gems (enabled but under-used)

| Skill / Command | Plugin | Why it matters | Trigger |
|---|---|---|---|
| `superpowers-lab:finding-duplicate-functions` | superpowers-lab | We literally just did this audit by hand. Should be the first call next time. | "find duplicate functions / skills" |
| `superpowers-lab:windows-vm` | superpowers-lab | We are on Windows 11. This skill encodes WSL/PowerShell quirks we keep re-discovering. | Windows-specific issues |
| `superpowers-lab:using-tmux-for-interactive-commands` | superpowers-lab | We use Zellij not tmux, but the patterns transfer to long-running interactive flows | When `pnpm dev` / interactive REPL needed |
| `superpowers:dispatching-parallel-agents` | superpowers | Concurrency rule from `CLAUDE.md` ("ALL independent ops MUST be concurrent in a single message") is exactly what this skill encodes | Multi-task sessions |
| `superpowers:subagent-driven-development` | superpowers | Maps to our Lumina → Guardians → Luminors hierarchy. We have not wired this skill into `/lumina` orchestration yet. | Any plan execution |
| `vercel:vercel-agent` | vercel | Brand-new agent SDK pattern from Vercel — we ship Vercel deployments daily and have not read this | Pre-Vercel-deploy |
| `vercel:next-cache-components` | vercel | Next.js 16 cache components are exactly what `apps/web/` needs after the i18n landing | i18n perf pass |
| `vercel:turbopack` | vercel | We just merged turbo-via-build CI fix (commit 79e23378). This skill explains turbopack vs turbo. | Build-perf debugging |
| `pr-review-toolkit:silent-failure-hunter` | pr-review-toolkit | Our 5-day red-main pattern (PR #93) is exactly the failure mode this hunts | After every CI break |
| `pr-review-toolkit:type-design-analyzer` | pr-review-toolkit | TS strict mode is enforced — type-design review fits | Pre-PR for TS-heavy diffs |
| `feature-dev:code-architect` | feature-dev | Architecture sign-off before implementation; aligns with `feedback_think_bigger` | Pre-implementation |
| `claude-md-management:claude-md-improver` | claude-md-management | We edit CLAUDE.md weekly without running this. | Monthly CLAUDE.md hygiene |
| `agent-sdk-dev:agent-sdk-verifier-ts` | agent-sdk-dev | We are building Agent SDK apps (`@arcanea/presence`, `arcanea-author`) — this verifies them | Pre-publish for SDK apps |

---

## Decision Rationale Summary

- **Anthropic-official** plugins are platform-quality and updated centrally. Subscribing wins over forking unless we have customised the skill (we have not, except for `arcanea-frontend-excellence` which is intentionally separate).
- **claude-flow** native skills are mostly stale renames of Anthropic skills, copied during the 2026-03-22 mega-build before the plugin marketplace existed. Most are now stub directories with no `SKILL.md`.
- **superpowers** by obra is third-party but trusted (Anthropic's own Jesse Vincent maintains it). It is the only plugin whose skills are referenced in our `feedback_*` memory files and in the harness session-start protocol.
- **Arcanea-original** skills (`lumina`, `nero`, `arcanea-canon`, `premium-visual`, `swarm-lumina`, `arcanea-frontend-excellence`) never overlap marketplace content. They are the brand moat and stay native.
- **No "keep both" decisions** — every overlap resolves cleanly to subscribe-or-arcanize. The "both" column is empty.

---

## Suggested Next Action

1. Edit `C:/Users/frank/.claude/settings.json` `enabledPlugins` to remove the four disable-candidates.
2. Run `superpowers-lab:finding-duplicate-functions` against `~/.claude/skills/` to confirm the empty-stub list before the bulk `rm`.
3. Bulk-delete the 22 native dirs flagged above (use `git mv` to `_archive/` first since `~/.claude` may be tracked elsewhere).
4. Add a session-start hook that warns when `~/.claude/skills/<name>/` shadows a marketplace skill of the same name (prevents recurrence).
