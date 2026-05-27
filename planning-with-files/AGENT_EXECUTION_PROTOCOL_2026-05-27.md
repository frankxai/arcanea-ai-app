# AGENT EXECUTION PROTOCOL — 2026-05-27

> Forward path for autonomous + interactive sessions across the Arcanea ecosystem during the Madrid window (2026-05-25 → 2026-06-08) and into June foundations.
> Supersedes any earlier execution protocol as the canonical reference.

---

## Session lane discipline (Madrid window)

Per `~/FrankX/docs/ops/MADRID-OPERATING-PLAN-2026.md` §2, three sessions run in parallel during the trip:

| Session | CWD | Lane | What ships |
|---|---|---|---|
| **A. FrankX** | `~/FrankX` | Content + Brand + Madrid demo | Workshops, newsletter, partnerships, demo cue card |
| **B. Arcanea** | `~/Arcanea` | Creative + Product + Ecosystem | apps/web, packages/, music catalog, NFT, ecosystem foundation |
| **C. Starlight** | `~/Starlight-Intelligence-System` | Research + Intelligence + Substrate | Daily ops scans, partner intel, ACOS catalog, deep research |

**Cross-session rule:** Never run the same slash command in two sessions simultaneously. Most ACOS commands write to shared `private/` files. Race conditions corrupt state.

**This protocol governs Session B (Arcanea).**

---

## Read-before-work checklist (every session start)

1. `AGENTS.md` (root)
2. `planning-with-files/CURRENT_STATE_2026-05-27.md` ← truth of disk
3. `planning-with-files/CURRENT_BACKLOG_2026-05-27.md` ← what's pending
4. `planning-with-files/CURRENT_CHANGELOG_2026-05-27.md` ← what landed today
5. `planning-with-files/AGENT_EXECUTION_PROTOCOL_2026-05-27.md` ← this doc
6. `.arcanea/CLAUDE.md` + `.arcanea/MASTER_PLAN.md`
7. `.claude/CLAUDE.md`

If any of these are >7 days old, the agent's first action is to surface a freshness alert and offer to refresh.

---

## Cached-belief validation (mandatory)

From root `CLAUDE.md`: any claim about CURRENT state — versions, ship status, file paths, architecture, deployment, quantities, dates of events older than this turn — requires same-turn verification (Read/Bash) OR explicit prefix: "unverified, from [memory|prior-turn|claude.md] (date X):".

**Memory is authoritative ONLY for:** intent, strategy, preferences, decision history, rationale.
**Memory is NEVER authoritative for:** current state of code, deploys, or systems.

3-5 seconds of disk reads beats instant stale answers. Correct-slow over confident-wrong.

---

## Branch + PR discipline

### Branch posture (active)
- **fix/deploy-skip-without-vercel-token** — 33 ahead of main, PR #134 DRAFT, awaiting CI conflict surface
- **feat/ecosystem-foundation** — PR #108 superseded, converted draft, awaiting close
- **Stale carryover** — see `~/FrankX/docs/ops/MADRID-OPERATING-PLAN-2026.md` §7 for staging/madrid-2026-05-25 across ecosystem (LEAVE ALONE mid-trip)

### What an agent can do without explicit Frank ratification
- ✅ Open a new branch from `origin/main`
- ✅ Commit + push to a new (non-main) branch
- ✅ Open a NEW draft PR
- ✅ Comment on existing PRs
- ✅ Convert PR draft state
- ✅ Write new files under `planning-with-files/`, `docs/ops/`, `docs/architecture/`
- ✅ Create staging folders + READMEs
- ✅ Run `pnpm typecheck`, `pnpm lint`, `pnpm build`, `pnpm test` (read-only/diagnostic)

### What requires Frank's explicit OK
- ❌ Merge any PR
- ❌ Close any PR (with prejudice)
- ❌ Push to `main` directly
- ❌ Force-push to any branch
- ❌ Delete remote branches
- ❌ `git reset --hard` on any branch with unpushed work
- ❌ Edit live brand copy where voice rules are ambiguous
- ❌ Delete worktrees
- ❌ Bulk regressions / cross-repo syncs

### Cross-tab race protection (per `feedback_cross_tab_race`)
Before any `git commit` / `git push`:
1. `git status` to verify clean working tree state
2. `git rev-parse --abbrev-ref HEAD` to verify branch
3. `git fetch origin <branch>` to detect upstream changes
4. If upstream advanced unexpectedly, STOP and surface to Frank

---

## Live surface verification (excellence bar, not just 200)

For any claim about a live surface working:
1. **HTTP probe:** `curl -s -o /dev/null -w "%{http_code}\n" <url>`
2. **Title + H1 sample:** `curl -s <url> | grep -oE "<title[^>]*>[^<]+</title>|<h1[^>]*>[^<]+</h1>"`
3. **Voice/slop scan (FrankX surfaces):** `curl -s <url> | grep -oiE "(delve|dive into|unleash|unlock|empower|revolutionize|transform your|journey|accelerate)"`
4. **Voice/slop scan (Arcanea surfaces):** open question — see CURRENT_BACKLOG D3

---

## Massive-action playbook

When Frank says "execute massive action" / "god mode" / "L99":

1. **Confirm authority scope** — what's reversible vs. requires explicit OK (see above)
2. **Parallel where safe** — open multiple Bash calls in one message when no dependency
3. **Surface as you go** — every 2-3 actions, write a short status line so Frank can intervene
4. **Stop and ask only when:**
   - Hitting a destructive operation
   - Hitting voice/brand ambiguity
   - Hitting a merge/push to protected branch
   - Hitting cross-tab race signals
