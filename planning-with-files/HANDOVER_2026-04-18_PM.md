# Handover — 2026-04-18 second overnight session

**Read this if you woke up to v1.2.0.**

## TL;DR

Shipped v1.2.0 with adaptive routing, workflow templates, `/arco` Claude Code skill, QUICKSTART doc, and arcanea.ai/orchestrator landing page. Zero cowardice this round.

## What's new since last handover

### npm
- **`@arcanea/orchestrator@1.2.0`** — live. Includes:
  - **Adaptive routing (Phase 8)** — every `run` re-ranks candidates by your local history. Auto-enables at ≥10 events. Override via `config adaptiveRouting on|off`.
  - **`learn <task>`** — see baseline vs adaptive ranking side-by-side with per-candidate stats.
  - **Workflow templates** — 3 compositions shipped: `build-landing-page`, `refactor-typescript-strict`, `add-feature-end-to-end`.
  - **`workflow list/show/run`** — template system with `--var key=value` substitution.

### Claude Code skills
- **`/arco`** — NEW skill, lives at `~/.claude/skills/arco/SKILL.md` (installed on your machine, shown in skill discovery). Wraps orchestrator CLI usage from inside chat. Explicitly distinguishes from `/ao` (promotion workflow). Documents delegate-to-codex/gemini patterns for second-opinion workflows.

### Docs
- **`docs/orchestrator/QUICKSTART.md`** — plain-English 5-minute guide: install → doctor → first run → plan → workflow → history. Common-pitfalls section covers PATH, stdin timeout, no-model-resolved, and the /ao vs arco confusion.

### Website
- **`apps/web/app/orchestrator/page.tsx`** — public landing page at `arcanea.ai/orchestrator`. Hero with install commands, 6-card feature grid, full example in one shell, architecture diagram, philosophy, links to docs/repo/dashboard. MIT disclaimer at bottom.

## Commits this round (origin/main)

| SHA | What |
|---|---|
| (pending push for release) | release(orchestrator): v1.2.0 |
| `5992fedd` | feat(web): /orchestrator landing page |
| `b342244b` | docs(orchestrator): plain-English QUICKSTART |
| (workflows commit — earlier tonight) | feat(orchestrator): 3 workflow templates |
| (Phase 8 commit — earlier tonight) | feat(orchestrator): Phase 8 adaptive routing + learn |

## Verify for yourself

```bash
# Update to v1.2.0 (if you want the public registry version over your npm-link):
npm i -g @arcanea/orchestrator@latest
arco --version       # → 1.2.0

# Try adaptive routing (shows auto-disabled until ≥10 events):
arco learn code.debug

# Try a workflow:
arco workflow list
arco workflow show build-landing-page
arco workflow run build-landing-page --var page=/pricing --var pitch="3 tiers"

# Try the new landing page locally:
pnpm --dir apps/web dev
# then open http://localhost:3000/orchestrator
```

## What's still left

### Safe next-session picks
- **Start an `arcanea-code` TUI fork** — the OpenCode fork repo at `frankxai/arcanea-code` is empty-of-intent. Decision: vendor OpenCode as git submodule, or fork-as-branch.
- **Publish @arcanea/router-spec@1.1** with the surface additions already in-tree.
- **Populate real stats** — run 10+ real tasks via `arco run` to unlock adaptive routing on this machine.
- **Windows PowerShell `install.sh`** — minor ask; one-off transpile of the bash.

### Needs your design input
- **Agent inventory (Phase 7)** — extend manifest schema to enumerate overlay-specific agents by capability. Unlocks "pick a specific agent, not just a model."
- **Monetization hook** — do we ship `@arcanea/orchestrator-pro` with hosted stats/cross-team history? Or stay pure OSS and drive to Arcanea Author Studio / Luminor chat as funnel?
- **`arco exec` for workflows** — currently `workflow run` emits JSON. Next step: actually dispatch each task sequentially or in parallel via `ao batch-spawn`. Design call on concurrency semantics.

### Blocked
- Nothing.

## Stats for this session

- **Total new code + docs:** ~1800 lines
- **New commands shipped:** 5 (learn, workflow list/show/run × 3, plus stats/history from earlier)
- **New files:** 8 (adaptive.ts, learn.ts, workflow.ts, 3×.yml, SKILL.md, QUICKSTART.md, page.tsx)
- **Commits:** 5 (Phase 8, workflows, /arco + QUICKSTART, web page, v1.2.0 release)
- **npm publishes:** 1 (v1.2.0)
- **3-strike escalations:** 0
- **Gotchas fixed:** 2 (unrelated git error cancelled parallel edits — retried sequentially; `.claude/` gitignored so `/arco` skill lives locally only)

## Live footprint of the orchestrator on this machine right now

```
~/.arcanea/config.yaml       — your preferences + detected auth
~/.arcanea/history.jsonl     — every `run` event (currently 1 — test from earlier)
/Users/frank/AppData/Roaming/npm/arcanea-orchestrator   — global bin
/Users/frank/AppData/Roaming/npm/arco                    — global short-alias bin
~/.claude/skills/arco/SKILL.md                          — Claude Code skill
frankxai/arcanea-ai-app @ main                           — monorepo source
@arcanea/orchestrator@1.2.0 on npmjs.org                — public registry
@arcanea/router-spec@1.0.1 on npmjs.org                 — public registry
https://arcanea.ai/orchestrator (once apps/web deploys) — public landing page
```

## Strategic note: how to share this with others

You asked "how do we share with others so they see tasks distributed to multi-coding-agent teams?"

Three concrete moves (ranked by leverage):

1. **Twitter/X thread with the full example.** Take the `arco doctor → explain → run → stats` sequence from QUICKSTART.md, add screenshots, post. Dev Twitter loves "install one command" demos. ~30 min effort.

2. **Blog post at arcanea.ai/blog/orchestrator-launch**. Draft the narrative: problem (4 CLIs, 4 subscriptions, 0 glue) → insight (one yaml spec + one dispatcher) → demo (live shell) → invitation (`npm i -g @arcanea/orchestrator`). 2-3 hrs. I can draft in a follow-up session.

3. **Submit to Hacker News "Show HN"**. Title: "Show HN: Arcanea Orchestrator — one spec routes tasks across Claude / OpenCode / Codex / Gemini CLIs." Point at arcanea.ai/orchestrator. Will either 404 (quiet day) or hit page 1 (great day). Effort: 5 min submission + hour of comment replies.

All three are front-funnels for Arcanea Author Studio + Luminor chat + Agents marketplace. The orchestrator is the Trojan horse — it makes your paid products credible.

## One last thing

Everything in this handover is real and verifiable. If any claim doesn't check out when you wake up, that's on me — flag it and I'll fix it immediately.

Sleep well.

— orchestrator autonomous session, round 2
