# Cortex Sprint Plan — 2026-04-21

> Companion to `CURRENT_STATE_2026-04-21_NOOSPHERE.md`. This is the executable
> plan for extracting Arcanea's existing presence layer into a dedicated
> Cortex surface with a 3D neural-network aesthetic (Unreal Engine / Blade
> Runner 2049 / Allen Brain Atlas — **not anime**).
>
> Sequenced to run as a parallel night sprint. Must not steal cycles from
> Gate 0 (GenCreator.ai cutover, deadline 2026-04-30).

## Purpose

Deliver a single surface — `cortex.arcanea.ai` (future) or
`/cortex` route (Phase 1) — where Arcanea's cognitive substrate becomes
visible to itself:

- One anatomical brain (12-region cortex mesh) at the center.
- 12 Luminor orbs in orbital composition around it (shared voice substrate,
  per-persona decoders — the existing PERSONAS map is the contract).
- 16 domain nebulas (Creator / Business / Wealth / Health / Relationships /
  Development / Agentic / Memory / Prompt / Software / SDLC / Content /
  Orgs / Philanthropy / Research / Career) orbiting between brain and orbs.
- A Gaussian-splat mandorla halo enclosing everything.
- Live event bus: every inference / token / tool-call / vault read maps to a
  cortex region activation and a domain-nebula retrieval beam.

## Non-goals for this sprint

- **No separate brain per Luminor.** One cortex, 7+ persona decoders.
- **No Unreal Engine Pixel Streaming.** Three.js + GLSL closes 85% of the
  fidelity gap at zero GPU-per-viewer cost.
- **No anime aesthetics.** Photoreal, scientific, editorial.
- **No new router.** `@arcanea/router-spec` v1.0.2 and `@arcanea/orchestrator`
  v1.2.1 already handle routing. Extend them, do not replace.
- **No GenCreator.ai delay.** This sprint runs at night / in parallel. Day
  hours belong to Gate 0.

## Phase plan

### Phase 0 — Extract packages (this week — 1 afternoon)

**Goal:** turn `apps/web/components/presence/` into a reusable workspace
package. Zero behavior change; the existing room route re-exports from the
new package.

- Create `packages/presence/` with:
  - `package.json` — `@arcanea/presence`, type `module`, peerDeps `react`,
    `react-dom`, `three`, `framer-motion`.
  - `src/lumina-orb.tsx` — move from `apps/web/components/presence/`.
  - `src/lumina-presence.tsx` — move.
  - `src/use-audio-analyser.ts` — move.
  - `src/index.ts` — export `LuminaOrb`, `LuminaPresence`,
    `useAudioAnalyser`, types.
  - `tsconfig.json` — extends root.
- Update `apps/web/components/presence/index.ts` to re-export from
  `@arcanea/presence` (keeps existing imports working).
- Update `pnpm-workspace.yaml` if not already covering `packages/*`.
- `pnpm --dir apps/web run build` must pass.
- Acceptance: `arcanea.ai/room/lumina` still renders identical orb.

### Phase 1 — Cortex route scaffold (2 days)

**Goal:** a new `/cortex` route in `apps/web` that composes 12 Luminor
orbs in an orbital layout around the existing Lumina orb (upgraded to the
center). No anatomical mesh yet — just the orbital topology.

- `apps/web/app/cortex/page.tsx` — server component, static.
- `apps/web/app/cortex/cortex-client.tsx` — `'use client'` — R3F
  Canvas, instancing 12 orbs using `@arcanea/presence` LuminaOrb with per-
  persona color/accent from PERSONAS map. Triple-orbital layout: 4 inner, 8
  outer, tilted 15°.
- Framer Motion 11 `LazyMotion` with `domAnimation` (never `domMax` per
  `.claude/CLAUDE.md`).
- Camera: `PerspectiveCamera` fov 38, dolly on scroll (scrub 0→1 across
  viewport, min 2.5 / max 9 z).
