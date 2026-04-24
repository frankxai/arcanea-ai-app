# Handover — Voice Runaway Fix + Cortex Visual Backlog (2026-04-21, late evening)

> **Writer:** Shinkami (Opus 4.7, 1M context)
> **Reader:** next agent/session — ZERO prior context assumed
> **Prior handovers this day (read for fuller picture, but this one stands alone):**
> - `HANDOVER-2026-04-21-AO-UNIFICATION.md` (`/ao` as meta-dispatcher)
> - `HANDOVER-2026-04-21-DEFENSE-LAYER.md` (canonical commands + guardrails)
> - `HANDOVER-2026-04-21-CORTEX-ROOM-HOTFIX.md` (Cortex scaffold + production room 404 hotfix)

## Situation

Arcanea voice room is live at `arcanea.ai/room/{persona}` AND locally via
`voice jarvis --local --app` (which starts a Node server on `:7777` and
opens a framed Chromium window). Production hotfix from earlier this
session confirmed working — Frank ran `voice jarvis --local --app` and
turn 1 completed end-to-end (STT 440ms, LLM 741ms, TTS 1041ms).

**Then turns 2+ came back with empty transcriptions** — the mic kept
recording for 11.7 seconds of mostly-silence, Whisper returned empty
text, server responded 502 "transcription returned nothing". Root cause
diagnosed, fix shipped to `main` this session (commit `69f54c38`).

Frank also asked to shelve two improvements into backlog for a future
session: (1) "true 3D neural network visualization" upgrade from the
current orb to an anatomical multi-region brain, and (2) webcam feed as
an additional input signal to the brain. Both are Cortex Phase 2/3 work
already specced in `CORTEX_SPRINT_PLAN_2026-04-21.md`, but need explicit
scope tickets.

## What's Done

### Voice runaway-recording fix (commit `69f54c38`, local on `main`, not pushed)

Files changed:
- `packages/arcanea-voice/web/client.mjs`
- `packages/arcanea-voice/src/server.mjs`

**Symptom reproduced from Frank's session logs:**
```
[VOICE] stt "Hello Jarvis, how are you?" (89911b, 440ms)
[VOICE] JARVIS   stt=440ms  llm=741ms  tts=1041ms  tools=none
[VOICE] transcribe empty (365401 bytes, 11702ms)
[VOICE] transcribe empty (227093 bytes, 4420ms)
```

**Root cause:** single VAD threshold (`rms > 0.035`). Any ambient room
noise above 0.035 continuously reset the silence counter to zero, so
recording never auto-stopped. User spoke for ~3s, but the mic kept
capturing for 11+ seconds of background noise. Whisper receives 11s of
mostly-silent audio and returns empty string ("no detectable speech").

**Fix shipped:**
1. **Two-threshold hysteresis** in `vadLoop()`:
   - `SPEECH_ON` at 0.035 (unchanged) triggers `hasSpoken`
   - `SPEECH_OFF` at 0.018 counts toward `vadSilent`
   - Dead zone `[0.018, 0.035]` holds current state — ambient noise no
     longer resets the silence counter
2. **Hard 12s recording cap** via `MAX_RECORD_MS` backstop. If VAD
   misbehaves under weird acoustics, recording stops anyway.
3. **Disambiguated server error** — when Whisper returns empty, message
   now tells the user whether cause was likely ambient noise (long
   recording) or silence (short recording).

Verified:
- `node packages/arcanea-voice/test/tools.test.mjs` → **14/14 PASS**
- `node packages/arcanea-voice/test/server.test.mjs` → **8/8 PASS**
- `node -c` syntax clean on both files

**NOT yet Frank-tested** — this handover is written after the commit
but before verification. Next action #1.

### Voice command truth table (final, correct)

| Command | Local server? | Points at | Auth source | Tool calling |
|---|---|---|---|---|
| `voice jarvis` | ❌ | hosted `arcanea.ai` (default browser) | BYOK in web settings panel | — |
| `voice jarvis --app` | ❌ | hosted `arcanea.ai` (Chromium frame) | BYOK in web settings panel | — |
| `voice jarvis --local` | ✅ :7777 | localhost (default browser) | `$GROQ_API_KEY` env | ✅ |
| **`voice jarvis --local --app`** | ✅ :7777 | localhost (Chromium frame) | env | **✅ this is what you want** |

`--app` alone does NOT start local server. User confusion point in this
session — guide now lives in `planning-with-files/LOCAL_APP_GUIDE_2026-04-21.md`.

Voice command globally linked at `C:\Users\frank\AppData\Roaming\npm\voice`
(via earlier `npm link` in the voice package).

## What's Not Done

### Not verified yet — requires Frank's follow-up

