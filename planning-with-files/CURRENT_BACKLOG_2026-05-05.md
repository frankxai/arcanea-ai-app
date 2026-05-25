# Current Backlog — 2026-05-05 (Sprint W19 mid-flight reprioritization)

> Supersedes `CURRENT_BACKLOG_2026-04-20.md` after a 14-day gap.
> Reordered around two facts: (a) Gate 0 silently slipped Apr 30 — Wed May 7 EOD is binary decision, (b) inflection week shipped 5 substrates (`@starlight/multilingual`, Mädchen book, JARVIS demo, Las Tierras Wave 1, Sprint W19 cost discipline), but none generated €1.

## Prioritization rule (W19)

```
P0 = Gate 0 decision OR Sprint W19 lock-in tasks (book hygiene, i18n Phase 2, capture diagnose).
P1 = Frank-hand carryovers + working-tree resolution (blocks substrate work).
P2 = Voice + Brain Atlas demo path completion (cinematic loop).
P3 = Las Tierras Waves 2-3 + book editorial.
P4 = Repo hygiene at scale + W19 audit decisions.
P5 = Strategic / future-optionality (deferred until Gate 0 closed).
```

The P0 above is *sprint-mechanics*, not feature work. **Frank's only revenue-relevant action this week is the Gate 0 decision Wed EOD.** Everything else is value-creation that doesn't pay rent without that decision.

---

## P0 — Gate 0 decision + Sprint W19 lock-in (Mon→Wed)

