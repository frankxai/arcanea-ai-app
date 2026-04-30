/**
 * @arcanea/presence
 *
 * The Lumina orb + presence primitives — 482-line GLSL particle shell,
 * icosahedron core, torus halo, orbiting satellites, sticky-mount audio-
 * reactive composition. This is the visual substrate for Arcanea Cortex —
 * The Living Second Brain.
 *
 * Source of truth lives here. `apps/web/components/presence/*` will become
 * thin re-export shims once the Lane A extraction PR lands. Until then,
 * both paths render identical output — pick either in your imports.
 */

export { LuminaOrb } from './lumina-orb';
export type { OrbState, LuminaOrbProps } from './lumina-orb';

export { LuminaPresence } from './lumina-presence';
export type { PresenceState, LuminaPresenceProps } from './lumina-presence';

export { useAudioAnalyser } from './use-audio-analyser';
export type { AudioSnapshot, UseAudioAnalyserOptions } from './use-audio-analyser';

export { HUDOverlay } from './hud-overlay';
export type {
  HUDState,
  HUDOverlayProps,
  ApprovalTier,
  ApprovalPacket,
  AgentRosterEntry,
} from './hud-overlay';

export { BrainAtlas, DEFAULT_DISPATCH_FLEET } from './brain-atlas';
export type {
  BrainAtlasProps,
  BrainAtlasNode,
  BrainAtlasEdge,
  PacketEnvelope,
  IntentClass,
  ForceGraphRenderProps,
} from './brain-atlas';
