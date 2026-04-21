# Current State — 2026-04-21 Arcanea Cortex / Voice / Lumina Visualization

> Ground-truth audit triggered by `/ao take massive action` on Arcanea Voice,
> Jarvis, Lumina visualization. Supersedes the 2026-04-21 Cowork session claims
> about ArcaneanCortex.jsx, ArcaneanOrchestrator.jsx, gateway.v2.ts,
> SPRINT_NIGHT.md, and anime-design-system.md — **those files live only in the
> Cowork sandbox, not in this repo.**
>
> **Product name (locked 2026-04-21):** **Arcanea Cortex** — *The Living Second Brain.*
> Route: `/cortex`. Packages: `@arcanea/presence` (extracted primitives),
> `@arcanea/cortex` (future app-level composition). Prior working name
> "Noosphere" is deprecated — too abstract. Cortex is the actual thing.

## TL;DR

Arcanea Voice + Lumina presence is significantly more mature than the Cowork
session implied. The brain-viz concept is vapor inside this repo — zero files
committed. The real gap is not "start from scratch" but "extract the shipped
presence layer into a package and compose it into a dedicated Cortex surface."
And the aesthetic direction was wrong: it is **3D neural-network realism
(Unreal Engine / Blade Runner 2049 / Arrival / Allen Brain Atlas)** — NOT
anime. Frank corrected this in the `/ao` prompt.

Gate 0 constraint: 9 days to deadline (2026-04-30). GenCreator.ai is 2 days
overdue. Revenue is €0. Arcanea Cortex is strategic theater, not tactical
revenue — run it as a parallel night sprint without stealing GenCreator cycles.

## What's real (verified via direct Read, 2026-04-21)

### Lumina visualization — production-grade

`apps/web/components/presence/lumina-orb.tsx` · **482 lines**

- 4 GLSL shader programs:
  - **Main particle shell** — 4096 points on unit sphere, noise-displaced radius,
    per-seed hash-jitter, amplitude + low + high + chaos + inhale uniforms,
    additive blending, per-vertex rim factor.
  - **Icosahedron core** (subdivision 4) — fresnel + amp-driven glow.
  - **Torus halo** — 220-segment ring, angle-shimmer, visible only in `speaking`.
  - **Satellite points** — 256 orbiting flecks, tilted plane, per-seed spin.
- State machine: `listening | thinking | speaking` with per-state `{ radius,
  chaos, spin, baseAmp, pulseFreq }` configs, lerped uniforms (dt-relative).
- Bloom: same geometry at 1.22× scale, 0.35 opacity — cheap DIY glow instead of
  post-processing.
- Resize-observed, high-DPI (max 2×), proper THREE disposal on unmount.

`apps/web/components/presence/lumina-presence.tsx`

