# Handover — 2026-05-16 — Kura sovereign split

## What Landed

Across two repos this session:

**Extension repo** (`frankxai/arcanea-vault`, branch `codex/excellence-vault-baseline`):
- `5327ca2` — **Sovereign Kura split.** 23 files, +430/-250. Brand renamed Arcanea Kura → Kura; `VAULT_ROOT`, `CAPTURED_BY`, manifest, package, popup, sidepanel, all docs. `/kura-process` is now generic (format enforcement only). `/arcanea-kura-process` (was `kura-process.md`) keeps worldbuilding entity extraction as Arcanea's specialization.
- PR #1 retitled "feat: Kura v0.2.0 — sovereign local-first AI export + Arcanea specialization", body rewritten for two-product positioning.

**Monorepo** (`frankxai/arcanea-ai-app`, branch `codex/machine-excellence-pp-storage`):
- `ec7607b5` — Handover addendum to the 2026-05-13 doc with wave 4 council ratification details.
- PR #116 (Arcanea specialization surface — `/kura` landing + `/api/kura/import` + `/privacy/kura`) **confirmed in Draft state**; now correctly positioned as Arcanea's specialization page, not Kura's home.
- PR #117 (delete stale `packages/arcanea-vault/` + `packages/arcanea-vault-cli/`) opened earlier this week, still ready to merge.

Three earlier waves shipped before this session: original Kura rebrand (`b8ebc50a`), handover doc (`e3c8e03a`), bridge + landing scaffolding (`739a947a`).

## What Changed This Session

| Change | Where | Why |
|---|---|---|
| Brand split locked: Kura (sovereign) + Arcanea Kura (specialization) | both repos, via PR #1 + addendum | Council 4/4, 0.91 confidence; reversibility window before Web Store submission |
| `VAULT_ROOT` constant: `ArcaneaKura` → `Kura` | `src/core/frontmatter.ts` | Vault on disk lands at `~/Downloads/Kura/`, brand-neutral |
| `CAPTURED_BY`: `arcanea-kura/0.2.0` → `kura/0.2.0` | same | All captured frontmatter attributes to the open standard, not Arcanea |
| Bridge payload reshaped to `{ source: "kura", integration: "arcanea", ... }` + `X-Kura-Source` header | `src/background/index.ts` | Server can distinguish vanilla Kura from Arcanea customers in future |
| `.claude/commands/kura-process.md` (new generic skill) + `arcanea-kura-process.md` (was `kura-process.md`) | extension repo | Generic vs specialization split mirrors brand split |
| README full rewrite around sovereign-Kura positioning, "Built by Arcanea, free for everyone" footer | extension repo | Aligns with two-product structure |
| FORMAT_SPEC, CLAUDE.md, STORE_LISTING, EXCELLENCE_AUDIT, popup HTML/CSS/TS, sidepanel HTML/CSS/TS, Playwright assertions, smoke-test script | extension repo | All rebranded to "Kura" |
| PR #1 title + body rewritten for sovereign Kura positioning | GitHub | New reviewers see the locked positioning |
| Memory file `project_arcanea_kura.md` → `project_kura.md` with split details | `~/.claude/projects/.../memory/` | Future sessions know the locked two-product structure |
| `MEMORY.md` index entry refreshed | same | Visible in the auto-loaded index |
| Wave 4 addendum appended to existing handover doc | `docs/ops/HANDOVER_2026-05-13_arcanea-threads.md` | Single source of truth for the multi-wave session arc |

Also incorporated cleanly: two prior commits from another agent (`5b3e946` agent harness manifest, `4c233e0` agent instructions) — pushed before refactor so they're in the ancestry, not lost.

## Current Blockers