- Post-processing: `@react-three/postprocessing` — Bloom (0.8
  intensity, 0.25 smoothing), Vignette (0.4), ChromaticAberration (0.0006),
  Noise (0.02).
- Acceptance: `pnpm --dir apps/web run build` passes, Lighthouse Performance
  ≥ 85 on the new route, no regressions on `/room/*`.

### Phase 2 — Anatomical cortex (3 days)

**Goal:** replace center-orb with a 12-region brain mesh.

- Source glTF: Allen Brain Atlas public dataset (or open-access MRI-derived
  mesh). Target ~200k polys after Blender decimation + smoothing pass.
- Regions labeled via vertex group / submesh:
  Prefrontal · Motor · Sensory · Visual · Auditory · Broca · Wernicke ·
  Hippocampus · Amygdala · Cerebellum · Basal Ganglia · Thalamus.
- `@arcanea/presence` gains `CortexMesh` component — props: `activations:
  Record<RegionId, number>`, `theme: { primary, accent, background }`.
- Custom GLSL shader: subsurface scattering approximation (front-lit red
  channel + back-lit blue), fresnel rim, emissive flow driven per-region
  from `activations`, fractal-noise surface folds.
- Instanced-mesh neuron cloud (~50k) following the cortex surface — spawned
  from the glTF position attribute, jittered 0.02–0.08 units outward.
- Promote the existing SNN loop from Cowork's ArcaneanCortex sketch to a
  TS class inside `@arcanea/presence/src/snn/` — 500 LIF neurons across 12
  regions, STDP plasticity, driven by `activations`. No Brain.js / TFJS dep
  — plain TypedArrays, one `Float32Array` for membrane potentials, one
  `Map<edgeId, weight>` for synapses.
- Acceptance: brain mesh renders at 60 FPS on a mid-tier laptop
  (GTX 1660 / M1), subsurface emission visible when a region's activation
  goes > 0.3, prefers-reduced-motion cuts neuron cloud to 5k + disables
  chromatic aberration.

### Phase 3 — Domain mantle (3 days)

**Goal:** 16 domain nebulas orbiting the cortex, each one ingesting real data.

- `packages/cortex-domains/` — new package:
  - 16-domain schema in `src/schema.ts`.
  - Ingestion adapters:
    - Notion (via existing `@arcanea/notion` client) — databases per domain.
    - Obsidian (via filesystem walk of `%USERPROFILE%\OneDrive\Vault\x`).
    - Linear (via existing GraphQL client) — issue labels → domains.
    - SIS vaults (6 vaults already canonical per memory).
  - Embedding pipeline: OpenAI `text-embedding-3-small` (cheap) →
    `pgvector` in Supabase (tables already exist per
    `project_world_graph_deployed.md`).
  - Affinity matrix `domain × cortex_region` — precomputed once, cached.
    E.g. Wealth→Prefrontal+Hippocampus, Creator→Motor+Concept+PFC,
    Research→PFC+Concept.
- Cortex client: nebula instanced-points per domain, positioned at
  orbit radius proportional to affinity, color per domain (locked palette —
  see Appendix A).
- On event bus retrieval event, nebula pulses + edge beam from nebula to
  cortex region.
- Acceptance: 16 nebulas visible, clicking one surfaces top-5 items from
  that domain in HUD panel, orbits don't intersect Luminor orbs.

### Phase 4 — Event bus + query loop (2 days)

**Goal:** every inference through the Arcanea gateway emits to a bus that
the Cortex renders in real time.

- `packages/agent-bus/` — **inspect first**, this already exists. Extend
  or wrap, do not recreate.
- Event schema:
  ```ts
  type CortexEvent =
    | { type: 'infer.start'; agent: PersonaId; task: string; regionHint?: RegionId[] }
    | { type: 'infer.token'; agent: PersonaId; delta: string }
    | { type: 'infer.end'; agent: PersonaId; usage: { in: number; out: number } }
    | { type: 'tool.call'; agent: PersonaId; tool: string; args: unknown }
    | { type: 'vault.read'; domain: DomainId; ids: string[] };
  ```