| # | Task | Owner | Due | Notes |
|---|------|-------|-----|-------|
| P0.1 | **Gate 0 binary decision: book €1 OR formally reset to new dated deadline** | **Frank** | **Wed May 7 EOD** | Single decision, not build task. Surfaces: Whop product card, OSS donation tier, /room demo paid embed, founding-circle pre-pay, retreat deposit. |
| P0.2 | Wire Vercel Ignored Build Step in dashboard | **Frank** | Mon EOD | Sprint W19 task #4. Cost bleed continues until done. |
| P0.3 | Close PR #75 (43-package mega) — confirm closed | Lumina | Mon | Sprint W19 task #5. |
| P0.4 | Triage 6 stale GH Actions Dependabot PRs (#50-54) | Lumina | Tue | Sprint W19 task #6. |
| P0.5 | Stale branch sweep (delete `dependabot/*` >7d, `backup/*`, `worktree-*`, merged `feat/*`) | Lumina + Frank approval | Tue | List first, approval before any `git push --delete`. |
| P0.6 | Open PR for `@arcanea/multilingual-config` (commit 7e8d377a) | Lumina | Tue | Sprint W19 task #8. |
| P0.7 | Execute i18n Phase 2 full migration into apps/web (en+de, beyond homepage+library+about) | Lumina (subagent in worktree) | Wed | Phase 2A foundation already merged via PR #87. |
| P0.8 | Open PR `feature/multilingual-apps-web` for review | Lumina | Wed | After P0.7. |

---

## P1 — Frank-hand carryovers + working-tree resolution (Mon→Tue)

These block substrate work. Agents cannot do them.

| # | Task | Why | Est |
|---|------|-----|-----|
| P1.1 | **Working-tree commit-or-revert decision** (2,229 dirty lines) | Substrate noise commits + lost work risk | 30 min Frank decision + agent execution |
| P1.2 | Run `scripts/compact-wsl-admin.ps1` from admin PowerShell | Recovers 10–25 GB on C:; vhdx still uncompacted from Apr 29 | 15 min Frank-hand |
| P1.3 | Rotate `.npmrc` plaintext token | `npm token revoke` + new + env var/1Password. Apr 29 security debt. | 10 min Frank-hand |
| P1.4 | Review + commit/discard 18+ uncommitted `~/.claude/` | Prevent loss + git hygiene | 30 min Frank-hand |
| P1.5 | Drop concurrent Claude Code instances 21 → ≤5 | RAM critical (~9.5 GB at 95%). 16 GB machine cap. | 5 min Frank-hand |

---

## P2 — Voice + Brain Atlas demo path (Wed→Thu)

The cinematic loop closes when SIS `:7373` boots and Brain Atlas WebSocket goes live. Until then, `/room/jarvis` Groq direct path is the demo surface.

| # | Task | Why | Est |
|---|------|-----|-----|
| P2.1 | Add Vercel voice keys: `GROQ_API_KEY`, `OPENAI_API_KEY`, `ELEVENLABS_API_KEY`, `ANTHROPIC_API_KEY` | Hosted `/room` works for non-BYOK visitors | 5 min Frank-hand |
| P2.2 | Boot SIS voice-operator `:7373` per `VOICE_OPERATOR_BOOT_RUNBOOK_2026-04-30.md` | Unblocks Brain Atlas WebSocket demo + cognition bridge | 30 min Frank-hand (TextMode) / +12 min Whisper download (full) |
| P2.3 | VOICE-1 — Jarvis tool calling (`open_url`, `git_status`, `system_status`, `explain_arcanea`, `write_note`) | Demo bar elevation; per `VOICE_BACKLOG_2026-05-04.md` | 1-2h subagent |
| P2.4 | VOICE-3 — HUD overlay state machine on `/room/jarvis` | A5/A6 substrate ready; flips orb→full Jarvis HUD | 2-3h subagent |
| P2.5 | Switch `apps/web` imports to `@arcanea/presence/*` (Phase A2 finishing) | Removes duplicated source paths | 1h subagent |
| P2.6 | Capture/Council pipeline diagnose | Frank's `/capture` test required; cold 14+ days | 2-4h Lumina |
| P2.7 | Fix `daily-brief.md` Slack target `#ops` → `#arcanea` | Sprint W19 task #12. Trivial. | 5 min |
| P2.8 | Wire automated BLOCKER notification on Day 3 of capture silence | Sprint W19 task #13. New feature. | 1-2h |

---

## P3 — Las Tierras Waves 2-3 + book editorial (Wed→Fri)

Wave 4 BLOCKED on Frank substrate decision; Waves 2-3 can ship without him.

| # | Task | Why | Est |
|---|------|-----|-----|
| P3.1 | Las Tierras Wave 2 — Council line-edit pass on Ch 1-12 | Apr 25 plan §3 cuts mapped, never executed; "miracle-then-explanation" signature flaw | ~3h, Line Editor + Voice Alchemist + Developmental Editor parallel |
| P3.2 | Las Tierras Wave 3 — depth/tension/dialogue/hooks | Frank's primary feedback; first-line hooks + 25% dialogue minimum + magical flora/fauna currency | ~4h |
| P3.3 | Las Tierras Wave 4 sign-off | Aurevaldan substrate weave (Bela's folk-cosmology) — Frank approve or hold-for-Book-2 | Frank decision |
| P3.4 | Mädchen — English mirror parity check + final pre-print typography pass | German original is canonical; English follows | 1-2h |
| P3.5 | Forge of Ruin / Tides / Pyrathis / Van Linh / Hall of White — sequence next prose pass per Author Team pattern | BIBLEs ready; one book per week pace | Per-book ~6-8h |

---

## P4 — Repo hygiene at scale + W19 audit decisions (Thu→Fri)

| # | Task | Why | Est |
|---|------|-----|-----|
| P4.1 | Decide: `arcanea-flow` (1,529 changed) — archive or revive | Sprint W19 task #19 | Frank decision |
| P4.2 | Decide: `arcanea-realm` — fix wrong origin or absorb into arcanea-code | Sprint W19 task #20 | Frank + Lumina |
| P4.3 | Decide: `frankx.ai-vercel-website` (501 changed) — archive or restart | Sprint W19 task #21 | Frank + Lumina |
| P4.4 | Mark `arcanea-mcp` + `arcanea-memory` archived in registry | Sprint W19 task #22 | Trivial |
| P4.5 | Cut GitHub Releases for SIS v7.0/v7.1/v7.2 (Releases stale at v3) | Sprint W19 task #23 | Metadata |
| P4.6 | Wire weekly `/repo-triage` cron → single dashboard | Sprint W19 task #24 | New feature |
| P4.7 | `npm login` + publish 13 pending @arcanea packages | Carryover from W18 P1.1; unblocks `@starlight/multilingual` npm publish + MCP chain | 30 min Frank-hand |
| P4.8 | Add LICENSE + close 8 reviewer items on `@starlight/multilingual` | Pre-standalone-repo-extract | 1-2h subagent + Frank LICENSE call |

---

## P5 — Strategic / future-optionality (deferred until Gate 0 closes)

- Multi-repo coordination model formalization (Sprint W19 task #25).
- i18n Phase 3 plan (es + ja, Sprint W19 task #26).
- Founding Circle launch (needs Gate 0 first).
- New product surfaces (Music IS, Vibeclubs, GenCreator) until existing surfaces cost-disciplined.
- Streaming swarm trace UI + SSE subscription (PR #47 backend → UI gap).
- `@arcanea/router-spec` v1.1 publish.
- Real stats population via 10+ `arco run` events.
- Windows PowerShell `install.sh` transpile.
- `@arcanea/orchestrator-pro` monetization fork.
- Trinity AI engagement closure signal.

---

## Removed / Superseded from prior backlog

- ARC-139 GenCreator.ai cutover — surface deprioritized in W19; Gate 0 decision supersedes any single-surface push.
- ARC-76 / ARC-71 npm-publish chain — moved to P4.7 (was P1.1).
- ARC-86 / ARC-88 X handle rename + queued threads — Frank-hand, deferred to off-sprint window.
- ARC-83 / ARC-84 Simli + Hedra + NVIDIA NIM API keys — superseded by SIS-bridge + Groq pipeline.
- Vibeclubs P3 tier — deferred. New surfaces excluded from W19.
- Creator Forge Stage 1 spec — deferred. Cascade-ON locked, prose can wait.

---

## This week's singular framing

**Five surfaces shipped. Zero euros booked. Wed EOD = decision.**

If Frank does P0.1 (Gate 0 decision) + P1.1-P1.5 (carryovers + working-tree resolution) + P0.7 (i18n Phase 2 full migration ships) this week and nothing else, W19 closes clean — sprint discipline holds, Gate 0 is no longer silently failing, and substrate work resumes on a clean tree. Everything in P2-P5 is bonus.
