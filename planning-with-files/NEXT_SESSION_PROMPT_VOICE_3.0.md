# Next-Session Master Prompt — Voice 3.0 Massive Action

**Paste this entire document into a fresh Claude Code session at `C:/Users/frank/Arcanea`.**

---

## Mission

Take Arcanea Voice from a buggy v2 demo to a production-grade Jarvis-class personal AI command center. Specifically: get Frank from "clap doesn't reliably work and I can't speak" to "clap → window opens → 'Sir, the SIS is activating' → I speak, Lumina answers, and workflow tiles actually fire CLI commands on my machine."

**Frank's frustration triggers (read first):**
- v2 daemon flakiness — claps not firing reliably
- Window opens but voice loop in `/room/<persona>` doesn't work
- Neural-net visualization rendered poorly in earlier attempts
- Browser sandbox blocks actual CLI control
- Cannot have Arcanea + SIS + FrankX as separate intelligence systems
- Wants premium activation greeting ("Sir, the SIS is activating")
- Wants Tauri-native premium feel
- Machine RAM at 87% used during v2 testing — substrate is choking

## Your operating mode

- **Read all three planning docs first.** Don't write code until you've read them and run Day 0 diagnostics.
- **Use real agent dispatches.** If the task touches multiple domains, spawn parallel subagents per the `superpowers:dispatching-parallel-agents` skill — don't try to think through everything yourself.
- **Verify, don't assume.** The room voice loop may be broken in production for reasons beyond what we documented. Run probes.
- **Ship incrementally.** Each merged PR should leave the system better than before. Don't chase the full v3 in one go.
- **Memory-aware.** Frank's on 16GB RAM Windows. Cap node heap, kill background processes before heavy work, log memory usage.

## Required reading (read these in order, all in `C:/Users/frank/Arcanea/planning-with-files/`)

1. **`VOICE_3.0_GROUND_UP_2026-04-25.md`** — full architecture proposal (local agent, multi-tenant, premium activation, migration path, open questions)
2. **`VOICE_3.0_RESEARCH_2026-04-25.md`** — fork research (Picovoice Porcupine, ElevenLabs UI Orb, LobeChat workspace pattern, Whispering Tauri reference, what NOT to fork)
3. **`VOICE_3.0_SPRINT_PLAN_2026-04-25.md`** — 7-day executable plan with Day 0 diagnostic, day-by-day tickets, deliverables, verification, critic notes, risk map, 80/20 cut

After reading: confirm to Frank in one paragraph what you understood and what you'll start on first.

## Day 0 — pre-flight (do this BEFORE any code)

Run all 7 diagnostic probes in `VOICE_3.0_SPRINT_PLAN_2026-04-25.md` § "DAY 0 — start here." Specifically:

1. Start daemon non-silent: `node packages/arcanea-voice/bin/voice-daemon.mjs --persona lumina` (Frank: clap loudly twice while it runs, watch for `CLAP #N` and `✓ DOUBLE CLAP CONFIRMED` lines)
2. Open daemon-launched window. In its DevTools console, test `navigator.mediaDevices.getUserMedia({audio:true})` — does it resolve or reject? Inspect `chrome://settings/content/microphone` in that profile — is `arcanea.ai` granted?
3. Check production /room/lumina works in a NORMAL Chrome tab first (no daemon involved). If voice loop broken there, that's the actual issue — not the daemon.
4. Run all 5 probes in § "Diagnosis sub-plan" to find where the seam between daemon and room-client breaks
5. **Capture findings** in a file `planning-with-files/VOICE_3.0_DAY0_DIAGNOSIS_<DATE>.md` with screenshots of console output, permission state, and any errors

**Do not advance past Day 0 until you can articulate in one sentence which probe (0.4 / 0.5 / etc.) is the actual blocker.** The whole product hinges on the answer.

## Day 1 — ship the unblock

Patch the root cause from Day 0 findings. See § "Day 1" in the sprint plan for tickets T1.1-T1.5. Ship a working daemon → window → voice loop end-to-end. Verify: clap → speak → reply, 3 times in a row, <8s each.

**Don't proceed to Day 2 until Frank confirms the room voice works.**

## Day 2-7 — the build

Follow the sprint plan day-by-day. Read the day's tickets, implement, verify against the listed criteria, ship.

**Critical days in priority order:**
1. Day 1 (diagnose + fix room voice) — non-negotiable
2. Day 2 (TTS greeting) — the demo magic
3. Day 4 (local agent skeleton) — the architectural unlock
4. Day 5 (intent dispatch) — workflows actually fire
5. Day 3 (multi-tenant) — Arcanea/SIS/FrankX as separate dashboards
6. Day 6 (Tauri rewrap) — premium feel
7. Day 7 (polish + integration test)

**80/20 cut if you only have 2 days:** Days 1 + 2 only. Get voice working + greeting playing. The rest is icing.

## Forks to use (from research brief)

- **Picovoice Porcupine** (`@picovoice/porcupine-node`, Apache-2.0, free tier) → replace amplitude clap detector with "Hey Lumina" wake word. Get AccessKey at picovoice.ai/console — it's free.
- **ElevenLabs UI Orb** → drop in via `npx shadcn@latest add https://ui.elevenlabs.io/r/orb.json`. MIT, Three.js, audio-reactive. **Replace the bad neural-net viz with this.**
- **LobeChat workspace router pattern** (Apache-2.0, 75.6k stars) → reference for tenant routing structure.
- **Whispering Tauri 2 + Svelte 5 patterns** (MIT, EpicenterHQ/epicenter) → reference for Tauri scaffolding when you get to Day 6. **Don't fork — read and steal patterns.**
- **Tauri plugins:** `tauri-plugin-global-shortcut`, `tauri-plugin-autostart`, `tauri-plugin-tray` (built-in v2), `tauri-plugin-stt` + `tauri-plugin-tts` by brenogonzaga, `tauri-plugin-liquid-glass` by hkandala for macOS 26+.