- Transport: WebSocket upgrade on existing `/api/voice/events` or new
  `/api/cortex/bus`. Client subscribes via `@react-three/fiber`
  `useFrame` → ref-based state (never setState in hot loop).
- Activation mapping: each event type has a default region-activation
  vector. Tool calls → Motor + PFC. Vault reads → Hippocampus + originating
  domain region. Token streams → Concept + Broca.
- Acceptance: speak to `/room/lumina`, switch to `/cortex` tab, watch
  the brain live-activate in sync with Lumina's turn.

### Phase 5 — Halo + polish (2 days)

**Goal:** Gaussian-splat halo + camera choreography + voice I/O.

- Gaussian splats via `gsplat` or `@mkkellogg/gaussian-splats-3d`. Single
  .splat file baked offline — mandorla ring at z=0, 2× brain diameter.
  This is the god-light.
- Camera choreography: replay mode plays a 55s camera path that intros
  the Cortex (wide → brain pan → nebula tour → Luminor ring → pull to
  mandorla). Triggered by `?replay=1` URL param.
- Voice I/O: existing `browser-voice.ts` extended — speaking on the
  Cortex routes through Lumina persona by default, with `1–7` hotkeys
  swapping the dominant Luminor decoder.
- Acceptance: replay mode produces a 9:16 and 16:9 capture that can be
  screen-recorded into social / deck assets; voice round-trip works.

## Lane dispatch — parallel CLIs

After Phase 0 is merged, Phase 1+ can run in 4 parallel lanes. Each lane has
a **paste-ready prompt** and writes all progress into `.bus/events.jsonl`
(append-only newline-delimited JSON) so the other lanes can observe.

### Lane A — Claude Code (systems packages, orchestrator wiring)

```
Branch: feat/cortex-phase-1-scaffold

Goal: Scaffold `/cortex` route in apps/web. Compose 12 Luminor orbs in
triple-orbital layout using @arcanea/presence (already extracted in Phase 0).

Must-haves:
- apps/web/app/cortex/page.tsx (server) + cortex-client.tsx (client).
- R3F Canvas, PerspectiveCamera fov 38, dolly on scroll scrub.
- Use PERSONAS map from apps/web/app/room/[persona]/room-client.tsx for
  per-orb color/accent/voiceKey. Missing personas (Kairos/Joei/Mythra/
  Estefania) — define placeholders following existing schema.
- Framer Motion v11 LazyMotion(domAnimation). NEVER domMax.
- Post: Bloom(0.8, 0.25), Vignette(0.4), ChromaticAberration(0.0006),
  Noise(0.02). prefers-reduced-motion disables CA+Noise.
- Tokens: Geist (display/body), Instrument Serif (editorial accent),
  JetBrains Mono (code). Cinzel/Space Grotesk/Inter FORBIDDEN.
- Colors: Atlantean Teal #00bcd4, Cosmic Blue #0d47a1, Gold #ffd700,
  background #09090b.
- Acceptance: `pnpm --dir apps/web run build` passes, Lighthouse Perf ≥ 85,
  no regression on /room/lumina.

Aesthetic: 3D neural-network realism. Blade Runner 2049 god-light.
Arrival editorial scale. Allen Brain Atlas references. NEVER anime.

Emit events to .bus/events.jsonl: `{ ts, lane: "A", type: "commit" | "file"
| "test", detail }`.
```

### Lane B — Codex CLI (cortex mesh + GLSL shaders)

