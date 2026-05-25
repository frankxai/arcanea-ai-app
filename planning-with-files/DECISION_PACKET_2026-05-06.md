# Decision Packet — 2026-05-06 (Post-Overnight Frank Check-in)

**Date:** 2026-05-06
**Author:** Lumina/Opus session (Shinkami guardian)
**Audience:** Frank
**Purpose:** Single-screen surface of every open decision blocking forward motion. Each item is binary or near-binary so this can be cleared in 15-30 min.

> **Read order:** decisions are ranked by *time-criticality*, not importance. P0 = today; P3 = this month. Don't try to clear all at once.

---

## P0 — TIME-CRITICAL (Wed May 7 EOD = 1 day from now)

### D1. Gate 0 binary decision — book €1 OR formal reset

**Context:** Gate 0 silently MISSED Apr 30 (€0). Per Apr 20 backlog: *"a Gate missed is a Gate deferred; a Gate faked is a credibility loss."* The escape valve was never triggered. **Current state: silently failing.**

**Decision required:**
- (A) Book €1 from any of 13 surfaces by Wed EOD (Whop product, OSS donation tier, /room demo paid embed, founding-circle pre-pay, retreat deposit, Gumroad, etc.)
- (B) Formally reset Gate 0 to a new dated deadline. Public/journaled. No more silent slips.

**Recommendation:** (A) is the right outcome but (B) is acceptable **if** the new deadline is named TODAY in writing. Either is honorable; silent miss again is not.

**Action if (A):** pick the surface, ship the storefront, send to one warm contact, book €1 by Wed.
**Action if (B):** state new deadline in `planning-with-files/CURRENT_BACKLOG_2026-05-05.md` and SIS, ping `#arcanea`.

**BV formation:** June 1, 2026 — 26 days from today. Cash gap is no longer hypothetical.

---

## P1 — LAS TIERRAS DE LUZ MERGE-DECISIONS (block sensitivity-reader engagement)

PR #89 was squash-merged at 09:54 UTC May 5 as `763baf1c`. **The Spanish version IS on main.** All four post-merge decisions are still open — the merge happened before sign-off. Reverting any of them is a `git revert 763baf1c` away if you choose.

### D2. Spanish-only narration — confirm or revert

**The most consequential.** Both literary agents independently arrived at full-Spanish narration. Justifications:
- Target reader (28-year-old Venezuelan woman in Spain) is native Spanish
- BIBLE explicitly cites Rulfo / Jiménez / García Márquez / Cisneros lineage — three of four wrote in Spanish
- Read-aloud test: Spanish sings; English version was translation-in-reverse

**Counter-argument:** Apr 25 Council plan locked English-narration with Spanish dialogue + Veldarín atmosphere. PR #89 overrides without prior alignment.

**Reversibility:** original English drafts on `main` pre-2026-05-05 (commit before `c359b2da`). Reverting Ch 1-12: `git checkout <pre-c359b2da-commit> -- book/las-tierras-de-luz/chapters/`.

**Recommendation:** keep Spanish, run one Venezuelan beta-reader pass first, decide after.

**Cost of either:** keep = 0 effort. Revert = 30 min + redo line-edit per Apr 25 plan against English chapters.

### D3. Ch 1-6 expansion — expand to ~3,000w or ship asymmetric

Stream A (Consciousness Fiction Master, Ch 1-6) cut hard — averaged ~1,200w per chapter. Beautiful Rulfo-tight novella register. Stream B's redo on Ch 7-12 ran at ~3,500w per chapter — Márquez-roomier, more atmospheric. Result: **asymmetric pacing** between halves.