- **Playwright test has never been run.** `pnpm test:extension` exists but has not executed against a real Chromium. Until it runs green, the test is a contract on paper.
- **No real-browser capture verified.** No human has loaded `dist/` and clicked "Export to Kura" on a live AI platform yet. Scrapers were last touched 2026-02-23; DOM drift is the biggest unknown.
- **`/kura-process` and `/arcanea-kura-process` skills are untested** against any real captured vault.
- **`arcanea.ai/api/kura/health` is not deployed** — PR #116 is in Draft, so `arcanea.ai/kura` and the bridge endpoint are not live.
- **Repo rename** `arcanea-vault` → `kura` deferred until PR #1 merges (one `gh repo rename` command).
- **Chrome Web Store submission** blocked on: scraper smoke-test, generating 5 screenshots + 440×280 promo tile + new icon set per `STORE_LISTING.md` §5, paying $5 dev fee.

External dependencies:
- Vercel auto-deploy will trigger when PR #116 merges to main
- Chrome Web Store review cycle is 1-3 business days after submission

## Recommended Next Stack

1. **Run `pnpm test:extension` on a desktop.** First true browser validation. ~5 minutes. *Why first: zero-risk feedback loop. Catches scraper bugs, manifest issues, popup render failures in one shot. Until this runs green, everything downstream is theory.*
2. **Manual `dist/` load + one real capture.** Load unpacked in Chrome, capture from ChatGPT or Claude, verify `~/Downloads/Kura/<platform>/<date>_<slug>/` shape. *Why second: validates the layer Playwright can't cover (live platform DOMs).*
3. **Merge PR #1** once smoke + manual both pass. *Why: unlocks the rest of the chain.*
4. **`gh repo rename arcanea-vault kura`.** *Why: GitHub auto-redirects old URLs forever, and the canonical URL should match the product name before Web Store users start landing here.*
5. **Un-draft and merge PR #116.** *Why: Vercel deploys `arcanea.ai/kura` + `/privacy/kura` + `/api/kura/{import,health}` — only then does the opt-in Send-to-Arcanea button actually work in production.*
6. **Merge PR #117** (monorepo cleanup). *Why: removes the stale duplicates that have been causing "where is Kura really?" confusion.*
7. **Generate Web Store assets** per `STORE_LISTING.md` §5 — NB2 prompts are written, ~2-3h with image generation + screenshot work.
8. **Pay $5 Chrome dev fee, submit as "Kura".** *Why submit as Kura not "Arcanea Kura": broader search audience, cleaner name, brand-family architecture validates itself.*

Defer until v0.3+: Logseq/Anytype integrations, PNG screenshot export, multi-browser port (Firefox/Safari), real-time graph preview in side panel.

## Verification Evidence

| Gate | Status | Evidence |
|---|---|---|
| `pnpm typecheck` (extension) | ✅ Pass | clean exit code; `tsc --noEmit` no output |
| `pnpm build` (extension) | ✅ Pass | dist/ rebuilt 1.58s; manifest reads `"Kura — Export your most precious writing…"` |
| `pnpm test:extension` (Playwright) | ⏳ Never run | Test file present, real Chromium has not executed |
| Manual browser capture | ⏳ Never run | No human has loaded `dist/` in Chrome |
| Monorepo `tsc --noEmit` on Kura files | ✅ Pass | Verified in prior wave |
| Monorepo `eslint` on Kura files | ✅ Pass | Verified in prior wave |
| `arcanea.ai/api/kura/health` in prod | ❌ Not deployed | PR #116 in Draft |
| `arcanea.ai/kura` landing live | ❌ Not deployed | Same |
| `/kura-process` skill against real vault | ⏳ Never run | No captured vault exists yet |
| `/arcanea-kura-process` skill against real vault | ⏳ Never run | Same |
| Web Store submission | ⏸ Blocked | Needs assets + manual platform smoke + $5 fee |

Brutally honest: code/types/lint are validated. Runtime behaviour is **0% validated**. Step 1 of the next-stack moves that needle.

---

## Session Wisdom

### Prompts That Worked