The voice fix is committed locally but:
- Not pushed to `origin/main`
- Not tested by Frank in real session
- Not gated by CI (no automated voice smoke test exists)

**If the fix regresses on Frank's mic:** lower the `SPEECH_OFF`
threshold further (0.018 → 0.012) or raise `MAX_RECORD_MS` (12 → 20).
The hysteresis pattern is correct; specific numbers may need tuning per
mic + room acoustics.

### Backlog items Frank explicitly requested for Cortex

**Ticket 1: True 3D neural-network visualization — anatomical upgrade**

Current state: `@arcanea/presence/LuminaOrb` is a 4096-particle sphere
with icosahedron core, torus halo, 256 satellites. Aesthetic: abstract
orb. Shader breakdown in `packages/presence/README.md`.

Target state (from `CORTEX_SPRINT_PLAN_2026-04-21.md` Phase 2):
- Photoreal anatomical brain mesh (Allen Brain Atlas reference glTF,
  ~200k polys after Blender decimation)
- 12 labeled regions: Prefrontal, Motor, Sensory, Visual, Auditory,
  Broca, Wernicke, Hippocampus, Amygdala, Cerebellum, Basal Ganglia,
  Thalamus
- Custom GLSL: subsurface scattering, fresnel rim, emissive flow per
  region, fractal-noise cortical folds
- Instanced neurons (~50k) spawned from the mesh surface + jittered
- SNN (spiking neural network) with STDP plasticity — 500 LIF neurons
  across regions, driven by `activations: Record<RegionId, number>`
- Aesthetic lock: 3D neural-network realism (Unreal Engine / Blade
  Runner 2049 / Arrival / Allen Brain Atlas). **Banned vocabulary in any
  generation prompt: anime, cel-shade, Ghibli, Akira, Edgerunners, manga,
  waifu.** Saved to memory `feedback_noosphere_aesthetic.md`.

Estimated: 3 days. Depends on: `@arcanea/presence` extraction flip
(Phase 0 Lane A — not yet executed). Reference assets: license check
Allen Brain Atlas CC-BY for redistribution.

**Ticket 2: Webcam feed as input signal**

Current state: voice-only. Mic → STT → LLM → TTS loop. No visual input.

Target state:
- Webcam stream → face/emotion detection (MediaPipe face landmarks or
  equivalent — lightweight, in-browser, no server upload)
- Valence/arousal vector (e.g. smile → positive valence, wide eyes →
  high arousal) injected into cortex region activations as Prefrontal
  (attention) + Amygdala (emotion) drive
- Privacy: keep stream local, never transmit
- Opt-in via settings panel toggle — off by default

Bonus rev: motion energy (from the existing `ArcaneanCortex.jsx`
Cowork sketch) is a cheap stand-in if MediaPipe is too heavy — global
motion-delta across frames mapped to Motor+Cerebellum drive. Zero deps.

Estimated: 2 days (with MediaPipe) or half a day (motion-energy stand-in).

### Phase 0 extraction flip (still deferred from earlier handover)

`packages/presence/src/*` duplicates `apps/web/components/presence/*`.
The flip that makes apps/web re-export from `@arcanea/presence` is
specced in `planning-with-files/LANE_A_CLAUDE_CODE_PROMPT_2026-04-21.md`
but not executed. **Do this BEFORE anyone edits either file**, otherwise
the two copies drift.

### Regression suite for `/room/*`

Not built. If you're serious about preventing the production 404 bug
class, a Playwright smoke test hitting all 7 persona URLs and asserting
title matches `"{Name} · Arcanea"` (not fallback `"Arcanea · Room"`)
would catch the server/client boundary bug that slipped through. See
previous handover's Next Actions #2 for rationale.

## Critical Context

### Production room is LIVE and VERIFIED

Earlier this session, PR #63 (commit `0c21434e`) fixed a Turbopack
client-boundary bug that made every `/room/<persona>` visit fall through
to `notFound()` — Server Component was importing `PERSONAS` from a
`'use client'` module and getting an empty object at server runtime.
Fix: extracted `PERSONAS` + `Persona` + `PersonaId` + `PERSONA_ORDER`
to `apps/web/app/room/[persona]/personas.ts` (no `'use client'`), both
page.tsx (server) and room-client.tsx (client) import from it.

Verified post-deploy via `curl`:
- `/room/lumina` → title `"Lumina · Arcanea"` ✅
- `/room/jarvis` → title `"JARVIS · Arcanea"` ✅
- Deployment: `dpl_Bunjzibv8bgpPpMPtvMVdK4DQdSU`, state READY, aliased
  to `www.arcanea.ai` + `arcanea.ai`

### Env vars expected at runtime

