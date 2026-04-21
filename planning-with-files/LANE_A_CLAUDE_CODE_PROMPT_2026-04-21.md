# Lane A — Claude Code Prompt (Arcanea Cortex, Phase 0 + 1)

> **Purpose:** paste-ready prompt for a fresh Claude Code session. Executes
> Phase 0 (extract `@arcanea/presence` package) and Phase 1 (scaffold
> `/cortex` route with 12-Luminor orbital composition). Zero-risk refactor
> first, then feature work.
>
> **Context budget:** This prompt is self-contained. Claude Code does NOT
> need to read the planning docs first — everything it needs is below.
>
> **Branch:** `feat/arcanea-cortex-phase-0-1` — branch off `main` after
> `feat/author-council-2026-04-21` is merged. Do NOT branch off
> `feat/author-council-*` (it carries unrelated work).

---

## Paste-ready prompt

```
You're extending Arcanea with a new product called "Arcanea Cortex" —
The Living Second Brain. A 3D neural-network visualization (Unreal Engine /
Blade Runner 2049 / Allen Brain Atlas aesthetic — NOT anime, NOT cel-shade)
where a photoreal anatomical brain sits at the center surrounded by 12
Luminor orbs representing the persona layer.

This is Phase 0 + Phase 1. Later phases (cortex mesh, domain mantle, event
bus, halo splats) happen in separate sessions.

## Phase 0 — Extract @arcanea/presence package (zero-risk refactor)

The existing production code at `apps/web/components/presence/` is the 482-
line LuminaOrb + LuminaPresence + useAudioAnalyser stack. It ships today at
arcanea.ai/room/{persona}. Goal: turn it into a reusable workspace package
without breaking anything.

Steps:

1. Create `packages/presence/` with:
   - `package.json` — name: "@arcanea/presence", version: "0.1.0",
     type: "module", private: false, main: "./src/index.ts", types:
     "./src/index.ts", peerDependencies: { react, react-dom, three,
     framer-motion }. Use caret ranges matching apps/web's versions.
   - `tsconfig.json` — extends the repo root tsconfig.
   - `src/` — move these files from `apps/web/components/presence/` here:
     - lumina-orb.tsx
     - lumina-presence.tsx
     - use-audio-analyser.ts
     - Create `src/index.ts` that exports: LuminaOrb, LuminaPresence,
       useAudioAnalyser, and the types OrbState, PresenceState,
       LuminaOrbProps, LuminaPresenceProps, AudioSnapshot.

2. Replace the original files in `apps/web/components/presence/` with thin
   re-export shims:
   ```ts
   // apps/web/components/presence/lumina-orb.tsx
   export { LuminaOrb, type OrbState, type LuminaOrbProps }
     from '@arcanea/presence';
   ```
   Repeat for lumina-presence.tsx and use-audio-analyser.ts.

3. Add `"@arcanea/presence": "workspace:*"` to apps/web/package.json
   dependencies.

4. Verify:
   - `pnpm install` — clean.
   - `pnpm --dir apps/web run typecheck` — passes.
   - `pnpm --dir apps/web run build` — passes.
   - `arcanea.ai/room/lumina` still works locally (spot check with
     `pnpm --dir apps/web run dev` — stop server when done).

Commit after Phase 0 verifies clean. Message:
`refactor(presence): extract @arcanea/presence from apps/web/components`

## Phase 1 — Scaffold /cortex route

Goal: new /cortex route in apps/web that composes 12 Luminor orbs in a
triple-orbital layout using @arcanea/presence. No anatomical brain mesh
yet — just the orbital topology. The center is the existing Lumina orb at
larger scale.

Steps:

1. `apps/web/app/cortex/page.tsx` — server component, metadata:
   title "Arcanea Cortex · The Living Second Brain", description from
   PERSONAS aggregate.

2. `apps/web/app/cortex/cortex-client.tsx` — 'use client'. Uses
   @react-three/fiber + @react-three/drei (add to apps/web deps if not
   present, matching existing versions or latest stable at session time).

3. Composition:
   - Inner orbit (r=3.2, tilt 15°): Lumina (center, r=0 — scale 1.4×),
     Kairos, Joei, Mythra.
   - Outer orbit (r=5.2, tilt -10°): Draconia, Lyria, Alera, Shinkami,
     Nero, Jarvis, Estefania, Ana.
   - Per-orb color/accent from the PERSONAS map in
     apps/web/app/room/[persona]/room-client.tsx. For Kairos, Joei,
     Mythra, Estefania, Ana — use placeholders from the locked palette in
     `planning-with-files/CORTEX_SPRINT_PLAN_2026-04-21.md` Appendix A.

4. Camera: PerspectiveCamera fov 38, position [0, 1.5, 9]. Scroll-scrub
   dolly z: 9 → 3.5 across viewport (use `useScroll` from framer-motion
   or drei's ScrollControls).

5. Post-processing (@react-three/postprocessing):
   - Bloom intensity 0.8, luminanceSmoothing 0.25.
   - Vignette offset 0.5, darkness 0.4.
   - ChromaticAberration offset [0.0006, 0.0006].
   - Noise opacity 0.02.
   - prefers-reduced-motion → disable ChromaticAberration + Noise, cut
     bloom to 0.4.

6. Typography in any HUD overlay: Geist (display + body), Instrument Serif
   (editorial), JetBrains Mono (code). NEVER Cinzel, Space Grotesk, Inter.

7. Colors — use @arcanea/design-system v0.3.0 tokens (primary
   #00bcd4 Atlantean Teal, secondary #0d47a1 Cosmic Blue, accent #ffd700
   Gold, background #09090b).

8. Framer Motion: LazyMotion(features={domAnimation}). NEVER domMax.

9. Glass HUD card (top-right): status label, current dominant Luminor
   name, current persona color dot. Use tokens from design-system glass
   preset: bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm.

10. Accessibility:
    - Canvas has aria-hidden="true".
    - Announce dominant Luminor changes via aria-live="polite" region.
    - Keyboard: digits 1–9 swap dominant Luminor (like /room/*).
    - prefers-reduced-motion cuts scroll-scrub + post effects.

Acceptance:
- `pnpm --dir apps/web run build` passes.
- Lighthouse Performance on /cortex ≥ 85 (report via `npx @lhci/cli collect`
  against the Vercel preview deploy).
- Zero regression on /room/* — spot-check /room/lumina, /room/jarvis,
  /room/draconia render identically.
- Bundle size delta < 120 KB gzipped (the R3F + postprocessing deps are
  the expensive bit — tree-shake and dynamic-import the Canvas).

Commit message after Phase 1:
`feat(cortex): scaffold /cortex route with 12-Luminor orbital composition`

## Non-negotiables (from CLAUDE.md)

- Node 20.x via .nvmrc.
- pnpm only — NEVER npm or yarn.
- 16GB machine — kill pnpm dev after spot checks. NEVER run pnpm dev +
  pnpm build simultaneously.
- NEVER run pnpm dev unless actively testing UI in browser.
- Do NOT touch apps/web/app/room/* — that's live production.
- Do NOT touch any file under book/, .arcanea/, or arcanea-onchain/.
- All commits stage files by name — NEVER `git add .` or `git add -A`.

## Banned from aesthetic direction

anime, cel-shade, Ghibli, Akira, Edgerunners, manga, waifu, generic-AI-
brain stock imagery, Framer templates, Inter, Cinzel, Space Grotesk.

## When done

Open PR to main with title: "feat(cortex): @arcanea/presence extraction +
/cortex Phase 1 scaffold" and description containing:
- Before/after screenshots of /cortex at 1920×1080.
- Lighthouse scores.
- Bundle size delta.
- List of files moved/renamed (for reviewer orientation).
```

---

## Why this prompt works

- **Self-contained** — zero external file reads required.
- **Two-phase** — Phase 0 is zero-risk refactor with measurable pass/fail,
  earns trust before Phase 1's feature work.
- **Non-negotiables pulled from CLAUDE.md** — prevents Claude Code from
  autonomously running dev servers or staging with `git add .`.
- **Aesthetic banned-words list** — forces the 3D neural-network direction,
  no anime drift.
- **Acceptance criteria are measurable** — build pass, Lighthouse ≥ 85,
  bundle delta < 120 KB, zero room regressions.
- **Locked commit messages** — maintains the `feat(scope): description`
  convention from git history.

## Why NOT open this in a fresh worktree

The `@arcanea/presence` extraction touches files in `apps/web/` that the
running `feat/author-council-2026-04-21` branch already modifies. Open in
the main working tree AFTER author-council is merged to `main`. If that
merge is blocked, branch off current HEAD and resolve conflicts later —
but cleaner to wait 1 merge cycle.
