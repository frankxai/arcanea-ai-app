# CURRENT BACKLOG — 2026-05-27

> Pending decisions + ranked tasks. Supersedes `CURRENT_BACKLOG_2026-04-20.md` (5 weeks stale).
> Read alongside `CURRENT_STATE_2026-05-27.md` + `CURRENT_CHANGELOG_2026-05-27.md`.

---

## P0 — Decisions needed from Frank

### D1. PR #134 path forward
PR #134 carries the 33-commit ecosystem foundation work. CI will run and surface specific conflicts vs main.
- **Action:** Walk CI failures, decide: (a) merge with conflict resolution, (b) cherry-pick subset into a fresh smaller PR, (c) close in favor of fresh work.
- **Owner:** Frank
- **Why:** Ecosystem work has been stalled 16 days on PR #108; #134 puts it back in front of the reviewer.

### D2. Close PR #108 explicitly
PR #108 has been commented + converted to draft. Close after #134 lands (or right now if you accept the supersede framing).
- **Action:** `gh pr close 108 -c "Superseded by #134"` (when ready)
- **Owner:** Frank (close = final, but reversible via reopen)

### D3. `/about` voice — Arcanea mythology vs FrankX rules
"journey" and "unlock" sit inside Arcanea mythology (Apprentice→Luminor Gates). FrankX voice rules ban both absolutely; Arcanea voice rules don't explicitly cover this case.
- **Action:** Ratify a voice carve-out for Arcanea mythology surfaces — OR copy-fix /about to remove these tokens.
- **Owner:** Frank
- **Why:** Cannot unilaterally edit live brand copy without explicit ratification.

### D4. Worktree cleanup (6 → 2)
Current: `~/Arcanea`, `~/Arcanea-claude`, `~/Arcanea-site-excellence`, `~/.claude/worktrees/agent-a655…` (locked), `~/.claude/worktrees/feat-author-council-wiring`, `~/.claude/worktrees/multi-pr`.
Candidates for removal: `~/Arcanea-site-excellence` (behind main), `multi-pr` (3-week stale handover), `agent-a655…` (locked, purpose unclear).
- **Action:** Decide which to keep (max 2 per policy). I can remove the rest with `git worktree remove <path>`.
- **Owner:** Frank

### D5. PR #121 Dependabot dispositoin
MERGEABLE with Lighthouse failing (UNSTABLE). 7 dev-patches.
- **Action:** Merge ignoring Lighthouse / wait for stabilization / close + take next batch.
- **Owner:** Frank
- **Risk:** Low — dev-only patches.

---

## P1 — Ready to execute (no decision blocker)

### E1. models.yaml Opus upgrade (3-line edit)
Current models.yaml has `claude-opus-4-6` in 3 places: `gateway:arcanea-opus:model_id`, `claude_code:primary`, `routing:tier3_opus:models[]`. May-2026 latest is `claude-opus-4-7`.
- **Action:** Edit + commit on a focused branch `chore/models-opus-4-7` + open PR
- **Effort:** 5 min
- **Reversible:** Yes (revert PR)

### E2. Multi-runtime marketplace design proposal
The `agentic-creator-skills` marketplace is Claude-Code-only (`.claude-plugin/marketplace.json`). For "plugin that codex, gemini, antigravity can import smoothly":
- Universal manifest format: extend marketplace.json with `runtimes: { claude-code, codex, gemini, antigravity }` blocks
- Per-runtime adapter shims (already have `~/agentic-creator-os/adapters/opencode` as precedent)
- Documentation + smoke test per runtime
- **Action:** Write the design doc as `docs/architecture/MULTI_RUNTIME_MARKETPLACE_PROPOSAL_2026-05-27.md`
- **Effort:** 2-3h research + write
- **Owner:** Frank ratifies the spec; implementation follow-up sessions

### E3. /about voice fix (if Frank ratifies)
Once D3 is decided in favor of fixing, the file is at `apps/web/app/about/page.tsx`.
- **Action:** Replace `journey` / `unlock` with on-voice alternatives (e.g., "path" / "open" / "earn")
- **Effort:** 15 min
- **Reversible:** Yes (revert commit)

---

## P2 — Carryover from prior sprints

### C1. arcanea-realm cleanup (44 dirty on `dev`)
Pre-Madrid staged WIP. Per master plan §7: "Don't touch staging branches mid-trip." Defer until post-Madrid (after 2026-06-08).

### C2. arcanea-flow `feat/namespace-migration` (13 dirty, 6 ahead)
Active migration of @claude-flow → @arcanea-flow. Has its own session in mind per Madrid plan §2 Session B. Defer to dedicated session.

### C3. AnimeLegends.ai rename branch (3 ahead)
`rename/akashic-frame-drops-way-origins` — active rename refactor. Not Madrid-touching. Land when stable.

### C4. Sister-repo build/test health audit
This sweep verified branch/dirty state; not per-repo `pnpm build` + `pnpm test` health. Worth a focused audit pass when not Madrid-prep crunch.

---

## P3 — Strategic deferrals

### S1. Gate 0 €1 revenue decision (deadline 2026-05-31)
Per 2026-05-19 daily brief BLOCKER mode + `project_may_foundations_2026` memory. May 2026 = foundations month; Gate 0 deferred to June. No action this week.

### S2. ACOS public mirror cross-push
The overnight program's "out of scope tonight" note: "too risky to bulk-sync without Frank's eyes." Defer.

### S3. npm vs pnpm canonical decision
Per overnight program: "needs Frank's call, not mine." Surface in a focused decision doc.

### S4. proxy.ts vs middleware.ts rename
Codex's territory per overnight program notes. Don't touch.

---

## Priority queue (P0 → P3 collapsed)

| Rank | Item | Status | Owner |
|---|---|---|---|
| 1 | D1 — PR #134 path forward | Awaiting CI | Frank |
| 2 | D2 — Close PR #108 explicitly | Ready | Frank |
| 3 | D3 — /about voice ratification | Awaiting decision | Frank |
| 4 | E1 — models.yaml Opus 4.7 upgrade | Ready | Claude (Frank green-light) |
| 5 | D4 — Worktree cleanup | Awaiting decision | Frank |
| 6 | D5 — PR #121 disposition | Awaiting decision | Frank |
| 7 | E2 — Multi-runtime marketplace proposal | Ready to draft | Claude (Frank ratify spec) |
| 8 | E3 — /about voice fix | Blocked on D3 | Claude |
| 9 | C1-C4 | Carryover | Post-Madrid |
| 10 | S1-S4 | Strategic defer | Frank |

---

## What's NOT in this backlog (and why)

- **FrankX Madrid demo work** — that lives in `~/FrankX/docs/ops/WEDNESDAY-2026-05-27-MORNING-BRIEFING.md` with its own parallel session handling it.
- **Kura Web Store submission** — per HANDOVER_2026-05-16, blocked on Playwright smoke + assets + $5 fee. Defer to dedicated session.
- **Open Library / book series production** — separate working lanes per `book/CLAUDE.md`.
- **Onchain/crypto work** — `arcanea-onchain` repo is clean; no Madrid intersection.

---

*Generated 2026-05-27 ~04:45 CET by L99 god-mode sweep. Use this with CURRENT_STATE + CURRENT_CHANGELOG as the canonical session-start read.*