- **"i think X still doesnt feel right does it?"** — Surfacing dissonance *before* shipping more code. Pattern: when a name/decision feels off, name the unease early; cheap to redirect, expensive to undo.
- **"you in wrong repo por why in X thats the Y site is this meant to get there? ensure you take right actions?!?!"** — Challenging stated assumptions even when the AI sounds confident. Pattern: trust-but-verify on AI's repo/path/deploy claims.
- **"yes if /council also approves"** — Gating reversible-window-closing decisions through a structured deliberation skill. Pattern: human-in-the-loop via skill invocation, not just chat. The council's 4-perspective synthesis caught nuance a single AI voice would have flattened.
- **"beware other agents working on stuff, please take all actions for me"** — Two-clause prompt that authorizes execution *while* flagging concurrent-write risk. Pattern: pre-flight `git fetch` + inspect-before-modify becomes mandatory in multi-agent workspaces.
- **"do all for me"** — Granting blanket execution authority after the plan is laid out. Works because plan was structured and reversible; would be dangerous without that prep.

### Technical Choices Validated

- **Split before submission, not after.** Web Store listings are sticky — install URL freeze, brand confusion compounds. Doing a brand split *before* a marketplace submission costs 30 minutes; after costs reputation. Reversibility windows matter.
- **Generic + specialization skill pattern.** Two skills (`/kura-process` generic, `/arcanea-kura-process` Arcanea-flavored) sharing one format spec is cleaner than one bloated skill with conditional branches. Inheritance via convention, not framework.
- **IP+source token-bucket in Fluid Compute memory.** Vercel reuses function instances across requests, so an in-memory `Map<key, {tokens, refilledAt}>` actually survives between calls inside one instance. No Upstash/KV needed for v1. Distributed limits can come later.
- **Health-aware popup with `chrome.storage.local` 10-min cache.** Polling the bridge on every popup open would be wasteful; never polling means users click into errors. Cached health-check with a short TTL splits the difference at ~zero cost.
- **"Built by Arcanea, free for everyone" footer.** Creator-attribution without coupling product fate to creator brand fate. Apple does this with the "Designed by Apple in California" engraving — proximity without ownership claim.

### Patterns Discovered

- **Architectures that already have clear brand-neutral boundaries are 90% ready for a brand split.** The work is naming, not refactoring. Looking back, FORMAT_SPEC, src/core, popup were always brand-neutral in code — the brand was only in *strings*. The audit took 5 minutes; the rename took 25.
- **Drafting PRs you intentionally don't want to merge yet is better than holding work locally.** Keeps work visible to collaborators, doesn't risk auto-merge, captures intent in PR body. `gh pr ready --undo` flips state in seconds.
- **Council ratification before reversible-window-closing decisions reduces 2nd-order regret.** The 4-perspective synthesis caught the "standards win the long arc" framing that a single AI voice would have missed. Worth invoking on any decision where "later is expensive."
- **Other-agent commits should be pushed first, refactor lands on top.** `git fetch && git log --oneline -5` before any destructive action. Two unpushed agent commits (`5b3e946`, `4c233e0`) were preserved by pushing them first, then refactoring on top — not by stashing or rebasing.
- **The handover doc itself is part of the working memory.** Appending a wave-4 addendum to an existing handover (rather than creating a new file mid-arc) keeps the session story continuous. The original filename (`HANDOVER_2026-05-13_arcanea-threads.md`) stays even though the product is now Kura — git history continuity > filename freshness.

### What Was Built (Gratitude)

Three sessions ago, the extension was "Arcanea Vault — 2 months idle, never shipped." Today it's **Kura** — a sovereign open-standard export tool with a Playwright test, a hardened bridge endpoint, a 339-line format spec, a complete Web Store submission package, and a clean two-product brand architecture ratified by the council.

The brand evolution (Vault → Threads → Kura) wasn't drift — it was *naming stability through structured iteration*. Each rename closed a gap the prior name had exposed. Vault → Threads exposed the "capture vs storage" confusion. Threads → Kura exposed the "still too generic" gap. Kura + Arcanea Kura split exposed the "brand coupling limits adoption" thesis. Each name pointed deeper into what the product actually is.

What's better about the project: the moat is now *the format and the standard*, not a single product. Arcanea still wins because it's the creator of Kura and the best specialization layer — but Kura can outlive any single Arcanea decision. That's the structure that compounds.

The creative leap: realizing the architecture was already shaped for the split before anyone noticed. The code was sovereign all along; the names just needed to catch up.
