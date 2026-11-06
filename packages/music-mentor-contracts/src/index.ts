/** Arcanea Music Mentor v1 wire contracts. No runtime provider assumptions. */
export type Instrument = 'piano';
export type ConsentScope = 'store-recording' | 'external-audio-analysis' | 'external-video-analysis';
export type AssessmentStatus = 'queued' | 'processing' | 'completed' | 'insufficient-evidence' | 'failed' | 'deleted';
export type EvidenceKind = 'pitch' | 'onset' | 'duration' | 'tempo' | 'missing-note' | 'extra-note';
export interface PracticeExercise { id: string; version: string; instrument: Instrument; scoreAssetId: string; referenceMidiAssetId: string; tempoBpm: number; bars: number; licenseId: string; }
export interface PracticeAttempt { id: string; learnerId: string; exerciseId: string; exerciseVersion: string; createdAt: string; mediaAssetId: string; consent: ConsentScope[]; status: AssessmentStatus; idempotencyKey: string; }
export interface Measurement { kind: EvidenceKind; observed: number | null; expected: number | null; unit: 'midi-note' | 'milliseconds' | 'beats' | 'bpm' | 'count'; confidence: number; startMs: number; endMs: number; algorithmVersion: string; }
export interface FeedbackItem { id: string; message: string; evidenceIndices: number[]; priority: 'focus' | 'informational'; }
export interface AssessmentResult { attemptId: string; exerciseVersion: string; status: AssessmentStatus; measurements: Measurement[]; feedback: FeedbackItem[]; processingTraceId: string; evaluatedAt: string; }
export interface JobReceipt { jobId: string; attemptId: string; idempotencyKey: string; state: AssessmentStatus; traceId: string; costEstimateUsd?: number; }
export function validateAssessment(result: AssessmentResult): string[] {
 const errors: string[] = [];
 if (!result.attemptId || !result.processingTraceId) errors.push('missing identity or trace');
 if (result.status === 'completed' && !result.measurements.length) errors.push('completed without evidence');
 for (const m of result.measurements) {
  if (m.confidence < 0 || m.confidence > 1) errors.push('invalid confidence');
  if (m.startMs < 0 || m.endMs < m.startMs) errors.push('invalid time span');
  if (!m.algorithmVersion) errors.push('missing algorithm version');
 }
 for (const f of result.feedback) {
  if (!f.evidenceIndices.length || f.evidenceIndices.some(i => !Number.isInteger(i) || i < 0 || i >= result.measurements.length)) errors.push('ungrounded feedback');
 }
 return errors;
}
