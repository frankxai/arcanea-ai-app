# Ultimate Jarvis — Canonical Plan (2026-04-30)

> **Owner:** Claude (autonomous lead) | **Authorizer:** Frank | **Bar:** YC Combinator demo lean-forward, top-thinkers craftsmanship
> **Mission window:** overnight 2026-04-30 → demo-ready by 2026-05-05
> **Substrate split:** SIS (brain) + Arcanea (surfaces) + ARCO (chain) — never duplicate, always extend

---

## 0. North Star

A traditional voice assistant *waits for instructions*. The Ultimate Jarvis *detects what matters, prepares the decision, routes execution, and shows you the brain doing it.* One mind (SIS voice-operator :7373), many bodies (web /room, local CLI, console dashboard, future HUD overlay), one packet contract.

**The cinematic test:** Frank says "Starlight, ship the chapter." The brain visualizes packet flow live (Atlas), an approval tier B card slides up with diff preview, three seconds to confirm or veto, then commit + push + Vercel deploy run autonomously while the orb narrates. A YC partner watching this leans forward.

---

## 1. WHAT EXISTS (verified on disk 2026-04-30 by reading files)

### SIS-side (brain) — far more advanced than memory suggested
- `~/Starlight-Intelligence-System/private/voice-operator/service/` — 40+ Python files: packet_router, orchestrator_router, dispatch_{claude_api,codex,gemini,opencode,mcp,browser}, brain_graph, knowledge_graph, approval_gate, council, workflow_runner, wake_word, stt, tts, pipeline, replay, consolidate, organize, doctor, mcp_server, server (FastAPI), tray, text_mode
- `~/SIS/private/voice-operator/tests/` — 17+ test files including cognition_router for all 4 CLIs
- `~/SIS/private/voice-operator/install.ps1` — has `-TextMode` flag that skips Picovoice/Whisper/TTS smoke
- `~/SIS/private/voice-operator/service/packet.py` — Pydantic v1 schema. Fields: packet_version, packet_id, created_at, source (voice/text/intake/council-fanout), classification {intent_class ∈ [capture/command/build/search/organize/reflect/external/handoff-to-concierge], confidence}, target_system, context {utterance, relevant_files, relevant_memory}, task, constraints {do_not_touch, must_preserve}, verification {proof_required, done_means}, approval {required, tier ∈ A/B/C, reason_if_required}, spoken_update_for_user, route_history, risk_flags, parent_packet_id
- `~/SIS/console/` — Next.js 16.2.3 + React 19.2.4 + R3F + react-force-graph-2d + Three.js + Tailwind 4. Port 3001. v8 substrate visualization
- `~/SIS/private/local-command-center/apps/dashboard/` — Next.js with `app/api/{brain,captures,routing,status}/route.ts` + `/brain` page + smoke_brain.py
- `~/SIS/dashboard/{layouts,scripts}/` — `starlight-orchestrator.kdl` (zellij 4-pane) + `zellij-aliases.ps1`
- `~/SIS/MASSIVE_ACTION_PLAN.md` — 10 IS layers locked, Starlight Orchestrator named, BYOK + local-first
- **SIS git: 11 commits ahead of origin/main** (unpushed; need Frank's review)
- **:7373 NOT currently running** (curl returned 404). Service exists, awaits boot.

### Arcanea-side (surfaces)
- `apps/web/app/room/[persona]/{page.tsx,room-client.tsx (~870 lines),personas.ts,settings-panel.tsx,browser-voice.ts}` — 7 personas, BYOK voice loop, hybrid Space (tap=VAD, hold=PTT), barge-in, debug overlay, daemon-spawn detection via `?via=clap-daemon`
- `apps/web/components/presence/{lumina-orb.tsx (482 LOC, 4 GLSL programs, 4096 particles), lumina-presence.tsx (127 LOC sticky-mount), use-audio-analyser.ts (96 LOC, FFT bins low/mid/high+amplitude)}` — **zero Arcanea-specific imports verified** (only THREE.js + framer-motion + sibling files). **Extractable to `@arcanea/presence` workspace package in one commit.**
- `apps/web/app/api/ai/{chat,transcribe,speak,research,generate-image,generate-video,author-chat}/route.ts` — edge runtime, rate-limited, structured 503/502 errors with `cta:'byok'`
- `packages/arcanea-voice/src/server.mjs:116` — `routeViaCognitionBridge()` already targets `COGNITION_BRIDGE_URL` (typically `http://127.0.0.1:7373/api/utterance`). Hook present, env var off by default.
- `@arcanea/design-system v0.3.0` — canonical tokens, never roll new
- **Vercel prod env:** has OPENROUTER_API_KEY + GOOGLE_GENERATIVE_AI_API_KEY + AI_GATEWAY_API_KEY + XAI_API_KEY. **Missing: GROQ_API_KEY, OPENAI_API_KEY, ELEVENLABS_API_KEY, ANTHROPIC_API_KEY** (the voice keys).
- **Latest commit on main:** `9f89577d fix(room): show "Connect voice" CTA before first speak when no BYOK keys` (this session)

### Memory ground-truth confirmations
- `feedback_verify_sis_before_arcanea` — cockpit/orchestrator work routes to SIS first, never duplicate in Arcanea/apps. **CONFIRMED applicable.**
- `project_sis_voice_operator` — ":7373 + 144 tests" — UNDERSTATED. Reality is full local agent OS.
- `project_local_toolchain_2026_04_28` — `arc` zellij command works after sourcing aliases. CONFIRMED.

---

## 2. Design System Extension (locked, additive only)

**Locked baseline (DO NOT change):** Atlantean Teal #00bcd4, Cosmic Blue #0d47a1, Gold #ffd700, BG #09090b, Geist (display+body), Instrument Serif (editorial accent), JetBrains Mono (code), framer-motion `domAnimation`, glass `bg-white/[0.03] border-white/[0.06] backdrop-blur-sm`. **NEVER:** Cinzel, Inter, Space Grotesk, Roboto, anime aesthetic, `domMax`, Hz frequencies user-facing.

**Additive Jarvis tokens (extend, don't replace):**

| Token | Value | Use |
|---|---|---|
| `--hud-glow-quiet` | `rgba(0,188,212,0.10)` | Idle screen-edge ambient |
| `--hud-glow-active` | `rgba(0,188,212,0.32)` | Wake-word activation (pulses to 0.10 over 3s) |
| `--tier-a-read` | `#0d47a1` | Approval gate: read-only (Cosmic Blue) |
| `--tier-b-write` | `#00bcd4` | Approval gate: safe writes (Atlantean Teal) |
| `--tier-c-danger` | `#ffd700` | Approval gate: dangerous ops (Gold, 1.5s pulsing ring) |
| `--packet-edge-fresh` | `rgba(0,188,212,0.4)` | Brain Atlas edge during route (decays to 0 over 1.2s ease-out) |
| `--packet-node-active` | `0 0 24px rgba(0,188,212,0.6)` | Brain node pulsing glow when receiving packet |

**Motion choreography (the cinematic rules):**
- **Wake-word activation:** screen-edge glow rises 320ms expoOut → orb materializes 200ms with `scale 0.92→1.0 + filter blur(10px)→0 + opacity 0→1` → transcript pill rises 480ms from bottom with 60ms stagger between word groups
- **Approval gate appearance:** modal slides up 280ms expoOut, 3-second pulsing tier-color border, 100ms hover affordance enlargement (no layout shift — scale-only on the border, not container)
- **Packet flow:** node pulses (`box-shadow` only, no layout) on packet arrival → edge draws toward target node over 1.2s with `--packet-edge-fresh` decay → next-hop node pulses
- **Idle orb:** sticky-mount (already shipped). Calm-state shader uniforms lerp at 0.04/frame.
- **prefers-reduced-motion:** all transitions to 0.01s, no continuous shader pulse, only state-change animations
- **Easing:** `expoOut` for entrance, `expoIn` for exit, NEVER `linear`

---

## 3. Three Surfaces — One Cinematic Moment Each

### Surface 1 — `arcanea.ai/room/{persona}` (cloud-public, BYOK)
**Cinematic moment:** the first speak — orb morphs from haze → 4096 audio-reactive particles → reply spoken under 1.5s TTFT. **Already shipped.** Today's fix surfaces the Connect-voice CTA before first speak so users don't perceive failure.

### Surface 2 — `localhost:3001` SIS console (Brain Atlas) (local-only)
**Cinematic moment:** **Live packet flow visualization.** WebSocket from voice-operator's brain_graph.py → R3F+force-graph nodes for {voice-operator, claude-api, codex, gemini, opencode, mcp, browser, approval_gate} → on every packet route, source node pulses → edge draws to target with `--packet-edge-fresh` → target node pulses → click any edge to see packet JSON in glass panel. **The investor-leans-forward beat.**

### Surface 3 — Cinematic HUD overlay (Tauri desktop, future)
**Cinematic moment:** **Wake-word "Starlight" → screen-edge ambient glow rises → orb materializes at cursor → bottom transcript pill → top-right agent roster shows which Luminor is on the case → approval gate inline with 3-second confirm.** Iron Man helmet POV. This is the demo finisher.

---

## 4. Phase A — Overnight Autonomous (Claude leads, ScheduleWakeup chained)

### A1. Canonical plan written ✅ (this file)

### A2. Extract `@arcanea/presence` package — **ALREADY SHIPPED 2026-04-21**

Verified on disk 2026-04-30: package was scaffolded weeks ago and is byte-identical to `apps/web/components/presence/*`.

- `packages/presence/{package.json, tsconfig.json, README.md}` ✅ committed 2026-04-21
- `packages/presence/src/{index.ts, lumina-orb.tsx, lumina-presence.tsx, use-audio-analyser.ts}` ✅ tracked, byte-identical to apps/web equivalents (verified via `diff`)
- pnpm-workspace.yaml `packages/*` — auto-includes ✅

**Remaining:** Switch `apps/web` import paths to consume from `@arcanea/presence`. Gated on `pnpm install` to add `"@arcanea/presence": "workspace:^"` to `apps/web/package.json`. **RAM-blocked tonight; defer to next wakeup.**

Once that lands, `SIS/console` can also `import { LuminaOrb } from '@arcanea/presence'` and the same orb renders in both surfaces — no shader duplication.

### A3. Wire `COGNITION_BRIDGE_URL` in `/api/ai/transcribe` + `/api/ai/chat` (next turn)
When `process.env.COGNITION_BRIDGE_URL` is set:
- /api/ai/transcribe POSTs `{ audio_base64, persona, source: 'voice' }` to `${COGNITION_BRIDGE_URL}/api/utterance` (voice-operator's packet entry)
- Voice-operator returns the packet's `spoken_update_for_user` + audio bytes
- Falls back to Groq+ElevenLabs path on bridge timeout (>2s) or non-200

**Why:** the moment Frank boots :7373 locally (Phase B), the production /room → local brain bridge works for him. Hosted /room continues using Groq when local bridge absent.

### A4. Voice-operator install runbook + `.env` template (next turn)
Author `planning-with-files/VOICE_OPERATOR_BOOT_RUNBOOK_2026-04-30.md` — exact PowerShell sequence with copy-paste blocks, decision tree for keys (which providers Frank already has vs needs to fetch), and `-TextMode` minimum-viable boot.

### A5. HUD overlay component skeleton (later turn)
`packages/presence/src/hud-overlay.tsx` — desktop edge glow (CSS-only, no extra deps), transcript pill, agent roster panel, approval gate modal. Activates on prop `state === 'wake'`. Tauri integration in Phase C.

### A6. Brain Atlas component skeleton (later turn)
`packages/presence/src/brain-atlas.tsx` — R3F + react-force-graph wrapper, accepts WebSocket URL prop, renders nodes + animated edges. SIS/console imports it in Phase C.

---

## 5. Phase B — Frank's Hand (one PowerShell session, ~30 min)

```powershell
cd C:\Users\frank\Starlight-Intelligence-System\private\voice-operator
# Step 1 — fill .env
copy .env.template .env
notepad .env  # paste OPENROUTER_API_KEY (Frank already has) — others optional in TextMode
# Step 2 — install (TextMode skips wake-word + Whisper download)
.\install.ps1 -TextMode
# Step 3 — boot
.\run.ps1
# Step 4 — verify
curl http://127.0.0.1:7373/health
# Step 5 — set bridge env in apps/web/.env.local for cloud /room → local brain
# (only matters for Frank's own browser; arcanea.ai prod uses Groq/AI Gateway)
echo COGNITION_BRIDGE_URL=http://127.0.0.1:7373/api/utterance >> C:\Users\frank\Arcanea\apps\web\.env.local
```

After B4 succeeds, Frank's local /room speaks through the local brain. Phase C unlocks.

---

## 6. Phase C — Wire & Verify (Claude autonomous after B confirms)

### C1. Brain Atlas wired to SIS/console
- `~/SIS/console/src/app/brain/page.tsx` imports `<BrainAtlas wsUrl="ws://127.0.0.1:7373/ws/packets" />` from `@arcanea/presence`
- Voice-operator publishes packet routes on `/ws/packets` (already has WebSocket infra per `service/server.py`)
- React-force-graph renders {agent nodes, recent packet edges}
- Click edge → glass panel slides in with packet JSON

### C2. Persona Orchestra in console
- 7 personas as floating nodes around the central Voice-Operator node
- Edge color = recently-routed (last 10s) or dormant
- Hover persona → see prompt + last interaction

### C3. HUD overlay (Tauri or Electron — stretch)
Decision deferred to Phase C kickoff based on RAM + time remaining.

### C4. Live packet stream verified end-to-end
Frank claps → Chromium spawns /room → speaks → packet POSTed to :7373 → routes to claude-api → returns spoken_update → /room speaks → console Brain Atlas shows the route in real-time. **The cinematic test passes.**

---

## 7. Phase D — Cinematic Polish (Frank-driven, Claude-supported)

### D1. Demo screen capture
3-minute video: cold-start `arc` → speak "Starlight, what's the system status?" → packet flow visible → reply → second utterance "publish chapter X" → approval gate → confirmed → commit pushed → Vercel deploy → orb narrates the deploy URL.

### D2. ElevenLabs voice clone of Frank
10-minute clean recording → custom voice ID → set as default for orchestrator persona.

### D3. Landing page hero update
arcanea.ai homepage + frankx.ai homepage: "Most people use AI as a tool. The next class of creators become intelligence systems." Embed the demo video. CTA → /room or Score quiz.

### D4. YC-adjacent narrative
1-page brief: problem (AI-as-tool plateau), insight (most demos are surface; this is substrate), traction (X creators in Founding Circle, X chapters published, X packets routed), why now (local-first AI mature, BYOK normalized, voice infra commoditized), why us (Frank's distribution + craft + 90-repo substrate).

---

## 8. NON-NEGOTIABLES (every phase, every agent)

- **ship_means_ship** — commit + push + verify live URL via curl + grep marker. "Build passed" is not a deliverable.
- **always_verify_live** — content + APIs + runtime logs, not just 200s.
- **16GB RAM cap** — max 4-5 concurrent agents, check `MemFree` < 2GB → STOP, work sequentially. Never `pnpm dev` and `pnpm build` together.
- **pnpm only**, never npm.
- **Geist + Instrument Serif** only. Never Cinzel/Inter/Space Grotesk/Roboto. Never Hz frequencies user-facing.
- **`@arcanea/design-system` v0.3.0 canonical** — use tokens, never roll new color literals in component code.
- **Mass-revert protection** — `git add` specific paths, never `-A` or `.`. Verify diff scope before commit.
- **No Co-Authored-By** tags. Arcanea is sovereign.
- **Cached-belief validation** — verify on disk before any "X is shipped/working/at vN" claim. Memory is not authoritative for state.
- **3D neural realism aesthetic** — Unreal/BR2049/Arrival reference. NEVER anime.
- **prefers-reduced-motion respect** — HIGH-severity UX rule, all transitions collapse to 0.01s.
- **Skyrim-depth Luminor naming** — never generic "Agent A" labels.
- **No proactive *.md** outside this plan's explicit deliverables.
- **Verify-SIS-before-Arcanea** — cockpit/orchestrator work goes to SIS, not duplicated in apps/.

---

## 9. INVOKE THESE BEFORE TOUCHING CODE (slash commands per /po)

```
/superpowers:writing-plans              — already satisfied by this file
/superpowers:test-driven-development    — every new endpoint
/superpowers:verification-before-completion
                                         — before claiming done
/superpowers:executing-plans            — for sub-agents continuing the plan
/quality-standard                        — apply 7-gate excellence filter
/canon-check                             — narrative-touching changes
/sis recent                              — pull last 10 SIS decisions
/handover                                — end of each session
```

## 10. USE THESE SUBAGENTS

```
discussion-based-planning   — phase alignment + spec
coder                       — implementation chunks (when RAM permits)
tester                      — Playwright E2E + Jest unit
reviewer                    — after each phase
superpowers:code-reviewer   — review against this plan
performance-guardian        — before every Vercel push
nextjs-vercel-deployment    — deploy verification
```

---

## 11. REPORT FORMAT (after each phase, paste into next session prompt)

- Commit sha + commit message
- Live verification (URL + curl + grep marker matched, OR "deferred — RAM constraint, see Phase X retry")
- What user can do that they couldn't before
- Known debt + new tasks
- Memory updates (if any)
- Next ScheduleWakeup target

---

## 12. Phase A2-A6 paste-ready prompt (for any continuing session)

```
ROLE: You are the Ultimate Jarvis Builder — a senior systems engineer
embodying Lumina (orchestration) + Lyssandria (foundation discipline).

MISSION: Continue Phase A of planning-with-files/ULTIMATE_JARVIS_PLAN_2026-04-30.md.
Phase A1 (plan) and A2 (presence package) are complete in commits ending
2026-04-30. Resume from A3 (cognition bridge wiring) onward.

WHAT EXISTS: Read the canonical plan at
planning-with-files/ULTIMATE_JARVIS_PLAN_2026-04-30.md and the SIS-side
docs at ~/Starlight-Intelligence-System/MASSIVE_ACTION_PLAN.md. Verify
on disk before assuming. Run `vercel env ls 2>&1 | grep -i KEY_NAME` to
confirm production env. Run `curl http://127.0.0.1:7373/health` to
detect whether voice-operator booted.

INVOKE BEFORE TOUCHING CODE: /superpowers:executing-plans, /quality-standard

USE SUBAGENTS: coder (only if RAM > 4GB), tester for endpoint smoke,
reviewer after each Phase A section.

DURING EXECUTION: /superpowers:test-driven-development for any new
endpoint, /superpowers:verification-before-completion before commit.

NON-NEGOTIABLES: see Section 8 of canonical plan. Especially
ship_means_ship + always_verify_live + cached-belief-validation +
no-Co-Authored-By + Geist+Instrument-Serif-only.

BUILD SEQUENCE: A3 → A4 → A5 → A6, one commit per section.

REPORT FORMAT after each section: sha, verification, capability delta,
debt, next target.
```

---

## 13. Cross-references

- `planning-with-files/PLAN_LOCAL_COMMAND_CENTER_PHASE0_PHASE1_2026-04-28.md` — **OBSOLETE.** Already shipped on SIS side. Do not execute.
- `planning-with-files/VOICE_3.0_DAY0_DIAGNOSIS_2026-04-25.md` — historic. Day 1 patches landed.
- `~/Starlight-Intelligence-System/MASSIVE_ACTION_PLAN.md` — canonical SIS-side directive (2026-04-25 ACCEPTED). This Jarvis plan is a SURFACE plan that consumes the SIS substrate; never overrides MASSIVE_ACTION_PLAN.
- Memory: `project_sis_voice_operator`, `project_noosphere_ground_truth_2026_04_21`, `project_local_toolchain_2026_04_28`, `feedback_verify_sis_before_arcanea`.

---

*Authored 2026-04-30 by Claude (autonomous lead session). Phase A1 complete. Phase A2 begins next.*