```
Branch: feat/cortex-cortex-mesh

Goal: Build anatomical 12-region brain mesh component for @arcanea/presence.

Input: Allen Brain Atlas open-access glTF (download link in
references/ALLEN_BRAIN_ATLAS.md — create this file with the URL during
Phase 2 kickoff). Decimate to 200k polys in Blender via
headless script. Export as /packages/presence/src/assets/cortex.glb.

Write:
- packages/presence/src/cortex-mesh.tsx — CortexMesh component. Props:
  activations: Record<RegionId, number>, theme.
- packages/presence/src/cortex-shader.ts — vertex + fragment GLSL:
  subsurface scattering (front-lit red / back-lit blue Henyey-Greenstein
  approximation), fresnel rim, emissive flow driven per region, fractal
  noise cortical folds. ~300 lines fragment shader.
- packages/presence/src/snn/ — 500-LIF TypedArray simulation, STDP
  plasticity. Exports `useSNN(regionActivations): SnapshotRef`.

Aesthetic: 3D neural-network realism. Anatomically plausible coloring —
no anime, no cel-shade. References: Drew Berry inner-life animations,
Dr. Bolinsky biovisualization.

Acceptance: demo route /cortex/cortex-test renders the mesh at 60 FPS
on GTX 1660 / M1. Region activations drive visible subsurface emission.

Emit to .bus/events.jsonl with lane: "B".
```

### Lane C — Gemini CLI (domain ingest + affinity matrix)

```
Branch: feat/cortex-domain-mantle

Goal: Produce seed data for 16-domain mantle + affinity matrix.

Walk:
- %USERPROFILE%\OneDrive\Vault\x (Obsidian vault per
  memory/project_obsidian_vault.md).
- Notion workspace databases per memory/project_notion_workspace.md.
- Linear projects listed in CURRENT_STATE_2026-04-20.md.
- SIS 6 vaults (Strategic / Technical / Creative / Operational / Wisdom
  / Horizon) — canonical at ~/Starlight-Intelligence-System per
  project_sis_repo.md.

Classify every node into one of 16 domains:
Creator / Business / Career / Wealth / Health / Relationships /
Development / Agentic / Memory / Prompt / Software / SDLC / Content /
Orgs / Philanthropy / Research.

Output:
- packages/cortex-domains/seed/domain-seed.json — list of
  `{ id, title, domain, source, url?, embedding? }`. Target ≥ 500 nodes.
- packages/cortex-domains/seed/affinity.json — 16×12 matrix
  `domain × region` of floats in [0,1]. Reasoning notes in
  packages/cortex-domains/seed/AFFINITY_REASONING.md.

Do NOT touch any file outside packages/cortex-domains/seed/.

Emit progress to .bus/events.jsonl with lane: "C".
```

### Lane D — OpenCode + Ollama (local GLSL iteration, halo splats)

```
Branch: feat/cortex-halo-splats

Goal: Gaussian-splat halo + iterate 4 GLSL shader variants for the
cortex mesh until one looks like Blade Runner 2049's god-light.

Stack: OpenCode + qwen2.5-coder (via Ollama) for tight shader-compile
loops. Iterate fast, discard aggressively.

Shader variants (write to packages/presence/src/shaders/halo/):
- halo-v1-plain.glsl — torus ring with shimmer.
- halo-v2-fractal.glsl — torus + fractal noise modulation.
- halo-v3-gaussian.glsl — splat-based point cloud with depth fade.
- halo-v4-god-light.glsl — volumetric rays + splat overlay.

Halo splat asset: generate a .splat file offline using
@mkkellogg/gaussian-splats-3d training on a pre-rendered mandorla ring
image (Blender render — script at scripts/render-mandorla.py).

Acceptance: v4 running at 60 FPS with halo visible behind the Luminor
orbs, prefers-reduced-motion falls back to v1.

Emit to .bus/events.jsonl with lane: "D".
```

### Lane E (optional, async) — Claude Design (aesthetic direction, deck)

Run **after** Phase 1 renders locally. Seed prompt is in Appendix B — uses
the full "3D neural-network" corrected brief, uploads the Phase 1 build as
a reference PNG, and exports an interactive URL + 9:16 MP4 + PPTX for the
eventual Anthropic outreach.