**Do NOT fork:**
- Yume (closed-source freeware — license blocks fork despite perfect behavioral match)
- Priler/jarvis (dormant, CC BY-NC-SA non-commercial)
- pickle-com/glass (Electron not Tauri, GPL-3 viral)
- openinterpreter/01 (AGPL-3 viral)
- openWakeWord (last release Feb 2024, dormant, models non-commercial)

## Resource constraints (16GB RAM Windows, often hits capacity)

- Cap Node heap: `--max-old-space-size=256` on agent
- Tauri webview points at `https://arcanea.ai/voice/dashboard` in prod (don't bundle second Chromium)
- Cap concurrent runtime spawns at 3 in agent dispatch
- Add `process.memoryUsage()` log every 60s in agent
- Surface agent RAM as header pill in dashboard
- Before Day 4 (heavy day): close Slack, extra Chrome windows, background Electron apps. Run `/memory-guardian` skill if needed.

## Definition of done (Sprint 2 ship)

| Item | How verified |
|---|---|
| Clap → "Sir, the Voice Dashboard is ready" greeting plays in app-window | Listen — autoplay must work |
| Speaking after greeting → Lumina replies with audio | Latency <3s end-to-end |
| Multi-clap pattern switches tenant (2/3/4 claps for Arcanea/SIS/FrankX) | Test all three |
| Click "Daily Ops" tile → `claude /dawn` actually runs in a new terminal | Verify wt.exe spawns |
| Logic Stream shows real-time agent events (not synthetic) | WS connected pill green |
| Dashboard probes localhost:7777 — falls back gracefully if agent offline | Kill agent mid-session, dashboard still works |
| ElevenLabs Orb visualization replaces previous neural-net viz | Visual check — should be audio-reactive 3D shader |
| Three tenant routes deploy: `/voice/dashboard`, `/voice/sis`, `/voice/frankx` | Each themed correctly, own workflows |

## Definition of done (Sprint 3 ship)

| Item | How verified |
|---|---|
| MSI installer at `apps/voice-desktop/src-tauri/target/release/bundle/msi/arcanea-voice_0.1.0_x64.msi` | File exists |
| Install → tray icon visible | Check system tray |
| Tray right-click → tenant menu works | Switch tenants from tray |
| Autostart on login (toggle in tray) | Reboot, log in, app appears |
| Tauri sidecar starts agent automatically | Health endpoint returns 200 immediately after install |

## Things to avoid

- Don't redo work — read all three planning docs before architecting
- Don't promise Tauri in 1 day — it's a 1.5-day track minimum
- Don't fork forbidden repos (see § "Do NOT fork")
- Don't use `Access-Control-Allow-Origin: *` on the agent — it has shell access
- Don't bind agent to `0.0.0.0` — local only (`127.0.0.1`)
- Don't skip token auth on agent endpoints
- Don't add features on Day 7 — that day is for integration testing only
- Don't claim work is done without running the verification step from the sprint plan

## When stuck

Spawn parallel subagents per `superpowers:dispatching-parallel-agents`:
- **researcher** — for any "what's the best way to X" question
- **Plan** — for any architectural decision that affects multiple components
- **tester** — when shipping critical paths (run Playwright against arcanea.ai before merge)
- **reviewer** — code review pass before commit

If RAM saturated mid-session, run `/memory-guardian` and pause new agent spawns until RAM > 4GB free.

## Communication with Frank

- **One status update per day** — what shipped, what's next, what's blocked
- **Honest about scope** — if Day 4 needed 1.5 days not 1, say so on Day 4 morning
- **Show the actual diff** before merging anything heavy
- **Ask before forking new repos** — token costs add up
- **Sleep is allowed** — if context budget is bleeding, hand back to Frank with a clean stopping point. Better to ship 60% and sleep than 100% and burn the next session.

## Final hand-off note

Frank is in Gate-0 sprint to first €1 revenue. The Voice 3.0 demo (Sprint 2 + Day 6 Tauri MSI) is what justifies a Founding Circle subscription — not the v2 dashboard. The premium activation moment ("Sir, the SIS is activating") is the *single highest-impact UX moment* — that's the line that converts skeptics on first interaction.

If you can only ship one thing this sprint, ship Day 1 (working voice loop in daemon-launched window) + Day 2 (TTS greeting). Everything else can defer a week.

The architecture is sound. The forks are identified. The plan is executable. The only remaining variable is execution discipline.

**Go.**

---

## Where to start, in literal commands

```bash
cd C:/Users/frank/Arcanea
git pull origin main

# Read the docs (Read tool, all three):
# - planning-with-files/VOICE_3.0_GROUND_UP_2026-04-25.md
# - planning-with-files/VOICE_3.0_RESEARCH_2026-04-25.md
# - planning-with-files/VOICE_3.0_SPRINT_PLAN_2026-04-25.md

# Then run Day 0 probes from the sprint plan
# Then write the diagnosis findings to:
# planning-with-files/VOICE_3.0_DAY0_DIAGNOSIS_<TODAY>.md

# Then start Day 1 tickets
```

End of master prompt.