- `GROQ_API_KEY` — required for voice (transcription + LLM). Set in
  `$HOME/.arcanea/.env` or `apps/web/.env.local`. Verified present.
- `ELEVENLABS_API_KEY` — optional (premium TTS). Edge TTS fallback
  works offline. Verified present.
- `ARCANEA_VOICE_PORT` — default `7777`
- `ARCANEA_VOICE_LLM` — default `llama-3.3-70b-versatile`
- `ARCANEA_CLAUDE_BIN` — path to `claude` binary if not on PATH
- `LINEAR_API_KEY` — enables `linear_issue` voice tool

### Gotchas specific to this session

- **Two unpushed commits on `main`** as of this handover: `69f54c38`
  (voice fix) and the handover commit you're about to create. Remote
  head is `0c21434e`.
- **Pre-commit hook blocks >100 files or >5000 deletions** without
  `BIG-CHANGE:` tag. Installed via `scripts/install-hooks.sh` earlier
  today (see `HANDOVER-2026-04-21-DEFENSE-LAYER.md`).
- **Sacred paths** (pre-commit-protected): `.claude/commands/`,
  `.claude/agents/`, `.arcanea/`, `CLAUDE.md`, `CODEOWNERS`,
  `.githooks/`, `RECOVERY.md`. Deleting anything under these requires
  `SACRED-DELETE:` tag.
