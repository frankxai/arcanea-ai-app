---
title: Arcanea Brain Atlas — Architecture Decision Record
type: adr
status: accepted
decided: 2026-04-21
supersedes: null
superseded_by: null
author: claude
links:
  - ./second-brain-v2-architecture
  - ./prompt-os-v1.4.0-architecture
  - ../sprints/2026-S17
  - ../00-MOCs/MOC-Second-Brain
  - ../00-MOCs/MOC-Projects
---

# Arcanea Brain Atlas — ADR

**Thesis.** One surface that reads as a living organism and shows the whole thing at once: the human-brain anatomy (what thinks), the twelve life/work domains (what matters), the vault graph (what we know), the ecosystem surfaces (what we ship), the Luminor orchestra (who acts). Not a dashboard. A *legibility layer*.

## Problem

Frank's ecosystem spans 13 surfaces, 4 active projects, 5 brands, 12 Luminors, 7 scheduled skills, a 10-folder vault, and a Prompt OS producing ~8 briefs/week. Every sub-system has its own visualization: `prompt-os-dashboard`, `vault-atlas-v2`, the Noosphere spec, the Luminor orchestra scorecard. **None of them show the whole.** Result: every decision is made from partial view, and compounding is invisible because the loops are distributed across tools.

## Decision

Ship a dual-surface **Arcanea Brain Atlas**:

1. **Cowork artifact `arcanea-brain-atlas`** — 2D SVG unified map, live and persisted, re-rendered by `/vault-atlas` weekly. Works inside the Cowork sandbox (Chart.js + SVG only).
2. **Standalone `arcanea-brain-3d.html`** — Three.js r162 scene in `vibeclubs.ai/`, real-time 3D brain + world-tree + domain lobes + neural activity. Full post-processing bloom. Opens in any browser. Apex visualization.

Both surfaces share the **Twelve-Domain Taxonomy** (below) and the **Five-Layer Mental Model** (below). The 3D scene is the richer experience; the Cowork artifact is the always-on Monday-morning dashboard.

## Twelve-Domain Taxonomy

The life/work layer. Every atom, project, surface, and Luminor is tagged into exactly one primary domain.

| # | Domain | Brain region anchor | Vault tag | Primary Luminor |
|---|--------|--------------------|-----------|-----------------|
| 1 | Creator | Left frontal · expressive cortex | `creator` | Syntaxa |
| 2 | Business & Career | Dorsolateral PFC · executive | `business` | Kinetix |
| 3 | Wealth | Ventromedial PFC · valuation + reward | `wealth` | Numeros |
| 4 | Health | Hypothalamus + cerebellum · homeostasis + motor | `health` | Vitalia |
| 5 | Relationships | Right STS + TPJ · social cognition | `relationships` | Harmonix |
| 6 | Personal development & skills | Basal ganglia + hippocampus · habit + memory | `growth` | Meridian |
| 7 | Agentic systems | Premotor + parietal · action selection | `agents` | Lumina (queen) |
| 8 | Memory & context | Hippocampal formation · episodic + semantic | `memory` | Mnemosys |
| 9 | Prompt engineering | Broca + Wernicke · language production + comprehension | `prompts` | Syntaxa |
| 10 | Software engineering & SDLC/ADLC | Left parietal + angular gyrus · symbolic manipulation | `software` | Chronos |
| 11 | Content · orgs · philanthropy | Anterior cingulate · purpose + prosocial | `purpose` | Sophia |
| 12 | Research · biggest problems · frontier | Prefrontal + default-mode network · hypothesis + imagination | `research` | Oracle |

**Hard cap 12.** Biotech-superintelligence, AI-safety, governance, and climate-frontier all fold into §12 (Research · frontier). If a 13th domain needs its own bucket, one of these 12 gets merged or renamed — never added.

### Reconciliation with Noosphere's 16 nebulas

The Noosphere spec names 16 semantic nebulas; the Brain Atlas names 12 domains. The 12 are the canonical life/work ontology. The 16 are visual clusters in the Noosphere's 3D scene (some are sub-clusters of a domain, e.g. "biotech" is inside §12). The Noosphere stays at 16 for visual density; the vault stays at 12 for cognitive coherence.

## Five-Layer Mental Model