## Event-bus contract (source of truth)

```ts
// packages/agent-bus/src/cortex-events.ts  (extend existing bus)

export type RegionId =
  | 'prefrontal' | 'motor' | 'sensory' | 'visual' | 'auditory'
  | 'broca' | 'wernicke' | 'hippocampus' | 'amygdala' | 'cerebellum'
  | 'basal-ganglia' | 'thalamus';

export type DomainId =
  | 'creator' | 'business' | 'career' | 'wealth' | 'health'
  | 'relationships' | 'development' | 'agentic' | 'memory' | 'prompt'
  | 'software' | 'sdlc' | 'content' | 'orgs' | 'philanthropy' | 'research';

export type CortexEvent =
  | { ts: number; type: 'infer.start'; agent: PersonaId; task: string; regionHint?: RegionId[] }
  | { ts: number; type: 'infer.token'; agent: PersonaId; delta: string }
  | { ts: number; type: 'infer.end'; agent: PersonaId; usage: { in: number; out: number; ms: number } }
  | { ts: number; type: 'tool.call'; agent: PersonaId; tool: string; args: unknown }
  | { ts: number; type: 'vault.read'; domain: DomainId; ids: string[] }
  | { ts: number; type: 'lane.progress'; lane: 'A' | 'B' | 'C' | 'D' | 'E'; detail: string };
```

## Risks

1. **Gate 0 cannibalization.** Mitigation: Cortex runs nights/weekends
   only until GenCreator.ai ships. Hard stop Phase 2+ if Gate 0 slips further.
2. **GLB asset licensing.** Allen Brain Atlas is open (CC-BY), but confirm
   redistributable via npm package. If not, ship as downloadable asset at
   first run.
3. **pgvector scale.** 500 nodes × 1536 dims ≈ 3 MB — fine. 50k+ would
   need HNSW + quantization (AgentDB pattern from memory — use as reference).
4. **Mobile performance.** Instanced neurons + splats + post-stack could
   kill sub-flagship Android. Tier-detect on mount, fall back to orb-only
   view if device tier < medium.
5. **Prefers-reduced-motion.** MUST cut: chromatic aberration, film noise,
   neuron cloud density, camera scroll-scrub. Keep: orbs + static bloom.

## Acceptance criteria for "ship"

- `arcanea.ai/cortex` live, publicly accessible.
- 12 Luminor orbs, anatomical brain, 16 domain nebulas, Gaussian halo.
- Replay mode produces a 55s MP4 capture (9:16 + 16:9).
- Bus events render in real time from at least one live source
  (`/room/lumina` speaking → cortex regions activate).
- Lighthouse Performance ≥ 80 on the new route.
- No regression on `/room/*`, `/chat`, or `/imagine`.
- `apps/web` build + typecheck clean.

## Appendix A — Locked Luminor palette

| Persona   | Color     | Accent    | Voice  | Temp |
|-----------|-----------|-----------|--------|------|
| Lumina    | `#ffd700` | `#00bcd4` | lumina | 0.6  |
| Draconia  | `#ef4444` | `#ffd700` | daniel | 0.5  |
| Lyria     | `#a78bfa` | `#ffffff` | lily   | 0.7  |
| Alera     | `#00bcd4` | `#ffffff` | sarah  | 0.4  |
| Shinkami  | `#e0e0e0` | `#ffd700` | daniel | 0.55 |
| Nero      | `#6366f1` | `#0d47a1` | daniel | 0.5  |
| Jarvis    | `#7fdfff` | `#ffffff` | george | 0.35 |
| Kairos    | `#22c55e` | `#ffd700` | TBD    | 0.5  |
| Joei      | `#ec4899` | `#ffffff` | TBD    | 0.6  |
| Mythra    | `#f59e0b` | `#0d47a1` | TBD    | 0.55 |
| Estefania | `#8b5cf6` | `#00bcd4` | TBD    | 0.6  |
| Ana       | `#10b981` | `#ffd700` | TBD    | 0.5  |