- **`.claude.json` self-corrupted once today at 12:15 UTC** (restored
  from `.claude/backups/.claude.json.backup.1776766419182`). If the next
  session hits "Configuration Error · Unexpected EOF", pick the newest
  ~39kB backup in `C:\Users\frank\.claude\backups\`. **Never pick the
  "Reset with default" option.**
- **16GB RAM machine**: max 4-5 concurrent Claude Code instances.
  Never run `pnpm dev` + `pnpm build` simultaneously. CLAUDE.md rule.
- **`allow_auto_merge` is now `true`** on `frankxai/arcanea-ai-app`
  (enabled today via `gh api -X PATCH`). Squash-only merge remains the
  only allowed method.

### Current working tree dirt

- `M .claude/settings.local.json` — harness state, not yours
- `M packages/arcanea-voice/bin/voice.mjs` — modified by `npm link`
- `M wiki/skills/README.md` — present on session start, not yours
- `?? .claude/agents/design-*.md` — sibling session's responsibility
- `?? .claude/commands/*.md` — sibling session's responsibility
- `?? forks/`, `?? .git-hygiene/` — out of scope
- `?? planning-with-files/CURRENT_*_2026-04-20.md` — weekly synthesis, not yours

## Next Actions (ordered)

1. **Frank verifies the voice fix.** Run:
   ```powershell
   voice jarvis --local --app
   ```
   Have a 3-turn conversation. If all 3 turns transcribe correctly:
   push `69f54c38` to origin/main. If turn 2+ still empty: see "If
   the fix regresses" above for tuning knobs.

2. **Push `main`.** Two commits ahead (voice fix + this handover).
   `git push origin main`.

3. **Open backlog tickets** for the two Cortex visual improvements
   Frank named this session. Suggested Linear project: Arcanea
   (`df23e16b-dd2c-40b1-a828-2ccdb6fa1701`). Epic them under "Cortex
   Phase 2" using the specs above — titles:
   - "Cortex: anatomical 12-region brain mesh (replace orb)"
   - "Cortex: webcam feed → valence/arousal → region activation"

4. **Add Playwright smoke test** for `/room/<persona>` titles. One
   `apps/web/tests/room-smoke.spec.ts` file, 7 URLs × assert title.
   Wire into existing CI. Prevents the 2026-04-21 404 bug class.

5. **Execute Phase 0 extraction flip** via the Lane A prompt at
   `planning-with-files/LANE_A_CLAUDE_CODE_PROMPT_2026-04-21.md`.
   Self-contained — paste into a fresh Claude Code session. After this,
   Phase 1 (`/cortex` route scaffold) can start.

6. **Retire `feat/author-council-2026-04-21`** remote branch —
   `git push origin --delete feat/author-council-2026-04-21`. Merged
   via PR #60 already.

## Files to Read First

- **`packages/arcanea-voice/web/client.mjs`** — where the voice fix
  landed. Look at `vadLoop()` for the hysteresis + hard cap. This is
  the file you'd tune if mic acoustics vary.
- **`packages/arcanea-voice/src/server.mjs`** — `/api/converse`
  endpoint, updated error message. Audio → Whisper → LLM → TTS pipeline.
- **`packages/arcanea-voice/src/transcribe.mjs`** — Groq Whisper call.
  Rejects text < 4 chars. Falls back to local faster-whisper / openai
  whisper if Groq fails.
- **`apps/web/app/room/[persona]/personas.ts`** — the server-safe
  module the earlier hotfix added. Pattern to replicate if you ever
  need to share a const between server + `'use client'` components.
- **`planning-with-files/CURRENT_STATE_2026-04-21_CORTEX.md`** —
  ground-truth product state (Arcanea Cortex = The Living Second Brain).
- **`planning-with-files/CORTEX_SPRINT_PLAN_2026-04-21.md`** — full
  Phase 0–5 plan. The two backlog items above are Phase 2.
- **`planning-with-files/LANE_A_CLAUDE_CODE_PROMPT_2026-04-21.md`** —
  paste-ready next-session prompt.
- **`planning-with-files/LOCAL_APP_GUIDE_2026-04-21.md`** — local vs
  hosted truth table + env key docs.
- **`docs/ops/HANDOVER-2026-04-21-CORTEX-ROOM-HOTFIX.md`** — sibling
  handover from earlier this session. Has full repo map + memory
  relevance table. Don't duplicate — pair with this one.

## Repo Map

| Path | Purpose | State 2026-04-21 |
|---|---|---|
| `apps/web/` | Next.js 16 Turbopack, production `arcanea.ai` | **LIVE, verified** |
| `apps/web/app/room/[persona]/` | 7-persona voice rooms, BYOK | **LIVE, all 7 personas working** |
| `packages/arcanea-voice/` | Local voice CLI + :7777 server + 6 tools | **FIX APPLIED (unpushed)** |
| `packages/presence/` | `@arcanea/presence` primitives (dormant) | Shipped, awaits extraction flip |
| `packages/design-system/` | `@arcanea/design-system` v0.3.0 | Live (5 primitives + Lighthouse CI) |
| `packages/orchestrator/` | `@arcanea/orchestrator` v1.2.1 on npm | Live |
| `packages/author-council/` | 10-author council, MCP, slash commands | Live |
| `.arcanea/` | Intelligence substrate | Sacred path, pre-commit-protected |
| `.claude/commands/` | Slash commands (`/lumina`, `/arcanea`, `/superintelligence` restored today) | Sacred, pre-commit-protected |
| `.githooks/` | pre-commit + pre-push guardrails | Installed |
| `.github/workflows/` | CI, guardian PR check, restore-from-incident, daily snapshot | Live |
| `planning-with-files/` | Ground truth + sprint plans + Lane A prompt + local-app guide | Current as of today |
| `docs/ops/HANDOVER-2026-04-21-*.md` | Four handovers from today — READ ALL FOUR for full picture | This = latest |
| `book/forge-of-ruin/` | First Open Library book, Ch.1 council-audited | Live |

## Memory Relevance

Already indexed in `~/.claude/projects/C--Users-frank-Arcanea/memory/MEMORY.md`,
most relevant to the next agent's work:

- `feedback_noosphere_aesthetic.md` — **3D neural-net realism, NOT anime**
  (governs the Cortex backlog items from this session)
- `project_noosphere_ground_truth_2026_04_21.md` — what's real vs vapor
- `feedback_always_verify_live.md` — MUST verify runtime, not just 200 status
- `feedback_ship_means_ship.md` — commit + push + deployed, not just built
- `feedback_cached_belief_validation.md` — read disk before citing
- `feedback_mass_revert_protection.md` — always check diff scope
- `feedback_design_tier.md` — April 2026 top-tier design bar
- `feedback_design_taste.md` — Geist + Instrument Serif, no Cinzel
- `feedback_hz_identity.md` — frequencies backend-only, never UI-exposed
- `feedback_yolo_mode.md` — `cla` launcher uses `--dangerously-skip-permissions`
- `feedback_session_protocol.md` — read `.arcanea/MASTER_PLAN.md` first

## Open PRs / Branches

- PR #60 — MERGED (`a46cb671`) — Cortex scaffold + author-council + defense
- PR #63 — MERGED (`0c21434e`) — room PERSONAS hotfix
- Local commits ahead of origin: `69f54c38` (voice fix) + this handover
- `feat/author-council-2026-04-21` — remote branch still exists, safe to delete
- Dependabot fleet (#52, #53, #54, #55, #56, #61, #62) — check `gh pr list`

## Contact

- User email: `friemerx@gmail.com`
- Repo: `frankxai/arcanea-ai-app` (production, `main`)
- Team: `starlight-intelligence` · `team_q6LNT6rnFRlqlcjBJ2Wxz6PE`
- Vercel project: `prj_bg70JJwiuYTOyP1oX2ddiatX1O95`
- Package manager: **pnpm only**, Node 20.x via `.nvmrc`
