# Arcanea Artifact Pipeline Scene Brief

Date: 2026-07-05
Owner: Codex lead operator with Premium Web OS, Motion Design Studio, Arcanea Motion, and v0 as prototype support
Repo: `C:\Users\frank\starlight\repos\arcanea-ai-app`
Branch observed: `codex/arcanea-homepage-world-engine`

## Task Contract

Scope:
- Define the next Arcanea homepage proof-object upgrade after the current God Mode release slice.
- Turn the current atmospheric hero and shipped proof strip into a visible artifact pipeline: Call -> Gift -> Trial -> Canon Memory -> Agent Route -> Artifact Packet.
- Use v0 only as private prototype input; Codex remains the source of repo integration, QA, and release truth.

Files in scope for the next implementation:
- `apps/web/app/v3/hero-chat-box.tsx`
- `apps/web/app/v3/hero-showcase.tsx`
- optional new component: `apps/web/app/v3/artifact-pipeline-panel.tsx`
- optional style/tokens only through the existing Arcanea design system and Tailwind classes
- `.visual-qa/arcanea-god-mode-2026-07-05/artifact-pipeline-v0/`

Non-goals:
- Do not deploy or promote while the current Arcanea release-readiness gate reports Vercel project/runtime/domain blockers.
- Do not copy v0 code wholesale.
- Do not add dependencies.
- Do not introduce generated hero art or uninspected external assets.
- Do not claim durable Workflow/Eve runtime is shipped.

Rollback:
- Remove the new artifact-pipeline component and restore `HeroShowcase` to the current six-card proof strip.
- Keep this brief as planning evidence unless Frank explicitly wants the planning file removed.

## Current State

The current local God Mode slice already improved Arcanea from vague worldbuilding toward proof-loop reality:

- `ArtifactPipelinePanel` now exists as the shared proof-object component. It renders a compact first-viewport pipeline under the homepage prompt and the full proof-ledger panel in `HeroShowcase`.
- Homepage prompt routes into Genesis proof.
- Starter cards route to Genesis, Studio Image, and Chat.
- The proof strip now names shipped surfaces: Genesis Proof, Creature Atlas, Living World, Claw Store, MCP Bridge, Creator Economy.
- `/status` and `/method` exist locally with screenshot evidence.
- Local evidence manifest reports 27/30 and ship-preview, but release-readiness is blocked by Vercel framework/runtime/domain/live-state drift.

Visual gap:

- The first viewport is beautiful and on-brand, but it still reads primarily as cinematic atmosphere plus a prompt box.
- The proof mechanism is visible in the hero first viewport as a compact Call -> Trial -> Agent Route -> Artifact Packet sequence, and below the hero as the full Call -> Gift -> Trial -> Canon Memory -> Agent Route -> Artifact Packet ledger.
- Mobile proof stages are verticalized through the compact panel instead of depending on horizontal proof chips.
- The visual subject should become an inspectable artifact-making instrument, not only a world portal.

## Audience

- AI-native creators who want more than chat output.
- Worldbuilders and storytellers who need canon memory.
- Creative technologists and IP builders who care about provenance, rights, agents, and reusable workflows.
- Studio operators who need to understand what happens after the first prompt.

## First Read

Arcanea turns one creative call into a bounded proof artifact with canon memory, rights-aware provenance, specialist agent routing, and a path into Atlas, Studio, Worlds, or Store.

## Creative Thesis

Arcanea should feel like a mythic creative operating system, but the central object must be a proof ledger: a visible record of how imagination becomes a usable artifact.

## Static Composition Target

Recommended composition: Foil Ledger + Portal Plate hybrid.

- Keep the current cinematic background, but lower its authority behind the product proof.
- Add one compact artifact pipeline panel in or directly under the hero prompt area.
- The panel should read as one object, not six independent cards.
- Desktop: two-zone composition.
  - Left/center: headline, prompt, CTA.
  - Right or lower hero band: artifact pipeline proof object.
- Mobile: vertical proof object.
  - Show Call, Trial, Agent Route, and Artifact Packet as the visible minimum.
  - Keep all six stages accessible in the immediate proof section.
  - Remove or simplify horizontal proof chips to prevent crowding.

Core labels:

1. Call - name the pressure.
2. Gift - bound the offering.
3. Trial - define the proof test.
4. Canon Memory - record lineage, rights, and world context.
5. Agent Route - assign specialist roles.
6. Artifact Packet - seal the usable proof.

Public-safe hero copy option:

```text
Build worlds that remember what they make.

Name a creative call. Arcanea turns it into a bounded Gift, a proof-sized Trial, canon memory, specialist agent routing, and a rights-aware artifact packet.
```

CTA:

- Primary: `Create Genesis proof`
- Secondary: `Explore Atlas`
- Tertiary route in nav/section: `Read the Method`

## Asset Tier

Tier C now:
- Code-authored exact UI/proof panel.
- Owned background and existing Arcanea media can remain supporting material.
- No new generated media is required for the next implementation.

Tier B later:
- Optional poster or Remotion/social loop after the static proof object passes desktop/mobile QA.