- Wraps `LuminaOrb` + `useAudioAnalyser`.
- **Sticky-mount policy**: once activated, WebGL context stays alive for the
  component's lifetime. Fix introduced in commit `49fd3520 fix(voice):
  root-cause "nothing heard" + shaky orb + --app mode`. Rapid state flips no
  longer tear down the renderer.
- Opacity-driven visibility, AnimatePresence labels.

`apps/web/components/presence/use-audio-analyser.ts`

- `{ amplitude, low, high }` snapshot ref — drives orb uniforms every frame.
- Works from `MediaStream` (mic) OR `HTMLAudioElement` (TTS playback).

### Arcanea Voice — full CLI

`packages/arcanea-voice/` · publishable package

- `bin/voice.mjs` — commands: `voice jarvis | lumina | draconia | lyria |
  alera | shinkami | nero | presence`.
- `src/server.mjs` — local Node server on `:7777`, served room UI.
- `src/tools.mjs` — 6 tools the LLM can chain up to 4 rounds per turn:
  `shell_run` (whitelisted, 10s timeout, 4KB stdout cap), `file_write`
  ($HOME/cwd scoped), `claude_prompt` (clipboard + inbox), `claude_code_launch`
  (hands-free — spawns `claude --dangerously-skip-permissions`), `open_url`,
  `linear_issue`.
- `src/persona.mjs` + `src/transcribe.mjs` — persona config + Groq Whisper STT.
- `--app` Chromium mode for framed desktop experience.
- Env: `GROQ_API_KEY` (required), `ELEVENLABS_API_KEY` (optional, Edge TTS
  fallback), `ARCANEA_VOICE_LLM` (default `llama-3.3-70b-versatile`),
  `ARCANEA_VOICE_PORT`, `ARCANEA_CLAUDE_BIN`, `LINEAR_API_KEY`.
- Prior commits: `c4e0dec9 feat(voice): barge-in + VAD tune + latency
  instrumentation + integration tests`, `bc2e2533 fix(voice): wire voice
  jarvis dispatch from PS shim to Node presence CLI`, `a58a8c0e fix(voice):
  PS parse error from UTF-8 em-dash`.

### Jarvis — shipped persona + CLI binding

- `apps/web/app/room/jarvis` (via `[persona]` dynamic route) — persona defined
  in `room-client.tsx` PERSONAS map: cyan/white, tagline "Just A Rather Very
  Intelligent System", voiceKey `alera`, temperature 0.35, concise prompt.
- `voice jarvis` CLI dispatches through PowerShell shim → Node presence CLI
  (bc2e2533 wiring).

### Room route — 7 personas, BYOK, hosted

`apps/web/app/room/[persona]/`

- `page.tsx` — uses `generateStaticParams` from PERSONAS, calls `notFound()`
  for unknown ids, wraps `RoomClient`.
- `room-client.tsx` — PERSONAS map for `jarvis | lumina | draconia | lyria |
  alera | shinkami | nero`.
- `browser-voice.ts` — BYOK localStorage for Groq + ElevenLabs keys, Whisper
  transcription, ElevenLabs voice IDs per persona, SSR-safe.
- `settings-panel.tsx` — BYOK key entry UI.
- **Per CURRENT_STATE_2026-04-20.md, lines 34–35**: Presence Room is LIVE at
  `arcanea.ai/room/{persona}`, BYOK, multi-round tool chaining, VAD tuned.

## What's NOT real (Cowork-only, not in repo)

- `ArcaneanCortex.jsx` — 120 LIF neurons + STDP plasticity simulation —
  **does not exist in `C:\Users\frank\Arcanea`** (searched).
- `ArcaneanOrchestrator.jsx` — control-room viz — **does not exist.**
- `gateway.v2.ts` — unified BYOK gateway with sub-CLI spawning — **does not
  exist.** Routing currently lives inside `@arcanea/router-spec` v1.0.2 (npm)
  and is invoked per-surface.
- `SPRINT_NIGHT.md` — 4-lane dispatch plan — **does not exist.**
- `anime-design-system.md` — **does not exist and would be wrong anyway**
  (aesthetic correction below).
- `@arcanea/presence` extracted package — **not done.** Files still live in
  `apps/web/components/presence/`.
- `apps/noosphere` — **no app scaffolded.**

## What's NOT built that we actually want

Zero of the ambitious vision elements from the Cowork session exist in code:

- **No anatomical brain mesh.** Current orb is a spherical particle cloud. No
  Allen Brain Atlas glTF import, no 12-region cortex, no subsurface scattering.
- **No domain nebulas.** The 16-domain mantle concept (Creator / Business /
  Career / Wealth / Health / Relationships / Development / Agentic Systems /
  Memory / Prompt Eng / Software Eng / SDLC / Content / Orgs / Philanthropy /
  Research) is entirely unimplemented. No ingestion from Notion, Obsidian,
  Linear, SIS vaults.
- **No superintelligence halo.** No Gaussian splat outer ring.
- **No event bus.** No `wss://orchestrator.arcanea.ai/bus`. No per-token
  emissions. No `.bus/events.jsonl`.
- **No 12-Luminor orbital composition.** One orb, rendered per-persona.
- **No cortex ↔ event-bus binding.** No region-activates-on-intent loop.

## Aesthetic correction (important — supersedes prior direction)