5. **Land artifacts on disk** — every research output becomes a planning-with-files doc, every fix becomes a PR
6. **End with go/no-go report** — every massive-action burst ends with a structured summary of what landed + what's pending

---

## Voice + design fences

Voice rules per FrankX surfaces: no `delve`, `dive into`, `unleash`, `unlock`, `empower`, `revolutionize`, `transform your`, `journey`, `accelerate`, no emojis (unless explicitly requested).

Voice rules per Arcanea mythology surfaces: **AMBIGUOUS — see CURRENT_BACKLOG D3.**

Design tokens: never raw hex outside `@arcanea/design-system`. Enforcement: `feat(lint)` commit on PR #134 upgrades the check from warn → error.

Banned fonts: Cinzel, Space Grotesk, Inter (per `.claude/CLAUDE.md`). Approved: Geist, Instrument Serif, JetBrains Mono.

Banned Framer Motion: `domMax`. Approved: `domAnimation`.

Banned co-author trailer: `Co-Authored-By: claude-flow / ruvnet / etc.` Arcanea is sovereign.

---

## Multi-runtime marketplace (forward design)

Per CURRENT_BACKLOG E2 — the multi-runtime marketplace is currently a design proposal, not implementation. Greenfield work.

**Shape (proposed for Frank ratification):**
- Universal manifest: extend `.claude-plugin/marketplace.json` with `runtimes` block
- Per-runtime adapter: `adapters/{claude-code,codex,gemini,antigravity}/` — each adapter is a shim that translates the universal skills/agents/commands into runtime-specific format
- Smoke test per runtime: install + run one skill end-to-end
- Documentation: `docs/architecture/MULTI_RUNTIME_MARKETPLACE.md` (Frank ratifies before implementation)

**Precedent:** `~/agentic-creator-os/adapters/opencode/` shows the adapter pattern already exists for one runtime. Extending the pattern to 4 runtimes is incremental, not greenfield.

**Not in scope this session.** Surfaced as E2 in BACKLOG.

---

## Latest models (May 2026 reference)

For prompts/routing decisions:

| Provider | Latest GA | Latest preview | Use case |
|---|---|---|---|
| Anthropic | Opus 4.7, Sonnet 4.6, Haiku 4.5 | — | Reasoning, code, fast |
| OpenAI | GPT-5, GPT-5 mini | GPT-5.2 Pro | Coding, structured outputs |
| Google | Gemini 3 Pro, Gemini 3 Flash | Gemini 3.1 Flash Image (NB2) | Long-context grounding, multimodal |
| DeepSeek | DeepSeek-R1, DeepSeek-Chat (V3) | — | Deep reasoning, math, cheap |
| Meta | Llama 4 Maverick (17B/128E) | — | Open-source, fast |
| xAI | Grok 4.2 | — | Quality reasoning |
| Moonshot | Kimi K2.5 | — | Long-context Chinese |
| Cerebras | Bolt (2200 tok/s), Thunder (450 tok/s) | — | Ultra-fast inference |
| Mistral | Mistral Large 2512 | — | EU residency, quality |
| Qwen | Qwen 3 235B | — | Open-source quality |

**Image:** NB Pro (premium character/reference), NB2 (fast multimodal), FLUX.2 Max/Pro/Flex/Klein (alt), GPT-5 Image / Mini.
**Video:** Veo (Google direct), Seedance 2.0 (Higgsfield).
**TTS:** OpenAI tts-1-hd, ElevenLabs (premium).
**STT:** Groq Whisper Large v3 Turbo (primary), OpenAI Whisper-1 (fallback).

**Pending update in models.yaml:** Opus 4.6 → 4.7 (3-line edit, see BACKLOG E1).

---

## End-of-session ritual

Before any agent terminates a session:

1. Write a single end-of-session note to `docs/ops/HANDOVER_<date>_<lane>.md` if work spanned >2 hours
2. Update `MEMORY.md` if any non-derivable knowledge was learned (intent, strategy, preferences, decisions — NOT current state)
3. Update `planning-with-files/CURRENT_*` if substantial state changed
4. List remaining decisions in BACKLOG with explicit owner + reason

---

## Emergency protocols

### Cross-tab race detected mid-action
1. STOP all writes
2. `git fetch --all`
3. `git status` + `git log --oneline -5`
4. Surface to Frank with current state + race signal
5. Do not retry until Frank ratifies

### Disk hits <2 GB free
1. STOP all writes (no new commits)
2. Run `node ~/Arcanea/packages/peak-performance/dist/cli.js audit` if available
3. Surface to Frank with disk state + recommended cleanups
4. Wait for Frank to ratify cleanup before proceeding

### RAM hits >85%
1. Stop spawning agents
2. Recommend closing idle Claude/Codex instances
3. Prefer `model: haiku` for background work
4. Do not run `pnpm dev` + `pnpm build` concurrently

### Build fails on a Madrid-critical surface
1. Investigate root cause (read Vercel logs if accessible, otherwise local repro)
2. Surface to Frank with 3 options: fix in this session, swap demo URL, rollback
3. Do not silent-revert; explicit decision required

---

*Generated 2026-05-27 ~04:50 CET by L99 god-mode sweep. Authoritative through next major sweep (post-Madrid recommended: 2026-06-09).*