**Two paths:**
- (A) Expand Ch 1-6 to ~3,000w each. Adds ~10-12K words. Restores cut beats: La Abuela / verde sombraluz schoolyard scene (Ch 1), the walk-to-school destello cascade (Ch 1), bells-counting-to-10 reveal (Ch 1), mid-chapter scenes that gave the original its meditative breath. ~45 min agent dispatch.
- (B) Ship as-is. The asymmetric pacing reads as a literary choice (the seer's perception slows and widens as she meets Bela). Defensible.

**Recommendation:** (A). Ch 1-6 currently feels like précis for the longer chapters. The book is meant to be a literary novel (~50K target), not a 28K novella.

### D4. Cover v2 — keep or revert to v1

v2 (NB2 Mädchen-grade watercolor, no baked typography, Mira in profile under sombraluz, 2:3 vertical) is promoted as canonical in PR #89. v1 (original generation, baked-in typography) still on disk at `apps/web/public/images/books/las-tierras-de-luz-cover.png`.

**Recommendation:** keep v2. Matches the Mädchen visual standard you explicitly named as gold standard. Leaves typography overlay space, no baked-in text.

**Cost of either:** keep = 0 effort. Revert = swap `cover.png` ↔ `cover-v2.png` in `COVER_MAP` of `apps/web/app/books/drafts/page.tsx` + `[slug]/page.tsx`. 5 min.

### D5. Wave 4 — Aurevaldan substrate weave (Bela's folk-cosmology)

Frank asked for Aurevaldan folk-cosmology to land **without naming any real-world tradition**. Four-tradition convergence (Pemón mawari · Kabbalah Nitzotzot · Vedic anu-atma · Hesychast uncreated light) is now an Aurevaldan oral tradition Bela carries.

**What surfaces in prose** (all Bela's voice in Ch 11):
1. Tin box: *piedra de los velos* + dried herbs + 1946 photograph of Arcelia
2. Grandmother-story: First Light scattering through abundance, *los retornantes*, *la conversación que no se acaba*
3. Piedra in morning light: two heartbeats of cleaner perception, then ordinary stone

**Substrate dossier:** `book/las-tierras-de-luz/FOLK_COSMOLOGY_AUREVALDE.md` (3,707 words, Lore Master voice).

**Decision required:** sign off on Wave 4 substrate as canonical for Las Tierras OR revert + hold for Book 2.

**Recommendation:** sign off. The four-tradition convergence is the deepest creative move tonight; it lands with Aurevaldan ownership, no appropriation; Ch 11 climax now earns its weight.

### D6. Sensitivity reader engagement — who, when, paid

Two Venezuelan women beta readers — diaspora experience and aligned spiritual formation — must read full manuscript before publication, paid honorarium. Per Apr 25 Council plan §"Sensitivity protocol" — non-negotiable.

**Status:** not yet engaged. PR #89 merged without this gate.

**Decision required:** name the readers, paid honorarium amount, deadline.

**Suggested action:**
- 2 readers from your network (Venezuelan diaspora + spiritual formation alignment)
- €200-€300 each
- 2-week reading window
- Block production print + audiobook until both confirm
- /books/drafts/ route IS the live beta — readers can use that surface directly

---

## P2 — CANON-DRIFT FINDINGS (3 issues, all author-only)

Per `.arcanea/lore/canon-drift/2026-05-05.md`. **Zero prose-level violations** — readers are not exposed.

### D7. Verdant-Flow Gate mismatch (🟡 medium)

`book/las-tierras-de-luz/BIBLE.md` line 64: *"Anima signature: Verdant-Flow (Fourth Gate influence)"*

**Conflict:** Fourth Gate per `CANON_LOCKED.md` is **Heart (Maylinn / Laeylinn / 417 Hz)** — domain Love, healing. "Verdant-Flow" maps to Earth + Flow → Foundation (Gate 1) + Flow (Gate 2), not Heart.

**Decision required:**
- (A) Re-label as "Foundation-Flow (First + Second Gate cross-influence)"
- (B) Revise descriptor to Heart-Gate-aligned (e.g., "Tender-Heart resonance — orchards develop destellos because the valley loves long")

**Recommendation:** (B). Heart-Gate framing actually fits the BIBLE's own destello mechanic better than Verdant-Flow does.

### D8. Yggdrasil 432 Hz World Song (🟢 minor)

Referenced in Las Tierras BIBLE + folk-cosmology dossier as canon, but not in `CANON_LOCKED.md`. Solfeggio scale in CANON is 174-1111 Hz across Ten Gates; 432 Hz sits between Heart (417) and Voice (528) with no Gate assignment.

**Decision required:**
- (A) Promote into `CANON_LOCKED.md` as STAGING tier with approval-log entry
- (B) Strike from BIBLE/dossier — author-layer references should only invoke locked canon

**Recommendation:** (A) if "World Song" is a real cosmological intent; (B) if it was a half-locked artifact.

### D9. "The Arc" / "Arc of existence" (🟢 minor)

`book/CLAUDE.md` instructs *"The Arc referenced for cycles/death/rebirth"* as a canon-alignment checklist item, but `CANON_LOCKED.md` has no Tier or section called "The Arc."

**Decision required:**
- (A) Lock "The Arc" into CANON_LOCKED.md as Tier 1.5 (under Tier 1 Primordial Duality)
- (B) Strike from canon-alignment checklists

**Suggested formulation if (A):** the mantra at bottom of `book/CLAUDE.md` — *"Potential → Manifestation → Experience → Dissolution → Evolved Potential"* — is a clean candidate for the locked formulation.

---

## P3 — FRANK-HAND CARRYOVERS (not decisions, but blocked-on-you)

These have been open ≥7 days. Each is small Frank-time but agents cannot do them.

| # | Item | Why now | Est |
|---|---|---|---|
| F1 | Run `scripts/compact-wsl-admin.ps1` from admin PowerShell | Recovers 10-25 GB on C:; vhdx still uncompacted from Apr 29 | 15 min |
| F2 | Rotate `.npmrc` plaintext token | `npm token revoke` + new + env var/1Password. Apr 29 security debt. | 10 min |
| F3 | Drop concurrent Claude Code instances 21 → ≤5 | RAM critical (~9.5 GB at 95%). 16 GB cap. | 5 min |
| F4 | Add Vercel voice keys: `GROQ_API_KEY`, `OPENAI_API_KEY`, `ELEVENLABS_API_KEY`, `ANTHROPIC_API_KEY` | Hosted `/room` works for non-BYOK visitors | 5 min |
| F5 | Boot SIS voice-operator `:7373` per `VOICE_OPERATOR_BOOT_RUNBOOK_2026-04-30.md` | Unblocks Brain Atlas WebSocket + cognition bridge | 30 min (TextMode) / +12 min Whisper |
| F6 | Working-tree commit-or-revert decision (2,229 dirty lines) | Blocks substrate work; CRLF mirage suspected | 30 min |
| F7 | Wire Vercel Ignored Build Step in dashboard | Sprint W19 task #4. Cost bleed continues until done. | 5 min |
| F8 | Capture/Council pipeline diagnose — Frank's `/capture` test required | Cold ≥14 days; my prompts not auto-summarized to memory | 15 min for test |

---

## NOT decisions — orientation

**What's already on rails (no Frank action needed):**
- CI fix on red main — code-explorer agent dispatched in background, PR incoming
- 4 audit artifacts (CURRENT_STATE / CURRENT_BACKLOG / WEEKLY_REVIEW / canon-drift / git-cleanup) — PR #92 OPEN
- Stash spot-check + git-cleanup phase 1 — done (2 merged branches deleted, design-evolution worktree intact + clean, surfaced for Frank call)
- 4 open PRs (#88 cockpit, #91/#84/#83 dependabot) — all blocked by red CI, will unblock when fix lands

**Once D1-D9 cleared, the unblocked sequence is:**
1. CI green → all PRs (#92, #88, #91, #84, #83) re-run + merge
2. Wave 2 line-edit on Ch 1-12 (~3-4h agent work, can dispatch on green main)
3. Sensitivity readers engaged → 2-week window
4. /print route for Las Tierras (per Mädchen pattern)
5. Audiobook Spanish narration (separate production track)

---

## How to clear this in 15 min

1. **D1**: pick (A) or (B). One sentence in chat.
2. **D2-D5**: write *"keep / keep / keep / sign-off"* (recommended) or differ where needed.
3. **D6**: name 2 readers + €200-300 honorarium each.
4. **D7-D9**: pick (A) or (B) on each. One word each.
5. **F1-F8**: schedule a 60-min Frank-hand block this week. Pick the day.

The agents will pick up from there.

---

*Files written this pass: this file only. No code changes. PR #92 has the post-overnight audit artifacts; this packet is its sibling synthesis.*