Blocked:
- Tier D decorative particles, random node fields, generic dashboard mockups, and vague portal-only hero visuals.

## Motion Score

Motion name: Portal To Canon

Motion job:
- Explain causality: one call becomes proof through six named states.
- Make Arcanea feel ritualized without hiding the mechanism.
- Confirm that the artifact has an ending state and can enter Atlas, Studio, Worlds, or Store.

Personality:
- Mythic, luminous, tactile, transformational, restrained.

Track A implementation:
- Initial implementation should use CSS or existing Framer Motion only.
- A single route highlight may move from Call to Artifact Packet.
- Stage labels remain still and readable.
- CTA and headline do not move after initial load.
- Hover/tap states may lift the Artifact Packet slightly.

Track B candidate:
- Later GSAP/ScrollTrigger set-piece only after static composition passes.
- One earned scroll scene: prompt locks into canon memory, agent roles clarify, artifact packet resolves.
- No Lenis unless the app already tolerates it and reduced motion disables it.

Reduced motion:
- Render all stage labels immediately.
- Hold Artifact Packet as the highlighted final state.
- No traveling line, shimmer, parallax, or smooth scroll.
- The static state must still answer what Arcanea does.

## v0 Prototype Verdict

Private v0 chat:
- `https://v0.app/chat/fdNM4opFWFw`
- Chat id: `fdNM4opFWFw`
- Privacy: private
- Latest version: `b_4h3TijwqsTI`

v0 generated:

1. Foil Ledger - strongest desktop idea because it makes the proof object inspectable beside quiet copy.
2. Forge Seam - useful only as a mobile/vertical mental model.
3. Portal Plate - strongest integration metaphor because it reads as one codex object: authored intent on one side, system execution on the other.

Absorb:
- Stage model and labels.
- One focal proof object.
- Reduced-motion notes.
- Split between authored intent and system execution.
- Destination rail: Atlas, Studio, Worlds, Store.

Reject or rewrite:
- v0 global CSS and dependency/package output.
- Any separate prototype toolbar.
- Default Tailwind token setup that does not use Arcanea design-system tokens.
- Demo-token URLs. Do not persist them.
- API screenshot as final evidence. The captured v0 screenshot is a placeholder and does not prove visual quality.

## Implementation Plan

1. Create `ArtifactPipelinePanel` using existing dependencies and Arcanea tokens.
2. Use it in `HeroShowcase` first as a replacement or lead-in to the six-card strip.
3. If visual QA passes, promote a compact version into the hero first viewport under the prompt.
4. Replace crowded mobile proof chips with the compact vertical stage story.
5. Keep the existing six shipped surface cards below as destination proof, but make them secondary.
6. Run `corepack pnpm --dir apps/web type-check`.
7. Run `corepack pnpm --dir apps/web build` if type passes.
8. Capture desktop, mobile, and reduced-motion screenshots.
9. Update the existing Arcanea design evidence manifest.
10. Do not preview/deploy until the release-readiness gate no longer blocks or Frank accepts a preview-only exception.

## Acceptance Criteria

- First viewport shows the artifact pipeline as an inspectable proof object.
- The user can explain the mechanism in 5 seconds: Call -> Gift -> Trial -> Canon -> Agent -> Artifact.
- Mobile has no horizontal overflow or hidden proof-chip crowding.
- Motion has the named job above and a reduced-motion static story.
- No new external assets, fake metrics, or unverified claims.
- Visual score remains 26/30+.
- Release-readiness blockers are not hidden by visual polish.

## 2026-07-05 Implementation Evidence

Status: local implementation pass; preview and production deferred.

Implemented:

- `apps/web/app/v3/artifact-pipeline-panel.tsx`
- `apps/web/app/v3/hero-showcase.tsx`
- `apps/web/app/v3/v3-content.tsx` already consumes the compact hero variant

Verified:

- `gitleaks dir apps/web/app/v3/artifact-pipeline-panel.tsx --redact --no-banner --max-target-megabytes 5 --exit-code 1`
- `corepack pnpm --dir apps/web type-check`
- `corepack pnpm --dir apps/web build`
- Local production-server desktop, mobile viewport-slice, and reduced-motion visual QA

Evidence:

- `.visual-qa/arcanea-god-mode-2026-07-05/artifact-pipeline-local/artifact-pipeline-local-qa.json`
- `.visual-qa/arcanea-god-mode-2026-07-05/artifact-pipeline-local/desktop-panel.png`
- `.visual-qa/arcanea-god-mode-2026-07-05/artifact-pipeline-local/mobile-panel.png`
- `.visual-qa/arcanea-god-mode-2026-07-05/artifact-pipeline-local/mobile-packet.png`
- `.visual-qa/arcanea-god-mode-2026-07-05/artifact-pipeline-local/reduced-motion-panel.png`

Known release constraint:

- Do not preview or promote this slice until the Arcanea release-readiness blockers are resolved or Frank accepts a preview-only exception. The visual component is locally ship-grade; Vercel project/runtime/domain state is still the release risk.

## Next Owner Seat

Use `site-motion-integrator` when implementing this into the real app, with `arcanea-motion` for brand behavior and `motion-taste-critic` before preview.
