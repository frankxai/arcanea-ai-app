/**
 * @arcanea/arc — The Arc Protocol
 *
 * Creation genome format for AI-human co-creation.
 * Potential → Manifestation → Experience → Dissolution → Evolved Potential
 */

export type {
  Arc, ArcType, ArcStage, ArcAPL, ArcHistoryEntry, ArcBond,
  ArcAgent, ArcProvenance, Palette, Relation,
  Nea, NeaType,
} from './types';

export {
  createArc, createId, advanceStage, bond,
  toAgentContext, serialize, parse, validate,
  type CreateArcOptions, type ValidationResult,
} from './arc';