The Atlas visualizes five layers, stacked from biological to civilizational:

| Layer | Metaphor | What it shows |
|-------|----------|---------------|
| L1 · Anatomy | Human brain mesh | Neural regions active during any given Council run — prefrontal during Strategist, ACC during Sage, cerebellum during Maker |
| L2 · Domains | Twelve colored lobes orbiting the brain | Life/work coverage — which domains have atoms, which are starving |
| L3 · Vault | Particle field of atoms + edges | Every atom in `05-Atoms/`, sized by backlink fan-in, colored by domain |
| L4 · Ecosystem | Halo of 13 surfaces | arcanea.ai, frankx.ai, sis.arcanea.ai, gencreator.ai, vibeclubs.ai, noosphere.arcanea.ai, etc. — status, traffic, last-deploy |
| L5 · World Tree | Vertical spine | Time-axis: roots (archived decisions) → trunk (active projects) → canopy (shipped surfaces) → stars (aspirational horizons) |

Activation propagates across layers. A new atom on `prompt-engineering` lights L3 at that node, lights L2 at domain #9, lights L1 at Broca, and lights L4 at the Prompt Library surface. The user sees compounding in real time.

## Visual language

Shared token set across both surfaces. Design-system memory says no Cinzel, no Space Grotesk, no Inter.

| Token | Value | Use |
|-------|-------|-----|
| `--bg-deep` | `#050510` | 3D scene background |
| `--bg-light` | `#fafafa` | Cowork artifact background |
| `--teal` | `#00bcd4` (Atlantean) | primary accent, L4 halo |
| `--cosmic` | `#0d47a1` | L5 world tree trunk |
| `--gold` | `#ffd700` | active nodes, Luminor Lumina |
| `--aura-health` | `#10b981` | domain #4 |
| `--aura-wealth` | `#f59e0b` | domain #3 |
| `--aura-creator` | `#ec4899` | domain #1 |
| `--aura-research` | `#a855f7` | domain #12 |
| `--aura-agents` | `#3b82f6` | domain #7 |
| `--aura-growth` | `#06d6a0` | domain #6 |
| `--aura-purpose` | `#fbbf24` | domain #11 |
| fonts | Geist + Instrument Serif + JetBrains Mono | design-system canon |

## Rendering stack

### Cowork artifact (2D)

- Pure inline HTML/CSS/JS
- Chart.js v4 UMD for KPI bars + stacked growth
- Inline SVG for the brain outline, 12 domain nebulas, vault link graph edges
- `color-scheme: light` — renders inside Cowork's light UI
- ~1800 lines, <80 KB, opens in <1s

### Standalone 3D (`arcanea-brain-3d.html`)

- Three.js r162 via jsDelivr (pinned SRI hash)
- ImportMap for `three/examples/jsm/*` addons (OrbitControls, EffectComposer, UnrealBloomPass, TextGeometry)
- Procedural brain mesh — **not** a medical scan. Convex hull + noise displacement on a UV sphere to imply anatomy without claiming it. Avoids licensing + scan weight.
- 12 domain lobes = instanced icosahedra orbiting the brain, each with domain-color emissive
- Neural activity = 2000 animated line segments between random atom nodes, opacity pulsing with a Perlin-noise field
- World Tree = Catmull-Rom spline through 7 anchor points from `-Y` to `+Y` with geometry shader thickening toward roots
- Post-processing: UnrealBloomPass (strength 0.9, radius 0.5, threshold 0.4) + FilmPass (grayscale 0, intensity 0.2) + ChromaticAberration shader for the bio-digital feel
- Orbit controls, auto-rotate 0.3 rad/s
- Target: 60fps M1, 45fps on Frank's older hardware
- Standalone means: no build step, single HTML file, offline-capable after first load

## Data model

One JSON object describes the atlas. Both surfaces consume it.