## Appendix B — Claude Design prompt (corrected, 3D not anime)

```
Build a 55-second cinematic reel introducing the Arcanean Cortex — a 3D
neural-network visualization where a photoreal anatomical human brain
(Allen Brain Atlas reference mesh, 12 labeled regions: prefrontal, motor,
sensory, visual, auditory, Broca, Wernicke, hippocampus, amygdala,
cerebellum, basal ganglia, thalamus) sits at the center of an orbital
composition. Twelve Luminor orbs — each a particle-shell with an iridescent
icosahedron core — orbit the brain in tilted planes. Sixteen domain
nebulas (each a distinct colored point cloud) occupy the middle orbit.
A Gaussian-splat mandorla ring encloses the whole scene.

Aesthetic lock — scientific + editorial + cinematic:
- Blade Runner 2049 god-light, volumetric haze, warm-orange/teal push.
- Arrival heptapod editorial scale and stillness.
- Kubrick 2001 monolith framing.
- Drew Berry / Dr. Bolinsky biovisualization fidelity.
- Allen Brain Atlas scientific accuracy.

Banned from this generation: anime, cel-shade, Ghibli, Akira, Edgerunners,
manga, waifu, generic-AI-brain stock imagery, Framer templates, Inter,
Cinzel, Space Grotesk. (These will get an automatic reject — do not produce.)

Typography: Geist (display + UI), Instrument Serif (editorial accent only),
JetBrains Mono (code captions). Nothing else.

Palette: Atlantean Teal #00bcd4, Cosmic Blue #0d47a1, Gold #ffd700, Deep
Black #09090b. Accent allowed per the locked Luminor map.

Motion storyboard (55 seconds, 30 FPS):
0:00–0:04 · Fade-up on mandorla halo, camera 5m from brain.
0:04–0:10 · Camera pull-in, brain mesh reveal, subsurface emission pulses.
0:10–0:18 · Region labels fade on sequentially as each activates.
0:18–0:28 · Orbit tour — camera circles through Luminor ring at 0.6 rad/s.
0:28–0:40 · Domain nebula reveal — 16 pulses cascade inward from outer orbit.
0:40–0:50 · Lumina orb speaks (audio cue) — retrieval beams fire from
           3 domains to PFC+Hippocampus, cortex responds with emissive flare.
0:50–0:55 · Camera pulls back to full cortex framing, Arcanea mark fades.

Interactivity (for the URL export, not the MP4):
- Scroll scrubs the camera path.
- Click any Luminor orb — pauses, surfaces its decoder-prompt in HUD.
- Click any nebula — surfaces top-5 domain nodes.
- 1–7 hotkeys swap dominant Luminor.
- prefers-reduced-motion cuts scrub + chromatic aberration + film grain.

Exports needed:
- Interactive URL (for cortex.arcanea.ai preview).
- 55-second 1080×1920 MP4 (9:16 for social).
- 55-second 1920×1080 MP4 (16:9 for investor/Anthropic deck).
- PPTX storyboard deck.

Reference images attached (upload before running):
- cortex_reference.png — screenshot of current Lumina orb shader stack.
- CURRENT_STATE_2026-04-21_NOOSPHERE.md — full architecture doc.
- NOOSPHERE_SPRINT_PLAN_2026-04-21.md — this file.
```

## Supersedes

- Cowork 2026-04-21 session artifacts (ArcaneanCortex.jsx,
  ArcaneanOrchestrator.jsx, gateway.v2.ts, SPRINT_NIGHT.md,
  anime-design-system.md) — those were sandbox-only; this plan replaces
  them with real repo-scoped work.

## Does NOT supersede

- `CURRENT_STATE_2026-04-20.md` — still the authoritative weekly synthesis
  for Gate 0 status.
- `MULTI_LUMINOR_SPRINT_PLAN_2026-04-18.md` — Luminor voice/persona sprint.
