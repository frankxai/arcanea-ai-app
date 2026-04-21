# @arcanea/presence

> The Lumina orb + presence primitives — GLSL particle shell, icosahedron
> core, torus halo, orbiting satellites. Audio-reactive, state-machine
> driven, sticky-mounted. The visual substrate for **Arcanea Cortex** —
> *The Living Second Brain.*

## What's in the box

| Export | What it is |
|---|---|
| `LuminaOrb` | 4096-particle sphere + icosahedron core + halo ring + 256 satellites. 4 custom GLSL programs. Drives from audio amplitude + low/high bins. State machine: `listening | thinking | speaking`. |
| `LuminaPresence` | Wraps `LuminaOrb` with audio analyser + sticky-mount anti-shake policy + optional label chip. This is the component you actually render. |
| `useAudioAnalyser` | React hook producing a snapshot ref with `{ amplitude, low, mid, high, bins }`. Accepts `MediaStream` (mic) or `HTMLAudioElement` (TTS playback). |

## Install (from inside the Arcanea monorepo)

Add to your app's `package.json`:

```json
{
  "dependencies": {
    "@arcanea/presence": "workspace:*"
  }
}
```

Then:

```bash
pnpm install
```

## Use

```tsx
'use client';
import { LuminaPresence, type PresenceState } from '@arcanea/presence';

export function MyRoom({ state, stream, audio }: { state: PresenceState; stream?: MediaStream | null; audio?: HTMLAudioElement | null }) {
  return (
    <LuminaPresence
      state={state}
      stream={stream}
      audio={audio}
      color="#00bcd4"   // Atlantean Teal (default)
      accent="#ffd700"  // Gold (default)
      size={360}
      label="Listening" // or null to hide the chip
    />
  );
}
```

## Peer dependencies

- `react` ^19
- `react-dom` ^19
- `three` ^0.183
- `framer-motion` ^11.15

Matches `apps/web` versions (2026-04-21). Update peers in lockstep.

## State machine

The orb has three visible states plus an idle state on the presence wrapper:

| State | What it looks like | Drives from |
|---|---|---|
| `idle` | Fades out, unmounts visual effect | Default |
| `listening` | Calm breathing shell, satellites drift | Mic amplitude |
| `thinking` | Inhale pulse, chaos spikes, core contracts | Internal pulse |
| `speaking` | Halo ring blooms, amplitude-reactive shell | TTS audio element |

## Sticky-mount anti-shake

`LuminaPresence` keeps the WebGL context alive once the orb first
activates. Rapid state flips (push-to-talk, barge-in, tool chains) no
longer tear down and rebuild the Three.js renderer every turn. Visibility
is opacity-only after first paint. Fix introduced in commit `49fd3520`
(prior "shaky orb" root-cause).

## Shader architecture

`LuminaOrb` bundles four shader programs, all additive-blended:

1. **Main particle shell** (`VERT` + `FRAG`) — 4096 points on unit sphere,
   noise-displaced radius, per-seed hash jitter, amplitude-driven point
   size, rim factor, time.
2. **Icosahedron core** (`CORE_VERT` + `CORE_FRAG`) — subdivision-4 mesh,
   fresnel-based glow, amp-scaled size, inhale pulse.
3. **Torus halo** (`HALO_VERT` + `HALO_FRAG`) — 220-segment ring, angle
   shimmer, only visible in `speaking` state, tilts 15° off-plane.
4. **Satellite points** (`SAT_VERT` + `SAT_FRAG`) — 256 orbiting flecks
   in tilted plane, per-seed spin, always active.

Bloom is cheap: the main shell is cloned at 1.22× scale with 0.35 alpha.
No post-processing pass needed at this scale.

## Accessibility

- Canvas is `aria-hidden`.
- State changes should be announced via a separate `aria-live="polite"`
  region in the host app.
- Respect `prefers-reduced-motion` at the app level by mapping state to
  `idle` when the user opts out.

## License

MIT. Part of the Arcanea OSS ecosystem.