```ts
type AtlasData = {
  domains: Array<{
    id: string;          // 'creator', 'wealth', ...
    index: number;       // 1-12
    color: string;
    brainRegion: string; // 'left-frontal', ...
    luminor: string;     // 'Syntaxa', ...
    vaultCount: number;  // atoms tagged with this domain
    health: 'green' | 'amber' | 'red';
  }>;
  atoms: Array<{
    id: string;          // file path
    title: string;
    domain: string;      // FK to domains[].id
    outLinks: string[];  // wikilink targets
    inLinks: number;     // backlink fan-in
    status: 'evolving' | 'stable' | 'superseded';
  }>;
  surfaces: Array<{
    id: string;          // 'arcanea.ai', 'frankx.ai', ...
    status: 'live' | 'staging' | 'down';
    lastDeploy: string;
    trafficBand: 'low' | 'med' | 'high';
  }>;
  council: Array<{      // Prompt OS v1.4.0 six-role Council
    role: string;
    lastActive: string;
    brainRegion: string;
  }>;
};
```

At v1 the data is **static** (inlined into each surface). At v1.1 (post-sprint), `/vault-atlas` generates `meta/arcanea-brain-atlas/data.json` weekly and both surfaces fetch it.

## Invariants

1. **One canonical taxonomy — the 12 domains.** Every atom tagged into exactly one. Vault-atlas checks this.
2. **The brain mesh is procedural.** Never use a scanned medical asset. Licensing + aesthetic + weight.
3. **Atoms appear in the vault before they appear in the Atlas.** No visualization without substrate.
4. **Cowork artifact is the weekly surface; standalone 3D is the deep-focus surface.** Never cross the streams — don't try to do 3D inside the artifact.
5. **No spiritual or medical overclaim.** It's a visualization of a knowledge base, not a brain model. Copy stays precise.
6. **The world tree is time; the brain is now.** L1-L4 are spatial, L5 is temporal. Don't mix.
7. **Counter-Coach has veto on visual sprawl.** If the Atlas can't be read in 60s at Monday 7am, it's over-designed.

## Counter-Coach objections

> *"This is a vanity dashboard. You should be writing atoms, not admiring them."*

Counter: the Atlas *measures* atoms (vault graph + domain bars). It is the enforcement mechanism for T+30 gate, not a distraction from it. Without the Atlas, we'd cap at ~60 atoms and not notice.

> *"Twelve is arbitrary. Life doesn't carve at twelve."*

Counter: twelve is chosen because it's the smallest number that covers Frank's actual surface area without losing granularity. MOC cap is also 12 (Rule of 12). Picking the same cardinality across levels is a feature.

> *"3D brain is cargo-cult Unreal Engine envy."*

Counter: the 3D surface is for *Frank's own* recognition loop — seeing the organism activates more processing than reading a grid. Cargo cult is when aesthetics replace function; here aesthetics *are* the function (recognition density).

> *"You're coupling the Atlas to Prompt OS, but Prompt OS is 3 days old."*

Counter: the coupling is in one direction — Atlas reads Prompt OS output. Prompt OS can ship without the Atlas; Atlas can't ship without Prompt OS. If Prompt OS is deprecated, the Atlas downgrades gracefully.

## Open questions

- Does the Atlas live at `arcanea.ai/atlas`, a subdomain `atlas.arcanea.ai`, or only inside Cowork? **Deferred to sprint S18.**
- Does the standalone 3D file stream `data.json` from a URL when online, or stay fully offline? **Offline-first for v1; streaming deferred.**
- Webcam face tracking + keyboard input as activity signals (as Frank floated) — biotechnological overlay? **Deferred. Would require a real backend and MediaPipe; out of scope for a static HTML file.**
- Real-time spike-timing-dependent plasticity on atom edges? **Implemented as a *simulated* visual — not a real STDP model. Honesty clause (§Invariant 5).**

## Kill criteria

- Atlas loads but Frank opens it <1×/week at T+30 → vanity confirmed, reduce to a link from `prompt-os-dashboard`
- 3D HTML drops below 30fps on Frank's laptop → demote to 2D only
- The 12-domain taxonomy collects exceptions faster than atoms → re-carve or abandon the ontology (not the Atlas)
- Atom count does not exceed 60 at T+60 → Atlas is not driving the compound; refactor

## Related

- [[./second-brain-v2-architecture]] — the vault this visualizes
- [[./prompt-os-v1.4.0-architecture]] — the Council whose runs appear in L1
- [[../sprints/2026-S17]] — the sprint shipping this
- [[../00-MOCs/MOC-Second-Brain]] — navigation from the 12-MOC map
