export type Position = "refuge" | "0" | "1" | "2";
export type Outcome = "supply-saved" | "reserve-lost" | null;
export interface EncounterState {
  version: 1;
  water: number[];
  lostWater: number;
  opened: boolean[];
  position: Position;
  phase: number;
  pinned: boolean;
  progressMs: number;
  elapsedMs: number;
  falls: number;
  extendedCues: boolean;
  outcome: Outcome;
  attack: {
    stage: "recovery" | "windup";
    remainingMs: number;
    target: number | null;
    sequence: number;
  };
  message: string;
}
export type EncounterAction =
  | { type: "move"; position: Position }
  | { type: "open" | "pin" | "break-seal" }
  | { type: "transfer"; from: number; to: number };
export const CISTERNS: readonly string[];
export const CAPACITY: number;
export const WATER_TOTAL: number;
export const HOLD_MS: number;
export const STEP_MS: number;
export function createEncounter(options?: {
  extendedCues?: boolean;
}): EncounterState;
export function balanced(state: EncounterState): boolean;
export function actionBlocker(
  state: EncounterState,
  action: EncounterAction,
): string | null;
export function act(
  state: EncounterState,
  action: EncounterAction,
): EncounterState;
export function advance(
  state: EncounterState,
  milliseconds?: number,
): EncounterState;
export function validateState(state: unknown): string[];
export function exportProof(state: EncounterState): string;
export function importProof(text: string): EncounterState;