Frank's `/ao` prompt (2026-04-21): "consider in my prompt there i made mistake
reference Anime this visualization is 3D neural network not anime more unreal
engine or other top design approach."

**Direction locked:**

- **3D neural-network realism.** Photoreal anatomical brain mesh (Allen Brain
  Atlas / MRI-derived glTF), subsurface scattering for tissue, emissive
  propagation for neural activation, volumetric god-rays.
- **References:** Blade Runner 2049 god-light, Arrival heptapod logograms &
  editorial scale, Kubrick 2001 monolith framing, Allen Brain Atlas scientific
  meshes, top-tier medical visualization (e.g., Drew Berry, Dr. D. Bolinsky).
- **Banned vocabulary** in any Noosphere / Cortex / brain-viz prompt from
  here forward: `anime`, `cel-shade`, `Ghibli`, `Akira`, `Edgerunners`,
  `waifu`, `manga`. These were a slip-of-fingers in the original Cowork
  prompt — not the intent.
- **Three.js stays the stack** — Unreal Pixel Streaming is the wrong
  instrument ($2/hr/viewer GPU, fragmented interactivity, dep hell). Close the
  85% fidelity gap via:
  - `three` r162 + custom GLSL (subsurface + fresnel + fractal-noise cortical
    folding + emissive flow).
  - Post stack: `UnrealBloomPass`, `SSAOPass`, `SMAAPass`, `BokehPass` (DOF),
    chromatic aberration, film grain.
  - Instanced meshes for ~100k neurons (GPU-side, one draw call).
  - **Gaussian splats** for the halo ring — this is the lever that buys
    Kubrick/2049 god-light that polygons alone cannot.
  - `@react-three/fiber` + `@react-three/drei` for composition reactivity
    (domain clusters ingesting live Notion updates).

## Repos — what's locally installed & wired

- `apps/web/` — primary Next.js 16 app, Lumina orb + room route + voice lives here.
- `apps/web/components/presence/` — to be extracted into `@arcanea/presence`.
- `packages/arcanea-voice/` — standalone CLI + local server.
- `packages/arcanea-design-preset.js` — design tokens.
- `packages/design-system/` — `@arcanea/design-system` v0.3.0, 5 primitives +
  Lighthouse CI.
- `packages/orchestrator/` — `@arcanea/orchestrator` v1.2.1 (npm, adaptive
  routing + 3 workflow templates + `/arco`).
- `packages/router-spec/` *(inferred from CURRENT_STATE_2026-04-20)* —
  `@arcanea/router-spec` v1.0.2 (npm, 14 models, 16 tasks, 7 surfaces).
- `packages/agent-bus/` — **EXISTS** (potential foundation for the Noosphere
  event bus — needs inspection before assuming).

## Non-negotiable constraints

- **Gate 0 deadline 2026-04-30 (9 days).** GenCreator.ai cutover is still the
  #1 priority. Noosphere is a night-sprint / parallel track, not a substitute.
- **16GB RAM machine.** Per `CLAUDE.md`: max 4–5 concurrent Claude Code
  instances. Never run `pnpm dev` and `pnpm build` simultaneously. Kill dev
  servers after use.
- **pnpm only.** `apps/web` built via `pnpm --dir apps/web run build`.
- **Never regress `lumina-orb.tsx`.** It's shipped, tuned, and anti-shake-fixed.
  Extract via re-export, do not rewrite.
- **No "anime" vocabulary** in any downstream generation prompt.

## Memory changes written by this session

- `feedback_noosphere_aesthetic.md` — 3D neural network, NOT anime.
- `project_noosphere_ground_truth_2026_04_21.md` — what's real vs. vapor.
- (existing) `project_arcanea_noosphere.md` — to be revised, `anime` refs
  need purging on next touch.

## Next authoritative doc

`NOOSPHERE_SPRINT_PLAN_2026-04-21.md` — corrected sprint plan with workable
lane prompts for Claude Code / Codex / Gemini / OpenCode, sequenced against
Gate 0.
